import React, { useEffect, useState } from "react";
import { FaPlus, FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../Landing/Footer";
import Navbar from "../Landing/Navbar";
import styles from "./PetitionHead.module.css";

const PetitionHead = () => {
  const navigate = useNavigate();
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [petitionsPerPage] = useState(8);
  const [popup, setPopup] = useState("");

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

  // Get user info with fallback to token decoding
  const getUserInfo = () => {
    let userId = localStorage.getItem("userId") || "";
    let userObject = {};
    
    try {
      userObject = JSON.parse(localStorage.getItem("user") || "{}");
    } catch (error) {
      userObject = {};
    }

    // If localStorage doesn't have user info, try to get it from token
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
          
          // Update localStorage for future use
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

  const filteredPetitions = petitions
    .filter((petition) => petition)
    .filter((petition) => {
      if (isOfficial) {
        if (activeTab === "under-review") {
          return petition.status === "under-review" || petition.status === "pending";
        }
        if (activeTab === "closed") {
          return petition.status === "closed" || petition.status === "resolved";
        }
        return true;
      }

      if (activeTab === "mine") {
        return isUserOwnPetition(petition);
      }
      if (activeTab === "signed") {
        return isUserSignedPetition(petition) && !isUserOwnPetition(petition);
      }

      if (category !== "All Categories" && petition.category !== category) {
        return false;
      }

      return true;
    });

  // Pagination logic
  const indexOfLastPetition = currentPage * petitionsPerPage;
  const indexOfFirstPetition = indexOfLastPetition - petitionsPerPage;
  const currentPetitions = filteredPetitions.slice(indexOfFirstPetition, indexOfLastPetition);
  const totalPages = Math.ceil(filteredPetitions.length / petitionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusUpdate = async (petitionId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPopup("You must be logged in to update petition status.");
        return;
      }
      const res = await fetch(
        `http://localhost:4000/api/petitions/${petitionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update petition status");
      }

      setPopup(`Petition status updated to ${newStatus}!`);
      await fetchPetitions();
    } catch (error) {
      setPopup("Error updating petition status: " + error.message);
    }
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

      // Update the petition in the state
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'closed':
      case 'resolved':
        return '#ef4444';
      case 'under-review':
      case 'pending':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getPageTitle = () => {
    if (isOfficial) {
      switch (activeTab) {
        case "under-review":
          return "Petitions Under Review";
        case "closed":
          return "Closed Petitions";
        default:
          return "All Petitions";
      }
    }
    switch (activeTab) {
      case "mine":
        return "My Petitions";
      case "signed":
        return "Signed By Me";
      default:
        return "All Petitions";
    }
  };

  const getPageDescription = () => {
    if (isOfficial) {
      switch (activeTab) {
        case "under-review":
          return "Review and manage petitions that require official attention.";
        case "closed":
          return "View petitions that have been resolved or closed.";
        default:
          return "Overview of all petitions in the system.";
      }
    }
    switch (activeTab) {
      case "mine":
        return "Petitions you have created and are managing.";
      case "signed":
        return "Petitions you have signed and are supporting.";
      default:
        return "Browse, sign, and track petitions in your community.";
    }
  };

  const getEmptyMessage = () => {
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

  const myPetitionsCount = petitions.filter((p) => isUserOwnPetition(p)).length;
  const signedPetitionsCount = petitions.filter(
    (p) => isUserSignedPetition(p) && !isUserOwnPetition(p)
  ).length;
  const underReviewCount = petitions.filter(
    (p) => p.status === "under-review" || p.status === "pending"
  ).length;
  const closedCount = petitions.filter(
    (p) => p.status === "closed" || p.status === "resolved"
  ).length;

  // Pagination component
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

  // Popup component
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

  return (
    <>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className={styles.header}>
          <h2 className={styles.title}>{getPageTitle()}</h2>
          {!isOfficial && (
            <button
              className={styles.createBtn}
              onClick={() => navigate("/petition")}
            >
              <FaPlus className={styles.icon} /> Create Petition
            </button>
          )}
        </div>
        <p className={styles.descriptionText}>{getPageDescription()}</p>

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
                                | {petition.status}
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
                              onClick={() => navigate(`/petition/${petition._id}`)}
                            >
                              View Details
                            </button>

                            {isOfficial ? (
                              <div className={styles.officialActions}>
                                <button
                                  className={`${styles.actionBtn} ${styles.warningBtn}`}
                                  onClick={() => handleStatusUpdate(petition._id, "under-review")}
                                  disabled={petition.status === "under-review" || petition.status === "pending"}
                                  style={{
                                    opacity: (petition.status === "under-review" || petition.status === "pending") ? 0.6 : 1,
                                    cursor: (petition.status === "under-review" || petition.status === "pending") ? "not-allowed" : "pointer"
                                  }}
                                >
                                  {(petition.status === "under-review" || petition.status === "pending")
                                    ? "Under Review"
                                    : "Set Under Review"}
                                </button>

                                <button
                                  className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                                  onClick={() => handleStatusUpdate(petition._id, "closed")}
                                  disabled={petition.status === "closed" || petition.status === "resolved"}
                                  style={{
                                    opacity: (petition.status === "closed" || petition.status === "resolved") ? 0.6 : 1,
                                    cursor: (petition.status === "closed" || petition.status === "resolved") ? "not-allowed" : "pointer"
                                  }}
                                >
                                  {(petition.status === "closed" || petition.status === "resolved")
                                    ? "Closed"
                                    : "Close"}
                                </button>

                                {(petition.status === "closed" || petition.status === "resolved") && (
                                  <button
                                    className={`${styles.actionBtn} ${styles.successBtn}`}
                                    onClick={() => handleStatusUpdate(petition._id, "active")}
                                  >
                                    Reopen
                                  </button>
                                )}
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
                                      petition?.status === "closed" ||
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

        {!loading && (
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <h5 className={styles.statNumber}>{petitions.length}</h5>
              <small className={styles.statLabel}>Total Petitions</small>
            </div>
            {isOfficial ? (
              <>
                <div className={styles.statCard}>
                  <h5 className={styles.statNumberWarning}>{underReviewCount}</h5>
                  <small className={styles.statLabel}>Under Review</small>
                </div>
                <div className={styles.statCard}>
                  <h5 className={styles.statNumberSecondary}>{closedCount}</h5>
                  <small className={styles.statLabel}>Closed</small>
                </div>
                <div className={styles.statCard}>
                  <h5 className={styles.statNumberSuccess}>
                    {petitions.length - underReviewCount - closedCount}
                  </h5>
                  <small className={styles.statLabel}>Open</small>
                </div>
              </>
            ) : (
              <>
                <div className={styles.statCard}>
                  <h5 className={styles.statNumberInfo}>{myPetitionsCount}</h5>
                  <small className={styles.statLabel}>My Petitions</small>
                </div>
                <div className={styles.statCard}>
                  <h5 className={styles.statNumberSuccess}>{signedPetitionsCount}</h5>
                  <small className={styles.statLabel}>Signed By Me</small>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <Popup message={popup} onClose={() => setPopup("")} />
      <Footer />
    </>
  );
};

export default PetitionHead;