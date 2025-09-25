import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MdOutlinePoll } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import styles from './PollCreation.module.css';
import Navbar from '../Landing/Navbar';
import Footer from '../Landing/Footer';

const BASE_URL =
  import.meta.env?.VITE_BASE_URL || process.env.REACT_APP_BASE_URL || "http://localhost:4000";

const PollCreation = ({ isInDashboard = false, onSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton = location.state?.from === 'petition-head' || !isInDashboard;
  const today = new Date().toISOString().split("T")[0];

  const [poll, setPoll] = useState({
    title: '',
    description: '',
    options: [],
    closesOn: today,
    targetLocation: '',
  });

  const addOption = () => {
    if (poll.options.length < 10) {
      setPoll({ ...poll, options: [...poll.options, ''] });
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...poll.options];
    newOptions[index] = value;
    setPoll({ ...poll, options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = poll.options.filter((_, i) => i !== index);
    setPoll({ ...poll, options: newOptions });
  };

  const handlePollChange = (e) => {
    const { name, value } = e.target;
    setPoll({ ...poll, [name]: value });
  };

  const handlePollCreate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a poll.");
        return;
      }

      // Map options array to objects: { text }
      const validOptions = poll.options.filter(opt => opt.trim() !== "").map(opt => ({ text: opt }));

      if (!poll.title || validOptions.length < 2 || !poll.description.trim()) {
        alert("Please provide a title, description, and at least 2 valid options.");
        return;
      }

      const pollData = {
        title: poll.title,
        description: poll.description,
        options: validOptions,
        closesOn: poll.closesOn,
        targetLocation: poll.targetLocation,
      };

      const res = await fetch(`${BASE_URL}/api/polls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pollData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create poll");
      }

      const data = await res.json();
      alert("Poll created successfully!");

      setPoll({
        title: '',
        description: '',
        options: [],
        closesOn: today,
        targetLocation: '',
      });

      if (isInDashboard && onSuccess) {
        onSuccess();
      } else {
        navigate('/polls');
      }
    } catch (error) {
      alert("Error creating poll: " + error.message);
    }
  };

  const containerClass = isInDashboard ? styles.dashboardContainer : styles.container;
  const cardClass = isInDashboard ? styles.dashboardCard : styles.card;

  return (
    <div className={containerClass}>
      {!isInDashboard && <Navbar />}
      {showBackButton && !isInDashboard && (
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Back
        </button>
      )}

      <div className={cardClass}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Poll Creation</h1>
            <div className={styles.subtitle}>
              <MdOutlinePoll className={styles.icon} />
              <span>Create a new poll</span>
            </div>
          </div>
          <div className={styles.logo}>
            <span className={styles.logoText}>Civix</span>
          </div>
        </div>

        <form onSubmit={handlePollCreate} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Poll Title</label>
            <input
              type="text"
              name="title"
              className={styles.input}
              placeholder="Enter your question for the community"
              value={poll.title}
              onChange={handlePollChange}
              required
            />
            <p className={styles.hint}>Be clear and specific with your question</p>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              name="description"
              className={styles.textarea}
              placeholder="Provide more context about the poll..."
              rows="4"
              value={poll.description}
              onChange={handlePollChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Poll Options</label>
            <button type="button" className={styles.addButton} onClick={addOption}>
              <FaPlus className={styles.addIcon} />
              Add Option
            </button>
            <p className={styles.hint}>Add at least 2 options, up to a maximum of 10</p>

            {poll.options.map((option, index) => (
              <div key={index} className={styles.optionRow}>
                <input
                  type="text"
                  className={styles.optionInput}
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeOption(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Closes On</label>
              <div className={styles.dateInputWrapper}>
                <input
                  type="date"
                  name="closesOn"
                  className={styles.dateInput}
                  value={poll.closesOn}
                  onChange={handlePollChange}
                  min={today}
                />
              </div>
              <p className={styles.hint}>Set poll closing date (up to 30 days)</p>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Target Location</label>
              <div className={styles.searchInputWrapper}>
                <input
                  type="text"
                  name="targetLocation"
                  className={styles.searchInput}
                  placeholder="Search location"
                  value={poll.targetLocation}
                  onChange={handlePollChange}
                />
              </div>
              <p className={styles.hint}>The area this poll is relevant to.</p>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.createButton}>
              Create Poll
            </button>
          </div>
        </form>
      </div>

      {!isInDashboard && <Footer />}
    </div>
  );
};

export default PollCreation;
