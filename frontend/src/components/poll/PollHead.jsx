import React, { useEffect, useState } from "react";
import { FaPlus, FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../Landing/Footer";
import Navbar from "../Landing/Navbar";
import styles from "./PollHead.module.css";

const PollHead = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const [pollsPerPage] = useState(8);

  const userId = localStorage.getItem("userId") || "";
  const userObject = JSON.parse(localStorage.getItem("user") || "{}");
  const userType = userObject.userType || userObject.role || "citizen";

  // Check if user is an official
  const isOfficial =
    userType === "official" || 
    userType === "government" || 
    userType === "admin" ||
    userType.startsWith("admin") ||
    (userObject.role && (
      userObject.role === "official" || 
      userObject.role === "government" || 
      userObject.role === "admin" ||
      userObject.role.startsWith("admin")
    )) ||
    (userObject.name && (
      userObject.name.toLowerCase().includes("official") ||
      userObject.name.toLowerCase().includes("admin") ||
      userObject.name.toLowerCase().includes("government")
    ));

  // Enhanced debugging
  console.log("Debug - userId:", userId);
  console.log("Debug - Full userObject:", userObject);
  console.log("Debug - userType:", userType);
  console.log("Debug - isOfficial:", isOfficial);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userLocation = userObject.location || "New York"; // Default location
      const res = await fetch(`http://localhost:4000/api/polls/list?location=${encodeURIComponent(userLocation)}&page=${currentPage}&limit=${pollsPerPage * 3}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch polls");
      const data = await res.json();
      setPolls(data.polls || data || []);
    } catch (error) {
      console.error("Error fetching polls:", error);
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const isUserOwnPoll = (poll) => {
    let creatorId;
    if (typeof poll.createdBy === "object" && poll.createdBy !== null) {
      creatorId = poll.createdBy._id?.toString() || poll.createdBy.toString();
    } else {
      creatorId = poll.createdBy?.toString();
    }
    return creatorId === userId || creatorId === userObject._id;
  };

  const isUserVotedPoll = (poll) => {
    if (!poll.votes || !Array.isArray(poll.votes)) {
      return false;
    }
    const hasVoted = poll.votes.some((vote) => {
      let voterId;
      if (typeof vote.voter === "object" && vote.voter !== null) {
        voterId = vote.voter._id?.toString() || vote.voter.toString();
      } else {
        voterId = vote.voter?.toString();
      }
      return voterId === userId || voterId === userObject._id;
    });
    return hasVoted;
  };

  const filteredPolls = polls
    .filter((poll) => poll)
    .filter((poll) => {
      if (isOfficial) {
        if (activeTab === "active") {
          return poll.status === "active";
        }
        if (activeTab === "closed") {
          return poll.status === "closed" || poll.status === "ended";
        }
        return true;
      }

      if (activeTab === "mine") {
        return isUserOwnPoll(poll);
      }
      if (activeTab === "voted") {
        return isUserVotedPoll(poll) && !isUserOwnPoll(poll);
      }

      if (category !== "All Categories" && poll.category !== category) {
        return false;
      }

      return true;
    });

  // Pagination logic
  const indexOfLastPoll = currentPage * pollsPerPage;
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
  const currentPolls = filteredPolls.slice(indexOfFirstPoll, indexOfLastPoll);
  const totalPages = Math.ceil(filteredPolls.length / pollsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusUpdate = async (pollId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to update poll status.");
        return;
      }
      
      console.log(`Updating poll ${pollId} to status: ${newStatus}`);
      
      const res = await fetch(
        `http://localhost:4000/api/polls/${pollId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update poll status");
      }
      
      const updatedPoll = await res.json();
      console.log("Updated poll:", updatedPoll);
      
      setPolls((prev) =>
        prev.map((p) => 
          p._id === pollId 
            ? { ...p, status: newStatus } 
            : p
        )
      );
      
      alert(`Poll status updated to ${newStatus}!`);
      
      await fetchPolls();
    } catch (error) {
      console.error("Error updating poll status:", error);
      alert("Error updating poll status: " + error.message);
    }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      const token = localStorage.getItem("token");
      
      console.log("Debug - Voting on poll:", {
        pollId: pollId,
        optionId: optionId,
        token: token ? "Present" : "Missing"
      });

      if (!token) {
        alert("You must be logged in to vote on a poll.");
        return;
      }

      const res = await fetch(`http://localhost:4000/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ optionId: optionId }),
      });

      console.log("Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        
        let errorMessage = "Failed to vote on poll";
        try {
          const err = JSON.parse(errorText);
          errorMessage = err.message || err.error || errorMessage;
        } catch (parseError) {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await res.json();
      console.log("Vote response data:", data);
      
      alert("Vote cast successfully!");
      await fetchPolls(); // Refresh data
    } catch (error) {
      console.error("Error voting on poll:", error);
      alert("Error voting on poll: " + error.message);
    }
  };

  const handleQuickVote = async (pollId, optionIndex) => {
    if (isUserVotedPoll(polls.find(p => p._id === pollId))) {
      alert("You have already voted on this poll!");
      return;
    }
    
    const poll = polls.find(p => p._id === pollId);
    if (poll && poll.options && poll.options[optionIndex]) {
      const optionId = poll.options[optionIndex]._id || poll.options[optionIndex].id || optionIndex;
      await handleVote(pollId, optionId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'closed':
      case 'ended':
        return '#ef4444';
      case 'draft':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getPageTitle = () => {
    if (isOfficial) {
      switch (activeTab) {
        case "active":
          return "Active Polls";
        case "closed":
          return "Closed Polls";
        default:
          return "All Polls";
      }
    }
    switch (activeTab) {
      case "mine":
        return "My Polls";
      case "voted":
        return "Polls I've Voted On";
      default:
        return "All Polls";
    }
  };

  const getPageDescription = () => {
    if (isOfficial) {
      switch (activeTab) {
        case "active":
          return "Manage currently active polls in the system.";
        case "closed":
          return "View polls that have been closed or ended.";
        default:
          return "Overview of all polls in the system.";
      }
    }
    switch (activeTab) {
      case "mine":
        return "Polls you have created and are managing.";
      case "voted":
        return "Polls you have participated in by voting.";
      default:
        return "Browse and participate in community polls.";
    }
  };

  const getEmptyMessage = () => {
    if (isOfficial) {
      switch (activeTab) {
        case "active":
          return "No active polls at the moment.";
        case "closed":
          return "No closed polls found.";
        default:
          return "No polls found in the system.";
      }
    }
    switch (activeTab) {
      case "mine":
        return "You haven't created any polls yet. Start by creating your first poll!";
      case "voted":
        return "You haven't voted on any polls yet. Browse and participate in community discussions!";
      default:
        return "No polls found.";
    }
  };

  const myPollsCount = polls.filter((p) => isUserOwnPoll(p)).length;
  const votedPollsCount = polls.filter(
    (p) => isUserVotedPoll(p) && !isUserOwnPoll(p)
  ).length;
  const activePollsCount = polls.filter(
    (p) => p.status === "active"
  ).length;
  const closedPollsCount = polls.filter(
    (p) => p.status === "closed" || p.status === "ended"
  ).length;

  // Calculate total votes for a poll
  const getTotalVotes = (poll) => {
    if (!poll.options || !Array.isArray(poll.options)) return 0;
    return poll.options.reduce((total, option) => total + (option.votes || 0), 0);
  };

  // Pagination component
  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className={styles.paginationContainer}>
        <div className={styles.pagination}>
          <button
            className={`${styles.paginationBtn} ${styles.paginationArrow}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>

          {startPage > 1 && (
            <>
              <button
                className={styles.paginationBtn}
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
              {startPage > 2 && <span className={styles.paginationEllipsis}>...</span>}
            </>
          )}

          {pageNumbers.map((number) => (
            <button
              key={number}
              className={`${styles.paginationBtn} ${
                number === currentPage ? styles.paginationActive : ""
              }`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className={styles.paginationEllipsis}>...</span>}
              <button
                className={styles.paginationBtn}
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            className={`${styles.paginationBtn} ${styles.paginationArrow}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </button>
        </div>
        <div className={styles.paginationInfo}>
          Showing {indexOfFirstPoll + 1} to {Math.min(indexOfLastPoll, filteredPolls.length)} of {filteredPolls.length} polls
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
                  ← Back
                </button>
        <div className={styles.header}>
          <h2 className={styles.title}>{getPageTitle()}</h2>
          {!isOfficial && (
            <button
              className={styles.createBtn}
              onClick={() => navigate("/poll-creation")}
            >
              <FaPlus className={styles.icon} /> Create Poll
            </button>
          )}
        </div>
        <p className={styles.descriptionText}>{getPageDescription()}</p>

        <div className={styles.controls}>
          <div className={styles.tabGroup}>
            {isOfficial ? (
              <>
                <button
                  className={`${styles.tabBtn} ${
                    activeTab === "all" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabChange("all")}
                >
                  All Polls
                </button>
                <button
                  className={`${styles.tabBtn} ${
                    activeTab === "active" ? styles.activeTabWarning : ""
                  }`}
                  onClick={() => handleTabChange("active")}
                >
                  Active ({activePollsCount})
                </button>
                <button
                  className={`${styles.tabBtn} ${
                    activeTab === "closed" ? styles.activeTabSecondary : ""
                  }`}
                  onClick={() => handleTabChange("closed")}
                >
                  Closed ({closedPollsCount})
                </button>
              </>
            ) : (
              <>
                <button
                  className={`${styles.tabBtn} ${
                    activeTab === "all" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabChange("all")}
                >
                  All Polls
                </button>
                <button
                  className={`${styles.tabBtn} ${
                    activeTab === "mine" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabChange("mine")}
                >
                  My Polls
                </button>
                <button
                  className={`${styles.tabBtn} ${
                    activeTab === "voted" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabChange("voted")}
                >
                  Voted By Me
                </button>
              </>
            )}
          </div>

        </div>

        <div className={styles.pollList}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Loading polls...</p>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {currentPolls.length === 0 ? (
                  <div className={styles.emptyState}>
                    <i className="fas fa-poll fa-3x text-muted mb-3"></i>
                    <h5 className={styles.emptyMessage}>{getEmptyMessage()}</h5>
                    {activeTab === "mine" && !isOfficial && (
                      <button
                        className={styles.createBtnSecondary}
                        onClick={() => navigate("/poll")}
                      >
                        <FaPlus className={styles.icon} />
                        Create Your First Poll
                      </button>
                    )}
                  </div>
                ) : (
                  currentPolls.map((poll) => (
                    <div className={styles.col} key={poll._id}>
                      <div className={styles.card}>
                        <div className={styles.cardBody}>
                          <div className={styles.cardHeader}>
                            <h5 className={styles.cardTitle}>{poll?.title}</h5>
                            <span className={styles.categoryBadge}>
                              {poll?.category || "N/A"}
                            </span>
                          </div>
                          <p className={styles.cardDescription}>
                            {poll?.description?.length > 100
                              ? `${poll.description.substring(0, 100)}...`
                              : poll?.description || "No description"}
                          </p>

                          <div className={styles.progressContainer}>
                            <p className={styles.voteCount}>
                              <strong>{getTotalVotes(poll)}</strong> total votes
                            </p>
                            <p className={styles.statusInfo}>
                              {poll.options?.length || 0} options
                              <span
                                className={styles.statusBadge}
                                style={{
                                  marginLeft: "10px",
                                  fontWeight: "bold",
                                  color: getStatusColor(poll.status)
                                }}
                              >
                                | {poll.status}
                              </span>
                            </p>

                            {poll.endDate && (
                              <p className={styles.endDate}>
                                Ends: {new Date(poll.endDate).toLocaleDateString()}
                              </p>
                            )}

                            {/* Show poll options for quick voting */}
                            {!isUserOwnPoll(poll) && !isUserVotedPoll(poll) && poll.status === 'active' && poll.options && (
                              <div className={styles.quickVoteOptions}>
                                <p className={styles.quickVoteLabel}>Quick Vote:</p>
                                {poll.options.slice(0, 2).map((option, index) => (
                                  <button
                                    key={index}
                                    className={styles.quickVoteBtn}
                                    onClick={() => handleQuickVote(poll._id, index)}
                                  >
                                    {option.text || option.option || `Option ${index + 1}`}
                                  </button>
                                ))}
                                {poll.options.length > 2 && (
                                  <button
                                    className={styles.moreOptionsBtn}
                                    onClick={() => navigate(`/poll/${poll._id}`)}
                                  >
                                    +{poll.options.length - 2} more
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Show results preview if user has voted */}
                            {isUserVotedPoll(poll) && poll.options && (
                              <div className={styles.resultsPreview}>
                                <p className={styles.resultsLabel}>Results:</p>
                                {poll.options.slice(0, 2).map((option, index) => {
                                  const percentage = getTotalVotes(poll) > 0 ? 
                                    ((option.votes || 0) / getTotalVotes(poll) * 100).toFixed(1) : 0;
                                  return (
                                    <div key={index} className={styles.resultBar}>
                                      <div className={styles.resultInfo}>
                                        <span className={styles.optionText}>
                                          {option.text || option.option || `Option ${index + 1}`}
                                        </span>
                                        <span className={styles.percentage}>{percentage}%</span>
                                      </div>
                                      <div className={styles.progressBarSmall}>
                                        <div 
                                          className={styles.progressFill}
                                          style={{ width: `${percentage}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          <div className={styles.actions}>
                            <button
                              className={styles.detailsBtn}
                              onClick={() => navigate(`/poll/${poll._id}`)}
                            >
                              View Details
                            </button>

                            {isOfficial ? (
                              <div className={styles.officialActions}>
                                <button
                                  className={`${styles.actionBtn} ${styles.warningBtn}`}
                                  onClick={() => handleStatusUpdate(poll._id, "active")}
                                  disabled={poll.status === "active"}
                                  style={{
                                    opacity: poll.status === "active" ? 0.6 : 1,
                                    cursor: poll.status === "active" ? "not-allowed" : "pointer"
                                  }}
                                >
                                  {poll.status === "active" ? "Active" : "Activate"}
                                </button>

                                <button
                                  className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                                  onClick={() => handleStatusUpdate(poll._id, "closed")}
                                  disabled={poll.status === "closed" || poll.status === "ended"}
                                  style={{
                                    opacity: (poll.status === "closed" || poll.status === "ended") ? 0.6 : 1,
                                    cursor: (poll.status === "closed" || poll.status === "ended") ? "not-allowed" : "pointer"
                                  }}
                                >
                                  {(poll.status === "closed" || poll.status === "ended") ? "Closed" : "Close"}
                                </button>

                                {(poll.status === "closed" || poll.status === "ended") && (
                                  <button
                                    className={`${styles.actionBtn} ${styles.successBtn}`}
                                    onClick={() => handleStatusUpdate(poll._id, "active")}
                                  >
                                    Reopen
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className={styles.userActions}>
                                {!isUserOwnPoll(poll) && (
                                  <button
                                    className={`${styles.actionBtn} ${
                                      isUserVotedPoll(poll)
                                        ? styles.votedBtn
                                        : styles.voteBtn
                                    }`}
                                    disabled={
                                      poll?.status === "closed" ||
                                      poll?.status === "ended" ||
                                      isUserVotedPoll(poll)
                                    }
                                    onClick={() => navigate(`/poll/${poll._id}`)}
                                  >
                                    {isUserVotedPoll(poll)
                                      ? "Already Voted"
                                      : "Vote Now"}
                                  </button>
                                )}
                                {isUserOwnPoll(poll) && (
                                  <button className={styles.ownerBtn}>
                                    Created By You
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <PaginationComponent />
            </>
          )}
        </div>

        {!loading && (
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <h5 className={styles.statNumber}>{polls.length}</h5>
              <small className={styles.statLabel}>Total Polls</small>
            </div>
            {isOfficial ? (
              <>
                <div className={styles.statCard}>
                  <h5 className={styles.statNumberWarning}>{activePollsCount}</h5>
                  <small className={styles.statLabel}>Active</small>
                </div>
                <div className={styles.statCard}>
                  <h5 className={styles.statNumberSecondary}>{closedPollsCount}</h5>
                  <small className={styles.statLabel}>Closed</small>
                </div>
                <div className={styles.statCard}>
                  <h5 className={styles.statNumberSuccess}>
                    {polls.length - activePollsCount - closedPollsCount}
                  </h5>
                  <small className={styles.statLabel}>Draft</small>
                </div>
              </>
            ) : (
              <>
                <div className={styles.statCard}>
                  <h5 className={styles.statNumberInfo}>{myPollsCount}</h5>
                  <small className={styles.statLabel}>My Polls</small>
                </div>
                <div className={styles.statCard}>
                  <h5 className={styles.statNumberSuccess}>{votedPollsCount}</h5>
                  <small className={styles.statLabel}>Voted By Me</small>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PollHead;