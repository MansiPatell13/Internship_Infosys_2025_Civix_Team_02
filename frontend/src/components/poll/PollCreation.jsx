import React, { useState, useEffect } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { MdOutlinePoll } from "react-icons/md";
import styles from "./PollCreation.module.css";

const PollCreation = ({ onSuccess, isInDashboard = false }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  const [poll, setPoll] = useState({
    title: "",
    description: "",
    options: ["", ""],
    targetLocation: "",
    closesOn: today,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch current user from backend
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoadingUser(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setCurrentUser(null);
          setLoadingUser(false);
          return;
        }

        const response = await fetch("http://localhost:4000/api/dashboard", {
          method: "GET",
          headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch user data");
          setCurrentUser(null);
          setLoadingUser(false);
          return;
        }

        const data = await response.json();
        console.log("Fetched user data from backend:", data);
        
        if (data.user) {
          setCurrentUser({
            id: data.user._id || data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role || data.user.userType,
            location: data.user.location
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setCurrentUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const addOption = () => {
    if (poll.options.length < 10) {
      setPoll({ ...poll, options: [...poll.options, ""] });
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...poll.options];
    newOptions[index] = value;
    setPoll({ ...poll, options: newOptions });
  };

  const removeOption = (index) => {
    if (poll.options.length > 2) {
      const newOptions = poll.options.filter((_, i) => i !== index);
      setPoll({ ...poll, options: newOptions });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPoll({ ...poll, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!poll.title.trim()) throw new Error("Poll title is required");

      const validOptions = poll.options.filter((opt) => opt.trim() !== "");
      if (validOptions.length < 2) {
        throw new Error("At least 2 options are required");
      }

      if (!poll.targetLocation.trim()) {
        throw new Error("Target location is required");
      }

      if (!poll.closesOn) {
        throw new Error("Closing date is required");
      }

      const closingDate = new Date(poll.closesOn);
      if (closingDate <= new Date()) {
        throw new Error("Closing date must be in the future");
      }

      const pollData = {
        title: poll.title.trim(),
        options: validOptions.map((opt) => ({ text: opt.trim() })),
        target_location: poll.targetLocation.trim(),
        closesOn: poll.closesOn,
      };

      if (poll.description.trim()) {
        pollData.description = poll.description.trim();
      }

      const token = localStorage.getItem("token");

      console.log("Submitting pollData:", JSON.stringify(pollData, null, 2));

      const res = await fetch("http://localhost:4000/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(pollData),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error response:", text);
        throw new Error(text || "Failed to create poll");
      }

      setPoll({
        title: "",
        description: "",
        options: ["", ""],
        targetLocation: "",
        closesOn: today,
      });

      if (onSuccess) onSuccess();
      else alert("Poll created successfully!");
    } catch (err) {
      setError(err.message || "Failed to create poll");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loadingUser) {
    return (
      <div className={isInDashboard ? styles.dashboardContainer : styles.container}>
        <div className={isInDashboard ? styles.dashboardCard : styles.card}>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <MdOutlinePoll style={{ fontSize: '3rem', color: '#22c55e', marginBottom: '1rem' }} />
            <h2>Loading...</h2>
            <p>Verifying your access permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    return (
      <div className={isInDashboard ? styles.dashboardContainer : styles.container}>
        <div className={isInDashboard ? styles.dashboardCard : styles.card}>
          <div className={styles.errorContainer}>
            <MdOutlinePoll style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '1rem' }} />
            <h2>Not Authenticated</h2>
            <p>Please log in to create polls.</p>
          </div>
        </div>
      </div>
    );
  }

  // Access restricted for non-citizens/guests
  if (currentUser.role !== "citizen" && currentUser.role !== "guest") {
    return (
      <div className={isInDashboard ? styles.dashboardContainer : styles.container}>
        <div className={isInDashboard ? styles.dashboardCard : styles.card}>
          <div className={styles.errorContainer}>
            <MdOutlinePoll style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '1rem' }} />
            <h2>Access Restricted</h2>
            <p>
              Only citizens can create polls. You are registered as:{" "}
              <strong>{currentUser.role}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={isInDashboard ? styles.dashboardContainer : styles.container}>
      <div className={isInDashboard ? styles.dashboardCard : styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Poll</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Poll Title *</label>
            <input
              type="text"
              name="title"
              className={styles.input}
              value={poll.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description (optional)</label>
            <textarea
              name="description"
              className={styles.textarea}
              value={poll.description}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Options *</label>
            {poll.options.map((opt, idx) => (
              <div key={idx} className={styles.optionRow}>
                <input
                  type="text"
                  className={styles.input}
                  value={opt}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  required
                />
                {poll.options.length > 2 && (
                  <button 
                    type="button" 
                    onClick={() => removeOption(idx)}
                    className={styles.removeButton}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
            {poll.options.length < 10 && (
              <button 
                type="button" 
                onClick={addOption}
                className={styles.addButton}
              >
                <FaPlus className={styles.addIcon} /> Add Option
              </button>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Target Location *</label>
            <input
              type="text"
              name="targetLocation"
              className={styles.input}
              value={poll.targetLocation}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Closing Date *</label>
            <input
              type="date"
              name="closesOn"
              className={styles.input} // Using input class as dateInput isn't defined
              value={poll.closesOn}
              onChange={handleChange}
              min={today}
              required
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.actions}>
            <button 
              type="submit" 
              disabled={loading}
              className={styles.createButton}
            >
              {loading ? "Creating..." : "Create Poll"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PollCreation;