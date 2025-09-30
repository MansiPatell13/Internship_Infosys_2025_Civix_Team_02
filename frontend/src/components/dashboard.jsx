import React, { useEffect, useState } from "react";
import './dashboard.css';
import { FaUserCircle, FaHome } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlinePoll, MdOutlineHelp } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import { IoMdSettings, IoMdCreate } from "react-icons/io";
import { CgLogOut } from "react-icons/cg";
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';
import PetitionPage from '../components/Petition/PetitionPage';
import PollCreation from '../components/poll/PollCreation';

function Dashboard() {
  const [user, setUser] = useState({ name: "", email: "", location: "" });
  const [petitions, setPetitions] = useState([]);
  const [filteredPetitions, setFilteredPetitions] = useState([]);
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [activeView, setActiveView] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("petitions");
  const [userStats, setUserStats] = useState({
    totalActivePetitions: 0,
    myPetitions: 0,
    totalActivePolls: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to get user info
  const getUserInfo = () => {
    let userId = localStorage.getItem("userId") || "";
    let userObject = {};
    
    try {
      userObject = JSON.parse(localStorage.getItem("user") || "{}");
    } catch (error) {
      userObject = {};
    }

    if (!userId || Object.keys(userObject).length === 0) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decodedToken = JSON.parse(jsonPayload);
          
          if (decodedToken) {
            userId = decodedToken.sub || decodedToken.id || "";
            userObject = {
              id: decodedToken.sub || decodedToken.id,
              _id: decodedToken.sub || decodedToken.id,
              email: decodedToken.email,
              role: decodedToken.role,
              userType: decodedToken.role
            };
            
            localStorage.setItem("userId", userId);
            localStorage.setItem("user", JSON.stringify(userObject));
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    }

    return { userId, userObject };
  };

  // Helper function to check if petition belongs to user
  const isUserOwnPetition = (petition) => {
    const { userId, userObject } = getUserInfo();
    
    let creatorId =
      petition.createdBy?._id?.toString() ||
      petition.createdBy?.toString() ||
      petition.ownerId?._id?.toString() ||
      petition.ownerId?.toString() ||
      "";

    return (
      creatorId === userId ||
      creatorId === userObject._id ||
      creatorId === userObject.id
    );
  };

  // Fetch user data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        
        const response = await fetch("http://localhost:4000/api/dashboard", {
          method: "GET",
          headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`, 
            "Cache-Control": "no-cache" 
          },
        });
        
        if (!response.ok) {
          console.warn("Dashboard API not available, using fallback");
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        if (data.user) {
          const userData = {
            name: data.user.name,
            email: data.user.email,
            location: data.user.location || "Unknown",
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [activeView]);

  // Fetch ALL petitions and calculate stats
  useEffect(() => {
    const fetchPetitions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:4000/api/petitions', { 
          headers: {
            "Cache-Control": "no-cache",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        
        if (!response.ok) throw new Error("Failed to fetch petitions");
        
        const data = await response.json();
        console.log("Fetched petitions data:", data);
        
        const normalizedPetitions = data.map(p => ({
          id: p._id?.$oid || p._id || p.id,
          _id: p._id,
          title: p.title,
          description: p.description,
          category: p.category,
          location: p.location,
          image: p.image ? `http://localhost:4000${p.image}` : null,
          status: p.status,
          createdBy: p.createdBy,
          signatures: p.signatures || []
        }));
        
        // Filter active petitions from ALL users
        const activePetitions = normalizedPetitions.filter(p => 
          p.status === 'active' || 
          p.status === 'under-review' || 
          p.status === 'under_review' ||
          p.status === 'pending'
        );
        
        // Count user's own petitions
        const userPetitions = normalizedPetitions.filter(p => isUserOwnPetition(p));
        
        console.log("Total active petitions:", activePetitions.length);
        console.log("User petitions count:", userPetitions.length);
        
        // Set ALL active petitions for display (not just user's)
        setPetitions(activePetitions);
        
        setUserStats(prev => ({
          ...prev,
          totalActivePetitions: activePetitions.length,
          myPetitions: userPetitions.length
        }));
        
      } catch (error) {
        console.error("Error fetching petitions:", error);
        setPetitions([]);
      }
    };
    
    fetchPetitions();
  }, [activeView]);

  // Fetch ALL polls and calculate stats
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const response = await fetch('http://localhost:4000/api/polls/list?limit=100', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache"
          },
        });
        
        if (!response.ok) throw new Error("Failed to fetch polls");
        
        const data = await response.json();
        const fetchedPolls = data.polls || data;
        console.log("Fetched polls data:", fetchedPolls);
        
        // Filter active polls from ALL users
        const today = new Date();
        const activePolls = fetchedPolls.filter(poll => {
          if (!poll.closesOn) return true;
          const closesDate = new Date(poll.closesOn);
          return closesDate >= today;
        });
        
        const { userId, userObject } = getUserInfo();
        
        // Count user's polls
        const userPolls = fetchedPolls.filter(p => {
          let creatorId;
          if (typeof p.createdBy === "object" && p.createdBy !== null) {
            creatorId = p.createdBy._id?.toString() || p.createdBy.toString();
          } else {
            creatorId = p.createdBy?.toString();
          }
          return creatorId === userId || creatorId === userObject._id;
        });
        
        console.log("Total active polls:", activePolls.length);
        console.log("User polls count:", userPolls.length);
        
        // Set ALL active polls for display (not just user's)
        setPolls(activePolls);
        
        setUserStats(prev => ({
          ...prev,
          totalActivePolls: activePolls.length
        }));
        
      } catch (error) {
        console.error("Error fetching polls:", error);
        setPolls([]);
      }
    };
    
    fetchPolls();
  }, [activeView]);

  // Filter petitions and polls
  useEffect(() => {
    let filteredPet = [...petitions];
    let filteredPol = [...polls];
    
    if (locationFilter.trim() !== "") {
      const locationQuery = locationFilter.toLowerCase();
      filteredPet = filteredPet.filter(p => 
        p.location && p.location.toLowerCase().includes(locationQuery)
      );
      filteredPol = filteredPol.filter(p => 
        (p.targetLocation && p.targetLocation.toLowerCase().includes(locationQuery)) ||
        (p.location && p.location.toLowerCase().includes(locationQuery))
      );
    }
    
    if (categoryFilter !== "All Categories") {
      filteredPet = filteredPet.filter(p => p.category === categoryFilter);
    }
    
    setFilteredPetitions(filteredPet);
    setFilteredPolls(filteredPol);
  }, [locationFilter, categoryFilter, petitions, polls]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate('/login');
  };

  const handleSeeAllClick = () => {
    if (activeTab === "petitions") {
      navigate('/petition-head');
    } else {
      navigate('/polls');
    }
  };

  const scrollToFooter = () => {
    const footerElement = document.querySelector('footer');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories = [
    "All Categories", "Environment", "Infrastructure", "Education",
    "Public Safety", "Transportation", "Healthcare",
  ];

  const petitionsToDisplay = filteredPetitions.slice(0, 3);
  const pollsToDisplay = filteredPolls.slice(0, 3);

  const clearFilters = () => {
    setLocationFilter("");
    setCategoryFilter("All Categories");
  };

  const handleSuccessCallback = () => {
    setActiveView("dashboard");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  if (loading) {
    return (
      <div className="dash">
        <Navbar user={user} handleLogout={handleLogout} scrollToFooter={scrollToFooter} />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          fontSize: '1.2rem',
          color: '#666'
        }}>
          Loading dashboard...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dash">
      <Navbar user={user} handleLogout={handleLogout} scrollToFooter={scrollToFooter} />

      <div className="main-content">
        {/* Left Panel */}
        <div className="left-panel" style={{
          width: activeView === "dashboard" ? '280px' : '240px',
          minWidth: activeView === "dashboard" ? '280px' : '240px',
          transition: 'width 0.3s ease, min-width 0.3s ease'
        }}>
          <div className="user-card">
            <div className="user-info">
              <FaUserCircle className="user-avatar" />
              <h2>{user.name || "Username"}</h2>
              <p><IoLocationSharp /> {user.location || "Location"}</p>
              <p><IoIosMail /> {user.email || "Email address"}</p>
            </div>
          </div>

          <div className="menu-card">
            <div className="menu-list">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView("dashboard");
                }}
                style={{
                  backgroundColor: activeView === "dashboard" ? "rgba(46, 125, 50, 0.1)" : "transparent",
                  color: activeView === "dashboard" ? "var(--primary-color)" : "var(--text-color)"
                }}
              >
                <FaHome className="icon" />Dashboard
              </a>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView("petition");
                }}
                style={{
                  backgroundColor: activeView === "petition" ? "rgba(46, 125, 50, 0.1)" : "transparent",
                  color: activeView === "petition" ? "var(--primary-color)" : "var(--text-color)"
                }}
              >
                <IoMdCreate className="icon" />Create a Petition
              </a>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView("poll");
                }}
                style={{
                  backgroundColor: activeView === "poll" ? "rgba(46, 125, 50, 0.1)" : "transparent",
                  color: activeView === "poll" ? "var(--primary-color)" : "var(--text-color)"
                }}
              >
                <MdOutlinePoll className="icon" />Create a Poll
              </a>
              <Link to="/reports"><BsGraphUp className="icon" />Reports</Link>
              <Link to="/settings"><IoMdSettings className="icon" />Settings</Link>
            </div>
            <div className="menu-list">
              <Link to="/help"><MdOutlineHelp className="icon" />Help & Support</Link>
              <Link to="/login" className="logout" onClick={handleLogout}><CgLogOut className="icon" />Logout</Link>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel" style={{
          flex: activeView === "dashboard" ? 1 : 2,
          transition: 'flex 0.3s ease'
        }}>
          {activeView === "dashboard" ? (
            <>
              <div className="welcome-message">
                <h1>Welcome Back, {user.name || "Username"}!</h1>
                <p>Manage your petitions and polls.</p>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Petitions</h3>
                  <h2>{userStats.totalActivePetitions}</h2>
                  <p>active</p>
                </div>
                <div className="stat-card">
                  <h3>My Petitions</h3>
                  <h2>{userStats.myPetitions}</h2>
                  <p>created by you</p>
                </div>
                <div className="stat-card">
                  <h3>Total Polls</h3>
                  <h2>{userStats.totalActivePolls}</h2>
                  <p>active in system</p>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="tab-navigation">
                <button
                  className={`tab-btn ${activeTab === "petitions" ? "active" : ""}`}
                  onClick={() => setActiveTab("petitions")}
                >
                  Petitions ({filteredPetitions.length})
                </button>
                <button
                  className={`tab-btn ${activeTab === "polls" ? "active" : ""}`}
                  onClick={() => setActiveTab("polls")}
                >
                  Polls ({filteredPolls.length})
                </button>
              </div>

              <div className="filters-container">
                <div className="filter-controls">
                  <h2>Active {activeTab === "petitions" ? "Petitions" : "Polls"}</h2>
                  <div className="location-filter">
                    <label htmlFor="location">Filter by Location:</label>
                    <input
                      type="text"
                      id="location"
                      placeholder="Location..."
                      className="location-input"
                      value={locationFilter}
                      onChange={e => setLocationFilter(e.target.value)}
                    />
                  </div>
                </div>
                {activeTab === "petitions" && (
                  <div className="category-buttons">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        className={`category-btn ${categoryFilter === cat ? 'active' : ''}`}
                        onClick={() => setCategoryFilter(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {activeTab === "petitions" ? (
                <>
                  {petitionsToDisplay.length === 0 ? (
                    <div className="no-petitions-found">
                      <p>No petitions found with the current filters.</p>
                      <button className="clear-button" onClick={clearFilters}>
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    <div className="petitions-list">
                      {petitionsToDisplay.map(petition => (
                        <div key={petition.id} className="petition-card">
                          <h3>{petition.title}</h3>
                          <p>{petition.description}</p>
                          <p><strong>Category:</strong> {petition.category}</p>
                          <p><strong>Location:</strong> {petition.location}</p>
                          {petition.status && (
                            <p><strong>Status:</strong> {petition.status}</p>
                          )}
                          <p><strong>Signatures:</strong> {petition.signatures?.length || 0}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button onClick={handleSeeAllClick} className="clear-button">
                      {filteredPetitions.length > 3 
                        ? `See All ${filteredPetitions.length} Petitions` 
                        : 'See All Petitions'
                      }
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {pollsToDisplay.length === 0 ? (
                    <div className="no-petitions-found">
                      <p>No polls found with the current filters.</p>
                      <button className="clear-button" onClick={clearFilters}>
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    <div className="polls-display">
                      {pollsToDisplay.map(poll => (
                        <div key={poll._id || poll.id} className="poll-card">
                          <h3>{poll.title}</h3>
                          <p>{poll.description}</p>
                          <p>
                            <IoLocationSharp /> 
                            {poll.targetLocation || poll.location || "Unknown"}
                          </p>
                          <p>
                            <strong>Created by:</strong> {poll.createdBy?.name || "Unknown"}
                          </p>
                          <p>
                            <strong>Closes on:</strong> {
                              poll.closesOn 
                                ? new Date(poll.closesOn).toLocaleDateString()
                                : 'No closing date'
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button onClick={handleSeeAllClick} className="clear-button">
                      {filteredPolls.length > 3 
                        ? `See All ${filteredPolls.length} Polls` 
                        : 'See All Polls'
                      }
                    </button>
                  </div>
                </>
              )}
            </>
          ) : activeView === "petition" ? (
            <PetitionPage isInDashboard={true} onSuccess={handleSuccessCallback} />
          ) : activeView === "poll" ? (
            <PollCreation isInDashboard={true} onSuccess={handleSuccessCallback} />
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;