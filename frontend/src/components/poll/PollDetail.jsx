// import React, { useState, useEffect } from 'react';
// import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaUsers, FaVoteYea, FaCheckCircle } from 'react-icons/fa';
// import { MdOutlinePoll } from 'react-icons/md';
// import { useAuth } from '../Auth/AuthContext';
// import { pollAPI } from '../../utils/api';
// import styles from './PollDetail.module.css';

// const PollDetail = ({ pollId, onBack, onVoteSuccess }) => {
//   const { user } = useAuth();
//   const [poll, setPoll] = useState(null);
//   const [results, setResults] = useState({});
//   const [totalVotes, setTotalVotes] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [voting, setVoting] = useState(false);
//   const [voteError, setVoteError] = useState('');
//   const [hasVoted, setHasVoted] = useState(false);
//   const [userVote, setUserVote] = useState(null);

//   // Fetch poll details
//   const fetchPollDetails = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const response = await pollAPI.getById(pollId);
//       const pollData = response.poll || response;
//       setPoll(pollData);
      
//       // Calculate results and total votes
//       const calculatedResults = {};
//       let total = 0;
      
//       if (pollData.options && Array.isArray(pollData.options)) {
//         pollData.options.forEach(option => {
//           const voteCount = option.votes || 0;
//           calculatedResults[option.text] = voteCount;
//           total += voteCount;
//         });
//       }
      
//       setResults(calculatedResults);
//       setTotalVotes(total);
      
//       // Check vote status
//       const userHasVoted = response.hasVoted === true || 
//                           response.userVoted === true ||
//                           response.voted === true ||
//                           (response.userVote !== undefined && response.userVote !== null) ||
//                           pollData.hasVoted === true ||
//                           pollData.userVoted === true ||
//                           pollData.voted === true ||
//                           (pollData.userVote !== undefined && pollData.userVote !== null);
      
//       if (userHasVoted) {
//         setHasVoted(true);
//         const voteIndex = response.userVote ?? 
//                          response.userVoteIndex ?? 
//                          response.voteIndex ??
//                          pollData.userVote ?? 
//                          pollData.userVoteIndex ??
//                          pollData.voteIndex;
//         setUserVote(voteIndex !== undefined ? voteIndex : null);
//       } else {
//         setHasVoted(false);
//         setUserVote(null);
//       }
      
//     } catch (err) {
//       setError(err.message || 'Failed to fetch poll details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (pollId) {
//       fetchPollDetails();
//     }
//   }, [pollId]);

//   // Handle vote submission
//   const handleVote = async () => {
//     if (selectedOption === null) {
//       setVoteError("Please select an option before voting.");
//       return;
//     }
    
//     if (hasVoted) {
//       setVoteError("You have already voted on this poll.");
//       return;
//     }
    
//     setVoting(true);
//     setVoteError('');
    
//     try {
//       await pollAPI.vote(pollId, selectedOption.toString());
      
//       setHasVoted(true);
//       setUserVote(selectedOption);
      
//       await fetchPollDetails();
      
//       if (onVoteSuccess) {
//         onVoteSuccess();
//       }
      
//     } catch (err) {
//       const errorMessage = err.message || "Failed to submit vote.";
      
//       if (errorMessage.toLowerCase().includes('already voted')) {
//         setHasVoted(true);
//         await fetchPollDetails();
//         setVoteError("You have already voted on this poll.");
//       } else {
//         setVoteError(errorMessage);
//       }
//     } finally {
//       setVoting(false);
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = date - now;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays < 0) {
//       return 'Closed';
//     } else if (diffDays === 0) {
//       return 'Closes today';
//     } else if (diffDays === 1) {
//       return 'Closes tomorrow';
//     } else {
//       return `${diffDays} days left`;
//     }
//   };

//   const isPollClosed = (closesOn) => {
//     return new Date(closesOn) < new Date();
//   };

//   const getVotePercentage = (optionText) => {
//     if (totalVotes === 0) return 0;
//     const votes = results[optionText] || 0;
//     return Math.round((votes / totalVotes) * 100);
//   };

//   const getVoteCount = (optionText) => {
//     return results[optionText] || 0;
//   };

//   const isUserVotedOption = (index) => {
//     return userVote !== null && userVote === index;
//   };

//   if (loading) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.loading}>
//           <div className={styles.loadingSpinner}></div>
//           <p>Loading poll details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.errorMessage}>
//           <p>{error}</p>
//           <div className={styles.errorActions}>
//             <button onClick={fetchPollDetails} className={styles.retryButton}>
//               Try Again
//             </button>
//             <button onClick={onBack} className={styles.backButton}>
//               Back to Polls
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!poll) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.errorMessage}>
//           <p>Poll not found</p>
//           <button onClick={onBack} className={styles.backButton}>
//             Back to Polls
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const isExpired = isPollClosed(poll.closesOn);
//   const canVote = user?.role === 'citizen' && !isExpired && !hasVoted;

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <button onClick={onBack} className={styles.backBtn}>
//           <FaArrowLeft /> Back to Polls
//         </button>
        
//         <div className={styles.pollStatus}>
//           <span className={`${styles.statusBadge} ${
//             isExpired ? styles.closedBadge : styles.activeBadge
//           }`}>
//             {isExpired ? 'Closed' : 'Active'}
//           </span>
//         </div>
//       </div>

//       <div className={styles.pollCard}>
//         <div className={styles.pollHeader}>
//           <div className={styles.titleSection}>
//             <h1 className={styles.pollTitle}>
//               <MdOutlinePoll className={styles.titleIcon} />
//               {poll.title}
//             </h1>
            
//             <div className={styles.pollMeta}>
//               <div className={styles.metaItem}>
//                 <FaUsers className={styles.metaIcon} />
//                 <span>{totalVotes} votes</span>
//               </div>
              
//               {poll.targetLocation && (
//                 <div className={styles.metaItem}>
//                   <FaMapMarkerAlt className={styles.metaIcon} />
//                   <span>{poll.targetLocation}</span>
//                 </div>
//               )}
              
//               <div className={styles.metaItem}>
//                 <FaClock className={styles.metaIcon} />
//                 <span className={isExpired ? styles.closedText : styles.activeText}>
//                   {formatDate(poll.closesOn)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className={styles.pollDescription}>
//           <h3>About this poll:</h3>
//           <p>{poll.description}</p>
//         </div>

//         <div className={styles.pollContent}>
//           <div className={styles.votingSection}>
//             <h3>
//               {canVote ? 'Cast your vote:' : 
//                hasVoted ? 'Your vote has been recorded' :
//                isExpired ? 'Poll results:' : 
//                'Poll options:'}
//             </h3>
            
//             {hasVoted && (
//               <div className={styles.voteConfirmation}>
//                 <FaCheckCircle className={styles.checkIcon} />
//                 <span>Thank you for voting!</span>
//               </div>
//             )}
            
//             <div className={styles.optionsList}>
//               {poll.options.map((option, index) => {
//                 const voteCount = getVoteCount(option.text);
//                 const percentage = getVotePercentage(option.text);
//                 const isSelected = selectedOption === index;
//                 const isUserChoice = isUserVotedOption(index);
                
//                 return (
//                   <div 
//                     key={index} 
//                     className={`${styles.optionItem} ${
//                       canVote ? styles.votable : styles.readonly
//                     } ${isSelected ? styles.selected : ''} ${
//                       isUserChoice ? styles.userVoted : ''
//                     }`}
//                     onClick={canVote ? () => setSelectedOption(index) : undefined}
//                   >
//                     <div className={styles.optionContent}>
//                       {canVote && (
//                         <input
//                           type="radio"
//                           name="pollOption"
//                           value={index}
//                           checked={isSelected}
//                           onChange={() => setSelectedOption(index)}
//                           className={styles.radioInput}
//                         />
//                       )}
                      
//                       <div className={styles.optionText}>
//                         <span className={styles.optionLabel}>
//                           {option.text}
//                           {isUserChoice && hasVoted && (
//                             <span className={styles.userVoteIndicator}> ✓ Your vote</span>
//                           )}
//                         </span>
//                         {!canVote && (
//                           <div className={styles.voteStats}>
//                             <span className={styles.voteCount}>
//                               {voteCount} vote{voteCount !== 1 ? 's' : ''}
//                             </span>
//                             <span className={styles.percentage}>
//                               ({percentage}%)
//                             </span>
//                           </div>
//                         )}
//                       </div>
                      
//                       {!canVote && (
//                         <div className={styles.progressBar}>
//                           <div 
//                             className={styles.progressFill}
//                             style={{ width: `${percentage}%` }}
//                           ></div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
            
//             {canVote && (
//   <div className={styles.voteActions}>
//     {voteError && !hasVoted && (   // only show error if not already voted
//       <div className={styles.voteError}>
//         <p>{voteError}</p>
//       </div>
//     )}

//     <button 
//       onClick={handleVote}
//       disabled={voting || selectedOption === null || hasVoted} // disable after vote
//       className={styles.voteButton}
//     >
//       {voting ? (
//         <>
//           <div className={styles.buttonSpinner}></div>
//           Submitting...
//         </>
//       ) : (
//         <>
//           <FaVoteYea />
//           {hasVoted ? "Vote Submitted" : "Submit Vote"}   {/* update button text */}
//         </>
//       )}
//     </button>
//   </div>
// )}

            
//             {user?.role !== 'citizen' && !isExpired && (
//               <div className={styles.infoMessage}>
//                 <p>Only citizens can vote on polls. You are registered as: {user?.role}</p>
//               </div>
//             )}
//           </div>
          
//           {totalVotes > 0 && (
//             <div className={styles.resultsSection}>
//               <h3>Results Summary</h3>
//               <div className={styles.totalVotes}>
//                 <FaUsers className={styles.totalVotesIcon} />
//                 <span>{totalVotes} total vote{totalVotes !== 1 ? 's' : ''}</span>
//               </div>
              
//               <div className={styles.resultsList}>
//                 {poll.options
//                   .map((option, index) => ({
//                     ...option,
//                     votes: getVoteCount(option.text),
//                     percentage: getVotePercentage(option.text),
//                     index,
//                     isUserChoice: isUserVotedOption(index)
//                   }))
//                   .sort((a, b) => b.votes - a.votes)
//                   .map((option, rank) => (
//                     <div key={option.index} className={`${styles.resultItem} ${
//                       option.isUserChoice ? styles.userChoiceResult : ''
//                     }`}>
//                       <div className={styles.resultHeader}>
//                         <span className={styles.rankBadge}>#{rank + 1}</span>
//                         <span className={styles.resultText}>
//                           {option.text}
//                           {option.isUserChoice && hasVoted && (
//                             <span className={styles.userVoteIndicator}> (Your choice)</span>
//                           )}
//                         </span>
//                         <span className={styles.resultStats}>
//                           {option.votes} votes ({option.percentage}%)
//                         </span>
//                       </div>
//                       <div className={styles.resultBar}>
//                         <div 
//                           className={`${styles.resultFill} ${
//                             option.isUserChoice ? styles.userChoiceFill : ''
//                           }`}
//                           style={{ width: `${option.percentage}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   ))
//                 }
//               </div>
//             </div>
//           )}
//         </div>
        
//         <div className={styles.pollFooter}>
//           <div className={styles.creatorSection}>
//             <h4>Poll Creator</h4>
//             <div className={styles.creatorInfo}>
//               <span className={styles.creatorName}>
//                 {poll.createdBy?.name || 'Anonymous'}
//               </span>
//               <span className={styles.creatorRole}>
//                 ({poll.createdBy?.role || 'unknown'})
//               </span>
//             </div>
//           </div>
          
//           <div className={styles.dateSection}>
//             <div className={styles.dateInfo}>
//               <span>Created: {new Date(poll.createdAt).toLocaleDateString()}</span>
//               <span>Closes: {new Date(poll.closesOn).toLocaleDateString()}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PollDetail;


import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaUsers, FaVoteYea, FaCheckCircle } from 'react-icons/fa';
import { MdOutlinePoll } from 'react-icons/md';
import { useAuth } from '../Auth/AuthContext';
import { pollAPI } from '../../utils/api';
import styles from './PollDetail.module.css';

const PollDetail = ({ pollId, onBack, onVoteSuccess }) => {
  const { user } = useAuth();
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [voting, setVoting] = useState(false);
  const [voteError, setVoteError] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);

  // Fetch poll details
  const fetchPollDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await pollAPI.getById(pollId);
      const pollData = response.poll || response;
      setPoll(pollData);
      
      // Calculate results and total votes from poll options
      const calculatedResults = {};
      let total = 0;
      
      if (pollData.options && Array.isArray(pollData.options)) {
        pollData.options.forEach(option => {
          const voteCount = option.votes || 0;
          calculatedResults[option.text] = voteCount;
          total += voteCount;
        });
      }
      
      setResults(calculatedResults);
      setTotalVotes(total);
      
      // Check if user has already voted (from backend response if available)
      const userHasVoted = response.hasVoted === true || 
                          response.userVoted === true ||
                          response.voted === true ||
                          (response.userVote !== undefined && response.userVote !== null);
      
      if (userHasVoted) {
        setHasVoted(true);
        const voteIndex = response.userVote ?? response.userVoteIndex ?? response.voteIndex;
        setUserVote(voteIndex !== undefined ? voteIndex : null);
      } else {
        setHasVoted(false);
        setUserVote(null);
      }
      
    } catch (err) {
      console.error('Error fetching poll:', err);
      setError(err.message || 'Failed to fetch poll details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pollId) {
      fetchPollDetails();
    }
  }, [pollId]);

  // Handle vote submission
  const handleVote = async () => {
    if (selectedOption === null) {
      setVoteError("Please select an option before voting.");
      return;
    }
    
    // Check if user is a citizen
    if (user?.role !== 'citizen') {
      setVoteError("Only citizens can vote on polls.");
      return;
    }
    
    if (hasVoted) {
      setVoteError("You have already voted on this poll.");
      return;
    }
    
    setVoting(true);
    setVoteError('');
    
    try {
      await pollAPI.vote(pollId, selectedOption.toString());
      
      // Update local state immediately
      setHasVoted(true);
      setUserVote(selectedOption);
      
      // Refetch poll data to get updated results from server
      await fetchPollDetails();
      
      if (onVoteSuccess) {
        onVoteSuccess();
      }
      
    } catch (err) {
      console.error('Vote error:', err);
      
      const errorMessage = err.message || "Failed to submit vote.";
      
      if (errorMessage.toLowerCase().includes('already voted')) {
        setHasVoted(true);
        await fetchPollDetails();
        setVoteError("You have already voted on this poll.");
      } else {
        setVoteError(errorMessage);
      }
    } finally {
      setVoting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Closed';
    } else if (diffDays === 0) {
      return 'Closes today';
    } else if (diffDays === 1) {
      return 'Closes tomorrow';
    } else {
      return `${diffDays} days left`;
    }
  };

  const isPollClosed = (closesOn) => {
    return new Date(closesOn) < new Date();
  };

  const getVotePercentage = (optionText) => {
    if (totalVotes === 0) return 0;
    const votes = results[optionText] || 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const getVoteCount = (optionText) => {
    return results[optionText] || 0;
  };

  const isUserVotedOption = (index) => {
    return userVote !== null && userVote === index;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading poll details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <div className={styles.errorActions}>
            <button onClick={fetchPollDetails} className={styles.retryButton}>
              Try Again
            </button>
            <button onClick={onBack} className={styles.backButton}>
              Back to Polls
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          <p>Poll not found</p>
          <button onClick={onBack} className={styles.backButton}>
            Back to Polls
          </button>
        </div>
      </div>
    );
  }

  const isExpired = isPollClosed(poll.closesOn);
  const canVote = user?.role === 'citizen' && !isExpired && !hasVoted;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backBtn}>
          <FaArrowLeft /> Back to Polls
        </button>
        
        <div className={styles.pollStatus}>
          <span className={`${styles.statusBadge} ${
            isExpired ? styles.closedBadge : styles.activeBadge
          }`}>
            {isExpired ? 'Closed' : 'Active'}
          </span>
        </div>
      </div>

      <div className={styles.pollCard}>
        <div className={styles.pollHeader}>
          <div className={styles.titleSection}>
            <h1 className={styles.pollTitle}>
              <MdOutlinePoll className={styles.titleIcon} />
              {poll.title}
            </h1>
            
            <div className={styles.pollMeta}>
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
              
              <div className={styles.metaItem}>
                <FaClock className={styles.metaIcon} />
                <span className={isExpired ? styles.closedText : styles.activeText}>
                  {formatDate(poll.closesOn)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.pollDescription}>
          <h3>About this poll:</h3>
          <p>{poll.description}</p>
        </div>

        <div className={styles.pollContent}>
          <div className={styles.votingSection}>
            <h3>
              {canVote ? 'Cast your vote:' : 
               hasVoted ? 'Your vote has been recorded' :
               isExpired ? 'Poll results:' : 
               'Poll options:'}
            </h3>
            
            {hasVoted && user?.role === 'citizen' && (
              <div className={styles.voteConfirmation}>
                <FaCheckCircle className={styles.checkIcon} />
                <span>Thank you for voting!</span>
              </div>
            )}
            
            <div className={styles.optionsList}>
              {poll.options.map((option, index) => {
                const voteCount = getVoteCount(option.text);
                const percentage = getVotePercentage(option.text);
                const isSelected = selectedOption === index;
                const isUserChoice = isUserVotedOption(index);
                
                return (
                  <div 
                    key={index} 
                    className={`${styles.optionItem} ${
                      canVote ? styles.votable : styles.readonly
                    } ${isSelected ? styles.selected : ''} ${
                      isUserChoice ? styles.userVoted : ''
                    }`}
                    onClick={canVote ? () => setSelectedOption(index) : undefined}
                  >
                    <div className={styles.optionContent}>
                      {canVote && (
                        <input
                          type="radio"
                          name="pollOption"
                          value={index}
                          checked={isSelected}
                          onChange={() => setSelectedOption(index)}
                          className={styles.radioInput}
                        />
                      )}
                      
                      <div className={styles.optionText}>
                        <span className={styles.optionLabel}>
                          {option.text}
                          {isUserChoice && hasVoted && (
                            <span className={styles.userVoteIndicator}> ✓ Your vote</span>
                          )}
                        </span>
                        {!canVote && (
                          <div className={styles.voteStats}>
                            <span className={styles.voteCount}>
                              {voteCount} vote{voteCount !== 1 ? 's' : ''}
                            </span>
                            <span className={styles.percentage}>
                              ({percentage}%)
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {!canVote && (
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {canVote && (
              <div className={styles.voteActions}>
                {voteError && (
                  <div className={styles.voteError}>
                    <p>{voteError}</p>
                  </div>
                )}
                
                <button 
                  onClick={handleVote}
                  disabled={voting || selectedOption === null}
                  className={styles.voteButton}
                >
                  {voting ? (
                    <>
                      <div className={styles.buttonSpinner}></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaVoteYea />
                      Submit Vote
                    </>
                  )}
                </button>
              </div>
            )}
            
            {user?.role !== 'citizen' && !isExpired && (
              <div className={styles.infoMessage}>
                <p>Only citizens can vote on polls. You can view results as an {user?.role}.</p>
              </div>
            )}
          </div>
          
          {totalVotes > 0 && (
            <div className={styles.resultsSection}>
              <h3>Results Summary</h3>
              <div className={styles.totalVotes}>
                <FaUsers className={styles.totalVotesIcon} />
                <span>{totalVotes} total vote{totalVotes !== 1 ? 's' : ''}</span>
              </div>
              
              <div className={styles.resultsList}>
                {poll.options
                  .map((option, index) => ({
                    ...option,
                    votes: getVoteCount(option.text),
                    percentage: getVotePercentage(option.text),
                    index,
                    isUserChoice: isUserVotedOption(index)
                  }))
                  .sort((a, b) => b.votes - a.votes)
                  .map((option, rank) => (
                    <div key={option.index} className={`${styles.resultItem} ${
                      option.isUserChoice ? styles.userChoiceResult : ''
                    }`}>
                      <div className={styles.resultHeader}>
                        <span className={styles.rankBadge}>#{rank + 1}</span>
                        <span className={styles.resultText}>
                          {option.text}
                          {option.isUserChoice && hasVoted && (
                            <span className={styles.userVoteIndicator}> (Your choice)</span>
                          )}
                        </span>
                        <span className={styles.resultStats}>
                          {option.votes} votes ({option.percentage}%)
                        </span>
                      </div>
                      <div className={styles.resultBar}>
                        <div 
                          className={`${styles.resultFill} ${
                            option.isUserChoice ? styles.userChoiceFill : ''
                          }`}
                          style={{ width: `${option.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.pollFooter}>
          <div className={styles.creatorSection}>
            <h4>Poll Creator</h4>
            <div className={styles.creatorInfo}>
              <span className={styles.creatorName}>
                {poll.createdBy?.name || 'Anonymous'}
              </span>
              <span className={styles.creatorRole}>
                ({poll.createdBy?.role || 'unknown'})
              </span>
            </div>
          </div>
          
          <div className={styles.dateSection}>
            <div className={styles.dateInfo}>
              <span>Created: {new Date(poll.createdAt).toLocaleDateString()}</span>
              <span>Closes: {new Date(poll.closesOn).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollDetail;