import React, { useState } from 'react';
// import { Clock, Plus, Calendar, Search } from 'lucide-react';
import styles from './PollCreation.module.css';
import Navbar from '../Landing/Navbar';
import Footer from '../Landing/Footer';

const PollCreation = () => {
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState([]);
  const [closingDate, setClosingDate] = useState('10-05-2025');
  const [location, setLocation] = useState('');

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  return (
    <>
    <Navbar/>
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Poll Creation</h1>
            <div className={styles.subtitle}>
              {/* <Clock className={styles.icon} /> */}
              <span>Create a new poll</span>
            </div>
          </div>
          <div className={styles.logo}>
            <span className={styles.logoText}>Civix</span>
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Poll Question</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your question for the community"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <p className={styles.hint}>Be clear and specific with your question</p>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              placeholder="Provide more context about the poll..."
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Poll Options</label>
            <button
              type="button"
              className={styles.addButton}
              onClick={addOption}
            >
              {/* <Plus className={styles.addIcon} /> */}
              Add Option
            </button>
            <p className={styles.hint}>Add at least 2 options, up to a maximum of 10</p>
            
            {options.map((option, index) => (
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
                  type="text"
                  className={styles.dateInput}
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                />
                {/* <Calendar className={styles.dateIcon} /> */}
              </div>
              <p className={styles.hint}>Set poll closing date (up to 30 days)</p>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Target Location</label>
              <div className={styles.searchInputWrapper}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="search location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                {/* <Search className={styles.searchIcon} /> */}
              </div>
              <p className={styles.hint}>The area this poll is relevant to.</p>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.createButton}>
              Create Poll
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default PollCreation;