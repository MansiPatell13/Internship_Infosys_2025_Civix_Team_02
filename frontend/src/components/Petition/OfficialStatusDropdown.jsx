import React, { useState, useEffect } from "react";
import styles from "./OfficialStatusDropdown.module.css";

const OfficialStatusDropdown = ({ petition, handleStatusUpdate, officialName }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const maxChars = 500;

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPopup]);

  const handleSelect = (e) => {
    const status = e.target.value;
    if (!status) return;
    
    // Check location before opening popup
    const userStr = localStorage.getItem("user");
    const currentUser = userStr ? JSON.parse(userStr) : null;
    
    if (currentUser && currentUser.location && petition.location && 
        currentUser.location !== petition.location) {
      alert(`You can only manage petitions in your assigned location (${currentUser.location}). This petition is in ${petition.location}.`);
      return;
    }
    
    setSelectedStatus(status);
    setShowPopup(true);
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setResponseText(text);
      setCharCount(text.length);
    }
  };

  const handleSubmit = async () => {
    if (!responseText.trim()) {
      alert("Please enter a response or reason");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to update petition status.");
        setIsSubmitting(false);
        return;
      }

      // Verify location one more time
      const userStr = localStorage.getItem("user");
      const currentUser = userStr ? JSON.parse(userStr) : null;

      if (currentUser && currentUser.location && petition.location && 
          currentUser.location !== petition.location) {
        alert(`You can only manage petitions in your assigned location (${currentUser.location}). This petition is in ${petition.location}.`);
        setIsSubmitting(false);
        return;
      }

      let apiUrl;
      let requestBody;
      let method;

      // Use the correct official API based on action
      if (selectedStatus === "closed") {
        apiUrl = `http://localhost:4000/api/official/petitions/${petition._id}/close`;
        requestBody = { reason: responseText };
        method = "POST";
      } else {
        apiUrl = `http://localhost:4000/api/official/petitions/${petition._id}/status`;
        // Map frontend status to backend expected values
        let backendStatus = selectedStatus;
        if (selectedStatus === "under-review") {
          backendStatus = "under_review";
        }
        
        requestBody = {
          status: backendStatus,
          comment: responseText
        };
        method = "PUT";
      }

      const res = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update petition status");
      }

      // Call the parent handler to refresh the petition data
      if (handleStatusUpdate) {
        await handleStatusUpdate(petition._id);
      }

      setTimeout(() => {
        setShowPopup(false);
        setResponseText("");
        setSelectedStatus("");
        setCharCount(0);
        setIsSubmitting(false);
      }, 300);

    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.message || "Error updating petition status");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setResponseText("");
    setSelectedStatus("");
    setCharCount(0);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showPopup && !isSubmitting) {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showPopup, isSubmitting]);

  const getStatusLabel = () => {
    switch (selectedStatus) {
      case "under-review":
        return "Set Under Review";
      case "closed":
        return "Close Petition";
      case "active":
        return "Reopen Petition";
      default:
        return "Update Status";
    }
  };

  const getStatusIcon = () => {
    switch (selectedStatus) {
      case "under-review":
        return "🔍";
      case "closed":
        return "🔒";
      case "active":
        return "✅";
      default:
        return "📝";
    }
  };

  // Check if official can manage this petition
  const canManagePetition = () => {
    const userStr = localStorage.getItem("user");
    const currentUser = userStr ? JSON.parse(userStr) : null;
    
    if (!currentUser || !currentUser.location || !petition.location) {
      return false;
    }
    
    return currentUser.location === petition.location;
  };

  // Normalize status for display
  const normalizeStatus = (status) => {
    if (!status) return "active";
    return status.toLowerCase().replace(/_/g, '-');
  };

  const petitionStatus = normalizeStatus(petition.status);

  return (
    <div className={styles.dropdownWrapper}>
      {!canManagePetition() ? (
        <span className={styles.locationWarning} title={`This petition is in ${petition.location}`}>
          ⚠️ Different Location
        </span>
      ) : (
        <select
          className={styles.dropdown}
          value={selectedStatus}
          onChange={handleSelect}
          disabled={isSubmitting}
        >
          <option value="">Change Status</option>
          <option value="under-review" disabled={petitionStatus === "under-review"}>
            🔍 Set Under Review
          </option>
          <option value="closed" disabled={petitionStatus === "closed"}>
            🔒 Close Petition
          </option>
          <option value="active" disabled={petitionStatus === "active"}>
            ✅ Reopen Petition
          </option>
        </select>
      )}

      {showPopup && (
        <div className={styles.popupOverlay} onClick={handleCancel}>
          <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
            <h3>
              {getStatusIcon()} {getStatusLabel()}
            </h3>
            
            <textarea
              className={styles.textarea}
              placeholder="Enter your official response or reason for this status change..."
              value={responseText}
              onChange={handleTextChange}
              disabled={isSubmitting}
              autoFocus
              rows={6}
            />
            
            <div className={styles.characterCounter}>
              {charCount} / {maxChars} characters
            </div>

            <div className={styles.popupActions}>
              <button 
                onClick={handleSubmit} 
                className={styles.submitBtn}
                disabled={isSubmitting || !responseText.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
              <button
                onClick={handleCancel}
                className={styles.cancelBtn}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficialStatusDropdown;