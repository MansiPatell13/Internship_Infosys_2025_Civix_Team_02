import React, { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../Landing/Footer";
import Navbar from "../Landing/Navbar";
import styles from "./PetitionPage.module.css";

const PetitionPage = ({ isInDashboard = false, onSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const showBackButton = location.state?.from === 'petition-head' || !isInDashboard;

  const [petition, setPetition] = useState({
    title: "",
    category: "",
    location: "",
    goal: 100,
    description: "",
    image: null, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetition({ ...petition, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPetition({ ...petition, image: file });
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a petition.");
        return;
      }

      if (!petition.title || !petition.description || !petition.location) {
        alert("Please fill in title, description, and location.");
        return;
      }

      const formData = new FormData();
      formData.append("title", petition.title);
      formData.append("description", petition.description);
      formData.append("category", petition.category);
      formData.append("location", petition.location);
      formData.append("signatureGoal", petition.goal);
      if (petition.image) {
        formData.append("image", petition.image);
      }

      const res = await fetch("http://localhost:4000/api/petitions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create petition");
      }

      const data = await res.json();
      console.log("✅ Petition created:", data);

      setPetition((prev) => ({ ...prev, image: data.image }));

      alert("Petition created successfully!");
      
      // Reset form
      setPetition({
        title: "",
        category: "",
        location: "",
        goal: 100,
        description: "",
        image: null,
      });

      // Handle navigation based on context
      if (isInDashboard && onSuccess) {
        onSuccess();
      } else {
        navigate("/petition-head");
      }
    } catch (error) {
      console.error("❌ Error creating petition:", error);
      alert("Error creating petition: " + error.message);
    }
  };

  const containerClass = isInDashboard ? styles.dashboardContainer : styles.rl;
  const cardClass = isInDashboard ? styles.dashboardCard : styles.card;

  return (
    <div className={containerClass}>
      {!isInDashboard && <Navbar />}
      <div className={isInDashboard ? '' : styles.container}>
        {showBackButton && !isInDashboard && (
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            ← Back
          </button>
        )}
        <div className={cardClass}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.headerTitle}>Petition Creation</h1>
            </div>
            <div>
              <h4 className={styles.headerLogo}>Civix</h4>
            </div>
          </div>

          <div className={styles.createPetition}>
            <FaPencilAlt /> Create a new petition
          </div>

          {/* Title */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Petition Title <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.formControl}
              placeholder="Give a title to your Petition"
              name="title"
              value={petition.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category + Location */}
          <div className={`${styles.formGroup} ${styles.formRow}`}>
            <div className={styles.col}>
              <label className={styles.formLabel}>Category</label>
              <select
                className={styles.formSelect}
                name="category"
                value={petition.category}
                onChange={handleChange}
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

            <div className={styles.col}>
              <label className={styles.formLabel}>
                Location <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.formControl}
                placeholder="Search location"
                name="location"
                value={petition.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Goal */}
          <div className={`${styles.formGroup} ${styles.formRow}`}>
            <div className={styles.col}>
              <label className={styles.formLabel}>Signature Goal</label>
              <input
                type="number"
                className={styles.formControl}
                placeholder="100"
                name="goal"
                value={petition.goal}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Description <span className={styles.required}>*</span>
            </label>
            <textarea
              className={styles.formControl}
              rows={4}
              placeholder="Describe the issue and change you would like to see..."
              name="description"
              value={petition.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Image Upload + Preview */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              className={styles.formControl}
              onChange={handleImageChange}
            />
            {petition.image && typeof petition.image !== "string" && (
              <div className={styles.imagePreview}>
                <p className={styles.formLabel}>Preview:</p>
                <img
                  src={URL.createObjectURL(petition.image)}
                  alt="Petition Preview"
                  className={styles.previewImage}
                />
              </div>
            )}
          </div>

          {/* Publish button */}
          <div className={styles.formActions}>
            <button className={styles.primaryButton} onClick={handlePublish}>
              Publish
            </button>
          </div>
        </div>
      </div>
      {!isInDashboard && <Footer />}
    </div>
  );
};

export default PetitionPage;