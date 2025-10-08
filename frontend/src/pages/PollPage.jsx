import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaClock, FaUsers, FaSearch, FaArrowLeft, FaCheckCircle, FaPlus } from "react-icons/fa"; // FaPlus imported
import { MdOutlinePoll } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styles from './PollPage.module.css';

const PollsPage = () => {
  // view state is kept for list/detail transition within this component
  const [view, setView] = useState("list");
  const [selectedPollId, setSelectedPollId] = useState(null);
  const navigate = useNavigate();

  // NEW: handleCreatePoll function to navigate to poll creation route
  const handleCreatePoll = () => {
    navigate('/poll-creation');
  };
  
  const handleBack = () => navigate(-1);
  
  const handlePollClick = (pollId) => {
    setSelectedPollId(pollId);
    setView("detail");
  };

  if (view === "detail") {
    return <PollDetail pollId={selectedPollId} onBack={handleBack} />;
  }

  // NEW: onCreatePoll prop is passed to PollList
  return <PollList onPollClick={handlePollClick} onBack={handleBack} onCreatePoll={handleCreatePoll} />;
};

// NEW: onCreatePoll prop added to PollList definition
const PollList = ({ onPollClick, onBack, onCreatePoll }) => {
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
    <div className={styles.container}>
{/*       <div className={styles.createPollHeader}>
        <button onClick={onBack} className={styles.backToPollsBtn}>
          <FaArrowLeft /> Back
        </button>
      </div> */}

{/*       <div className={styles.pollsHeader}> 
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              <MdOutlinePoll className={styles.titleIcon} />
              Community Polls
            </h1>
            <p className={styles.subtitle}>
              Participate in community decisions and see what others think
            </p>
          </div>
          
        </div>
      </div> */}

      <div className={`${styles.content} ${styles.listContainer}`}>
        <div className={styles.tabsAndSearchContainer}>
          <div className={styles.statusTabs}>
            <button
              className={`${styles.statusTab} ${statusFilter === "all" ? styles.activeTab : ''}`}
              onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
            >
              All 
{/* <span className={styles.tabCount}>{counts.all}</span> */}
            </button>
            <button
              className={`${styles.statusTab} ${statusFilter === "active" ? styles.activeTab : ''}`}
              onClick={() => { setStatusFilter("active"); setCurrentPage(1); }}
            >
              Active 
{/* <span className={styles.tabCount}>{counts.active}</span> */}
            </button>
            <button
              className={`${styles.statusTab} ${statusFilter === "closed" ? styles.activeTab : ''}`}
              onClick={() => { setStatusFilter("closed"); setCurrentPage(1); }}
            >
              Closed 
{/* <span className={styles.tabCount}>{counts.closed}</span> */}
            </button>
            </div>

          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search polls by location..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>Search</button>
          </div>
        </div>

{/*         <div className={styles.resultsInfo}>
          <p>Showing {startIdx + 1}-{Math.min(endIdx, filteredPolls.length)} of {filteredPolls.length} polls</p>
        </div> */}

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading polls...</p>
          </div>
        ) : (
          <>
            <div className={styles.pollsGrid}>
              {currentPolls.map((poll) => {
                const isClosed = isPollClosed(poll.closesOn);
                const voteCount = getVoteCount(poll);
                
                return (
                  <div
                    key={poll._id}
                    className={`${styles.pollCard} ${isClosed ? styles.closedPoll : ''}`}
                    onClick={() => onPollClick(poll._id)}
                  >
                    <div className={styles.pollHeader}>
                      <h3 className={styles.pollTitle}>{poll.title}</h3>
                      <span className={`${styles.statusBadge} ${isClosed ? styles.closedBadge : styles.activeBadge}`}>
                        {isClosed ? "CLOSED" : "ACTIVE"}
                      </span>
                    </div>

                    <p className={styles.pollDescription}>
                      {poll.description.length > 100
                        ? `${poll.description.substring(0, 100)}...`
                        : poll.description}
                    </p>

                    <div className={styles.optionsSection}>
                      <p className={styles.optionsLabel}>Options:</p>
                      <div className={styles.optionsList}>
                        {poll.options.slice(0, 3).map((option, idx) => (
                          <span key={idx} className={styles.optionTag}>
                            {option.text}
                          </span>
                        ))}
                        {poll.options.length > 3 && (
                          <span className={styles.moreOptions}>+{poll.options.length - 3} more</span>
                        )}
                      </div>
                  </div>

                  <div className={styles.pollMeta}>
                      <div className={styles.metaItem}>
                        <FaUsers className={styles.metaIcon} />
                        <span>{voteCount} votes</span>
                      </div>
                      {poll.targetLocation && (
                        <div className={styles.metaItem}>
                          <FaMapMarkerAlt className={styles.metaIcon} />
                          <span>{poll.targetLocation}</span>
                        </div>
                      )}
                      <div className={styles.metaItem}>
                        <FaClock className={styles.metaIcon} />
                        <span className={isClosed ? styles.closedText : styles.activeText}>
                          {formatTimeLeft(poll.closesOn)}
                        </span>
                      </div>
                    </div>

                    <div className={styles.pollFooter}>
                      <span>By: {poll.createdBy?.name || "Anonymous"}</span>
                      <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`${styles.pageButton} ${currentPage === 1 ? styles.disabledButton : ''}`}
                >
                  Previous
                </button>
                
                <div className={styles.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`${styles.pageButton} ${page === currentPage ? styles.activePageButton : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabledButton : ''}`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
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

  if (loading) return <div className={styles.container}><div className={styles.loading}><div className={styles.spinner}></div><p>Loading poll...</p></div></div>;
  if (error && !poll) return <div className={styles.container}><p className={styles.errorText}>{error}</p><button onClick={onBack} className={styles.backToPollsBtn}><FaArrowLeft /> Back</button></div>;
  if (!poll) return <div className={styles.container}><p className={styles.hint}>No poll found</p><button onClick={onBack} className={styles.backToPollsBtn}><FaArrowLeft /> Back</button></div>;

  const isClosed = poll.closesOn ? new Date(poll.closesOn) <= new Date() : false;
  const totalVotes = getTotalVotes();

  return (
    <div className={styles.container}>
      <div className={styles.createPollHeader}>
        <button onClick={onBack} className={styles.backToPollsBtn}>
          <FaArrowLeft /> Back to Polls
        </button>
      </div>

      <div className={`${styles.content} ${styles.detailCard}`}>
        <div className={styles.detailHeader}>
          <div>
            <h1 className={styles.detailTitle}>{poll.title}</h1>
            <span className={`${styles.statusBadge} ${isClosed ? styles.closedBadge : styles.activeBadge}`}>
              {isClosed ? "CLOSED" : "ACTIVE"}
            </span>
          </div>
          <div className={styles.detailMeta}>
            <div className={styles.metaItem}>
              <FaUsers className={styles.metaIcon} />
              <span>{totalVotes} votes</span>
            </div>
            {poll.targetLocation && (
              <div className={styles.metaItem}>
                <FaMapMarkerAlt className={styles.metaIcon} />
                <span>{poll.targetLocation}</span>
              </div>
            )}
          </div>
        </div>

        <p className={styles.detailDescription}>{poll.description}</p>

        <div className={styles.votingSection}>
          <h3 className={styles.sectionTitle}>
            {hasVoted ? "Your vote has been recorded" : isClosed ? "Poll Results" : "Cast your vote"}
          </h3>

          {hasVoted && (
            <div className={styles.voteConfirmation}>
              <FaCheckCircle className={styles.checkIcon} />
              <span>Thank you for voting!</span>
            </div>
          )}

          <div className={styles.optionsContainer}>
            {poll.options && poll.options.length > 0 ? (
              poll.options.map((option, idx) => {
                const percentage = getPercentage(option.votes || 0);
                const isSelected = selectedOption === idx;

                return (
                  <div
                    key={idx}
                    className={`${styles.voteOption} ${isSelected && !hasVoted && !isClosed ? styles.selectedOption : ''}`}
                    onClick={() => !hasVoted && !isClosed && setSelectedOption(idx)}
                    style={{ cursor: (hasVoted || isClosed) ? 'default' : 'pointer' }}
                  >
                    <div className={styles.optionHeader}>
                      {!hasVoted && !isClosed && (
                        <input
                          type="radio"
                          checked={isSelected}
                          onChange={() => setSelectedOption(idx)}
                          className={styles.radioInput}
                        />
                      )}
                      <span className={styles.optionText}>{option.text || `Option ${idx + 1}`}</span>
                      {(hasVoted || isClosed) && (
                        <div className={styles.voteStats}>
                          <span className={styles.voteCount}>{option.votes || 0} votes</span>
                          <span className={styles.percentage}>({percentage}%)</span>
                        </div>
                      )}
                    </div>
                    {(hasVoted || isClosed) && (
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${percentage}%` }}></div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className={styles.hint}>No options available for this poll.</p>
            )}
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <p>{error}</p>
            </div>
          )}

          {!hasVoted && !isClosed && (
            <button
              onClick={handleVote}
              disabled={voting || selectedOption === null}
              className={`${styles.voteButton} ${voting || selectedOption === null ? styles.disabledButton : ''}`}
            >
              {voting ? "Submitting..." : "Submit Vote"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollsPage;