import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Landing/Navbar";
import Footer from "../Landing/Footer";
import styles from "./PetitionDetails.module.css";

const PetitionDetails = ({ isInDashboard, petitionId, onBack }) => {
  const { id: urlId } = useParams();
  const id = isInDashboard ? petitionId : urlId;
  const navigate = useNavigate();

  const [petition, setPetition] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  // Popup modal state
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    const fetchPetition = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/petitions/${id}`);
        if (!res.ok) throw new Error("Failed to fetch petition");
        const data = await res.json();
        setPetition(data);
      } catch (err) {
        console.error(err);
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
      } catch (parseError) {
        console.error("Error parsing user:", parseError);
      }
    }

    if (id) {
      fetchPetition();
    }
  }, [id]);

  if (!petition) return <p className="text-center mt-5">Loading petition...</p>;

  const progressPercentage = Math.min(
    ((petition.signatures?.length || 0) / (petition.signatureGoal || 1)) * 100,
    100
  );

  // Open modal before status update
  const openStatusPopup = (status) => {
    setSelectedStatus(status);
    setShowPopup(true);
  };

  // Confirm update
  const confirmStatusChange = async () => {
    if (!responseText.trim()) {
      alert("Please provide a response before submitting.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Login required to update petition.");
        return;
      }

      const res = await fetch(`http://localhost:4000/api/petitions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: selectedStatus,
          officialResponse: responseText,
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();

      // fallback if backend doesn't save officialResponse
      setPetition({
        ...updated,
        officialResponse: responseText,
      });

      setShowPopup(false);
      setResponseText("");
      setSelectedStatus("");
    } catch (err) {
      console.error(err);
      alert("Error updating status: " + err.message);
    }
  };

  // Handle back button click
  const handleBackClick = () => {
    if (isInDashboard && onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={styles.lu}>
      {!isInDashboard && <Navbar />}
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
           ← Back
      </button>
        <div className={styles.card}>
          {petition.image && (
            <img
              src={`http://localhost:4000/api/petitions/image/${petition.image}`}
              alt="Petition"
              className={styles.cardImage}
              onError={(e) => (e.target.style.display = "none")}
            />
          )}

          <div className={styles.cardBody}>
            <h2 className={styles.title}>{petition.title}</h2>
            <p className={styles.info}>
              <strong>Category:</strong> {petition.category}
            </p>
            <p className={styles.info}>
              <strong>Location:</strong> {petition.location}
            </p>
            <p className={styles.description}>{petition.description}</p>

            {/* Official response */}
            {petition.officialResponse && (
              <div className={styles.responseBox}>
                <h4>Official Response:</h4>
                <p>{petition.officialResponse}</p>
              </div>
            )}

            <p className={styles.signatureInfo}>
              <strong className={styles.signatures}>
                {petition.signatures?.length || 0}
              </strong>{" "}
              of {petition.signatureGoal} signatures{" "}
              <span
                className={styles.status}
                style={{
                  color:
                    petition.status === "active"
                      ? "green"
                      : petition.status === "closed"
                      ? "red"
                      : petition.status === "under-review"
                      ? "blue"
                      : "black",
                }}
              >
                {petition.status}
              </span>
            </p>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Only show official actions */}
            <div className={styles.buttonGroup}>
              {role === "official" && (
                <div className={styles.officialActions}>
                  {(petition.status === "active" ||
                    petition.status === "under-review" ||
                    petition.status === "pending") && (
                    <>
                      <button
                        className={styles.reviewButton}
                        onClick={() => openStatusPopup("under-review")}
                        disabled={
                          petition.status === "under-review" ||
                          petition.status === "pending"
                        }
                      >
                        {petition.status === "under-review"
                          ? "Under Review"
                          : "Set Under Review"}
                      </button>

                      <button
                        className={styles.closeButton}
                        onClick={() => openStatusPopup("closed")}
                        disabled={petition.status === "closed"}
                      >
                        Close
                      </button>
                    </>
                  )}

                  {(petition.status === "closed" || petition.status === "resolved") && (
                    <button
                      className={styles.successBtn}
                      onClick={() => openStatusPopup("active")}
                    >
                      Reopen
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
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
            />
            <div className={styles.popupActions}>
              <button className={styles.submitBtn} onClick={confirmStatusChange}>
                Submit
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowPopup(false)}
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
