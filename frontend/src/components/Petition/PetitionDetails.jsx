
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Landing/Navbar";
import Footer from "../Landing/Footer";
import styles from "./PetitionDetails.module.css";

const PetitionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [petition, setPetition] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch petition + user info
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
        console.error("Error parsing user from localStorage:", parseError);
      }
    }

    fetchPetition();
  }, [id]);

  if (!petition) return <p className="text-center mt-5">Loading petition...</p>;

  const progressPercentage = Math.min(
    ((petition.signatures?.length || 0) / (petition.signatureGoal || 1)) * 100,
    100
  );

  // Sign petition
  const handleSign = async () => {
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
        body: JSON.stringify({ userId: user._id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to sign petition");
      }

      const data = await res.json();
      setPetition((prev) => ({
        ...prev,
        signatures: [...prev.signatures, user._id],
      }));
    } catch (err) {
      console.error(err);
      alert("Error signing petition: " + err.message);
    }
  };

  // Update petition status
  const updateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in as official to update petition status.");
        return;
      }

      const res = await fetch(`http://localhost:4000/api/petitions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update petition status");
      const updated = await res.json();
      setPetition(updated);
    } catch (err) {
      console.error(err);
      alert("Error updating petition status: " + err.message);
    }
  };

  return (
    <div className={styles.lu}>
      <Navbar />
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
              onError={(e) => {
                e.target.style.display = "none";
              }}
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

            <div className={styles.buttonGroup}>
              {/* Citizen + User actions */}
             {/* Citizen + User actions */}
{(role === "user" || role === "citizen") && (
  petition.signatures?.includes(user._id) ? (
    <button
      className={styles.signButton}
      disabled
      style={{ opacity: 0.5, cursor: "not-allowed" }}
    >
      Already Signed
    </button>
  ) : (
    <button
      className={styles.signButton}
      onClick={handleSign}
      disabled={petition.status === "closed"}
    >
      Sign Petition
    </button>
  )
)}


              {/* Official actions */}
              {role === "official" && (
                <div className={styles.officialActions}>
                  {(petition.status === "active" ||
                    petition.status === "under-review" ||
                    petition.status === "pending") && (
                    <>
                      {/* Set Under Review */}
                      <button
                        className={styles.reviewButton}
                        onClick={() => updateStatus("under-review")}
                        disabled={
                          petition.status === "under-review" ||
                          petition.status === "pending"
                        }
                        style={{
                          opacity:
                            petition.status === "under-review" ||
                            petition.status === "pending"
                              ? 0.6
                              : 1,
                          cursor:
                            petition.status === "under-review" ||
                            petition.status === "pending"
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        {petition.status === "under-review" ||
                        petition.status === "pending"
                          ? "Under Review"
                          : "Set Under Review"}
                      </button>

                      {/* Close */}
                      <button
                        className={styles.closeButton}
                        onClick={() => updateStatus("closed")}
                        disabled={
                          petition.status === "closed" ||
                          petition.status === "resolved"
                        }
                        style={{
                          opacity:
                            petition.status === "closed" ||
                            petition.status === "resolved"
                              ? 0.6
                              : 1,
                          cursor:
                            petition.status === "closed" ||
                            petition.status === "resolved"
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        Close
                      </button>
                    </>
                  )}

                  {(petition.status === "closed" ||
                    petition.status === "resolved") && (
                    <>
                      {/* Reopen */}
                      <button
                        className={styles.successBtn}
                        onClick={() => updateStatus("active")}
                      >
                        Reopen
                      </button>

                      {/* Close disabled */}
                      <button
                        className={styles.closeButton}
                        disabled
                        style={{ opacity: 0.6, cursor: "not-allowed" }}
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>
              )}

              {!role && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  No role detected. Please log in.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PetitionDetails;
