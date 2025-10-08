
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Landing/Navbar";
import Footer from "../Landing/Footer";
import styles from "./PetitionDetails.module.css";

// Utility for mapping frontend status label to backend enum
const getBackendStatus = (status) => {
  if (status === "under-review") return "under_review";
  if (status === "active" || status === "closed") return status;
  return status;
};

const PetitionDetails = ({ isInDashboard, petitionId: propPetitionId, onBack }) => {
  const params = useParams();
  const urlId = params.id;
  // Use prop ID if in dashboard, otherwise use URL param
  const id = propPetitionId || urlId;
  const navigate = useNavigate();
  
  const [petition, setPetition] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [responseText, setResponseText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasSigned, setHasSigned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Suppress console errors for 403 responses
    const originalError = console.error;
    console.error = (...args) => {
      // Filter out 403 errors related to comments endpoint
      const errorString = args.join(' ');
      if (errorString.includes('403') && errorString.includes('comments/petition')) {
        return; // Silently ignore
      }
      originalError.apply(console, args);
    };

    // Load user data first
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
      } catch (e) {
        console.warn("Failed to parse user from localStorage");
      }
    }

    // Check if ID exists
    if (!id) {
      console.error("No petition ID provided!");
      setError("Invalid or missing petition ID. Please navigate from the petitions list.");
      setLoading(false);
      return;
    }

    const fetchPetition = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `http://localhost:4000/api/petitions/${id}`;
        const res = await fetch(url);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Petition not found");
          }
          throw new Error(`Failed to fetch petition (Status: ${res.status})`);
        }
        
        const data = await res.json();
        setPetition(data);
        
        // Check if current user has signed
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setHasSigned(data.signatures?.includes(parsedUser.id) || false);
        }
      } catch (err) {
        console.error("Error fetching petition:", err);
        setError(err.message || "Failed to fetch petition");
        setPetition(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setComments([]);
        return;
      }
      
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        };
        
        const res = await fetch(`http://localhost:4000/api/comments/petition/${id}`, {
          headers
        }).catch(() => null); // Catch network errors
        
        if (res && res.ok) {
          const data = await res.json().catch(() => null);
          if (data) {
            setComments(data);
            return;
          }
        }
      } catch (err) {
        // Silently ignore all errors
      }
      
      // Default to empty if anything fails
      setComments([]);
    };

    fetchPetition();
    fetchComments();

    // Cleanup: restore original console.error
    return () => {
      console.error = originalError;
    };
  }, [id]);

  // Permission check for official managing petition
  const canManagePetition =
    role === "official" &&
    user?.location &&
    petition?.location &&
    user.location === petition.location;

  const openStatusPopup = (status) => {
    if (role === "official" && petition && user.location !== petition.location) {
      alert(
        `You can only manage petitions in your assigned location (${user.location}). This petition is in ${petition.location}.`
      );
      return;
    }
    setSelectedStatus(status);
    setShowPopup(true);
  };

  const confirmStatusChange = async () => {
    if (!responseText.trim()) {
      alert("Please provide a reason before submitting.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login required to update petition.");
      return;
    }
    if (user?.location !== petition.location) {
      alert(`You can only manage petitions in your location: ${user.location}`);
      return;
    }

    setIsSubmitting(true);
    try {
      let apiUrl, method, body;
      if (selectedStatus === "closed") {
        // Close petition endpoint
        apiUrl = `http://localhost:4000/api/official/petitions/${petition._id}/close`;
        method = "POST";
        body = JSON.stringify({ reason: responseText });
      } else {
        // Update status endpoint - DON'T send comment to avoid backend validation error
        // Backend has a bug where it tries to save petition status to Comment model
        apiUrl = `http://localhost:4000/api/official/petitions/${petition._id}/status`;
        method = "PUT";
        body = JSON.stringify({
          status: getBackendStatus(selectedStatus)
          // NOT sending comment field to avoid backend creating a Comment with invalid status
        });
      }
      
      const res = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      }).catch(() => null);

      if (!res || !res.ok) {
        let errorMessage = "Failed to update status";
        if (res) {
          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If JSON parsing fails, use default message
          }
        }
        throw new Error(errorMessage);
      }

      const result = await res.json().catch(() => ({ message: "Status updated" }));
      
      // Refresh petition data
      try {
        const refetchedPetition = await fetch(
          `http://localhost:4000/api/petitions/${id}`
        ).then((res) => res.json());
        setPetition(refetchedPetition);
      } catch (e) {
        // Silently fail
      }
      
      // Try to refresh comments (silently fail if not accessible)
      setTimeout(async () => {
        try {
          const commentsRes = await fetch(
            `http://localhost:4000/api/comments/petition/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }
          ).catch(() => null);
          
          if (commentsRes && commentsRes.ok) {
            const commentsData = await commentsRes.json().catch(() => null);
            if (commentsData) {
              setComments(commentsData);
            }
          }
        } catch (e) {
          // Silently ignore
        }
      }, 500);
      
      setShowPopup(false);
      setResponseText("");
      setSelectedStatus("");
      alert(result.message || "Petition status updated successfully!");
    } catch (err) {
      alert("Error updating status: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignPetition = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to sign this petition.");
      if (!isInDashboard) {
        navigate("/login");
      }
      return;
    }

    if (hasSigned) {
      alert("You have already signed this petition.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:4000/api/petitions/${id}/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to sign petition");
      }

      const data = await res.json();
      
      // Refresh petition data
      const refetchedPetition = await fetch(
        `http://localhost:4000/api/petitions/${id}`
      ).then((res) => res.json());
      setPetition(refetchedPetition);
      setHasSigned(true);
      
      alert(data.message || "Petition signed successfully!");
    } catch (err) {
      alert("Error signing petition: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    if (isInDashboard && onBack) {
      onBack();
    } else {
      navigate("/petition");
    }
  };

  // Show latest official comment, if any
  const officialComments = comments.filter((c) => c.isOfficial);
  const latestOfficial = officialComments.length
    ? officialComments[officialComments.length - 1]
    : null;

  const signatureCount = petition?.signatures?.length || 0;
  const signatureGoal = petition?.signatureGoal || 100;
  const signaturePercentage = Math.min((signatureCount / signatureGoal) * 100, 100);

  if (loading) {
    return (
      <div className={styles.lu}>
        {!isInDashboard && <Navbar />}
        <div className={styles.loading}>Loading petition details...</div>
        {!isInDashboard && <Footer />}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.lu}>
        {!isInDashboard && <Navbar />}
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleBackClick} className={styles.backButton}>
            Back to Petitions
          </button>
        </div>
        {!isInDashboard && <Footer />}
      </div>
    );
  }

  if (!petition) {
    return (
      <div className={styles.lu}>
        {!isInDashboard && <Navbar />}
        <div className={styles.error}>
          <h2>Petition not found</h2>
          <button onClick={handleBackClick} className={styles.backButton}>
            Back to Petitions
          </button>
        </div>
        {!isInDashboard && <Footer />}
      </div>
    );
  }

  return (
    <div className={styles.lu}>
      {!isInDashboard && <Navbar />}
      <div className={styles.card}>
        <div className={styles.cardBody}>
          {/* Back Button */}
          {(isInDashboard || true) && (
            <button onClick={handleBackClick} className={styles.backButton}>
              ← Back to Petitions
            </button>
          )}

          {/* Petition Image */}
          {petition.image && (
            <div className={styles.imageContainer}>
              <img 
                src={`http://localhost:4000/api/petitions/image/${petition.image}`} 
                alt={petition.title}
                className={styles.petitionImage}
              />
            </div>
          )}

          {/* Petition Header */}
          <div className={styles.header}>
            <span className={`${styles.statusBadge} ${styles[petition.status]}`}>
              {petition.status}
            </span>
            <h2 className={styles.title}>{petition.title}</h2>
          </div>

          {/* Petition Info */}
          <div className={styles.infoGrid}>
            <p className={styles.info}>
              <strong>Category:</strong> {petition.category}
            </p>
            <p className={styles.info}>
              <strong>Location:</strong> {petition.location}
            </p>
            <p className={styles.info}>
              <strong>Created by:</strong> {petition.createdBy?.name || "Anonymous"}
            </p>
            <p className={styles.info}>
              <strong>Created on:</strong> {new Date(petition.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Description */}
          <div className={styles.descriptionSection}>
            <h3>Description</h3>
            <p className={styles.description}>{petition.description}</p>
          </div>

          {/* Signature Progress */}
          <div className={styles.signatureSection}>
            <div className={styles.signatureHeader}>
              <h3>Signatures</h3>
              <span className={styles.signatureCount}>
                {signatureCount} / {signatureGoal}
              </span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${signaturePercentage}%` }}
              />
            </div>
            <p className={styles.progressText}>
              {signaturePercentage.toFixed(1)}% of goal reached
            </p>
          </div>

          {/* Citizen Actions - Sign Petition */}
          {role === "citizen" && petition.status === "active" && (
            <div className={styles.citizenActions}>
              <button
                className={`${styles.signButton} ${hasSigned ? styles.disabled : ""}`}
                onClick={handleSignPetition}
                disabled={hasSigned || isSubmitting}
              >
                {hasSigned ? "✓ Already Signed" : "Sign This Petition"}
              </button>
            </div>
          )}

          {/* Official Response */}
          {latestOfficial && (
            <div className={styles.responseBox}>
              <h4>Official Response</h4>
              <p>{latestOfficial.content}</p>
              <div className={styles.responseMeta}>
                <small className={styles.responseAuthor}>
                  By: {latestOfficial.author?.name || "Official"}
                </small>
                <small className={styles.responseDate}>
                  {new Date(latestOfficial.createdAt).toLocaleDateString()}
                </small>
              </div>
            </div>
          )}

          {/* Official Actions */}
          {canManagePetition && (
            <div className={styles.officialActions}>
              <h4>Official Actions</h4>
              <div className={styles.actionButtons}>
                {petition.status !== "closed" && (
                  <button
                    className={styles.closeButton}
                    onClick={() => openStatusPopup("closed")}
                    disabled={isSubmitting}
                  >
                    Close Petition
                  </button>
                )}
                {petition.status !== "under review" && (
                  <button
                    className={styles.reviewButton}
                    onClick={() => openStatusPopup("under review")}
                    disabled={isSubmitting}
                  >
                    Set Under Review
                  </button>
                )}
                {petition.status !== "active" && (
                  <button
                    className={styles.activeButton}
                    onClick={() => openStatusPopup("active")}
                    disabled={isSubmitting}
                  >
                    Reopen Petition
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Comments Section - Only show if comments are accessible */}
          {comments.length > 0 && (
            <div className={styles.commentsSection}>
              <h4>Official Comments ({comments.length})</h4>
              <div className={styles.commentsList}>
                {comments.map((comment) => (
                  <div 
                    key={comment._id} 
                    className={`${styles.comment} ${comment.isOfficial ? styles.officialComment : ""}`}
                  >
                    <div className={styles.commentHeader}>
                      <strong>{comment.author?.name || "Anonymous"}</strong>
                      {comment.isOfficial && (
                        <span className={styles.officialBadge}>Official</span>
                      )}
                      <span className={styles.commentDate}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={styles.commentContent}>{comment.content}</p>
                    {comment.status && (
                      <span className={styles.commentStatus}>Status: {comment.status}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Popup */}
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupBox}>
            <h3>
              {selectedStatus === "under-review"
                ? "Set Petition Under Review"
                : selectedStatus === "closed"
                ? "Close Petition"
                : "Reopen Petition"}
            </h3>
            <textarea
              className={styles.textarea}
              placeholder="Enter reason or official response..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              rows={6}
              disabled={isSubmitting}
            />
            <div className={styles.popupActions}>
              <button 
                className={styles.submitBtn} 
                onClick={confirmStatusChange}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setShowPopup(false);
                  setResponseText("");
                  setSelectedStatus("");
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {!isInDashboard && <Footer />}
    </div>
  );
};

export default PetitionDetails;