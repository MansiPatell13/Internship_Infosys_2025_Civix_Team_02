import React, { useEffect, useState } from "react";
import { FaPlus, FaFilter } from "react-icons/fa";
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

  const userId = localStorage.getItem("userId") || "";
  const userObject = JSON.parse(localStorage.getItem("user") || "{}");
  const userType = userObject.userType || userObject.role || "citizen";
  const isOfficial =
    userType === "official" || userType === "government" || userType === "admin";

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleCategoryChange = (e) => setCategory(e.target.value);

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
      console.error("Error fetching petitions:", error);
      setPetitions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetitions();
  }, []);

  const isUserOwnPetition = (petition) => {
    let creatorId;
    if (typeof petition.createdBy === "object" && petition.createdBy !== null) {
      creatorId = petition.createdBy._id?.toString() || petition.createdBy.toString();
    } else {
      creatorId = petition.createdBy?.toString();
    }
    return creatorId === userId || creatorId === userObject._id;
  };

  const isUserSignedPetition = (petition) => {
    if (!petition.signatures || !Array.isArray(petition.signatures)) {
      return false;
    }
    const isSigned = petition.signatures.some((sig) => {
      let sigId;
      if (typeof sig === "object" && sig !== null) {
        sigId = sig._id?.toString() || sig.toString();
      } else {
        sigId = sig?.toString();
      }
      return sigId === userId || sigId === userObject._id;
    });
    return isSigned;
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

  const handleStatusUpdate = async (petitionId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to update petition status.");
        return;
      }
      
      console.log(`Updating petition ${petitionId} to status: ${newStatus}`);
      
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
      
      const updatedPetition = await res.json();
      console.log("Updated petition:", updatedPetition);
      
      // Update the local state immediately
      setPetitions((prev) =>
        prev.map((p) => 
          p._id === petitionId 
            ? { ...p, status: newStatus } 
            : p
        )
      );
      
      alert(`Petition status updated to ${newStatus}!`);
      
      // Fetch fresh data to ensure consistency
      await fetchPetitions();
    } catch (error) {
      console.error("Error updating petition status:", error);
      alert("Error updating petition status: " + error.message);
    }
  };

  const handleSign = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to sign a petition.");
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
        const err = await res.json();
        throw new Error(err.message || "Failed to sign petition");
      }
      const data = await res.json();
      setPetitions((prev) =>
        prev.map((p) =>
          p._id === id
            ? {
                ...p,
                signatures: data.petition?.signatures || p.signatures,
                status: data.petition?.status || p.status,
              }
            : p
        )
      );
      alert("Petition signed successfully!");
      fetchPetitions();
    } catch (error) {
      alert("Error signing petition: " + error.message);
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

  return (
    <div className={styles.l}>

      <Navbar />
      <div className={styles.container}>
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
                  My Petitions
                </button>
                <button
                  className={`${styles.tabBtn} ${
                    activeTab === "signed" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabChange("signed")}
                >
                  Signed By Me
                </button>
              </>
            )}
          </div>

          {activeTab === "all" && (
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
          )}
        </div>

        <div className={styles.petitionList}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Loading petitions...</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredPetitions.length === 0 ? (
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
                filteredPetitions.map((petition) => (
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
                          <p>
  {petition.signatures.length} signatures{" "}
  <span
    style={{
      marginLeft: "10px",
      fontWeight: "bold",
      color:
        petition.status === "active"
          ? "green"
          : petition.status === "closed"
          ? "red"
          : petition.status === "under-review"
          ? "blue"
          : "black", // fallback
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
                              {/* Set Under Review Button */}
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

                              {/* Close Button */}
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

                              {/* Reopen Button - Only show for closed petitions */}
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
      <Footer />
    </div>
  );
};

export default PetitionHead;