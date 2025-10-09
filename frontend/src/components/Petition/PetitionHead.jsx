import React, { useEffect, useState } from "react";
import { FaPlus, FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../Landing/Footer";
import Navbar from "../Landing/Navbar";
import styles from "./PetitionHead.module.css";
import OfficialStatusDropdown from "./OfficialStatusDropdown";

const PetitionHead = ({ isInDashboard, onViewDetails }) => {
  const navigate = useNavigate();
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [petitionsPerPage] = useState(9);
  const [popup, setPopup] = useState("");
  const [userLocation, setUserLocation] = useState("");

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

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
        const decodedToken = decodeToken(token);
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
      }
    }

    return { userId, userObject };
  };

  const { userId, userObject } = getUserInfo();
  const userType = userObject.userType || userObject.role || "citizen";

  const isOfficial =
    userType === "official" ||
    userType === "government" ||
    userType === "admin" ||
    userType.startsWith("admin") ||
    (userObject.role &&
      (userObject.role === "official" ||
        userObject.role === "government" ||
        userObject.role === "admin" ||
        userObject.role.startsWith("admin"))) ||
    (userObject.name &&
      (userObject.name.toLowerCase().includes("official") ||
        userObject.name.toLowerCase().includes("admin") ||
        userObject.name.toLowerCase().includes("government")));

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:4000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUserLocation(data.user?.location || "");
        }
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };

    fetchUserLocation();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  const fetchPetitions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/petitions", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch petitions");
      const data = await res.json();
      setPetitions(data || []);
    } catch (error) {
      setPetitions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetitions();
  }, []);

  const isUserOwnPetition = (petition) => {
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

  const isUserSignedPetition = (petition) => {
    const arr = petition.signatures || petition.signedBy || [];
    if (!Array.isArray(arr)) return false;
    
    return arr.some((sig) => {
      let sigId = sig?._id?.toString() || sig?.toString() || "";
      return (
        sigId === userId ||
        sigId === userObject._id ||
        sigId === userObject.id
      );
    });
  };

  const normalizeStatus = (status) => {
    if (!status) return "active";
    const normalized = status.toLowerCase().replace(/[_\s]+/g, ' ').trim();
    return normalized;
  };

  const filteredPetitions = petitions
    .filter((petition) => petition)
    .filter((petition) => {

      if (category !== "All Categories" && petition.category !== category) {
        return false;
      }

      if (activeTab === "location") {
        return petition.location === userLocation;
      }

      if (isOfficial) {
        const petitionStatus = normalizeStatus(petition.status);
        if (activeTab === "under-review") {
          return petitionStatus === "under review" || petitionStatus === "pending";
        }
        if (activeTab === "closed") {
          return petitionStatus === "closed" || petitionStatus === "resolved";
        }
        return true;
      }

      if (activeTab === "mine") {
        return isUserOwnPetition(petition);
      }
      if (activeTab === "signed") {
        return isUserSignedPetition(petition) && !isUserOwnPetition(petition);
      }

      return true;
    });

  const indexOfLastPetition = currentPage * petitionsPerPage;
  const indexOfFirstPetition = indexOfLastPetition - petitionsPerPage;
  const currentPetitions = filteredPetitions.slice(indexOfFirstPetition, indexOfLastPetition);
  const totalPages = Math.ceil(filteredPetitions.length / petitionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusUpdate = async (petitionId) => {
    // Refresh the specific petition or all petitions
    await fetchPetitions();
    setPopup("Petition status updated successfully!");
    setTimeout(() => setPopup(""), 3000);
  };

  const handleSign = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPopup("You must be logged in to sign a petition.");
        return;
      }

      const res = await fetch(`http://localhost:4000/api/petitions/${id}/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        setPopup(errorData.message || "Failed to sign petition");
        return;
      }

      setPetitions((prev) =>
        prev.map((p) => {
          if (p._id === id) {
            return {
              ...p,
              signatures: [...(p.signatures || []), userId]
            };
          }
          return p;
        })
      );

      setPopup("Petition signed successfully!");
    } catch (error) {
      setPopup("Error signing petition: " + error.message);
    }
  };

  const handleViewDetailsClick = (petitionId) => {
    if (isInDashboard && onViewDetails) {
      onViewDetails(petitionId);
    } else {
      navigate(`/petition/${petitionId}`);
    }
  };

  const getStatusColor = (status) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'active':
        return '#10b981';
      case 'closed':
      case 'resolved':
        return '#ef4444';
      case 'under review':
      case 'pending':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStatusDisplay = (status) => {
    const normalized = normalizeStatus(status);
    return normalized.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const myPetitionsCount = petitions.filter((p) => isUserOwnPetition(p)).length;
  const signedPetitionsCount = petitions.filter(
    (p) => isUserSignedPetition(p) && !isUserOwnPetition(p)
  ).length;
  const locationPetitionsCount = petitions.filter(
    (p) => p.location === userLocation
  ).length;
  const underReviewCount = petitions.filter(
    (p) => {
      const status = normalizeStatus(p.status);
      return status === "under review" || status === "pending";
    }
  ).length;
  const closedCount = petitions.filter(
    (p) => {
      const status = normalizeStatus(p.status);
      return status === "closed" || status === "resolved";
    }
  ).length;

  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className={styles.paginationContainer}>
        <div className={styles.pagination}>
          <button
            className={`${styles.paginationBtn} ${styles.paginationArrow}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>

          {startPage > 1 && (
            <>
              <button
                className={styles.paginationBtn}
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
              {startPage > 2 && <span className={styles.paginationEllipsis}>...</span>}
            </>
          )}

          {pageNumbers.map((number) => (
            <button
              key={number}
              className={`${styles.paginationBtn} ${
                number === currentPage ? styles.paginationActive : ""
              }`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className={styles.paginationEllipsis}>...</span>}
              <button
                className={styles.paginationBtn}
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            className={`${styles.paginationBtn} ${styles.paginationArrow}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </button>
        </div>
        <div className={styles.paginationInfo}>
          Showing {indexOfFirstPetition + 1} to {Math.min(indexOfLastPetition, filteredPetitions.length)} of {filteredPetitions.length} petitions
        </div>
      </div>
    );
  };

  const Popup = ({ message, onClose }) =>
    message ? (
      <div className={styles.popupOverlay} onClick={onClose}>
        <div className={styles.popup} onClick={e => e.stopPropagation()}>
          <p>{message}</p>
          <button className={styles.popupCloseBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    ) : null;

  const getEmptyMessage = () => {
    if (activeTab === "location") {
      return `No petitions found in ${userLocation}. ${isOfficial ? 'No petitions in your jurisdiction yet.' : 'Be the first to create one!'}`;
    }

    if (isOfficial) {
      switch (activeTab) {
        case "under-review":
          return "No petitions are currently under review.";
        case "closed":
          return "No closed petitions found.";
        default:
          return "No petitions found in the system.";
      }
    }
    switch (activeTab) {
      case "mine":
        return "You haven't created any petitions yet. Start by creating your first petition!";
      case "signed":
        return "You haven't signed any petitions yet. Browse and support causes you care about!";
      default:
        return "No petitions found.";
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.controls}>
          <div className={styles.tabGroup}>
            {isOfficial ? (
              <>
                <button
                  className={`${styles.tabBtn} ${
                    activeTab === "all" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabChange("all")}
                >
                  All Petitions
                </button>
                <button
                  className={`${styles.tabBtn} ${
                    activeTab === "location" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabChange("location")}
                >
                  My Location ({locationPetitionsCount})
                </button>
                <button
                  className={`${styles.tabBtn} ${
                    activeTab === "under-review" ? styles.activeTabWarning : ""
                  }`}
                  onClick={() => handleTabChange("under-review")}
                >
                  Under Review ({underReviewCount})
                </button>
                <button
                  className={`${styles.tabBtn} ${
                    activeTab === "closed" ? styles.activeTabSecondary : ""
                  }`}
                  onClick={() => handleTabChange("closed")}
                >
                  Closed ({closedCount})
                </button>
              </>
            ) : (
              <>
                <button
                  className={`${styles.tabBtn} ${
                    activeTab === "all" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabChange("all")}
                >
                  All Petitions
                </button>
                <button
                  className={`${styles.tabBtn} ${
                    activeTab === "mine" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabChange("mine")}
                >
                  My Petitions ({myPetitionsCount})
                </button>
                <button
                  className={`${styles.tabBtn} ${
                    activeTab === "signed" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabChange("signed")}
                >
                  Signed By Me ({signedPetitionsCount})
                </button>
                <button
                  className={`${styles.tabBtn} ${
                    activeTab === "location" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabChange("location")}
                >
                  In My Location ({locationPetitionsCount})
                </button>
              </>
            )}
          </div>

          <div className={styles.filter}>
            <FaFilter className={styles.filterIcon} />
            <select
              className={styles.select}
              value={category}
              onChange={handleCategoryChange}
            >
              <option>All Categories</option>
              <option value="Environment">Environment</option>
              <option value="Transport">Transportation</option>
              <option value="Education">Education</option>
              <option value="Health & Safety">Public Safety</option>
              <option value="Local Government & Policy">Healthcare</option>
              <option value="Community & Social Issues">Infrastructure</option>
              <option value="Community & Social Issues">Animal Welfare</option>
            </select>
          </div>
        </div>

        <div className={styles.petitionList}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Loading petitions...</p>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {currentPetitions.length === 0 ? (
                  <div className={styles.emptyState}>
                    <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                    <h5 className={styles.emptyMessage}>{getEmptyMessage()}</h5>
                    {activeTab === "location" && !isOfficial && (
                      <button
                        className={styles.createBtnSecondary}
                        onClick={() => navigate("/petition")}
                      >
                        <FaPlus className={styles.icon} />
                        Create Petition in {userLocation}
                      </button>
                    )}
                    {activeTab === "mine" && !isOfficial && (
                      <button
                        className={styles.createBtnSecondary}
                        onClick={() => navigate("/petition")}
                      >
                        <FaPlus className={styles.icon} />
                        Create Your First Petition
                      </button>
                    )}
                  </div>
                ) : (
                  currentPetitions.map((petition) => (
                    <div className={styles.col} key={petition._id}>
                      <div className={styles.card}>
                        <div className={styles.cardBody}>
                          <div className={styles.cardHeader}>
                            <h5 className={styles.cardTitle}>{petition?.title}</h5>
                            <span className={styles.categoryBadge}>
                              {petition?.category || "N/A"}
                            </span>
                          </div>
                          <p className={styles.locationDescription}>
                            {petition?.location}
                          </p>
                          <p className={styles.cardDescription}>
                            {petition?.description?.length > 100
                              ? `${petition.description.substring(0, 100)}...`
                              : petition?.description || "No description"}
                          </p>

                          <div className={styles.progressContainer}>
                            <p className={styles.signatureCount}>
                              <strong>{petition?.signatures?.length || 0}</strong>{" "}
                              of {petition?.signatureGoal || 0} signatures
                            </p>
                            <p className={styles.statusInfo}>
                              {petition.signatures.length} signatures
                              <span
                                className={styles.statusBadge}
                                style={{
                                  marginLeft: "10px",
                                  fontWeight: "bold",
                                  color: getStatusColor(petition.status)
                                }}
                              >
                                | {getStatusDisplay(petition.status)}
                              </span>
                            </p>

                            <div className={styles.progressBar}>
                              <div
                                className={styles.progress}
                                style={{
                                  width: `${Math.min(
                                    ((petition?.signatures?.length || 0) /
                                      (petition?.signatureGoal || 1)) *
                                      100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className={styles.actions}>
                            <button
                              className={styles.detailsBtn}
                              onClick={() => handleViewDetailsClick(petition._id)}
                            >
                              View Details
                            </button>
                            {isOfficial ? (
                              <div className={styles.officialActions}>
                                {/* <OfficialStatusDropdown
                                  petition={petition}
                                  handleStatusUpdate={handleStatusUpdate}
                                  officialName={userObject.name || "Official"}
                                /> */}
                              </div>
                            ) : (
                              <div className={styles.userActions}>
                                {!isUserOwnPetition(petition) && (
                                  <button
                                    className={`${styles.actionBtn} ${
                                      isUserSignedPetition(petition)
                                        ? styles.signedBtn
                                        : styles.signBtn
                                    }`}
                                    disabled={
                                      normalizeStatus(petition?.status) === "closed" ||
                                      isUserSignedPetition(petition)
                                    }
                                    onClick={() => handleSign(petition._id)}
                                  >
                                    {isUserSignedPetition(petition)
                                      ? "Already Signed"
                                      : "Sign Petition"}
                                  </button>
                                )}
                                {isUserOwnPetition(petition) && (
                                  <button className={styles.ownerBtn}>
                                    Created By You
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <PaginationComponent />
            </>
          )}
        </div>
      </div>
      <Popup message={popup} onClose={() => setPopup("")} />
    </>
  );
};

export default PetitionHead;

// Done
