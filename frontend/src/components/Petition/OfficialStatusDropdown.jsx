// import React, { useState } from "react";
// import styles from "./OfficialStatusDropdown.module.css";

// const OfficialStatusDropdown = ({ petition, handleStatusUpdate, officialName }) => {
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const [responseText, setResponseText] = useState("");

//   const handleSelect = (e) => {
//     const status = e.target.value;
//     if (!status) return;
//     setSelectedStatus(status);
//     setShowPopup(true);
//   };

//   const handleSubmit = async () => {
//     if (!responseText.trim()) {
//       alert("Please enter a response or reason");
//       return;
//     }

//     const statusLabel = `${selectedStatus} (by ${officialName || "Official"})`;

//     // Wait until popup closes to prevent re-render flicker
//     await handleStatusUpdate(petition._id, statusLabel, responseText);
//     setShowPopup(false);
//     setResponseText("");
//     setSelectedStatus("");
//   };

//   return (
//     <div className={styles.dropdownWrapper}>
//       <select
//         className={styles.dropdown}
//         value={selectedStatus}
//         onChange={handleSelect}
//       >
//         <option value="">Change Status</option>
//         <option value="under-review">Set Under Review</option>
//         <option value="closed">Close Petition</option>
//         <option value="active">Reopen Petition</option>
//       </select>

//       {showPopup && (
//         <div className={styles.popupOverlay}>
//           <div className={styles.popupBox}>
//             <h3>Provide Reason / Response</h3>
//             <textarea
//               className={styles.textarea}
//               placeholder="Enter reason or notes..."
//               value={responseText}
//               onChange={(e) => setResponseText(e.target.value)}
//             />
//             <div className={styles.popupActions}>
//               <button onClick={handleSubmit} className={styles.submitBtn}>
//                 Submit
//               </button>
//               <button
//                 onClick={() => {
//                   setShowPopup(false);
//                   setSelectedStatus("");
//                 }}
//                 className={styles.cancelBtn}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OfficialStatusDropdown;



import React, { useState, useEffect } from "react";
import styles from "./OfficialStatusDropdown.module.css";

const OfficialStatusDropdown = ({ petition, handleStatusUpdate, officialName }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const maxChars = 500;

  // Prevent body scroll when popup is open
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

    const statusLabel = `${selectedStatus} (by ${officialName || "Official"})`;

    try {
      // Wait until popup closes to prevent re-render flicker
      await handleStatusUpdate(petition._id, statusLabel, responseText);
      
      // Close popup and reset with a slight delay for better UX
      setTimeout(() => {
        setShowPopup(false);
        setResponseText("");
        setSelectedStatus("");
        setCharCount(0);
        setIsSubmitting(false);
      }, 300);
    } catch (error) {
      console.error("Error updating status:", error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setResponseText("");
    setSelectedStatus("");
    setCharCount(0);
  };

  // Close popup on Escape key
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

  return (
    <div className={styles.dropdownWrapper}>
      <select
        className={styles.dropdown}
        value={selectedStatus}
        onChange={handleSelect}
        disabled={isSubmitting}
      >
        <option value="">Change Status</option>
        <option value="under-review">🔍 Set Under Review</option>
        <option value="closed">🔒 Close Petition</option>
        <option value="active">✅ Reopen Petition</option>
      </select>

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