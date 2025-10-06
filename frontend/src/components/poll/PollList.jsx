import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaClock, FaUsers, FaSearch, FaArrowLeft, FaCheckCircle, FaPlus, FaTimes } from "react-icons/fa";
import { MdOutlinePoll } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const PollsPage = () => {
  const [view, setView] = useState("list");
  const [selectedPollId, setSelectedPollId] = useState(null);
  const navigate = useNavigate();

  const handleCreatePoll = () => setView("create");
  const handleBack = () => setView("list");
  const handlePollClick = (pollId) => {
    setSelectedPollId(pollId);
    // setView("detail");
    navigate("/poll-creation");
  };

  if (view === "create") {
    return <PollCreation onBack={handleBack} onSuccess={handleBack} />;
  }

  if (view === "detail") {
    return <PollDetail pollId={selectedPollId} onBack={handleBack} />;
  }

  return <PollList onPollClick={handlePollClick} onCreatePoll={handleCreatePoll} onBack={handleBack} />;
};

const PollList = ({ onPollClick, onCreatePoll, onBack }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [counts, setCounts] = useState({ all: 0, active: 0, closed: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const pollsPerPage = 9;

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/polls/list?page=1&limit=100", {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      if (!res.ok) throw new Error("Failed to fetch polls");
      const data = await res.json();
      const pollsData = data.polls || [];
      setPolls(pollsData);
      
      const now = new Date();
      const active = pollsData.filter(p => new Date(p.closesOn) > now).length;
      const closed = pollsData.filter(p => new Date(p.closesOn) <= now).length;
      setCounts({ all: pollsData.length, active, closed });
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const isPollClosed = (closesOn) => new Date(closesOn) <= new Date();

  const formatTimeLeft = (closesOn) => {
    const now = new Date();
    const closeDate = new Date(closesOn);
    const diff = closeDate - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return "Closed";
    if (days === 0) return "Closes today";
    return `${days} days left`;
  };

  const getVoteCount = (poll) => {
    return poll.options.reduce((total, opt) => total + (opt.votes || 0), 0);
  };

  const filteredPolls = polls.filter(poll => {
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "active" && !isPollClosed(poll.closesOn)) ||
      (statusFilter === "closed" && isPollClosed(poll.closesOn));
    
    const matchesSearch = !searchTerm || 
      poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (poll.targetLocation && poll.targetLocation.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPolls.length / pollsPerPage);
  const startIdx = (currentPage - 1) * pollsPerPage;
  const endIdx = startIdx + pollsPerPage;
  const currentPolls = filteredPolls.slice(startIdx, endIdx);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.backButtonContainer}>
        <button onClick={onBack} style={styles.backButton}>
          <FaArrowLeft /> Back
        </button>
      </div>

      <div style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>
            <MdOutlinePoll style={styles.titleIcon} />
            Community Polls
          </h1>
          <p style={styles.subtitle}>
            Participate in community decisions and see what others think
          </p>
        </div>
        {/* <button onClick={onCreatePoll} style={styles.createPollButton}>
          <FaPlus /> Create Poll
        </button> */}
      </div>

      <div style={styles.tabsAndSearchContainer}>
        <div style={styles.statusTabs}>
          <button
            style={{...styles.statusTab, ...(statusFilter === "all" ? styles.activeTab : {})}}
            onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
          >
            All <span style={styles.tabCount}>{counts.all}</span>
          </button>
          <button
            style={{...styles.statusTab, ...(statusFilter === "active" ? styles.activeTab : {})}}
            onClick={() => { setStatusFilter("active"); setCurrentPage(1); }}
          >
            Active <span style={styles.tabCount}>{counts.active}</span>
          </button>
          <button
            style={{...styles.statusTab, ...(statusFilter === "closed" ? styles.activeTab : {})}}
            onClick={() => { setStatusFilter("closed"); setCurrentPage(1); }}
          >
            Closed <span style={styles.tabCount}>{counts.closed}</span>
          </button>
        </div>

        <div style={styles.searchContainer}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search polls by location..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={styles.searchInput}
          />
          <button style={styles.searchButton}>Search</button>
        </div>
      </div>

      <div style={styles.resultsInfo}>
        <p>Showing {startIdx + 1}-{Math.min(endIdx, filteredPolls.length)} of {filteredPolls.length} polls</p>
      </div>

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading polls...</p>
        </div>
      ) : (
        <>
          <div style={styles.pollsGrid}>
            {currentPolls.map((poll) => {
              const isClosed = isPollClosed(poll.closesOn);
              const voteCount = getVoteCount(poll);
              
              return (
                <div
                  key={poll._id}
                  style={{...styles.pollCard, ...(isClosed ? styles.closedPoll : {})}}
                  onClick={() => onPollClick(poll._id)}
                >
                  <div style={styles.pollHeader}>
                    <h3 style={styles.pollTitle}>{poll.title}</h3>
                    <span style={{...styles.statusBadge, ...(isClosed ? styles.closedBadge : styles.activeBadge)}}>
                      {isClosed ? "CLOSED" : "ACTIVE"}
                    </span>
                  </div>

                  <p style={styles.pollDescription}>
                    {poll.description.length > 100
                      ? `${poll.description.substring(0, 100)}...`
                      : poll.description}
                  </p>

                  <div style={styles.optionsSection}>
                    <p style={styles.optionsLabel}>Options:</p>
                    <div style={styles.optionsList}>
                      {poll.options.slice(0, 3).map((option, idx) => (
                        <span key={idx} style={styles.optionTag}>
                          {option.text}
                        </span>
                      ))}
                      {poll.options.length > 3 && (
                        <span style={styles.moreOptions}>+{poll.options.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div style={styles.pollMeta}>
                    <div style={styles.metaItem}>
                      <FaUsers style={styles.metaIcon} />
                      <span>{voteCount} votes</span>
                    </div>
                    {poll.targetLocation && (
                      <div style={styles.metaItem}>
                        <FaMapMarkerAlt style={styles.metaIcon} />
                        <span>{poll.targetLocation}</span>
                      </div>
                    )}
                    <div style={styles.metaItem}>
                      <FaClock style={styles.metaIcon} />
                      <span style={isClosed ? styles.closedText : styles.activeText}>
                        {formatTimeLeft(poll.closesOn)}
                      </span>
                    </div>
                  </div>

                  <div style={styles.pollFooter}>
                    <span>By: {poll.createdBy?.name || "Anonymous"}</span>
                    <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{...styles.pageButton, ...(currentPage === 1 ? styles.disabledButton : {})}}
              >
                Previous
              </button>
              
              <div style={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    style={{...styles.pageButton, ...(page === currentPage ? styles.activePageButton : {})}}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{...styles.pageButton, ...(currentPage === totalPages ? styles.disabledButton : {})}}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const PollDetail = ({ pollId, onBack }) => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");

  const fetchPoll = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/polls/${pollId}`, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      if (!res.ok) throw new Error("Failed to fetch poll");
      const data = await res.json();
      
      const pollData = data.poll || data;
      
      if (!pollData.options || !Array.isArray(pollData.options)) {
        pollData.options = [];
      }
      
      if (data.hasVoted || data.userVoted || pollData.hasVoted) {
        setHasVoted(true);
      }
      
      setPoll(pollData);
    } catch (err) {
      console.error("Fetch poll error:", err);
      setError(err.message || "Failed to load poll");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPoll(); }, [pollId]);

  const handleVote = async () => {
    if (selectedOption === null) {
      setError("Please select an option before voting");
      return;
    }
    
    if (hasVoted) {
      setError("You have already voted on this poll");
      return;
    }
    
    try {
      setVoting(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ selectedOption }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || "Failed to vote";
        
        if (res.status === 400 && (
          errorMessage.toLowerCase().includes("already voted") ||
          errorMessage.toLowerCase().includes("already cast")
        )) {
          setHasVoted(true);
          setError("You have already voted on this poll");
        } else {
          throw new Error(errorMessage);
        }
        return;
      }
      
      await res.json();
      setHasVoted(true);
      setError("");
      fetchPoll();
    } catch (err) {
      console.error("Vote error:", err);
      setError(err.message || "Failed to submit vote");
    } finally {
      setVoting(false);
    }
  };

  const getTotalVotes = () => {
    if (!poll || !poll.options || !Array.isArray(poll.options)) return 0;
    return poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
  };

  const getPercentage = (votes) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  if (loading) return <div style={styles.container}><div style={styles.loading}><div style={styles.spinner}></div><p>Loading poll...</p></div></div>;
  if (error && !poll) return <div style={styles.container}><p style={styles.errorText}>{error}</p><button onClick={onBack} style={styles.backButton}><FaArrowLeft /> Back</button></div>;
  if (!poll) return <div style={styles.container}><p>No poll found</p><button onClick={onBack} style={styles.backButton}><FaArrowLeft /> Back</button></div>;

  const isClosed = poll.closesOn ? new Date(poll.closesOn) <= new Date() : false;
  const totalVotes = getTotalVotes();

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>
        <FaArrowLeft /> Back to Polls
      </button>

      <div style={styles.detailCard}>
        <div style={styles.detailHeader}>
          <div>
            <h1 style={styles.detailTitle}>{poll.title}</h1>
            <span style={{...styles.statusBadge, ...(isClosed ? styles.closedBadge : styles.activeBadge)}}>
              {isClosed ? "CLOSED" : "ACTIVE"}
            </span>
          </div>
          <div style={styles.detailMeta}>
            <div style={styles.metaItem}>
              <FaUsers style={styles.metaIcon} />
              <span>{totalVotes} votes</span>
            </div>
            {poll.targetLocation && (
              <div style={styles.metaItem}>
                <FaMapMarkerAlt style={styles.metaIcon} />
                <span>{poll.targetLocation}</span>
              </div>
            )}
          </div>
        </div>

        <p style={styles.detailDescription}>{poll.description}</p>

        <div style={styles.votingSection}>
          <h3 style={styles.sectionTitle}>
            {hasVoted ? "Your vote has been recorded" : isClosed ? "Poll Results" : "Cast your vote"}
          </h3>

          {hasVoted && (
            <div style={styles.voteConfirmation}>
              <FaCheckCircle style={styles.checkIcon} />
              <span>Thank you for voting!</span>
            </div>
          )}

          <div style={styles.optionsContainer}>
            {poll.options && poll.options.length > 0 ? (
              poll.options.map((option, idx) => {
                const percentage = getPercentage(option.votes || 0);
                const isSelected = selectedOption === idx;

                return (
                  <div
                    key={idx}
                    style={{
                      ...styles.voteOption,
                      ...(isSelected && !hasVoted && !isClosed ? styles.selectedOption : {}),
                      ...(hasVoted || isClosed ? {} : { cursor: 'pointer' })
                    }}
                    onClick={() => !hasVoted && !isClosed && setSelectedOption(idx)}
                  >
                    <div style={styles.optionHeader}>
                      {!hasVoted && !isClosed && (
                        <input
                          type="radio"
                          checked={isSelected}
                          onChange={() => setSelectedOption(idx)}
                          style={styles.radioInput}
                        />
                      )}
                      <span style={styles.optionText}>{option.text || `Option ${idx + 1}`}</span>
                      {(hasVoted || isClosed) && (
                        <div style={styles.voteStats}>
                          <span style={styles.voteCount}>{option.votes || 0} votes</span>
                          <span style={styles.percentage}>({percentage}%)</span>
                        </div>
                      )}
                    </div>
                    {(hasVoted || isClosed) && (
                      <div style={styles.progressBar}>
                        <div style={{...styles.progressFill, width: `${percentage}%`}}></div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p style={styles.hint}>No options available for this poll.</p>
            )}
          </div>

          {error && (
            <div style={styles.errorAlert}>
              <p>{error}</p>
            </div>
          )}

          {!hasVoted && !isClosed && (
            <button
              onClick={handleVote}
              disabled={voting || selectedOption === null}
              style={{
                ...styles.voteButton,
                ...(voting || selectedOption === null ? styles.disabledButton : {})
              }}
            >
              {voting ? "Submitting..." : "Submit Vote"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PollCreation = ({ onBack, onSuccess }) => {
  const today = new Date().toISOString().split("T")[0];
  const [poll, setPoll] = useState({
    title: "",
    description: "",
    options: ["", ""],
    closesOn: today,
    targetLocation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setPoll({ ...poll, [e.target.name]: e.target.value });
  };

  const updateOption = (i, value) => {
    const newOpts = [...poll.options];
    newOpts[i] = value;
    setPoll({ ...poll, options: newOpts });
  };

  const addOption = () => {
    if (poll.options.length < 10) {
      setPoll({ ...poll, options: [...poll.options, ""] });
    }
  };

  const removeOption = (i) => {
    if (poll.options.length > 2) {
      setPoll({ ...poll, options: poll.options.filter((_, idx) => idx !== i) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const validOptions = poll.options.filter((opt) => opt.trim() !== "");
      if (validOptions.length < 2) throw new Error("Need at least 2 options");

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...poll,
          options: validOptions.map((o) => ({ text: o })),
        }),
      });
      if (!res.ok) throw new Error("Failed to create poll");
      await res.json();

      setPoll({ title: "", description: "", options: ["", ""], closesOn: today, targetLocation: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>
        <FaArrowLeft /> Back to Polls
      </button>

      <div style={styles.createCard}>
        <div style={styles.createHeader}>
          <div>
            <h1 style={styles.createTitle}>Create New Poll</h1>
            <p style={styles.createSubtitle}>
              <MdOutlinePoll style={styles.iconInline} />
              Engage your community
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Poll Title *</label>
            <input
              type="text"
              name="title"
              value={poll.title}
              onChange={handleChange}
              placeholder="What question would you like to ask?"
              style={styles.input}
              required
              maxLength={200}
            />
            <p style={styles.hint}>{poll.title.length}/200 characters</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              name="description"
              value={poll.description}
              onChange={handleChange}
              placeholder="Provide context and details..."
              style={styles.textarea}
              rows={4}
              required
              maxLength={1000}
            />
            <p style={styles.hint}>{poll.description.length}/1000 characters</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Poll Options *</label>
            <div style={styles.optionsHeader}>
              <button type="button" onClick={addOption} style={styles.addOptionButton} disabled={poll.options.length >= 10}>
                <FaPlus /> Add Option
              </button>
              <p style={styles.hint}>{poll.options.length}/10 options</p>
            </div>

            {poll.options.map((opt, i) => (
              <div key={i} style={styles.optionRow}>
                <span style={styles.optionNumber}>{i + 1}</span>
                <input
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  style={styles.optionInput}
                  maxLength={100}
                />
                {poll.options.length > 2 && (
                  <button type="button" onClick={() => removeOption(i)} style={styles.removeButton}>
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Closes On *</label>
              <input
                type="date"
                name="closesOn"
                value={poll.closesOn}
                onChange={handleChange}
                min={today}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Target Location</label>
              <input
                type="text"
                name="targetLocation"
                value={poll.targetLocation}
                onChange={handleChange}
                placeholder="e.g., New York, Mumbai"
                style={styles.input}
                maxLength={100}
              />
            </div>
          </div>

          {error && <p style={styles.errorMessage}>{error}</p>}

          <button type="submit" disabled={loading} style={{...styles.submitButton, ...(loading ? styles.disabledButton : {})}}>
            {loading ? "Creating..." : "Create Poll"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f8fafc 100%)",
    padding: "2rem",
  },
  backButtonContainer: {
    marginBottom: "1rem",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#374151",
    fontSize: "1rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "white",
    borderRadius: "16px",
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    flexWrap: "wrap",
    gap: "1rem",
  },
  titleSection: {
    flex: 1,
    minWidth: "300px",
  },
  title: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 0.5rem 0",
  },
  titleIcon: {
    color: "#22c55e",
    fontSize: "2rem",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "1.1rem",
    margin: 0,
  },
  createPollButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem 2rem",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    boxShadow: "0 4px 6px rgba(34, 197, 94, 0.3)",
  },
  tabsAndSearchContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  statusTabs: {
    display: "flex",
    gap: "0.5rem",
  },
  statusTab: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    background: "#f8f9fa",
    border: "2px solid transparent",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#666",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  activeTab: {
    background: "#2e7d32",
    color: "white",
    borderColor: "#2e7d32",
  },
  tabCount: {
    background: "rgba(0,0,0,0.2)",
    borderRadius: "12px",
    padding: "0.25rem 0.5rem",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    maxWidth: "400px",
    flex: 1,
  },
  searchIcon: {
    position: "absolute",
    left: "1rem",
    color: "#94a3b8",
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    padding: "0.75rem 1rem 0.75rem 2.5rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px 0 0 8px",
    fontSize: "1rem",
    outline: "none",
  },
  searchButton: {
    padding: "0.75rem 1.5rem",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "0 8px 8px 0",
    cursor: "pointer",
    fontWeight: "600",
  },
  resultsInfo: {
    marginBottom: "1rem",
    padding: "0.75rem 1rem",
    background: "#f0f7f1",
    borderLeft: "4px solid #2e7d32",
    borderRadius: "4px",
    fontSize: "0.95rem",
    color: "#555",
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "3rem",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #22c55e",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  pollsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  pollCard: {
    background: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "2px solid #f1f5f9",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  closedPoll: {
    opacity: 0.75,
  },
  pollHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "1rem",
  },
  pollTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
    flex: 1,
  },
  statusBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "600",
    flexShrink: 0,
  },
  activeBadge: {
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #a7f3d0",
  },
  closedBadge: {
    background: "#f3f4f6",
    color: "#6b7280",
    border: "1px solid #d1d5db",
  },
  pollDescription: {
    color: "#64748b",
    lineHeight: "1.5",
    margin: 0,
  },
  optionsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  optionsLabel: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
    margin: 0,
  },
  optionsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  optionTag: {
    padding: "0.25rem 0.75rem",
    background: "#f1f5f9",
    color: "#475569",
    borderRadius: "16px",
    fontSize: "0.8rem",
    border: "1px solid #e2e8f0",
  },
  moreOptions: {
    padding: "0.25rem 0.75rem",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "16px",
    fontSize: "0.8rem",
    border: "1px solid #a7f3d0",
    fontWeight: "600",
  },
  pollMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    paddingTop: "1rem",
    borderTop: "1px solid #f1f5f9",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#64748b",
  },
  metaIcon: {
    fontSize: "14px",
    color: "#94a3b8",
  },
  activeText: {
    color: "#22c55e",
    fontWeight: "600",
  },
  closedText: {
    color: "#dc2626",
    fontWeight: "600",
  },
  pollFooter: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.875rem",
    color: "#94a3b8",
    paddingTop: "1rem",
    borderTop: "1px solid #f1f5f9",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "2rem",
  },
  pageNumbers: {
    display: "flex",
    gap: "0.25rem",
  },
  pageButton: {
    padding: "0.5rem 1rem",
    border: "1px solid #e2e8f0",
    background: "white",
    color: "#374151",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
  },
  activePageButton: {
    background: "#22c55e",
    color: "white",
    borderColor: "#22c55e",
  },
  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  detailCard: {
    background: "white",
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    border: "1px solid #f1f5f9",
    marginTop: "1rem",
  },
  detailHeader: {
    marginBottom: "1.5rem",
    paddingBottom: "1.5rem",
    borderBottom: "2px solid #f1f5f9",
  },
  detailTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 1rem 0",
  },
  detailMeta: {
    display: "flex",
    gap: "1.5rem",
    marginTop: "1rem",
  },
  detailDescription: {
    color: "#64748b",
    lineHeight: "1.6",
    fontSize: "1.05rem",
    marginBottom: "2rem",
  },
  votingSection: {
    marginTop: "2rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#374151",
    margin: "0 0 1.5rem 0",
  },
  voteConfirmation: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem",
    background: "#dcfce7",
    border: "2px solid #a7f3d0",
    borderRadius: "8px",
    color: "#166534",
    fontWeight: "600",
    marginBottom: "1.5rem",
  },
  checkIcon: {
    color: "#22c55e",
    fontSize: "18px",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "2rem",
  },
  voteOption: {
    border: "2px solid #f1f5f9",
    borderRadius: "12px",
    padding: "1.5rem",
    transition: "all 0.2s ease",
  },
  selectedOption: {
    borderColor: "#22c55e",
    background: "#f0fdf4",
  },
  optionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "0.5rem",
  },
  radioInput: {
    width: "18px",
    height: "18px",
    accentColor: "#22c55e",
  },
  optionText: {
    flex: 1,
    fontWeight: "600",
    color: "#374151",
    fontSize: "1.05rem",
  },
  voteStats: {
    display: "flex",
    gap: "1rem",
    fontSize: "0.875rem",
  },
  voteCount: {
    color: "#64748b",
    fontWeight: "600",
  },
  percentage: {
    color: "#22c55e",
    fontWeight: "600",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    background: "#f1f5f9",
    borderRadius: "4px",
    overflow: "hidden",
    marginTop: "0.75rem",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
    borderRadius: "4px",
    transition: "width 0.5s ease",
  },
  voteButton: {
    padding: "1rem 2rem",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1.05rem",
    boxShadow: "0 4px 6px rgba(34, 197, 94, 0.3)",
    transition: "all 0.2s ease",
  },
  errorAlert: {
    padding: "1rem",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#dc2626",
    marginBottom: "1rem",
  },
  errorText: {
    color: "#dc2626",
    padding: "1rem",
    fontSize: "1rem",
  },
  createCard: {
    background: "white",
    borderRadius: "16px",
    padding: "3rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    border: "1px solid #f1f5f9",
    marginTop: "1rem",
    maxWidth: "800px",
    margin: "1rem auto",
  },
  createHeader: {
    marginBottom: "2rem",
    paddingBottom: "1.5rem",
    borderBottom: "2px solid #e2e8f0",
  },
  createTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 0.5rem 0",
  },
  createSubtitle: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#166534",
    fontSize: "1rem",
    fontWeight: "600",
    padding: "0.75rem 1.25rem",
    background: "#dcfce7",
    borderRadius: "50px",
    border: "2px solid #a7f3d0",
    width: "fit-content",
  },
  iconInline: {
    fontSize: "18px",
    color: "#22c55e",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  input: {
    padding: "0.75rem 1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.2s ease",
  },
  textarea: {
    padding: "0.75rem 1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
    resize: "vertical",
    minHeight: "100px",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
  },
  hint: {
    fontSize: "0.875rem",
    color: "#64748b",
    margin: 0,
    fontStyle: "italic",
  },
  optionsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  addOptionButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "white",
    border: "2px dashed #a7f3d0",
    borderRadius: "8px",
    color: "#166534",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  optionRow: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  optionNumber: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2rem",
    height: "2rem",
    background: "#dcfce7",
    border: "2px solid #a7f3d0",
    borderRadius: "50%",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#166534",
    flexShrink: 0,
  },
  optionInput: {
    flex: 1,
    padding: "0.75rem 1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
  },
  removeButton: {
    width: "2rem",
    height: "2rem",
    border: "none",
    background: "#ef4444",
    color: "white",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s ease",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
  },
  errorMessage: {
    padding: "1rem",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#dc2626",
  },
  submitButton: {
    padding: "1rem 2.5rem",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    boxShadow: "0 4px 6px rgba(34, 197, 94, 0.3)",
    transition: "all 0.2s ease",
    alignSelf: "center",
  },
};

export default PollsPage;