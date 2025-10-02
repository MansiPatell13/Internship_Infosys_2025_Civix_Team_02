import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { MdOutlinePoll } from 'react-icons/md';
import { useAuth } from '../Auth/AuthContext';
import { pollAPI } from '../../utils/api';
import styles from './PollCreation.module.css';

const PollCreation = ({ onSuccess, isInDashboard = false }) => {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  const [poll, setPoll] = useState({
    title: '',
    description: '',
    options: ['', ''],
    closesOn: today,
    target_location: '',  // ✅ changed from targetLocation
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setError('');
    setLoading(true);

    try {
      if (!poll.title.trim()) throw new Error('Poll title is required');
      if (!poll.description.trim()) throw new Error('Poll description is required');

      const validOptions = poll.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) throw new Error('At least 2 options are required');

      if (!poll.closesOn) throw new Error('Closing date is required');

      const closingDate = new Date(poll.closesOn);
      const now = new Date();
      if (closingDate <= now) throw new Error('Closing date must be in the future');

      // ✅ Ensure correct field names expected by backend
      const pollData = {
        title: poll.title.trim(),
        description: poll.description.trim(),
        options: validOptions.map(opt => ({ text: opt.trim() })),
        closesOn: poll.closesOn,
        target_location: poll.target_location.trim(), // ✅ fixed key here
      };

      await pollAPI.create(pollData);

      // Reset form
      setPoll({
        title: '',
        description: '',
        options: ['', ''],
        closesOn: today,
        target_location: '', // ✅ match reset field
      });

      if (onSuccess) {
        onSuccess();
      } else {
        alert('Poll created successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'citizen') {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <MdOutlinePoll className={styles.errorIcon} />
          <h2>Access Restricted</h2>
          <p className={styles.errorMessage}>
            Only citizens can create polls. You are registered as: <strong>{user?.role}</strong>
          </p>
          <p className={styles.errorHint}>
            Citizens can create and vote on polls, while officials can view and monitor all community polls.
          </p>
        </div>
      </div>
    );
  }

  const containerClass = isInDashboard ? styles.dashboardContainer : styles.container;
  const cardClass = isInDashboard ? styles.dashboardCard : styles.card;

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Create Poll</h1>
            <div className={styles.subtitle}>
              <MdOutlinePoll className={styles.icon} />
              <span>Engage your community</span>
            </div>
          </div>
          <div className={styles.logo}>
            <span className={styles.logoText}>Civix</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Poll Title *</label>
            <input
              type="text"
              name="title"
              className={styles.input}
              placeholder="What question would you like to ask the community?"
              value={poll.title}
              onChange={handleChange}
              required
              maxLength={200}
            />
            <p className={styles.hint}>
              Keep it clear and concise (max 200 characters) - {poll.title.length}/200
            </p>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description *</label>
            <textarea
              name="description"
              className={styles.textarea}
              placeholder="Provide context and details about your poll..."
              rows="4"
              value={poll.description}
              onChange={handleChange}
              required
              maxLength={1000}
            />
            <p className={styles.hint}>
              Help voters understand the context (max 1000 characters) - {poll.description.length}/1000
            </p>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Poll Options *</label>
            <div className={styles.optionsHeader}>
              <button
                type="button"
                className={styles.addButton}
                onClick={addOption}
                disabled={poll.options.length >= 10}
              >
                <FaPlus className={styles.addIcon} />
                Add Option
              </button>
              <p className={styles.hint}>
                Add 2-10 options. Currently: {poll.options.length}/10
              </p>
            </div>

            <div className={styles.optionsContainer}>
              {poll.options.map((option, index) => (
                <div key={index} className={styles.optionRow}>
                  <span className={styles.optionNumber}>{index + 1}</span>
                  <input
                    type="text"
                    className={styles.optionInput}
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    maxLength={100}
                  />
                  {poll.options.length > 2 && (
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeOption(index)}
                      title="Remove option"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Closes On *</label>
              <input
                type="date"
                name="closesOn"
                className={styles.dateInput}
                value={poll.closesOn}
                onChange={handleChange}
                min={today}
                required
              />
              <p className={styles.hint}>Poll will close at midnight on selected date</p>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Target Location</label>
              <input
                type="text"
                name="target_location" // ✅ input field name matches backend
                className={styles.searchInput}
                placeholder="e.g., New York, Mumbai, Delhi, etc."
                value={poll.target_location}
                onChange={handleChange}
                maxLength={100}
              />
              <p className={styles.hint}>Leave blank for general polls</p>
            </div>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <p>{error}</p>
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.createButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className={styles.buttonSpinner}></div>
                  Creating Poll...
                </>
              ) : (
                'Create Poll'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PollCreation;
