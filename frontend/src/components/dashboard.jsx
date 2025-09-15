import React, { useEffect, useState } from "react";
import './dashboard.css';
import { FaUserCircle, FaHome } from "react-icons/fa";
import { IoIosMail, IoMdCreate } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { MdOutlinePoll, MdOutlineHelp } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { CgLogOut } from "react-icons/cg";

function Dashboard() {
  // User state
  const [user, setUser] = useState({ name: "", email: "", location: "" });

  // Petitions states
  const [petitions, setPetitions] = useState([]);
  const [filteredPetitions, setFilteredPetitions] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://localhost:4000/api/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        if (data.user) {
          setUser({
            name: data.user.name,
            email: data.user.email,
            location: data.user.location || "Unknown",
          });
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchPetitions = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/petitions', { cache: "no-store" });

        if (!response.ok) throw new Error("Failed to fetch petitions");
        const data = await response.json();

        const normalizedPetitions = data.map(p => ({
  id: p._id?.$oid || p._id || p.id,
  title: p.title,
  description: p.description,
  category: p.category,
  location: p.location,
  image: p.image ? `http://localhost:4000${p.image}` : null,
  status: p.status,
}));


        setPetitions(normalizedPetitions);
        setFilteredPetitions(normalizedPetitions);
      } catch (error) {
        console.error("Error fetching petitions:", error);
      }
    };

    fetchPetitions();
  }, []);

  useEffect(() => {
    let filtered = petitions;

    if (locationFilter.trim() !== "") {
      filtered = filtered.filter(p =>
        p.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (categoryFilter !== "All Categories") {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    setFilteredPetitions(filtered);
  }, [locationFilter, categoryFilter, petitions]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const categories = [
    "All Categories",
    "Environment",
    "Infrastructure",
    "Education",
    "Public Safety",
    "Transportation",
    "Healthcare",
  ];

  return (
    <div className="dash" style={{ padding: 0, margin: 0 }}>
      {/* Navbar */}
      <div className="navbar">
        <div className="navlogo">
          <img src="/logo.png" alt="Logo" style={{ width: '95px', height: '45px' }} />
        </div>
        <div className="nav-center">
          <Link to="/dashboard" className="n1">Home</Link>
          <Link to="/petitions" className="n1">Petitions</Link>
          <Link to="/pollsfilter" className="n1">Polls</Link>
          <Link to="/reports" className="n1">Reports</Link>
        </div>
        <div className="nav-right">
          <FaUserCircle size={50} className="nr" />
          <p className="nr">{user.name || "Username"}</p>
        </div>
      </div>

      <div className="main">
        {/* Left Sidebar */}
        <div className="box-left">
          <div className="user-box">
            <div className="box1">
              <FaUserCircle size={50} />
              <p className="user-name">{user.name || "Username"}</p>
            </div>
            <p className="user-location">
              <IoLocationSharp style={{ marginRight: "7px", verticalAlign: "middle" }} />
              {user.location || "Location"}
            </p>
            <p className="user-email">
              <IoIosMail style={{ marginRight: "7px", verticalAlign: "middle" }} />
              {user.email || "Email address"}
            </p>
          </div>

          <div className="option-box">
            <Link to="/dashboard" className="o1 o3" style={{ display: "flex", alignItems: "center" }}>
              <FaHome style={{ marginRight: "7px" }} />
              Dashboard
            </Link>

            <Link to="/create-petition" className="o1 o3" style={{ display: "flex", alignItems: "center" }}>
              <IoMdCreate style={{ marginRight: "7px" }} />
              Create a Petition
            </Link>

            <Link to="/pollsfilter" className="o1 o3" style={{ display: "flex", alignItems: "center" }}>
              <MdOutlinePoll style={{ marginRight: "7px" }} />
              Create a Poll
            </Link>

            <Link to="/reports" className="o1 o3" style={{ display: "flex", alignItems: "center" }}>
              <BsGraphUp style={{ marginRight: "7px" }} />
              Reports
            </Link>

            <Link to="/settings" className="o1 o3" style={{ display: "flex", alignItems: "center" }}>
              <IoMdSettings style={{ marginRight: "7px" }} />
              Settings
            </Link>

            <Link to="/help" className="o1 o3" style={{ display: "flex", alignItems: "center", marginTop: '3rem' }}>
              <MdOutlineHelp style={{ marginRight: "7px" }} />
              Help & Support
            </Link>

            <Link
              to="/login"
              className="o1 o3 o5"
              style={{ display: "flex", alignItems: "center" }}
              onClick={handleLogout}
            >
              <CgLogOut style={{ marginRight: "7px" }} />
              Logout
            </Link>
          </div>
        </div>

        {/* Right content */}
        <div className="right-box">
          <div className="user-intro">
            <h1 style={{ marginBottom: '0.5rem' }}>Welcome Back, {user.name || "Username"}!</h1>
            <p style={{ marginTop: '0', marginLeft: '0.6rem' }}>
              Discover what’s happening in your community and share your thoughts
            </p>
          </div>

          <div className="rb">
            <div className="rb1">
              <h3 className="rb2"> My Petitions</h3>
              <h2 className="rb2">0</h2>
              <p className="rb2">petitions</p>
            </div>
            <div className="rb1">
              <h3 className="rb2">Successful Petitions</h3>
              <h2 className="rb2">0</h2>
              <p className="rb2">or under review</p>
            </div>
            <div className="rb1">
              <h3 className="rb2">Polls Created</h3>
              <h2 className="rb2">0</h2>
              <p className="rb2">polls</p>
            </div>
          </div>

          {/* Filters */}
          <div className="active">
            <h2>Active Petitions Near You</h2>
            <div className="loc">
              <label htmlFor="location">Showing For : </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder=" Location .."
                className="loc1"
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="category">
            {categories.map(cat => (
              <button
                key={cat}
                className="cat"
                style={{
                  backgroundColor: categoryFilter === cat ? 'rgba(0, 128, 0, 0.74)' : undefined,
                  color: categoryFilter === cat ? 'white' : undefined,
                }}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Petitions List or No Result */}
          {filteredPetitions.length === 0 ? (
            <div className="clear">
              <p className="c1">No petitions found with the current filters</p>
              <button
                className="clear-button c1"
                onClick={() => {
                  setLocationFilter("");
                  setCategoryFilter("All Categories");
                }}
              >
                Clear Filter
              </button>
            </div>
          ) : (
            <div className="petition-list">
              {filteredPetitions.map(petition => (
                <div key={petition.id} className="petition-card">
                  <h3>{petition.title}</h3>
                  <p>{petition.description}</p>
                  <p><strong>Category:</strong> {petition.category}</p>
                  <p><strong>Location:</strong> {petition.location}</p>
                  {petition.image && (
                    <img
                      src={petition.image}
                      alt={petition.title}
                      className="petition-image"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section about">
            <h4>About Civix</h4>
            <p>
              Civix empowers citizens to actively engage in local governance through petitions, polls,
              and public feedback. Our mission is to create transparent and accountable communities by
              giving everyone a voice.
            </p>
          </div>
          <div className="footer-section links">
            <h4>Quick Links</h4>
            <Link to="/dashboard" className="f1">Home</Link>
            <Link to="/petitions" className="f1">Petitions</Link>
            <Link to="/pollsfilter" className="f1">Polls</Link>
            <Link to="/reports" className="f1">Reports</Link>
            <Link to="/settings" className="f1">Settings</Link>
            <Link to="/help" className="f1">Help & Support</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Civix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;


