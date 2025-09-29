// // // // import React, { useEffect, useState } from "react";
// // // // import { useNavigate } from "react-router-dom";
// // // // import styles from "./PollHead.module.css";
// // // // // changed
// // // // const Footer = () => {
// // // //   return (
// // // //     <footer className={styles.footer}>
// // // //       <div className={styles.footerContent}>
// // // //         <div className={styles.footerSection}>
// // // //           <h4 className={styles.footerTitle}>Community Polls</h4>
// // // //           <p className={styles.footerText}>
// // // //             Making community decisions together through democratic voting.
// // // //           </p>
// // // //         </div>
// // // //         <div className={styles.footerSection}>
// // // //           <h4 className={styles.footerTitle}>Quick Links</h4>
// // // //           <ul className={styles.footerLinks}>
// // // //             <li><a href="/polls">Active Polls</a></li>
// // // //             <li><a href="/create">Create Poll</a></li>
// // // //             <li><a href="/results">Poll Results</a></li>
// // // //             <li><a href="/about">About Us</a></li>
// // // //           </ul>
// // // //         </div>
// // // //         <div className={styles.footerSection}>
// // // //           <h4 className={styles.footerTitle}>Contact</h4>
// // // //           <p className={styles.footerText}>
// // // //             Have questions? Reach out to us at<br />
// // // //             <a href="mailto:support@communitypolls.com">support@communitypolls.com</a>
// // // //           </p>
// // // //         </div>
// // // //       </div>
// // // //       <div className={styles.footerBottom}>
// // // //         <p>&copy; 2025 Community Polls. All rights reserved.</p>
// // // //       </div>
// // // //     </footer>
// // // //   );
// // // // };

// // // // const PollVotingInterface = () => {
// // // //   const navigate = useNavigate();
// // // //   const [polls, setPolls] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [selectedPoll, setSelectedPoll] = useState(null);
// // // //   const [currentPage, setCurrentPage] = useState(1);
// // // //   const [pollsPerPage] = useState(9);
// // // //   const [userLocation] = useState("New York");
// // // //   const [votingLoading, setVotingLoading] = useState(false);
// // // //   const [userVotedPolls, setUserVotedPolls] = useState(new Set()); 

// // // //   const [user] = useState(() => {
// // // //     const userData = localStorage.getItem("user");
// // // //     return userData ? JSON.parse(userData) : {
// // // //       id: "user123",
// // // //       name: "John Doe",
// // // //       votedPolls: []
// // // //     };
// // // //   });

// // // //   const handleCreatePoll = () => {
// // // //     navigate("/poll-creation");
// // // //   };

// // // //   const handleGoBack = () => {
// // // //     navigate(-1);
// // // //   };

// // // //   // Check vote status using only backend data
// // // //   const checkUserVoteStatus = async (polls) => {
// // // //     const token = localStorage.getItem("token");
// // // //     if (!token) return;

// // // //     const votedPollsSet = new Set();
    
// // // //     for (const poll of polls) {
// // // //       try {
// // // //         const response = await fetch(`http://localhost:4000/api/polls/${poll._id}`, {
// // // //           headers: {
// // // //             "Authorization": `Bearer ${token}`,
// // // //             "Content-Type": "application/json"
// // // //           }
// // // //         });

// // // //         if (response.ok) {
// // // //           const data = await response.json();
// // // //           // Check if the backend response indicates user has voted
// // // //           if (data.poll && data.poll.userHasVoted) {
// // // //             votedPollsSet.add(poll._id);
// // // //           } else if (data.userHasVoted) {
// // // //             votedPollsSet.add(poll._id);
// // // //           }
// // // //         }
// // // //       } catch (error) {
// // // //         console.warn(`Error checking vote status for poll ${poll._id}:`, error);
// // // //       }
// // // //     }

// // // //     console.log("User voted polls from backend:", Array.from(votedPollsSet));
// // // //     setUserVotedPolls(votedPollsSet);
// // // //   };

// // // //   const clearVoteData = async () => {
// // // //     try {
// // // //       const token = localStorage.getItem("token");
// // // //       if (!token) {
// // // //         console.log("No token found");
// // // //         return;
// // // //       }

// // // //       // If you have a clear votes endpoint, call it here
// // // //       // const response = await fetch("http://localhost:4000/api/user/clear-votes", {
// // // //       //   method: "POST",
// // // //       //   headers: {
// // // //       //     "Authorization": `Bearer ${token}`,
// // // //       //     "Content-Type": "application/json"
// // // //       //   }
// // // //       // });

// // // //       setUserVotedPolls(new Set());
// // // //       console.log("Vote data cleared locally!");
// // // //       // Refresh polls to show updated UI
// // // //       await fetchPolls();
// // // //     } catch (error) {
// // // //       console.error("Error clearing vote data:", error);
// // // //     }
// // // //   };

// // // //   const fetchPolls = async () => {
// // // //     setLoading(true);
// // // //     try {
// // // //       const token = localStorage.getItem("token");
// // // //       if (!token) {
// // // //         throw new Error("No authentication token found");
// // // //       }

// // // //       const response = await fetch(
// // // //         `http://localhost:4000/api/polls/list?page=${currentPage}&limit=${pollsPerPage * 3}`,
// // // //         {
// // // //           headers: {
// // // //             "Authorization": `Bearer ${token}`,
// // // //             "Content-Type": "application/json"
// // // //           }
// // // //         }
// // // //       );
      
// // // //       if (response.status === 401) {
// // // //         localStorage.removeItem("token");
// // // //         localStorage.removeItem("user");
// // // //         throw new Error("Authentication failed. Please log in again.");
// // // //       }
      
// // // //       if (!response.ok) {
// // // //         const errorData = await response.json();
// // // //         throw new Error(errorData.message || "Failed to fetch polls");
// // // //       }
      
// // // //       const data = await response.json();
// // // //       console.log("Fetched polls data:", data);
// // // //       const allPolls = data.polls || [];
      
// // // //       // Filter by closesOn date - check if poll is still active
// // // //       const activePolls = allPolls.filter(poll => {
// // // //         const closeDate = new Date(poll.closesOn);
// // // //         const now = new Date();
// // // //         return closeDate > now;
// // // //       });
      
// // // //       // Refresh polls with accurate vote counts from detailed API
// // // //       const pollsWithVotes = await refreshPollsWithVotes(activePolls);
// // // //       setPolls(pollsWithVotes);
      
// // // //       // Check user vote status for each poll
// // // //       await checkUserVoteStatus(pollsWithVotes);
      
// // // //     } catch (error) {
// // // //       console.error("Error fetching polls:", error);
// // // //       if (error.message.includes("Authentication")) {
// // // //         alert("Please log in to view polls");
// // // //         setPolls([]);
// // // //       } else {
// // // //         // Show mock data for demo purposes
// // // //         // setPolls([
// // // //         //   {
// // // //         //     _id: "1",
// // // //         //     title: "Choose your favorite color",
// // // //         //     description: "I want to know the popular choice, so kindly vote",
// // // //         //     targetLocation: "New York",
// // // //         //     closesOn: "2025-10-01T00:00:00.000Z",
// // // //         //     options: [
// // // //         //       { text: "Black", votes: 88 },
// // // //         //       { text: "White", votes: 67 },
// // // //         //       { text: "Purple", votes: 34 }
// // // //         //     ],
// // // //         //     createdBy: { _id: "creator1", name: "Alice Johnson" }
// // // //         //   },
// // // //         //   {
// // // //         //     _id: "2",
// // // //         //     title: "Best time for community meetings",
// // // //         //     description: "When would you prefer community meetings to be scheduled?",
// // // //         //     targetLocation: "New York",
// // // //         //     closesOn: "2025-10-15T00:00:00.000Z",
// // // //         //     options: [
// // // //         //       { text: "Morning (9-11 AM)", votes: 45 },
// // // //         //       { text: "Afternoon (2-4 PM)", votes: 78 },
// // // //         //       { text: "Evening (6-8 PM)", votes: 92 }
// // // //         //     ],
// // // //         //     createdBy: { _id: "creator2", name: "Bob Smith" }
// // // //         //   },
// // // //         //   {
// // // //         //     _id: "3",
// // // //         //     title: "Preferred transportation method",
// // // //         //     description: "What's your go-to transportation method for daily commute?",
// // // //         //     targetLocation: "New York",
// // // //         //     closesOn: "2025-09-30T00:00:00.000Z",
// // // //         //     options: [
// // // //         //       { text: "Car", votes: 156 },
// // // //         //       { text: "Public Transit", votes: 203 },
// // // //         //       { text: "Bicycle", votes: 89 },
// // // //         //       { text: "Walking", votes: 67 }
// // // //         //     ],
// // // //         //     createdBy: { _id: "creator3", name: "Carol Davis" }
// // // //         //   }
// // // //         // ]);
// // // //         // Check vote status for mock data too
// // // //         await checkUserVoteStatus([
// // // //           { _id: "1" }, { _id: "2" }, { _id: "3" }
// // // //         ]);
// // // //       }
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   // Refresh polls with updated vote data from the detailed endpoint
// // // //   const refreshPollsWithVotes = async (pollsToRefresh) => {
// // // //     const token = localStorage.getItem("token");
// // // //     if (!token) return pollsToRefresh;

// // // //     const updatedPolls = [];
    
// // // //     for (const poll of pollsToRefresh) {
// // // //       try {
// // // //         const response = await fetch(`http://localhost:4000/api/polls/${poll._id}`, {
// // // //           headers: {
// // // //             "Authorization": `Bearer ${token}`,
// // // //             "Content-Type": "application/json"
// // // //           }
// // // //         });
        
// // // //         if (response.ok) {
// // // //           const data = await response.json();
// // // //           const updatedPoll = { ...poll };
// // // //           if (data.results && poll.options) {
// // // //             updatedPoll.options = poll.options.map((option) => ({
// // // //               ...option,
// // // //               votes: data.results[option.text] || option.votes || 0
// // // //             }));
// // // //           }
          
// // // //           // Check if current user has voted on this poll from backend response
// // // //           if (data.poll && data.poll.userHasVoted !== undefined) {
// // // //             updatedPoll.userHasVoted = data.poll.userHasVoted;
// // // //           } else if (data.userHasVoted !== undefined) {
// // // //             updatedPoll.userHasVoted = data.userHasVoted;
// // // //           }
          
// // // //           updatedPolls.push(updatedPoll);
// // // //         } else {
// // // //           updatedPolls.push(poll);
// // // //         }
// // // //       } catch (error) {
// // // //         console.warn(`Error refreshing poll ${poll._id}:`, error);
// // // //         updatedPolls.push(poll);
// // // //       }
// // // //     }
    
// // // //     return updatedPolls;
// // // //   };

// // // //   const fetchPollDetails = async (pollId) => {
// // // //     try {
// // // //       const token = localStorage.getItem("token");
// // // //       if (!token) {
// // // //         throw new Error("No authentication token found");
// // // //       }

// // // //       const response = await fetch(`http://localhost:4000/api/polls/${pollId}`, {
// // // //         headers: {
// // // //           "Authorization": `Bearer ${token}`,
// // // //           "Content-Type": "application/json"
// // // //         }
// // // //       });

// // // //       if (response.status === 401) {
// // // //         localStorage.removeItem("token");
// // // //         localStorage.removeItem("user");
// // // //         throw new Error("Authentication failed. Please log in again.");
// // // //       }

// // // //       if (!response.ok) {
// // // //         const errorData = await response.json();
// // // //         throw new Error(errorData.error || errorData.message || "Failed to fetch poll details");
// // // //       }
      
// // // //       const data = await response.json();
// // // //       const pollWithUpdatedVotes = { ...data.poll };
      
// // // //       if (data.results && data.poll.options) {
// // // //         pollWithUpdatedVotes.options = data.poll.options.map((option) => ({
// // // //           ...option,
// // // //           votes: data.results[option.text] || option.votes || 0
// // // //         }));
// // // //       }
      
// // // //       // Set user voted status from backend response
// // // //       if (data.poll && data.poll.userHasVoted !== undefined) {
// // // //         pollWithUpdatedVotes.userHasVoted = data.poll.userHasVoted;
        
// // // //         // Update local voted polls state based on backend response
// // // //         const newUserVotedPolls = new Set(userVotedPolls);
// // // //         if (data.poll.userHasVoted) {
// // // //           newUserVotedPolls.add(pollId);
// // // //         } else {
// // // //           newUserVotedPolls.delete(pollId);
// // // //         }
// // // //         setUserVotedPolls(newUserVotedPolls);
// // // //       } else if (data.userHasVoted !== undefined) {
// // // //         pollWithUpdatedVotes.userHasVoted = data.userHasVoted;
        
// // // //         // Update local voted polls state based on backend response
// // // //         const newUserVotedPolls = new Set(userVotedPolls);
// // // //         if (data.userHasVoted) {
// // // //           newUserVotedPolls.add(pollId);
// // // //         } else {
// // // //           newUserVotedPolls.delete(pollId);
// // // //         }
// // // //         setUserVotedPolls(newUserVotedPolls);
// // // //       }
      
// // // //       setSelectedPoll(pollWithUpdatedVotes);
      
// // // //       setPolls(prevPolls => 
// // // //         prevPolls.map(poll => 
// // // //           poll._id === pollId ? pollWithUpdatedVotes : poll
// // // //         )
// // // //       );
      
// // // //     } catch (error) {
// // // //       console.error("Error fetching poll details:", error);
// // // //       if (error.message.includes("Authentication")) {
// // // //         alert("Please log in to view poll details");
// // // //       } else {
// // // //         const mockPoll = polls.find(p => p._id === pollId);
// // // //         if (mockPoll) setSelectedPoll(mockPoll);
// // // //       }
// // // //     }
// // // //   };

// // // //   const handleVote = async (pollId, optionIndex) => {
// // // //     if (hasUserVoted(pollId)) {
// // // //       // Don't allow voting if already voted - UI should show results instead
// // // //       return;
// // // //     }

// // // //     setVotingLoading(true);
// // // //     try {
// // // //       const token = localStorage.getItem("token");
// // // //       if (!token) {
// // // //         throw new Error("No authentication token found. Please log in.");
// // // //       }

// // // //       console.log("Voting on poll:", pollId, "Option index:", optionIndex);

// // // //       const response = await fetch(`http://localhost:4000/api/polls/${pollId}/vote`, {
// // // //         method: "POST",
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //           Authorization: `Bearer ${token}`,
// // // //         },
// // // //         body: JSON.stringify({ selectedOption: optionIndex.toString() }),
// // // //       });

// // // //       console.log("Vote response status:", response.status);

// // // //       if (response.status === 401) {
// // // //         localStorage.removeItem("token");
// // // //         localStorage.removeItem("user");
// // // //         throw new Error("Authentication failed. Please log in again.");
// // // //       }

// // // //       if (!response.ok) {
// // // //         const errorData = await response.json();
// // // //         console.error("Vote error data:", errorData);
        
// // // //         if (errorData.error && errorData.error.includes("already voted")) {
// // // //           // Add to local state and localStorage if backend says user has voted
// // // //           const newUserVotedPolls = new Set(userVotedPolls);
// // // //           newUserVotedPolls.add(pollId);
// // // //           setUserVotedPolls(newUserVotedPolls);
          
// // // //           // Store voted poll in localStorage for persistence
// // // //           const localVotedPolls = JSON.parse(localStorage.getItem("userVotedPolls") || "[]");
// // // //           if (!localVotedPolls.includes(pollId)) {
// // // //             localVotedPolls.push(pollId);
// // // //             localStorage.setItem("userVotedPolls", JSON.stringify(localVotedPolls));
// // // //           }
          
// // // //           // Show alert and refresh to show results
// // // //           alert("You have already voted on this poll! Refreshing to show results...");
// // // //           await fetchPolls();
// // // //           return;
// // // //         }
        
// // // //         throw new Error(errorData.error || errorData.message || "Failed to vote");
// // // //       }

// // // //       // Successfully voted - add to local state and persist
// // // //       const newUserVotedPolls = new Set(userVotedPolls);
// // // //       newUserVotedPolls.add(pollId);
// // // //       setUserVotedPolls(newUserVotedPolls);

// // // //       // Store voted poll in localStorage for persistence
// // // //       const localVotedPolls = JSON.parse(localStorage.getItem("userVotedPolls") || "[]");
// // // //       if (!localVotedPolls.includes(pollId)) {
// // // //         localVotedPolls.push(pollId);
// // // //         localStorage.setItem("userVotedPolls", JSON.stringify(localVotedPolls));
// // // //       }

// // // //       alert("Vote cast successfully!");
      
// // // //       if (selectedPoll && selectedPoll._id === pollId) {
// // // //         setSelectedPoll(null);
// // // //       }
      
// // // //       // Refresh polls to get updated vote counts
// // // //       await fetchPolls();
      
// // // //     } catch (error) {
// // // //       console.error("Error voting:", error);
// // // //       if (error.message.includes("Authentication")) {
// // // //         alert("Please log in to vote on polls");
// // // //       } else {
// // // //         alert("Error voting: " + error.message);
// // // //       }
// // // //     } finally {
// // // //       setVotingLoading(false);
// // // //     }
// // // //   };

// // // //   const hasUserVoted = (pollId) => {
// // // //     const voted = userVotedPolls.has(pollId);
// // // //     console.log(`Checking if user voted on poll ${pollId}:`, voted);
// // // //     return voted;
// // // //   };

// // // //   const getTotalVotes = (poll) => {
// // // //     return poll.options.reduce((total, option) => total + (option.votes || 0), 0);
// // // //   };

// // // //   const getVotePercentage = (option, totalVotes) => {
// // // //     return totalVotes > 0 ? ((option.votes || 0) / totalVotes * 100).toFixed(1) : 0;
// // // //   };

// // // //   const formatDate = (dateString) => {
// // // //     return new Date(dateString).toLocaleDateString('en-US', {
// // // //       year: 'numeric',
// // // //       month: 'short',
// // // //       day: 'numeric'
// // // //     });
// // // //   };

// // // //   const getCategory = (poll) => {
// // // //     const title = poll.title.toLowerCase();
// // // //     if (title.includes('gender')) {
// // // //       return "Demographics";
// // // //     }
// // // //     if (title.includes('cleanup') || title.includes('neighborhood') || 
// // // //         title.includes('community') || title.includes('initiative')) {
// // // //       return "Community";
// // // //     }
// // // //     if (title.includes('date') || title.includes('event')) {
// // // //       return "Events";
// // // //     }
// // // //     if (title.includes('color') || title.includes('style') || title.includes('preference')) {
// // // //       return "Lifestyle";
// // // //     }
// // // //     if (title.includes('transport') || title.includes('travel') || title.includes('commute')) {
// // // //       return "Transportation";
// // // //     }
// // // //     return "General";
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchPolls(); // This will call checkUserVoteStatus with backend data only
// // // //   }, [currentPage]);

// // // //   // Pagination
// // // //   const indexOfLastPoll = currentPage * pollsPerPage;
// // // //   const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
// // // //   const currentPolls = polls.slice(indexOfFirstPoll, indexOfLastPoll);
// // // //   const totalPages = Math.ceil(polls.length / pollsPerPage);

// // // //   const handlePageChange = (pageNumber) => {
// // // //     setCurrentPage(pageNumber);
// // // //     window.scrollTo({ top: 0, behavior: 'smooth' });
// // // //   };

// // // //   if (loading) {
// // // //     return (
// // // //       <div className={styles.container}>
// // // //         <div className={styles.loading}>
// // // //           <div className={styles.spinner}></div>
// // // //           <p className={styles.loadingText}>Loading active polls...</p>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className={styles.container}>
// // // //       <div className={styles.content}>
// // // //         {/* Back Button */}
// // // //         <div className={styles.backButtonContainer}>
// // // //           <button 
// // // //             onClick={handleGoBack} 
// // // //             className={styles.backButton}
// // // //           >
// // // //             ← Back
// // // //           </button>
          
// // // //           {/* Debug button - remove in production */}
// // // //           {/* <button 
// // // //             onClick={clearVoteData}
// // // //             style={{
// // // //               marginLeft: '10px',
// // // //               background: '#dc3545',
// // // //               color: 'white',
// // // //               border: 'none',
// // // //               padding: '8px 16px',
// // // //               borderRadius: '6px',
// // // //               cursor: 'pointer',
// // // //               fontSize: '14px'
// // // //             }}
// // // //           >
// // // //             Clear Vote Data (Debug)
// // // //           </button> */}
// // // //         </div>

// // // //         {/* Header */}
// // // //         <div className={styles.header}>
// // // //           <div className={styles.headerTop}>
// // // //             <div className={styles.headerLeft}>
// // // //               <h1 className={styles.mainTitle}>Active Polls Near You</h1>
// // // //               <p className={styles.description}>
// // // //                 Participate in community decisions by voting on active polls. Your voice matters!
// // // //               </p>
// // // //             </div>
// // // //             <div className={styles.headerRight}>
// // // //               <button 
// // // //                 className={styles.createPollButton}
// // // //                 onClick={handleCreatePoll}
// // // //               >
// // // //                 + Create Poll
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Poll Grid */}
// // // //         <div className={styles.pollGrid}>
// // // //           {currentPolls.map((poll) => {
// // // //             const totalVotes = getTotalVotes(poll);
// // // //             const userHasVoted = hasUserVoted(poll._id);
            
// // // //             return (
// // // //               <div key={poll._id} className={styles.pollCard}>
// // // //                 <div className={styles.cardHeader}>
// // // //                   <span className={styles.categoryBadge}>{getCategory(poll)}</span>
// // // //                   <span className={styles.endDate}>
// // // //                     🕒 Ends {formatDate(poll.closesOn)}
// // // //                   </span>
// // // //                 </div>

// // // //                 <h3 className={styles.pollTitle}>{poll.title}</h3>
                
// // // //                 <p className={styles.pollDescription}>{poll.description}</p>

// // // //                 {/* Vote Count */}
// // // //                 <div className={styles.pollStats}>
// // // //                   <span className={styles.voteCount}>
// // // //                     👥 {totalVotes} votes • {poll.options.length} options
// // // //                   </span>
// // // //                   {userHasVoted && (
// // // //                     <span className={styles.votedBadge}>✓ Voted</span>
// // // //                   )}
// // // //                 </div>

// // // //                 {/* Quick Vote Preview - Only show if user hasn't voted */}
// // // //                 {!userHasVoted && (
// // // //                   <div className={styles.voteSection}>
// // // //                     <div className={styles.quickVoteLabel}>Quick Vote:</div>
// // // //                     {poll.options.slice(0, 2).map((option, index) => (
// // // //                       <button
// // // //                         key={index}
// // // //                         onClick={() => handleVote(poll._id, index)}
// // // //                         disabled={votingLoading}
// // // //                         className={styles.voteButton}
// // // //                       >
// // // //                         <span className={styles.optionText}>{option.text}</span>
// // // //                         <span className={styles.voteButtonCount}>{option.votes} votes</span>
// // // //                       </button>
// // // //                     ))}
// // // //                   </div>
// // // //                 )}

// // // //                 {/* Results Preview for Voted Polls - Show all options with percentages */}
// // // //                 {userHasVoted && (
// // // //                   <div className={styles.resultsSection}>
// // // //                     <div className={styles.resultsLabel}>Vote Results:</div>
// // // //                     {poll.options.map((option, index) => {
// // // //                       const percentage = getVotePercentage(option, totalVotes);
// // // //                       return (
// // // //                         <div key={index} className={styles.resultItem}>
// // // //                           <div className={styles.resultHeader}>
// // // //                             <span className={styles.resultText}>{option.text}</span>
// // // //                             <span className={styles.resultPercentage}>{percentage}%</span>
// // // //                           </div>
// // // //                           <div className={styles.progressBar}>
// // // //                             <div 
// // // //                               className={styles.progressFill}
// // // //                               style={{ 
// // // //                                 width: `${percentage}%`,
// // // //                                 backgroundColor: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#f59e0b' : '#ef4444'
// // // //                               }}
// // // //                             ></div>
// // // //                           </div>
// // // //                           <div className={styles.voteCount}>
// // // //                             {option.votes || 0} votes ({percentage}%)
// // // //                           </div>
// // // //                         </div>
// // // //                       );
// // // //                     })}
// // // //                   </div>
// // // //                 )}

// // // //                 {/* Action Buttons */}
// // // //                 <div className={styles.actionButtons}>
// // // //                   {!userHasVoted ? (
// // // //                     <>
// // // //                       <button
// // // //                         onClick={() => fetchPollDetails(poll._id)}
// // // //                         className={styles.detailsButton}
// // // //                       >
// // // //                         👁️ View Details
// // // //                       </button>
                      
// // // //                       {poll.options.length > 2 && (
// // // //                         <button
// // // //                           onClick={() => fetchPollDetails(poll._id)}
// // // //                           className={styles.moreOptionsButton}
// // // //                         >
// // // //                           +{poll.options.length - 2} more options
// // // //                         </button>
// // // //                       )}
// // // //                     </>
// // // //                   ) : (
// // // //                     <button
// // // //                       onClick={() => fetchPollDetails(poll._id)}
// // // //                       className={styles.detailsButton}
// // // //                     >
// // // //                       👁️ View Full Results
// // // //                     </button>
// // // //                   )}
// // // //                 </div>
// // // //               </div>
// // // //             );
// // // //           })}
// // // //         </div>

// // // //         {/* Pagination */}
// // // //         {totalPages > 1 && (
// // // //           <div className={styles.pagination}>
// // // //             <button
// // // //               onClick={() => handlePageChange(currentPage - 1)}
// // // //               disabled={currentPage === 1}
// // // //               className={`${styles.paginationButton} ${styles.paginationArrow}`}
// // // //             >
// // // //               ‹
// // // //             </button>
            
// // // //             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// // // //               <button
// // // //                 key={page}
// // // //                 onClick={() => handlePageChange(page)}
// // // //                 className={`${styles.paginationButton} ${
// // // //                   page === currentPage ? styles.paginationActive : ""
// // // //                 }`}
// // // //               >
// // // //                 {page}
// // // //               </button>
// // // //             ))}
            
// // // //             <button
// // // //               onClick={() => handlePageChange(currentPage + 1)}
// // // //               disabled={currentPage === totalPages}
// // // //               className={`${styles.paginationButton} ${styles.paginationArrow}`}
// // // //             >
// // // //               ›
// // // //             </button>
// // // //           </div>
// // // //         )}

// // // //         {/* Empty State */}
// // // //         {polls.length === 0 && (
// // // //           <div className={styles.emptyState}>
// // // //             <div className={styles.emptyIcon}>📊</div>
// // // //             <h3 className={styles.emptyTitle}>No Active Polls</h3>
// // // //             <p className={styles.emptyMessage}>Check back later for new polls to participate in!</p>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* Poll Details Modal */}
// // // //       {selectedPoll && (
// // // //         <div className={styles.modalOverlay}>
// // // //           <div className={styles.modal}>
// // // //             <div className={styles.modalHeader}>
// // // //               <div className={styles.modalTitleSection}>
// // // //                 <span className={styles.modalCategoryBadge}>{getCategory(selectedPoll)}</span>
// // // //                 <h2 className={styles.modalTitle}>{selectedPoll.title}</h2>
// // // //               </div>
// // // //               <button
// // // //                 onClick={() => setSelectedPoll(null)}
// // // //                 className={styles.modalCloseButton}
// // // //               >
// // // //                 ✕
// // // //               </button>
// // // //             </div>

// // // //             <p className={styles.modalDescription}>{selectedPoll.description}</p>

// // // //             <div className={styles.modalVoteSection}>
// // // //               <h3 className={styles.modalVoteTitle}>
// // // //                 {hasUserVoted(selectedPoll._id) ? 'Results' : 'Cast Your Vote'}
// // // //               </h3>
              
// // // //               <div className={styles.modalOptions}>
// // // //                 {selectedPoll.options.map((option, index) => {
// // // //                   const totalVotes = getTotalVotes(selectedPoll);
// // // //                   const percentage = getVotePercentage(option, totalVotes);
// // // //                   const userHasVoted = hasUserVoted(selectedPoll._id);

// // // //                   return (
// // // //                     <div key={index} className={styles.modalOption}>
// // // //                       {!userHasVoted ? (
// // // //                         <button
// // // //                           onClick={() => handleVote(selectedPoll._id, index)}
// // // //                           disabled={votingLoading}
// // // //                           className={styles.modalVoteButton}
// // // //                         >
// // // //                           <span className={styles.modalOptionText}>{option.text}</span>
// // // //                           <span className={styles.modalOptionVotes}>{option.votes || 0} votes</span>
// // // //                         </button>
// // // //                       ) : (
// // // //                         <div className={styles.modalResult}>
// // // //                           <div className={styles.modalResultHeader}>
// // // //                             <span className={styles.modalResultText}>{option.text}</span>
// // // //                             <span className={styles.modalResultStats}>{percentage}% ({option.votes || 0} votes)</span>
// // // //                           </div>
// // // //                           <div className={styles.modalProgressBar}>
// // // //                             <div 
// // // //                               className={styles.modalProgressFill}
// // // //                               style={{ width: `${percentage}%` }}
// // // //                             ></div>
// // // //                           </div>
// // // //                         </div>
// // // //                       )}
// // // //                     </div>
// // // //                   );
// // // //                 })}
// // // //               </div>
// // // //             </div>

// // // //             <div className={styles.modalFooter}>
// // // //               <span className={styles.modalFooterInfo}>Total votes: {getTotalVotes(selectedPoll)}</span>
// // // //               <span className={styles.modalFooterInfo}>Ends: {formatDate(selectedPoll.closesOn)}</span>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default PollVotingInterface;

// // // import React, { useEffect, useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import styles from "./PollHead.module.css";


// // // const PollVotingInterface = () => {
// // //   const navigate = useNavigate();
// // //   const [polls, setPolls] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [selectedPoll, setSelectedPoll] = useState(null);
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [pollsPerPage] = useState(9);
// // //   const [userLocation] = useState("New York");
// // //   const [votingLoading, setVotingLoading] = useState(false);
// // //   const [userVotedPolls, setUserVotedPolls] = useState(new Set());

// // //   const handleCreatePoll = () => {
// // //     navigate("/poll-creation");
// // //   };

// // //   const handleGoBack = () => {
// // //     navigate(-1);
// // //   };

// // //   // Check authentication and redirect if needed
// // //   const checkAuth = () => {
// // //     const token = localStorage.getItem("token");
// // //     if (!token) {
// // //       alert("Please log in to view polls");
// // //       navigate("/login");
// // //       return false;
// // //     }
// // //     return true;
// // //   };

// // //   const fetchPolls = async () => {
// // //     if (!checkAuth()) return;
    
// // //     setLoading(true);
// // //     try {
// // //       const token = localStorage.getItem("token");
// // //       const response = await fetch(
// // //         `http://localhost:4000/api/polls/list?location=${userLocation}&page=1&limit=50`,
// // //         {
// // //           headers: {
// // //             "Authorization": `Bearer ${token}`,
// // //             "Content-Type": "application/json"
// // //           }
// // //         }
// // //       );
      
// // //       if (response.status === 401) {
// // //         localStorage.removeItem("token");
// // //         localStorage.removeItem("user");
// // //         alert("Session expired. Please log in again.");
// // //         navigate("/login");
// // //         return;
// // //       }
      
// // //       if (!response.ok) {
// // //         const errorData = await response.json();
// // //         throw new Error(errorData.message || "Failed to fetch polls");
// // //       }
      
// // //       const data = await response.json();
// // //       console.log("Fetched polls data:", data);
// // //       const allPolls = data.polls || [];
      
// // //       // Filter by closesOn date - check if poll is still active
// // //       const activePolls = allPolls.filter(poll => {
// // //         const closeDate = new Date(poll.closesOn);
// // //         const now = new Date();
// // //         return closeDate > now;
// // //       });
      
// // //       // Get detailed data for each poll to have accurate vote counts
// // //       const pollsWithDetails = await Promise.all(
// // //         activePolls.map(async (poll) => {
// // //           try {
// // //             const detailResponse = await fetch(`http://localhost:4000/api/polls/${poll._id}`, {
// // //               headers: {
// // //                 "Authorization": `Bearer ${token}`,
// // //                 "Content-Type": "application/json"
// // //               }
// // //             });
            
// // //             if (detailResponse.ok) {
// // //               const detailData = await detailResponse.json();
// // //               console.log(`Detail data for poll ${poll._id}:`, detailData); // Debug log
              
// // //               const updatedPoll = { ...poll };
              
// // //               // Update vote counts from results
// // //               if (detailData.results && poll.options) {
// // //                 console.log(`Results for poll ${poll._id}:`, detailData.results); // Debug log
// // //                 updatedPoll.options = poll.options.map((option, index) => {
// // //                   const voteCount = detailData.results[option.text] || option.votes || 0;
// // //                   console.log(`Option "${option.text}" has ${voteCount} votes`); // Debug log
// // //                   return {
// // //                     ...option,
// // //                     votes: voteCount
// // //                   };
// // //                 });
// // //               }
              
// // //               // If no results but we have totalVotes, distribute evenly as fallback
// // //               if (!detailData.results && detailData.totalVotes > 0) {
// // //                 console.log(`No results object, but totalVotes: ${detailData.totalVotes}`);
// // //                 // This is a fallback - you might want to remove this in production
// // //                 const avgVotes = Math.floor(detailData.totalVotes / poll.options.length);
// // //                 updatedPoll.options = poll.options.map((option, index) => ({
// // //                   ...option,
// // //                   votes: index === 0 ? detailData.totalVotes - (avgVotes * (poll.options.length - 1)) : avgVotes
// // //                 }));
// // //               }
              
// // //               return updatedPoll;
// // //             }
// // //             return poll;
// // //           } catch (error) {
// // //             console.warn(`Error fetching details for poll ${poll._id}:`, error);
// // //             return poll;
// // //           }
// // //         })
// // //       );
      
// // //       setPolls(pollsWithDetails);
      
// // //       // Check user vote status for each poll
// // //       await checkUserVoteStatus(pollsWithDetails);
      
// // //     } catch (error) {
// // //       console.error("Error fetching polls:", error);
// // //       alert("Error loading polls: " + error.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Refresh a single poll after voting
// // //   const refreshSinglePoll = async (pollId) => {
// // //     try {
// // //       const token = localStorage.getItem("token");
// // //       const response = await fetch(`http://localhost:4000/api/polls/${pollId}`, {
// // //         headers: {
// // //           "Authorization": `Bearer ${token}`,
// // //           "Content-Type": "application/json"
// // //         }
// // //       });

// // //       if (response.ok) {
// // //         const data = await response.json();
// // //         console.log("Poll refresh data:", data); // Debug log
        
// // //         const updatedPoll = { ...data.poll };
        
// // //         // Update vote counts from results
// // //         if (data.results && data.poll.options) {
// // //           console.log("Vote results:", data.results); // Debug log
// // //           updatedPoll.options = data.poll.options.map((option, index) => ({
// // //             ...option,
// // //             votes: data.results[option.text] || option.votes || 0
// // //           }));
// // //           console.log("Updated poll options:", updatedPoll.options); // Debug log
// // //         }
        
// // //         // Update the poll in the polls array
// // //         setPolls(prevPolls => 
// // //           prevPolls.map(poll => 
// // //             poll._id === pollId ? updatedPoll : poll
// // //           )
// // //         );
        
// // //         // If modal is open, update it too
// // //         if (selectedPoll && selectedPoll._id === pollId) {
// // //           setSelectedPoll(updatedPoll);
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.error("Error refreshing poll:", error);
// // //     }
// // //   };

// // //   const checkUserVoteStatus = async (polls) => {
// // //     const token = localStorage.getItem("token");
// // //     if (!token) return;

// // //     // Since your backend doesn't seem to provide direct vote status,
// // //     // we'll maintain voted polls in component state and localStorage as backup
// // //     const savedVotedPolls = JSON.parse(localStorage.getItem("userVotedPolls") || "[]");
// // //     const votedPollsSet = new Set(savedVotedPolls);
// // //     setUserVotedPolls(votedPollsSet);
// // //   };

// // //   const fetchPollDetails = async (pollId) => {
// // //     if (!checkAuth()) return;

// // //     try {
// // //       const token = localStorage.getItem("token");
// // //       const response = await fetch(`http://localhost:4000/api/polls/${pollId}`, {
// // //         headers: {
// // //           "Authorization": `Bearer ${token}`,
// // //           "Content-Type": "application/json"
// // //         }
// // //       });

// // //       if (response.status === 401) {
// // //         localStorage.removeItem("token");
// // //         localStorage.removeItem("user");
// // //         alert("Session expired. Please log in again.");
// // //         navigate("/login");
// // //         return;
// // //       }

// // //       if (!response.ok) {
// // //         const errorData = await response.json();
// // //         throw new Error(errorData.error || errorData.message || "Failed to fetch poll details");
// // //       }
      
// // //       const data = await response.json();
// // //       const pollWithResults = { ...data.poll };
      
// // //       // Add vote results to the poll options
// // //       if (data.results && data.poll.options) {
// // //         pollWithResults.options = data.poll.options.map((option) => ({
// // //           ...option,
// // //           votes: data.results[option.text] || 0
// // //         }));
// // //       }
      
// // //       // Update user vote status based on backend response
// // //       const newUserVotedPolls = new Set(userVotedPolls);
// // //       if (data.userHasVoted || (data.poll && data.poll.userHasVoted)) {
// // //         newUserVotedPolls.add(pollId);
// // //       } else {
// // //         newUserVotedPolls.delete(pollId);
// // //       }
// // //       setUserVotedPolls(newUserVotedPolls);
      
// // //       setSelectedPoll(pollWithResults);
      
// // //       // Update the poll in the main polls array
// // //       setPolls(prevPolls => 
// // //         prevPolls.map(poll => 
// // //           poll._id === pollId ? pollWithResults : poll
// // //         )
// // //       );
      
// // //     } catch (error) {
// // //       console.error("Error fetching poll details:", error);
// // //       alert("Error loading poll details: " + error.message);
// // //     }
// // //   };

// // //   const handleVote = async (pollId, optionIndex) => {
// // //     if (!checkAuth()) return;
    
// // //     if (hasUserVoted(pollId)) {
// // //       alert("You have already voted on this poll!");
// // //       return;
// // //     }

// // //     setVotingLoading(true);
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       console.log("Voting on poll:", pollId, "Option index:", optionIndex);

// // //       const response = await fetch(`http://localhost:4000/api/polls/${pollId}/vote`, {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //         body: JSON.stringify({ selectedOption: optionIndex }), // Send as number, not string
// // //       });

// // //       console.log("Vote response status:", response.status);

// // //       if (response.status === 401) {
// // //         localStorage.removeItem("token");
// // //         localStorage.removeItem("user");
// // //         alert("Session expired. Please log in again.");
// // //         navigate("/login");
// // //         return;
// // //       }

// // //       if (!response.ok) {
// // //         const errorData = await response.json();
// // //         console.error("Vote error data:", errorData);
        
// // //         if (errorData.error && errorData.error.includes("already voted")) {
// // //           // User has already voted according to backend
// // //           const newUserVotedPolls = new Set(userVotedPolls);
// // //           newUserVotedPolls.add(pollId);
// // //           setUserVotedPolls(newUserVotedPolls);
          
// // //           // Save to localStorage
// // //           const savedVotedPolls = JSON.parse(localStorage.getItem("userVotedPolls") || "[]");
// // //           if (!savedVotedPolls.includes(pollId)) {
// // //             savedVotedPolls.push(pollId);
// // //             localStorage.setItem("userVotedPolls", JSON.stringify(savedVotedPolls));
// // //           }
          
// // //           alert("You have already voted on this poll! Refreshing to show results...");
// // //           await refreshSinglePoll(pollId);
// // //           return;
// // //         }
        
// // //         throw new Error(errorData.error || errorData.message || "Failed to vote");
// // //       }

// // //       // Successfully voted
// // //       const response_data = await response.json();
      
// // //       const newUserVotedPolls = new Set(userVotedPolls);
// // //       newUserVotedPolls.add(pollId);
// // //       setUserVotedPolls(newUserVotedPolls);

// // //       // Save to localStorage
// // //       const savedVotedPolls = JSON.parse(localStorage.getItem("userVotedPolls") || "[]");
// // //       if (!savedVotedPolls.includes(pollId)) {
// // //         savedVotedPolls.push(pollId);
// // //         localStorage.setItem("userVotedPolls", JSON.stringify(savedVotedPolls));
// // //       }

// // //       alert("Vote cast successfully!");
      
// // //       // Close modal if it's open
// // //       if (selectedPoll && selectedPoll._id === pollId) {
// // //         setSelectedPoll(null);
// // //       }
      
// // //       // Refresh the specific poll to get updated vote counts
// // //       await refreshSinglePoll(pollId);
      
// // //     } catch (error) {
// // //       console.error("Error voting:", error);
// // //       alert("Error voting: " + error.message);
// // //     } finally {
// // //       setVotingLoading(false);
// // //     }
// // //   };

// // //   const hasUserVoted = (pollId) => {
// // //     return userVotedPolls.has(pollId);
// // //   };

// // //   const getTotalVotes = (poll) => {
// // //     return poll.options.reduce((total, option) => total + (option.votes || 0), 0);
// // //   };

// // //   const getVotePercentage = (option, totalVotes) => {
// // //     return totalVotes > 0 ? ((option.votes || 0) / totalVotes * 100).toFixed(1) : 0;
// // //   };

// // //   const formatDate = (dateString) => {
// // //     return new Date(dateString).toLocaleDateString('en-US', {
// // //       year: 'numeric',
// // //       month: 'short',
// // //       day: 'numeric'
// // //     });
// // //   };

// // //   const getCategory = (poll) => {
// // //     const title = poll.title.toLowerCase();
// // //     if (title.includes('gender')) {
// // //       return "Demographics";
// // //     }
// // //     if (title.includes('cleanup') || title.includes('neighborhood') || 
// // //         title.includes('community') || title.includes('initiative')) {
// // //       return "Community";
// // //     }
// // //     if (title.includes('date') || title.includes('event')) {
// // //       return "Events";
// // //     }
// // //     if (title.includes('color') || title.includes('style') || title.includes('preference')) {
// // //       return "Lifestyle";
// // //     }
// // //     if (title.includes('transport') || title.includes('travel') || title.includes('commute')) {
// // //       return "Transportation";
// // //     }
// // //     return "General";
// // //   };

// // //   useEffect(() => {
// // //     fetchPolls();
// // //   }, []); // Remove currentPage dependency since we're fetching all polls at once

// // //   // Pagination - this should work correctly now
// // //   const indexOfLastPoll = currentPage * pollsPerPage;
// // //   const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
// // //   const currentPolls = polls.slice(indexOfFirstPoll, indexOfLastPoll);
// // //   const totalPages = Math.ceil(polls.length / pollsPerPage);

// // //   const handlePageChange = (pageNumber) => {
// // //     setCurrentPage(pageNumber);
// // //     window.scrollTo({ top: 0, behavior: 'smooth' });
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className={styles.container}>
// // //         <div className={styles.loading}>
// // //           <div className={styles.spinner}></div>
// // //           <p className={styles.loadingText}>Loading active polls...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className={styles.container}>
// // //       <div className={styles.content}>
// // //         {/* Back Button */}
// // //         <div className={styles.backButtonContainer}>
// // //           <button 
// // //             onClick={handleGoBack} 
// // //             className={styles.backButton}
// // //           >
// // //             ← Back
// // //           </button>
// // //         </div>

// // //         {/* Header */}
// // //         <div className={styles.header}>
// // //           <div className={styles.headerTop}>
// // //             <div className={styles.headerLeft}>
// // //               <h1 className={styles.mainTitle}>Active Polls Near You</h1>
// // //               <p className={styles.description}>
// // //                 Participate in community decisions by voting on active polls. Your voice matters!
// // //               </p>
// // //             </div>
// // //             <div className={styles.headerRight}>
// // //               <button 
// // //                 className={styles.createPollButton}
// // //                 onClick={handleCreatePoll}
// // //               >
// // //                 + Create Poll
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Poll Grid */}
// // //         <div className={styles.pollGrid}>
// // //           {currentPolls.map((poll) => {
// // //             const totalVotes = getTotalVotes(poll);
// // //             const userHasVoted = hasUserVoted(poll._id);
            
// // //             return (
// // //               <div key={poll._id} className={styles.pollCard}>
// // //                 <div className={styles.cardHeader}>
// // //                   <span className={styles.categoryBadge}>{getCategory(poll)}</span>
// // //                   <span className={styles.endDate}>
// // //                     🕒 Ends {formatDate(poll.closesOn)}
// // //                   </span>
// // //                 </div>

// // //                 <h3 className={styles.pollTitle}>{poll.title}</h3>
                
// // //                 <p className={styles.pollDescription}>{poll.description}</p>

// // //                 {/* Vote Count */}
// // //                 <div className={styles.pollStats}>
// // //                   <span className={styles.voteCount}>
// // //                     👥 {totalVotes} votes • {poll.options.length} options
// // //                   </span>
// // //                   {userHasVoted && (
// // //                     <span className={styles.votedBadge}>✓ Voted</span>
// // //                   )}
// // //                 </div>

// // //                 {/* Quick Vote Preview - Only show if user hasn't voted */}
// // //                 {!userHasVoted && (
// // //                   <div className={styles.voteSection}>
// // //                     <div className={styles.quickVoteLabel}>Quick Vote:</div>
// // //                     {poll.options.slice(0, 2).map((option, index) => (
// // //                       <button
// // //                         key={index}
// // //                         onClick={() => handleVote(poll._id, index)}
// // //                         disabled={votingLoading}
// // //                         className={styles.voteButton}
// // //                       >
// // //                         <span className={styles.optionText}>{option.text}</span>
// // //                         <span className={styles.voteButtonCount}>{option.votes || 0} votes</span>
// // //                       </button>
// // //                     ))}
// // //                   </div>
// // //                 )}

// // //                 {/* Results Preview for Voted Polls */}
// // //                 {userHasVoted && (
// // //                   <div className={styles.resultsSection}>
// // //                     <div className={styles.resultsLabel}>Vote Results:</div>
// // //                     {poll.options.map((option, index) => {
// // //                       const percentage = getVotePercentage(option, totalVotes);
// // //                       return (
// // //                         <div key={index} className={styles.resultItem}>
// // //                           <div className={styles.resultHeader}>
// // //                             <span className={styles.resultText}>{option.text}</span>
// // //                             <span className={styles.resultPercentage}>{percentage}%</span>
// // //                           </div>
// // //                           <div className={styles.progressBar}>
// // //                             <div 
// // //                               className={styles.progressFill}
// // //                               style={{ 
// // //                                 width: `${percentage}%`,
// // //                                 backgroundColor: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#f59e0b' : '#ef4444'
// // //                               }}
// // //                             ></div>
// // //                           </div>
// // //                           <div className={styles.voteCount}>
// // //                             {option.votes || 0} votes ({percentage}%)
// // //                           </div>
// // //                         </div>
// // //                       );
// // //                     })}
// // //                   </div>
// // //                 )}

// // //                 {/* Action Buttons */}
// // //                 <div className={styles.actionButtons}>
// // //                   {!userHasVoted ? (
// // //                     <>
// // //                       <button
// // //                         onClick={() => fetchPollDetails(poll._id)}
// // //                         className={styles.detailsButton}
// // //                       >
// // //                         👁️ View Details
// // //                       </button>
                      
// // //                       {poll.options.length > 2 && (
// // //                         <button
// // //                           onClick={() => fetchPollDetails(poll._id)}
// // //                           className={styles.moreOptionsButton}
// // //                         >
// // //                           +{poll.options.length - 2} more options
// // //                         </button>
// // //                       )}
// // //                     </>
// // //                   ) : (
// // //                     <button
// // //                       onClick={() => fetchPollDetails(poll._id)}
// // //                       className={styles.detailsButton}
// // //                     >
// // //                       👁️ View Full Results
// // //                     </button>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //             );
// // //           })}
// // //         </div>

// // //         {/* Pagination */}
// // //         {totalPages > 1 && (
// // //           <div className={styles.pagination}>
// // //             <button
// // //               onClick={() => handlePageChange(currentPage - 1)}
// // //               disabled={currentPage === 1}
// // //               className={`${styles.paginationButton} ${styles.paginationArrow}`}
// // //             >
// // //               ‹
// // //             </button>
            
// // //             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// // //               <button
// // //                 key={page}
// // //                 onClick={() => handlePageChange(page)}
// // //                 className={`${styles.paginationButton} ${
// // //                   page === currentPage ? styles.paginationActive : ""
// // //                 }`}
// // //               >
// // //                 {page}
// // //               </button>
// // //             ))}
            
// // //             <button
// // //               onClick={() => handlePageChange(currentPage + 1)}
// // //               disabled={currentPage === totalPages}
// // //               className={`${styles.paginationButton} ${styles.paginationArrow}`}
// // //             >
// // //               ›
// // //             </button>
// // //           </div>
// // //         )}

// // //         {/* Empty State */}
// // //         {polls.length === 0 && (
// // //           <div className={styles.emptyState}>
// // //             <div className={styles.emptyIcon}>📊</div>
// // //             <h3 className={styles.emptyTitle}>No Active Polls</h3>
// // //             <p className={styles.emptyMessage}>Check back later for new polls to participate in!</p>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Poll Details Modal */}
// // //       {selectedPoll && (
// // //         <div className={styles.modalOverlay}>
// // //           <div className={styles.modal}>
// // //             <div className={styles.modalHeader}>
// // //               <div className={styles.modalTitleSection}>
// // //                 <span className={styles.modalCategoryBadge}>{getCategory(selectedPoll)}</span>
// // //                 <h2 className={styles.modalTitle}>{selectedPoll.title}</h2>
// // //               </div>
// // //               <button
// // //                 onClick={() => setSelectedPoll(null)}
// // //                 className={styles.modalCloseButton}
// // //               >
// // //                 ✕
// // //               </button>
// // //             </div>

// // //             <p className={styles.modalDescription}>{selectedPoll.description}</p>

// // //             <div className={styles.modalVoteSection}>
// // //               <h3 className={styles.modalVoteTitle}>
// // //                 {hasUserVoted(selectedPoll._id) ? 'Results' : 'Cast Your Vote'}
// // //               </h3>
              
// // //               <div className={styles.modalOptions}>
// // //                 {selectedPoll.options.map((option, index) => {
// // //                   const totalVotes = getTotalVotes(selectedPoll);
// // //                   const percentage = getVotePercentage(option, totalVotes);
// // //                   const userHasVoted = hasUserVoted(selectedPoll._id);

// // //                   return (
// // //                     <div key={index} className={styles.modalOption}>
// // //                       {!userHasVoted ? (
// // //                         <button
// // //                           onClick={() => handleVote(selectedPoll._id, index)}
// // //                           disabled={votingLoading}
// // //                           className={styles.modalVoteButton}
// // //                         >
// // //                           <span className={styles.modalOptionText}>{option.text}</span>
// // //                           <span className={styles.modalOptionVotes}>{option.votes || 0} votes</span>
// // //                         </button>
// // //                       ) : (
// // //                         <div className={styles.modalResult}>
// // //                           <div className={styles.modalResultHeader}>
// // //                             <span className={styles.modalResultText}>{option.text}</span>
// // //                             <span className={styles.modalResultStats}>{percentage}% ({option.votes || 0} votes)</span>
// // //                           </div>
// // //                           <div className={styles.modalProgressBar}>
// // //                             <div 
// // //                               className={styles.modalProgressFill}
// // //                               style={{ width: `${percentage}%` }}
// // //                             ></div>
// // //                           </div>
// // //                         </div>
// // //                       )}
// // //                     </div>
// // //                   );
// // //                 })}
// // //               </div>
// // //             </div>

// // //             <div className={styles.modalFooter}>
// // //               <span className={styles.modalFooterInfo}>Total votes: {getTotalVotes(selectedPoll)}</span>
// // //               <span className={styles.modalFooterInfo}>Ends: {formatDate(selectedPoll.closesOn)}</span>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //     </div>
// // //   );
// // // };

// // // export default PollVotingInterface;

// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import styles from "./PollHead.module.css";

// // const Footer = () => {
// //   return (
// //     <footer className={styles.footer}>
// //       <div className={styles.footerContent}>
// //         <div className={styles.footerSection}>
// //           <h4 className={styles.footerTitle}>Community Polls</h4>
// //           <p className={styles.footerText}>
// //             Making community decisions together through democratic voting.
// //           </p>
// //         </div>
// //         <div className={styles.footerSection}>
// //           <h4 className={styles.footerTitle}>Quick Links</h4>
// //           <ul className={styles.footerLinks}>
// //             <li><a href="/polls">Active Polls</a></li>
// //             <li><a href="/create">Create Poll</a></li>
// //             <li><a href="/results">Poll Results</a></li>
// //             <li><a href="/about">About Us</a></li>
// //           </ul>
// //         </div>
// //         <div className={styles.footerSection}>
// //           <h4 className={styles.footerTitle}>Contact</h4>
// //           <p className={styles.footerText}>
// //             Have questions? Reach out to us at<br />
// //             <a href="mailto:support@communitypolls.com">support@communitypolls.com</a>
// //           </p>
// //         </div>
// //       </div>
// //       <div className={styles.footerBottom}>
// //         <p>&copy; 2025 Community Polls. All rights reserved.</p>
// //       </div>
// //     </footer>
// //   );
// // };

// // const PollVotingInterface = () => {
// //   const navigate = useNavigate();
// //   const [polls, setPolls] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedPoll, setSelectedPoll] = useState(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [pollsPerPage] = useState(9);
// //   const [votingLoading, setVotingLoading] = useState(false);
// //   const [userVotedPolls, setUserVotedPolls] = useState(new Set());

// //   const handleCreatePoll = () => {
// //     navigate("/poll-creation");
// //   };

// //   const handleGoBack = () => {
// //     navigate(-1);
// //   };

// //   // Check authentication and redirect if needed
// //   const checkAuth = () => {
// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       alert("Please log in to view polls");
// //       navigate("/login");
// //       return false;
// //     }
// //     return true;
// //   };

// //   // Fetch all polls from database
// //   const fetchPolls = async () => {
// //     if (!checkAuth()) return;
    
// //     setLoading(true);
// //     try {
// //       const token = localStorage.getItem("token");
      
// //       // Fetch all polls without location filter to get all available polls
// //       const response = await fetch(
// //         `http://localhost:4000/api/polls/list?page=1&limit=100`,
// //         {
// //           headers: {
// //             "Authorization": `Bearer ${token}`,
// //             "Content-Type": "application/json"
// //           }
// //         }
// //       );
      
// //       if (response.status === 401) {
// //         localStorage.removeItem("token");
// //         localStorage.removeItem("user");
// //         alert("Session expired. Please log in again.");
// //         navigate("/login");
// //         return;
// //       }
      
// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData.message || "Failed to fetch polls");
// //       }
      
// //       const data = await response.json();
// //       console.log("Raw polls data from API:", data);
// //       const allPolls = data.polls || [];
      
// //       // Filter by closesOn date - only show active polls
// //       const activePolls = allPolls.filter(poll => {
// //         const closeDate = new Date(poll.closesOn);
// //         const now = new Date();
// //         return closeDate > now;
// //       });
      
// //       console.log("Active polls after filtering:", activePolls);
      
// //       // Get detailed vote counts for each poll
// //       const pollsWithVoteCounts = await Promise.all(
// //         activePolls.map(async (poll) => {
// //           try {
// //             const detailResponse = await fetch(`http://localhost:4000/api/polls/${poll._id}`, {
// //               headers: {
// //                 "Authorization": `Bearer ${token}`,
// //                 "Content-Type": "application/json"
// //               }
// //             });
            
// //             if (detailResponse.ok) {
// //               const detailData = await detailResponse.json();
// //               console.log(`Vote data for poll ${poll.title}:`, detailData);
              
// //               const updatedPoll = { ...poll };
              
// //               // Update vote counts from the results object
// //               if (detailData.results && poll.options) {
// //                 updatedPoll.options = poll.options.map((option) => ({
// //                   ...option,
// //                   votes: detailData.results[option.text] || 0
// //                 }));
// //               }
              
// //               return updatedPoll;
// //             }
// //             return poll;
// //           } catch (error) {
// //             console.warn(`Error fetching vote data for poll ${poll._id}:`, error);
// //             return poll;
// //           }
// //         })
// //       );
      
// //       console.log("Final polls with vote counts:", pollsWithVoteCounts);
// //       setPolls(pollsWithVoteCounts);
      
// //       // Check user vote status for each poll using backend API
// //       await checkUserVoteStatus(pollsWithVoteCounts);
      
// //     } catch (error) {
// //       console.error("Error fetching polls:", error);
// //       alert("Error loading polls: " + error.message);
// //       setPolls([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Check which polls user has voted on by trying to vote with invalid data
// //   const checkUserVoteStatus = async (polls) => {
// //     const token = localStorage.getItem("token");
// //     if (!token || polls.length === 0) return;

// //     const votedPollsSet = new Set();
    
// //     // Check each poll by attempting to vote with invalid option
// //     for (const poll of polls) {
// //       try {
// //         const checkResponse = await fetch(`http://localhost:4000/api/polls/${poll._id}/vote`, {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`,
// //           },
// //           body: JSON.stringify({ selectedOption: 999 }), // Invalid option index
// //         });
        
// //         if (!checkResponse.ok) {
// //           const errorData = await checkResponse.json();
// //           if (errorData.error && errorData.error.includes("already voted")) {
// //             votedPollsSet.add(poll._id);
// //             console.log(`User has already voted on poll: ${poll.title}`);
// //           }
// //         }
// //       } catch (error) {
// //         console.warn(`Error checking vote status for poll ${poll._id}:`, error);
// //       }
// //     }

// //     console.log("Polls user has voted on:", Array.from(votedPollsSet));
// //     setUserVotedPolls(votedPollsSet);
// //   };

// //   // Fetch individual poll details when user wants to see more
// //   const fetchPollDetails = async (pollId) => {
// //     if (!checkAuth()) return;

// //     try {
// //       const token = localStorage.getItem("token");
// //       const response = await fetch(`http://localhost:4000/api/polls/${pollId}`, {
// //         headers: {
// //           "Authorization": `Bearer ${token}`,
// //           "Content-Type": "application/json"
// //         }
// //       });

// //       if (response.status === 401) {
// //         localStorage.removeItem("token");
// //         localStorage.removeItem("user");
// //         alert("Session expired. Please log in again.");
// //         navigate("/login");
// //         return;
// //       }

// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData.error || errorData.message || "Failed to fetch poll details");
// //       }
      
// //       const data = await response.json();
// //       console.log("Poll details:", data);
      
// //       const pollWithResults = { ...data.poll };
      
// //       // Add current vote results to options
// //       if (data.results && data.poll.options) {
// //         pollWithResults.options = data.poll.options.map((option) => ({
// //           ...option,
// //           votes: data.results[option.text] || 0
// //         }));
// //       }
      
// //       setSelectedPoll(pollWithResults);
      
// //       // Update the poll in main array
// //       setPolls(prevPolls => 
// //         prevPolls.map(poll => 
// //           poll._id === pollId ? pollWithResults : poll
// //         )
// //       );
      
// //     } catch (error) {
// //       console.error("Error fetching poll details:", error);
// //       alert("Error loading poll details: " + error.message);
// //     }
// //   };

// //   // Handle voting
// //   const handleVote = async (pollId, optionIndex) => {
// //     if (!checkAuth()) return;
    
// //     if (hasUserVoted(pollId)) {
// //       alert("You have already voted on this poll!");
// //       return;
// //     }

// //     setVotingLoading(true);
// //     try {
// //       const token = localStorage.getItem("token");

// //       console.log("Attempting to vote:", pollId, "Option index:", optionIndex);

// //       const response = await fetch(`http://localhost:4000/api/polls/${pollId}/vote`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({ selectedOption: optionIndex }),
// //       });

// //       console.log("Vote response status:", response.status);

// //       if (response.status === 401) {
// //         localStorage.removeItem("token");
// //         localStorage.removeItem("user");
// //         alert("Session expired. Please log in again.");
// //         navigate("/login");
// //         return;
// //       }

// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         console.error("Vote error:", errorData);
        
// //         if (errorData.error && errorData.error.includes("already voted")) {
// //           // Mark as voted
// //           const newUserVotedPolls = new Set(userVotedPolls);
// //           newUserVotedPolls.add(pollId);
// //           setUserVotedPolls(newUserVotedPolls);
          
// //           alert("You have already voted on this poll!");
// //           // Refresh poll data to show results
// //           await refreshSinglePoll(pollId);
// //           return;
// //         }
        
// //         throw new Error(errorData.error || errorData.message || "Failed to vote");
// //       }

// //       // Vote successful
// //       const newUserVotedPolls = new Set(userVotedPolls);
// //       newUserVotedPolls.add(pollId);
// //       setUserVotedPolls(newUserVotedPolls);

// //       alert("Vote cast successfully!");
      
// //       // Close modal if open
// //       if (selectedPoll && selectedPoll._id === pollId) {
// //         setSelectedPoll(null);
// //       }
      
// //       // Refresh this poll to show updated vote counts
// //       await refreshSinglePoll(pollId);
      
// //     } catch (error) {
// //       console.error("Error voting:", error);
// //       alert("Error voting: " + error.message);
// //     } finally {
// //       setVotingLoading(false);
// //     }
// //   };

// //   // Refresh single poll after voting
// //   const refreshSinglePoll = async (pollId) => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       const response = await fetch(`http://localhost:4000/api/polls/${pollId}`, {
// //         headers: {
// //           "Authorization": `Bearer ${token}`,
// //           "Content-Type": "application/json"
// //         }
// //       });

// //       if (response.ok) {
// //         const data = await response.json();
// //         console.log("Refreshed poll data:", data);
        
// //         const updatedPoll = { ...data.poll };
        
// //         // Update vote counts from backend results
// //         if (data.results && data.poll.options) {
// //           updatedPoll.options = data.poll.options.map((option) => ({
// //             ...option,
// //             votes: data.results[option.text] || 0
// //           }));
// //         }
        
// //         // Update in polls array
// //         setPolls(prevPolls => 
// //           prevPolls.map(poll => 
// //             poll._id === pollId ? updatedPoll : poll
// //           )
// //         );
        
// //         // Update modal if open
// //         if (selectedPoll && selectedPoll._id === pollId) {
// //           setSelectedPoll(updatedPoll);
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Error refreshing poll:", error);
// //     }
// //   };

// //   const hasUserVoted = (pollId) => {
// //     return userVotedPolls.has(pollId);
// //   };

// //   const getTotalVotes = (poll) => {
// //     return poll.options.reduce((total, option) => total + (option.votes || 0), 0);
// //   };

// //   const getVotePercentage = (option, totalVotes) => {
// //     return totalVotes > 0 ? ((option.votes || 0) / totalVotes * 100).toFixed(1) : 0;
// //   };

// //   const formatDate = (dateString) => {
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       year: 'numeric',
// //       month: 'short',
// //       day: 'numeric'
// //     });
// //   };

// //   const getCategory = (poll) => {
// //     const title = poll.title.toLowerCase();
// //     if (title.includes('gender')) return "Demographics";
// //     if (title.includes('cleanup') || title.includes('neighborhood') || 
// //         title.includes('community') || title.includes('initiative')) return "Community";
// //     if (title.includes('date') || title.includes('event')) return "Events";
// //     if (title.includes('color') || title.includes('style') || title.includes('preference')) return "Lifestyle";
// //     if (title.includes('transport') || title.includes('travel') || title.includes('commute')) return "Transportation";
// //     if (title.includes('infrastructure') || title.includes('survey')) return "Infrastructure";
// //     if (title.includes('frontend') || title.includes('framework')) return "Technology";
// //     if (title.includes('park') || title.includes('improvement')) return "Environment";
// //     return "General";
// //   };

// //   useEffect(() => {
// //     fetchPolls();
// //   }, []);

// //   // Pagination
// //   const indexOfLastPoll = currentPage * pollsPerPage;
// //   const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
// //   const currentPolls = polls.slice(indexOfFirstPoll, indexOfLastPoll);
// //   const totalPages = Math.ceil(polls.length / pollsPerPage);

// //   const handlePageChange = (pageNumber) => {
// //     setCurrentPage(pageNumber);
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //   };

// //   if (loading) {
// //     return (
// //       <div className={styles.container}>
// //         <div className={styles.loading}>
// //           <div className={styles.spinner}></div>
// //           <p className={styles.loadingText}>Loading active polls...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className={styles.container}>
// //       <div className={styles.content}>
// //         {/* Back Button */}
// //         <div className={styles.backButtonContainer}>
// //           <button 
// //             onClick={handleGoBack} 
// //             className={styles.backButton}
// //           >
// //             ← Back
// //           </button>
// //         </div>

// //         {/* Header */}
// //         <div className={styles.header}>
// //           <div className={styles.headerTop}>
// //             <div className={styles.headerLeft}>
// //               <h1 className={styles.mainTitle}>Active Polls Near You</h1>
// //               <p className={styles.description}>
// //                 Participate in community decisions by voting on active polls. Your voice matters!
// //               </p>
// //               <p className={styles.pollCount}>
// //                 Found {polls.length} active polls
// //               </p>
// //             </div>
// //             <div className={styles.headerRight}>
// //               <button 
// //                 className={styles.createPollButton}
// //                 onClick={handleCreatePoll}
// //               >
// //                 + Create Poll
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Poll Grid */}
// //         <div className={styles.pollGrid}>
// //           {currentPolls.map((poll) => {
// //             const totalVotes = getTotalVotes(poll);
// //             const userHasVoted = hasUserVoted(poll._id);
            
// //             return (
// //               <div key={poll._id} className={styles.pollCard}>
// //                 <div className={styles.cardHeader}>
// //                   <span className={styles.categoryBadge}>{getCategory(poll)}</span>
// //                   <span className={styles.endDate}>
// //                     🕒 Ends {formatDate(poll.closesOn)}
// //                   </span>
// //                 </div>

// //                 <h3 className={styles.pollTitle}>{poll.title}</h3>
                
// //                 <p className={styles.pollDescription}>{poll.description}</p>

// //                 {/* Vote Count */}
// //                 <div className={styles.pollStats}>
// //                   <span className={styles.voteCount}>
// //                     👥 {totalVotes} votes • {poll.options.length} options
// //                   </span>
// //                   {userHasVoted && (
// //                     <span className={styles.votedBadge}>✓ Voted</span>
// //                   )}
// //                 </div>

// //                 {/* Quick Vote Preview - Only show if user hasn't voted */}
// //                 {!userHasVoted && (
// //                   <div className={styles.voteSection}>
// //                     <div className={styles.quickVoteLabel}>Quick Vote:</div>
// //                     {poll.options.slice(0, 2).map((option, index) => (
// //                       <button
// //                         key={index}
// //                         onClick={() => handleVote(poll._id, index)}
// //                         disabled={votingLoading}
// //                         className={styles.voteButton}
// //                       >
// //                         <span className={styles.optionText}>{option.text}</span>
// //                         <span className={styles.voteButtonCount}>{option.votes || 0} votes</span>
// //                       </button>
// //                     ))}
// //                   </div>
// //                 )}

// //                 {/* Results Preview for Voted Polls */}
// //                 {userHasVoted && (
// //                   <div className={styles.resultsSection}>
// //                     <div className={styles.resultsLabel}>Vote Results:</div>
// //                     {poll.options.map((option, index) => {
// //                       const percentage = getVotePercentage(option, totalVotes);
// //                       return (
// //                         <div key={index} className={styles.resultItem}>
// //                           <div className={styles.resultHeader}>
// //                             <span className={styles.resultText}>{option.text}</span>
// //                             <span className={styles.resultPercentage}>{percentage}%</span>
// //                           </div>
// //                           <div className={styles.progressBar}>
// //                             <div 
// //                               className={styles.progressFill}
// //                               style={{ 
// //                                 width: `${percentage}%`,
// //                                 backgroundColor: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#f59e0b' : '#ef4444'
// //                               }}
// //                             ></div>
// //                           </div>
// //                           <div className={styles.voteCount}>
// //                             {option.votes || 0} votes ({percentage}%)
// //                           </div>
// //                         </div>
// //                       );
// //                     })}
// //                   </div>
// //                 )}

// //                 {/* Action Buttons */}
// //                 <div className={styles.actionButtons}>
// //                   {!userHasVoted ? (
// //                     <>
// //                       <button
// //                         onClick={() => fetchPollDetails(poll._id)}
// //                         className={styles.detailsButton}
// //                       >
// //                         👁️ View Details
// //                       </button>
                      
// //                       {poll.options.length > 2 && (
// //                         <button
// //                           onClick={() => fetchPollDetails(poll._id)}
// //                           className={styles.moreOptionsButton}
// //                         >
// //                           +{poll.options.length - 2} more options
// //                         </button>
// //                       )}
// //                     </>
// //                   ) : (
// //                     <button
// //                       onClick={() => fetchPollDetails(poll._id)}
// //                       className={styles.detailsButton}
// //                     >
// //                       👁️ View Full Results
// //                     </button>
// //                   )}
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>

// //         {/* Pagination */}
// //         {totalPages > 1 && (
// //           <div className={styles.pagination}>
// //             <button
// //               onClick={() => handlePageChange(currentPage - 1)}
// //               disabled={currentPage === 1}
// //               className={`${styles.paginationButton} ${styles.paginationArrow}`}
// //             >
// //               ‹
// //             </button>
            
// //             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// //               <button
// //                 key={page}
// //                 onClick={() => handlePageChange(page)}
// //                 className={`${styles.paginationButton} ${
// //                   page === currentPage ? styles.paginationActive : ""
// //                 }`}
// //               >
// //                 {page}
// //               </button>
// //             ))}
            
// //             <button
// //               onClick={() => handlePageChange(currentPage + 1)}
// //               disabled={currentPage === totalPages}
// //               className={`${styles.paginationButton} ${styles.paginationArrow}`}
// //             >
// //               ›
// //             </button>
// //           </div>
// //         )}

// //         {/* Empty State */}
// //         {polls.length === 0 && (
// //           <div className={styles.emptyState}>
// //             <div className={styles.emptyIcon}>📊</div>
// //             <h3 className={styles.emptyTitle}>No Active Polls</h3>
// //             <p className={styles.emptyMessage}>Check back later for new polls to participate in!</p>
// //           </div>
// //         )}
// //       </div>

// //       {/* Poll Details Modal */}
// //       {selectedPoll && (
// //         <div className={styles.modalOverlay}>
// //           <div className={styles.modal}>
// //             <div className={styles.modalHeader}>
// //               <div className={styles.modalTitleSection}>
// //                 <span className={styles.modalCategoryBadge}>{getCategory(selectedPoll)}</span>
// //                 <h2 className={styles.modalTitle}>{selectedPoll.title}</h2>
// //               </div>
// //               <button
// //                 onClick={() => setSelectedPoll(null)}
// //                 className={styles.modalCloseButton}
// //               >
// //                 ✕
// //               </button>
// //             </div>

// //             <p className={styles.modalDescription}>{selectedPoll.description}</p>

// //             <div className={styles.modalVoteSection}>
// //               <h3 className={styles.modalVoteTitle}>
// //                 {hasUserVoted(selectedPoll._id) ? 'Results' : 'Cast Your Vote'}
// //               </h3>
              
// //               <div className={styles.modalOptions}>
// //                 {selectedPoll.options.map((option, index) => {
// //                   const totalVotes = getTotalVotes(selectedPoll);
// //                   const percentage = getVotePercentage(option, totalVotes);
// //                   const userHasVoted = hasUserVoted(selectedPoll._id);

// //                   return (
// //                     <div key={index} className={styles.modalOption}>
// //                       {!userHasVoted ? (
// //                         <button
// //                           onClick={() => handleVote(selectedPoll._id, index)}
// //                           disabled={votingLoading}
// //                           className={styles.modalVoteButton}
// //                         >
// //                           <span className={styles.modalOptionText}>{option.text}</span>
// //                           <span className={styles.modalOptionVotes}>{option.votes || 0} votes</span>
// //                         </button>
// //                       ) : (
// //                         <div className={styles.modalResult}>
// //                           <div className={styles.modalResultHeader}>
// //                             <span className={styles.modalResultText}>{option.text}</span>
// //                             <span className={styles.modalResultStats}>{percentage}% ({option.votes || 0} votes)</span>
// //                           </div>
// //                           <div className={styles.modalProgressBar}>
// //                             <div 
// //                               className={styles.modalProgressFill}
// //                               style={{ width: `${percentage}%` }}
// //                             ></div>
// //                           </div>
// //                         </div>
// //                       )}
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             </div>

// //             <div className={styles.modalFooter}>
// //               <span className={styles.modalFooterInfo}>Total votes: {getTotalVotes(selectedPoll)}</span>
// //               <span className={styles.modalFooterInfo}>Ends: {formatDate(selectedPoll.closesOn)}</span>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <Footer />
// //     </div>
// //   );
// // };

// // export default PollVotingInterface;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "./PollHead.module.css";

// const PollVotingInterface = () => {
//   const navigate = useNavigate();
//   const [polls, setPolls] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPoll, setSelectedPoll] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pollsPerPage] = useState(9);
//   const [votingLoading, setVotingLoading] = useState(false);
//   const [userVotedPolls, setUserVotedPolls] = useState(new Set());

//   const handleCreatePoll = () => {
//     navigate("/poll-creation");
//   };

//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   // Check authentication and redirect if needed
//   const checkAuth = () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Please log in to view polls");
//       navigate("/login");
//       return false;
//     }
//     return true;
//   };

//   // Fetch all polls from database
//   const fetchPolls = async () => {
//     if (!checkAuth()) return;
    
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
      
//       // Fetch all polls without location filter to get all available polls
//       const response = await fetch(
//         `http://localhost:4000/api/polls/list?page=1&limit=100`,
//         {
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );
      
//       if (response.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         alert("Session expired. Please log in again.");
//         navigate("/login");
//         return;
//       }
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to fetch polls");
//       }
      
//       const data = await response.json();
//       console.log("Raw polls data from API:", data);
//       const allPolls = data.polls || [];
      
//       // Filter by closesOn date - only show active polls
//       const activePolls = allPolls.filter(poll => {
//         const closeDate = new Date(poll.closesOn);
//         const now = new Date();
//         return closeDate > now;
//       });
      
//       console.log("Active polls after filtering:", activePolls);
      
//       // Get detailed vote counts for each poll
//       const pollsWithVoteCounts = await Promise.all(
//         activePolls.map(async (poll) => {
//           try {
//             const detailResponse = await fetch(`http://localhost:4000/api/polls/${poll._id}`, {
//               headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json"
//               }
//             });
            
//             if (detailResponse.ok) {
//               const detailData = await detailResponse.json();
//               console.log(`Vote data for poll ${poll.title}:`, detailData);
              
//               const updatedPoll = { ...poll };
              
//               // Update vote counts from the results object
//               if (detailData.results && poll.options) {
//                 updatedPoll.options = poll.options.map((option) => ({
//                   ...option,
//                   votes: detailData.results[option.text] || 0
//                 }));
//               }
              
//               return updatedPoll;
//             }
//             return poll;
//           } catch (error) {
//             console.warn(`Error fetching vote data for poll ${poll._id}:`, error);
//             return poll;
//           }
//         })
//       );
      
//       console.log("Final polls with vote counts:", pollsWithVoteCounts);
//       setPolls(pollsWithVoteCounts);
      
//       // Check user vote status for each poll using backend API
//       await checkUserVoteStatus(pollsWithVoteCounts);
      
//     } catch (error) {
//       console.error("Error fetching polls:", error);
//       alert("Error loading polls: " + error.message);
//       setPolls([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check which polls user has voted on by examining vote records
//   const checkUserVoteStatus = async (polls) => {
//     const token = localStorage.getItem("token");
//     if (!token || polls.length === 0) return;

//     const votedPollsSet = new Set();
    
//     // For now, let's not pre-check vote status since the backend doesn't provide this info directly
//     // We'll determine vote status when user tries to vote or when we detect "already voted" errors
//     console.log("Skipping pre-vote status check - will determine dynamically");
    
//     setUserVotedPolls(votedPollsSet);
//   };

//   // Fetch individual poll details when user wants to see more
//   const fetchPollDetails = async (pollId) => {
//     if (!checkAuth()) return;

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`http://localhost:4000/api/polls/${pollId}`, {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       if (response.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         alert("Session expired. Please log in again.");
//         navigate("/login");
//         return;
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || errorData.message || "Failed to fetch poll details");
//       }
      
//       const data = await response.json();
//       console.log("Poll details:", data);
      
//       const pollWithResults = { ...data.poll };
      
//       // Add current vote results to options
//       if (data.results && data.poll.options) {
//         pollWithResults.options = data.poll.options.map((option) => ({
//           ...option,
//           votes: data.results[option.text] || 0
//         }));
//       }
      
//       setSelectedPoll(pollWithResults);
      
//       // Update the poll in main array
//       setPolls(prevPolls => 
//         prevPolls.map(poll => 
//           poll._id === pollId ? pollWithResults : poll
//         )
//       );
      
//     } catch (error) {
//       console.error("Error fetching poll details:", error);
//       alert("Error loading poll details: " + error.message);
//     }
//   };

//   // Handle voting
//   const handleVote = async (pollId, optionIndex) => {
//     if (!checkAuth()) return;
    
//     if (hasUserVoted(pollId)) {
//       alert("You have already voted on this poll!");
//       return;
//     }

//     setVotingLoading(true);
//     try {
//       const token = localStorage.getItem("token");

//       console.log("Attempting to vote:", pollId, "Option index:", optionIndex);

//       const response = await fetch(`http://localhost:4000/api/polls/${pollId}/vote`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ selectedOption: optionIndex }),
//       });

//       console.log("Vote response status:", response.status);

//       if (response.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         alert("Session expired. Please log in again.");
//         navigate("/login");
//         return;
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Vote error:", errorData);
        
//         if (errorData.error && errorData.error.includes("already voted")) {
//           // Mark as voted
//           const newUserVotedPolls = new Set(userVotedPolls);
//           newUserVotedPolls.add(pollId);
//           setUserVotedPolls(newUserVotedPolls);
          
//           alert("You have already voted on this poll!");
//           // Refresh poll data to show results
//           await refreshSinglePoll(pollId);
//           return;
//         }
        
//         throw new Error(errorData.error || errorData.message || "Failed to vote");
//       }

//       // Vote successful
//       const newUserVotedPolls = new Set(userVotedPolls);
//       newUserVotedPolls.add(pollId);
//       setUserVotedPolls(newUserVotedPolls);

//       alert("Vote cast successfully!");
      
//       // Close modal if open
//       if (selectedPoll && selectedPoll._id === pollId) {
//         setSelectedPoll(null);
//       }
      
//       // Refresh this poll to show updated vote counts
//       await refreshSinglePoll(pollId);
      
//     } catch (error) {
//       console.error("Error voting:", error);
//       alert("Error voting: " + error.message);
//     } finally {
//       setVotingLoading(false);
//     }
//   };

//   // Refresh single poll after voting
//   const refreshSinglePoll = async (pollId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`http://localhost:4000/api/polls/${pollId}`, {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Refreshed poll data:", data);
        
//         const updatedPoll = { ...data.poll };
        
//         // Update vote counts from backend results
//         if (data.results && data.poll.options) {
//           updatedPoll.options = data.poll.options.map((option) => ({
//             ...option,
//             votes: data.results[option.text] || 0
//           }));
//         }
        
//         // Update in polls array
//         setPolls(prevPolls => 
//           prevPolls.map(poll => 
//             poll._id === pollId ? updatedPoll : poll
//           )
//         );
        
//         // Update modal if open
//         if (selectedPoll && selectedPoll._id === pollId) {
//           setSelectedPoll(updatedPoll);
//         }
//       }
//     } catch (error) {
//       console.error("Error refreshing poll:", error);
//     }
//   };

//   const hasUserVoted = (pollId) => {
//     return userVotedPolls.has(pollId);
//   };

//   const getTotalVotes = (poll) => {
//     return poll.options.reduce((total, option) => total + (option.votes || 0), 0);
//   };

//   const getVotePercentage = (option, totalVotes) => {
//     return totalVotes > 0 ? ((option.votes || 0) / totalVotes * 100).toFixed(1) : 0;
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getCategory = (poll) => {
//     const title = poll.title.toLowerCase();
//     if (title.includes('gender')) return "Demographics";
//     if (title.includes('cleanup') || title.includes('neighborhood') || 
//         title.includes('community') || title.includes('initiative')) return "Community";
//     if (title.includes('date') || title.includes('event')) return "Events";
//     if (title.includes('color') || title.includes('style') || title.includes('preference')) return "Lifestyle";
//     if (title.includes('transport') || title.includes('travel') || title.includes('commute')) return "Transportation";
//     if (title.includes('infrastructure') || title.includes('survey')) return "Infrastructure";
//     if (title.includes('frontend') || title.includes('framework')) return "Technology";
//     if (title.includes('park') || title.includes('improvement')) return "Environment";
//     return "General";
//   };

//   useEffect(() => {
//     fetchPolls();
//   }, []);

//   // Pagination
//   const indexOfLastPoll = currentPage * pollsPerPage;
//   const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
//   const currentPolls = polls.slice(indexOfFirstPoll, indexOfLastPoll);
//   const totalPages = Math.ceil(polls.length / pollsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   if (loading) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.loading}>
//           <div className={styles.spinner}></div>
//           <p className={styles.loadingText}>Loading active polls...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.content}>
//         {/* Back Button */}
//         <div className={styles.backButtonContainer}>
//           <button 
//             onClick={handleGoBack} 
//             className={styles.backButton}
//           >
//             ← Back
//           </button>
//         </div>

//         {/* Header */}
//         <div className={styles.header}>
//           <div className={styles.headerTop}>
//             <div className={styles.headerLeft}>
//               <h1 className={styles.mainTitle}>Active Polls Near You</h1>
//               <p className={styles.description}>
//                 Participate in community decisions by voting on active polls. Your voice matters!
//               </p>
//               <p className={styles.pollCount}>
//                 Found {polls.length} active polls
//               </p>
//             </div>
//             <div className={styles.headerRight}>
//               <button 
//                 className={styles.createPollButton}
//                 onClick={handleCreatePoll}
//               >
//                 + Create Poll
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Poll Grid */}
//         <div className={styles.pollGrid}>
//           {currentPolls.map((poll) => {
//             const totalVotes = getTotalVotes(poll);
//             const userHasVoted = hasUserVoted(poll._id);
            
//             return (
//               <div key={poll._id} className={styles.pollCard}>
//                 <div className={styles.cardHeader}>
//                   <span className={styles.categoryBadge}>{getCategory(poll)}</span>
//                   <span className={styles.endDate}>
//                     🕒 Ends {formatDate(poll.closesOn)}
//                   </span>
//                 </div>

//                 <h3 className={styles.pollTitle}>{poll.title}</h3>
                
//                 <p className={styles.pollDescription}>{poll.description}</p>

//                 {/* Vote Count */}
//                 <div className={styles.pollStats}>
//                   <span className={styles.voteCount}>
//                     👥 {totalVotes} votes • {poll.options.length} options
//                   </span>
//                   {userHasVoted && (
//                     <span className={styles.votedBadge}>✓ Voted</span>
//                   )}
//                 </div>

//                 {/* Show voting interface for polls with no votes or where user hasn't voted */}
//                 {(!userHasVoted && totalVotes === 0) && (
//                   <div className={styles.voteSection}>
//                     <div className={styles.quickVoteLabel}>Be the first to vote:</div>
//                     {poll.options.slice(0, 2).map((option, index) => (
//                       <button
//                         key={index}
//                         onClick={() => handleVote(poll._id, index)}
//                         disabled={votingLoading}
//                         className={styles.voteButton}
//                       >
//                         <span className={styles.optionText}>{option.text}</span>
//                         <span className={styles.voteButtonCount}>0 votes</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}

//                 {/* Show voting interface for polls where user hasn't voted but others have */}
//                 {(!userHasVoted && totalVotes > 0) && (
//                   <div className={styles.voteSection}>
//                     <div className={styles.quickVoteLabel}>Cast your vote:</div>
//                     {poll.options.slice(0, 2).map((option, index) => (
//                       <button
//                         key={index}
//                         onClick={() => handleVote(poll._id, index)}
//                         disabled={votingLoading}
//                         className={styles.voteButton}
//                       >
//                         <span className={styles.optionText}>{option.text}</span>
//                         <span className={styles.voteButtonCount}>{option.votes || 0} votes</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}

//                 {/* Results Preview - Only show if user has voted */}
//                 {userHasVoted && (
//                   <div className={styles.resultsSection}>
//                     <div className={styles.resultsLabel}>Vote Results:</div>
//                     {poll.options.map((option, index) => {
//                       const percentage = getVotePercentage(option, totalVotes);
//                       return (
//                         <div key={index} className={styles.resultItem}>
//                           <div className={styles.resultHeader}>
//                             <span className={styles.resultText}>{option.text}</span>
//                             <span className={styles.resultPercentage}>{percentage}%</span>
//                           </div>
//                           <div className={styles.progressBar}>
//                             <div 
//                               className={styles.progressFill}
//                               style={{ 
//                                 width: `${percentage}%`,
//                                 backgroundColor: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#f59e0b' : '#ef4444'
//                               }}
//                             ></div>
//                           </div>
//                           <div className={styles.voteCount}>
//                             {option.votes || 0} votes ({percentage}%)
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className={styles.actionButtons}>
//                   {!userHasVoted ? (
//                     <>
//                       <button
//                         onClick={() => fetchPollDetails(poll._id)}
//                         className={styles.detailsButton}
//                       >
//                         👁️ View Details
//                       </button>
                      
//                       {poll.options.length > 2 && (
//                         <button
//                           onClick={() => fetchPollDetails(poll._id)}
//                           className={styles.moreOptionsButton}
//                         >
//                           +{poll.options.length - 2} more options
//                         </button>
//                       )}
//                     </>
//                   ) : (
//                     <button
//                       onClick={() => fetchPollDetails(poll._id)}
//                       className={styles.detailsButton}
//                     >
//                       👁️ View Full Results
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className={styles.pagination}>
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className={`${styles.paginationButton} ${styles.paginationArrow}`}
//             >
//               ‹
//             </button>
            
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => handlePageChange(page)}
//                 className={`${styles.paginationButton} ${
//                   page === currentPage ? styles.paginationActive : ""
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}
            
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className={`${styles.paginationButton} ${styles.paginationArrow}`}
//             >
//               ›
//             </button>
//           </div>
//         )}

//         {/* Empty State */}
//         {polls.length === 0 && (
//           <div className={styles.emptyState}>
//             <div className={styles.emptyIcon}>📊</div>
//             <h3 className={styles.emptyTitle}>No Active Polls</h3>
//             <p className={styles.emptyMessage}>Check back later for new polls to participate in!</p>
//           </div>
//         )}
//       </div>

//       {/* Poll Details Modal */}
//       {selectedPoll && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modal}>
//             <div className={styles.modalHeader}>
//               <div className={styles.modalTitleSection}>
//                 <span className={styles.modalCategoryBadge}>{getCategory(selectedPoll)}</span>
//                 <h2 className={styles.modalTitle}>{selectedPoll.title}</h2>
//               </div>
//               <button
//                 onClick={() => setSelectedPoll(null)}
//                 className={styles.modalCloseButton}
//               >
//                 ✕
//               </button>
//             </div>

//             <p className={styles.modalDescription}>{selectedPoll.description}</p>

//             <div className={styles.modalVoteSection}>
//               <h3 className={styles.modalVoteTitle}>
//                 {hasUserVoted(selectedPoll._id) ? 'Results' : 'Cast Your Vote'}
//               </h3>
              
//               <div className={styles.modalOptions}>
//                 {selectedPoll.options.map((option, index) => {
//                   const totalVotes = getTotalVotes(selectedPoll);
//                   const percentage = getVotePercentage(option, totalVotes);
//                   const userHasVoted = hasUserVoted(selectedPoll._id);

//                   return (
//                     <div key={index} className={styles.modalOption}>
//                       {!userHasVoted ? (
//                         <button
//                           onClick={() => handleVote(selectedPoll._id, index)}
//                           disabled={votingLoading}
//                           className={styles.modalVoteButton}
//                         >
//                           <span className={styles.modalOptionText}>{option.text}</span>
//                           <span className={styles.modalOptionVotes}>{option.votes || 0} votes</span>
//                         </button>
//                       ) : (
//                         <div className={styles.modalResult}>
//                           <div className={styles.modalResultHeader}>
//                             <span className={styles.modalResultText}>{option.text}</span>
//                             <span className={styles.modalResultStats}>{percentage}% ({option.votes || 0} votes)</span>
//                           </div>
//                           <div className={styles.modalProgressBar}>
//                             <div 
//                               className={styles.modalProgressFill}
//                               style={{ width: `${percentage}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className={styles.modalFooter}>
//               <span className={styles.modalFooterInfo}>Total votes: {getTotalVotes(selectedPoll)}</span>
//               <span className={styles.modalFooterInfo}>Ends: {formatDate(selectedPoll.closesOn)}</span>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default PollVotingInterface;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PollHead.module.css";


const PollVotingInterface = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pollsPerPage] = useState(9);
  const [votingLoading, setVotingLoading] = useState(false);
  const [userVotedPolls, setUserVotedPolls] = useState(new Set());

  const handleCreatePoll = () => {
    navigate("/poll-creation");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Check authentication and redirect if needed
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to view polls");
      navigate("/login");
      return false;
    }
    return true;
  };

  // Fetch all polls from database
  const fetchPolls = async () => {
    if (!checkAuth()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Fetch all polls without location filter to get all available polls
      const response = await fetch(
        `http://localhost:4000/api/polls/list?page=1&limit=100`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch polls");
      }
      
      const data = await response.json();
      console.log("Raw polls data from API:", data);
      const allPolls = data.polls || [];
      
      // Filter by closesOn date - only show active polls
      const activePolls = allPolls.filter(poll => {
        const closeDate = new Date(poll.closesOn);
        const now = new Date();
        return closeDate > now;
      });
      
      console.log("Active polls after filtering:", activePolls);
      
      // Get detailed vote counts for each poll
      const pollsWithVoteCounts = await Promise.all(
        activePolls.map(async (poll) => {
          try {
            const detailResponse = await fetch(`http://localhost:4000/api/polls/${poll._id}`, {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            });
            
            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              console.log(`Vote data for poll ${poll.title}:`, detailData);
              
              const updatedPoll = { ...poll };
              
              // Update vote counts from the results object
              if (detailData.results && poll.options) {
                updatedPoll.options = poll.options.map((option) => ({
                  ...option,
                  votes: detailData.results[option.text] || 0
                }));
              }
              
              return updatedPoll;
            }
            return poll;
          } catch (error) {
            console.warn(`Error fetching vote data for poll ${poll._id}:`, error);
            return poll;
          }
        })
      );
      
      console.log("Final polls with vote counts:", pollsWithVoteCounts);
      setPolls(pollsWithVoteCounts);
      
      // Don't pre-check vote status - let it be determined dynamically
      setUserVotedPolls(new Set());
      
    } catch (error) {
      console.error("Error fetching polls:", error);
      alert("Error loading polls: " + error.message);
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch individual poll details when user wants to see more
  const fetchPollDetails = async (pollId) => {
    if (!checkAuth()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/polls/${pollId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || "Failed to fetch poll details");
      }
      
      const data = await response.json();
      console.log("Poll details:", data);
      
      const pollWithResults = { ...data.poll };
      
      // Add current vote results to options
      if (data.results && data.poll.options) {
        pollWithResults.options = data.poll.options.map((option) => ({
          ...option,
          votes: data.results[option.text] || 0
        }));
      }
      
      setSelectedPoll(pollWithResults);
      
      // Update the poll in main array
      setPolls(prevPolls => 
        prevPolls.map(poll => 
          poll._id === pollId ? pollWithResults : poll
        )
      );
      
    } catch (error) {
      console.error("Error fetching poll details:", error);
      alert("Error loading poll details: " + error.message);
    }
  };

  // Handle voting
  const handleVote = async (pollId, optionIndex) => {
    if (!checkAuth()) return;
    
    if (hasUserVoted(pollId)) {
      alert("You have already voted on this poll!");
      return;
    }

    setVotingLoading(true);
    try {
      const token = localStorage.getItem("token");

      console.log("Attempting to vote:", pollId, "Option index:", optionIndex);

      const response = await fetch(`http://localhost:4000/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectedOption: optionIndex }),
      });

      console.log("Vote response status:", response.status);
      const responseData = await response.json();
      console.log("Vote response data:", responseData);

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        console.error("Vote error:", responseData);
        
        if (responseData.error && responseData.error.includes("already voted")) {
          // Mark as voted and refresh poll data
          const newUserVotedPolls = new Set(userVotedPolls);
          newUserVotedPolls.add(pollId);
          setUserVotedPolls(newUserVotedPolls);
          
          alert("You have already voted on this poll!");
          await refreshSinglePoll(pollId);
          return;
        }
        
        throw new Error(responseData.error || responseData.message || "Failed to vote");
      }

      // Vote successful
      const newUserVotedPolls = new Set(userVotedPolls);
      newUserVotedPolls.add(pollId);
      setUserVotedPolls(newUserVotedPolls);

      alert("Vote cast successfully!");
      
      // Close modal if open
      if (selectedPoll && selectedPoll._id === pollId) {
        setSelectedPoll(null);
      }
      
      // Refresh this poll to show updated vote counts
      await refreshSinglePoll(pollId);
      
    } catch (error) {
      console.error("Error voting:", error);
      alert("Error voting: " + error.message);
    } finally {
      setVotingLoading(false);
    }
  };

  // Refresh single poll after voting
  const refreshSinglePoll = async (pollId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/polls/${pollId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Refreshed poll data:", data);
        
        const updatedPoll = { ...data.poll };
        
        // Update vote counts from backend results
        if (data.results && data.poll.options) {
          updatedPoll.options = data.poll.options.map((option) => ({
            ...option,
            votes: data.results[option.text] || 0
          }));
        }
        
        // Update in polls array
        setPolls(prevPolls => 
          prevPolls.map(poll => 
            poll._id === pollId ? updatedPoll : poll
          )
        );
        
        // Update modal if open
        if (selectedPoll && selectedPoll._id === pollId) {
          setSelectedPoll(updatedPoll);
        }
      }
    } catch (error) {
      console.error("Error refreshing poll:", error);
    }
  };

  const hasUserVoted = (pollId) => {
    return userVotedPolls.has(pollId);
  };

  const getTotalVotes = (poll) => {
    return poll.options.reduce((total, option) => total + (option.votes || 0), 0);
  };

  const getVotePercentage = (option, totalVotes) => {
    return totalVotes > 0 ? ((option.votes || 0) / totalVotes * 100).toFixed(1) : 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategory = (poll) => {
    const title = poll.title.toLowerCase();
    if (title.includes('gender')) return "Demographics";
    if (title.includes('cleanup') || title.includes('neighborhood') || 
        title.includes('community') || title.includes('initiative')) return "Community";
    if (title.includes('date') || title.includes('event')) return "Events";
    if (title.includes('color') || title.includes('style') || title.includes('preference')) return "Lifestyle";
    if (title.includes('transport') || title.includes('travel') || title.includes('commute')) return "Transportation";
    if (title.includes('infrastructure') || title.includes('survey')) return "Infrastructure";
    if (title.includes('frontend') || title.includes('framework')) return "Technology";
    if (title.includes('park') || title.includes('improvement')) return "Environment";
    return "General";
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // Pagination
  const indexOfLastPoll = currentPage * pollsPerPage;
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
  const currentPolls = polls.slice(indexOfFirstPoll, indexOfLastPoll);
  const totalPages = Math.ceil(polls.length / pollsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading active polls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Back Button */}
        <div className={styles.backButtonContainer}>
          <button 
            onClick={handleGoBack} 
            className={styles.backButton}
          >
            ← Back
          </button>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerLeft}>
              <h1 className={styles.mainTitle}>Active Polls Near You</h1>
              <p className={styles.description}>
                Participate in community decisions by voting on active polls. Your voice matters!
              </p>
              <p className={styles.pollCount}>
                Found {polls.length} active polls
              </p>
            </div>
            <div className={styles.headerRight}>
             
            </div>
          </div>
        </div>

        {/* Poll Grid */}
        <div className={styles.pollGrid}>
          {currentPolls.map((poll) => {
            const totalVotes = getTotalVotes(poll);
            const userHasVoted = hasUserVoted(poll._id);
            
            return (
              <div key={poll._id} className={styles.pollCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.categoryBadge}>{getCategory(poll)}</span>
                  <span className={styles.endDate}>
                    🕒 Ends {formatDate(poll.closesOn)}
                  </span>
                </div>

                <h3 className={styles.pollTitle}>{poll.title}</h3>
                
                <p className={styles.pollDescription}>{poll.description}</p>

                {/* Vote Count */}
                <div className={styles.pollStats}>
                  <span className={styles.voteCount}>
                    👥 {totalVotes} votes • {poll.options.length} options
                  </span>
                  {userHasVoted && (
                    <span className={styles.votedBadge}>✓ Voted</span>
                  )}
                </div>

                {/* Show voting buttons for all polls where user hasn't voted */}
                {!userHasVoted && (
                  <div className={styles.voteSection}>
                    <div className={styles.quickVoteLabel}>
                      {totalVotes === 0 ? "Be the first to vote:" : "Cast your vote:"}
                    </div>
                    {poll.options.slice(0, 2).map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleVote(poll._id, index)}
                        disabled={votingLoading}
                        className={styles.voteButton}
                      >
                        <span className={styles.optionText}>{option.text}</span>
                        <span className={styles.voteButtonCount}>{option.votes || 0} votes</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Results Preview - Only show if user has voted */}
                {userHasVoted && (
                  <div className={styles.resultsSection}>
                    <div className={styles.resultsLabel}>Vote Results:</div>
                    {poll.options.map((option, index) => {
                      const percentage = getVotePercentage(option, totalVotes);
                      return (
                        <div key={index} className={styles.resultItem}>
                          <div className={styles.resultHeader}>
                            <span className={styles.resultText}>{option.text}</span>
                            <span className={styles.resultPercentage}>{percentage}%</span>
                          </div>
                          <div className={styles.progressBar}>
                            <div 
                              className={styles.progressFill}
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#f59e0b' : '#ef4444'
                              }}
                            ></div>
                          </div>
                          <div className={styles.voteCount}>
                            {option.votes || 0} votes ({percentage}%)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                  {!userHasVoted ? (
                    <>
                      <button
                        onClick={() => fetchPollDetails(poll._id)}
                        className={styles.detailsButton}
                      >
                        👁️ View Details
                      </button>
                      
                      {poll.options.length > 2 && (
                        <button
                          onClick={() => fetchPollDetails(poll._id)}
                          className={styles.moreOptionsButton}
                        >
                          +{poll.options.length - 2} more options
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => fetchPollDetails(poll._id)}
                      className={styles.detailsButton}
                    >
                      👁️ View Full Results
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`${styles.paginationButton} ${styles.paginationArrow}`}
            >
              ‹
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`${styles.paginationButton} ${
                  page === currentPage ? styles.paginationActive : ""
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`${styles.paginationButton} ${styles.paginationArrow}`}
            >
              ›
            </button>
          </div>
        )}

        {/* Empty State */}
        {polls.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📊</div>
            <h3 className={styles.emptyTitle}>No Active Polls</h3>
            <p className={styles.emptyMessage}>Check back later for new polls to participate in!</p>
          </div>
        )}
      </div>

      {/* Poll Details Modal */}
      {selectedPoll && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleSection}>
                <span className={styles.modalCategoryBadge}>{getCategory(selectedPoll)}</span>
                <h2 className={styles.modalTitle}>{selectedPoll.title}</h2>
              </div>
              <button
                onClick={() => setSelectedPoll(null)}
                className={styles.modalCloseButton}
              >
                ✕
              </button>
            </div>

            <p className={styles.modalDescription}>{selectedPoll.description}</p>

            <div className={styles.modalVoteSection}>
              <h3 className={styles.modalVoteTitle}>
                {hasUserVoted(selectedPoll._id) ? 'Results' : 'Cast Your Vote'}
              </h3>
              
              <div className={styles.modalOptions}>
                {selectedPoll.options.map((option, index) => {
                  const totalVotes = getTotalVotes(selectedPoll);
                  const percentage = getVotePercentage(option, totalVotes);
                  const userHasVoted = hasUserVoted(selectedPoll._id);

                  return (
                    <div key={index} className={styles.modalOption}>
                      {!userHasVoted ? (
                        <button
                          onClick={() => handleVote(selectedPoll._id, index)}
                          disabled={votingLoading}
                          className={styles.modalVoteButton}
                        >
                          <span className={styles.modalOptionText}>{option.text}</span>
                          <span className={styles.modalOptionVotes}>{option.votes || 0} votes</span>
                        </button>
                      ) : (
                        <div className={styles.modalResult}>
                          <div className={styles.modalResultHeader}>
                            <span className={styles.modalResultText}>{option.text}</span>
                            <span className={styles.modalResultStats}>{percentage}% ({option.votes || 0} votes)</span>
                          </div>
                          <div className={styles.modalProgressBar}>
                            <div 
                              className={styles.modalProgressFill}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <span className={styles.modalFooterInfo}>Total votes: {getTotalVotes(selectedPoll)}</span>
              <span className={styles.modalFooterInfo}>Ends: {formatDate(selectedPoll.closesOn)}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PollVotingInterface;