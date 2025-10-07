import React, { useState } from "react";
import styles from "./OfficialStatusDropdown.module.css";

const OfficialStatusDropdown = ({ petition, handleStatusUpdate, officialName }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [responseText, setResponseText] = useState("");

  const handleSelect = (e) => {
    const status = e.target.value;
    if (!status) return;
    setSelectedStatus(status);
    setShowPopup(true);
  };

  const handleSubmit = async () => {
    if (!responseText.trim()) {
      alert("Please enter a response or reason");
      return;
    }

    const statusLabel = `${selectedStatus} (by ${officialName || "Official"})`;

    // Wait until popup closes to prevent re-render flicker
    await handleStatusUpdate(petition._id, statusLabel, responseText);
    setShowPopup(false);
    setResponseText("");
    setSelectedStatus("");
  };

  return (
    <div className={styles.dropdownWrapper}>
      <select
        className={styles.dropdown}
        value={selectedStatus}
        onChange={handleSelect}
      >
        <option value="">Change Status</option>
        <option value="under-review">Set Under Review</option>
        <option value="closed">Close Petition</option>
        <option value="active">Reopen Petition</option>
      </select>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupBox}>
            <h3>Provide Reason / Response</h3>
            <textarea
              className={styles.textarea}
              placeholder="Enter reason or notes..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            />
            <div className={styles.popupActions}>
              <button onClick={handleSubmit} className={styles.submitBtn}>
                Submit
              </button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  setSelectedStatus("");
                }}
                className={styles.cancelBtn}
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