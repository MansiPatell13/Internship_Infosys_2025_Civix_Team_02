import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../components/Auth/AuthContext';
import PollList from '../components/poll/PollList';
import PollCreation from '../components/poll/PollCreation';
import styles from '../pages/PollPage.module.css';
import { useNavigate } from 'react-router-dom';

const PollsPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  // Handle authentication redirect in useEffect
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handlePollCreated = () => {
    setShowCreatePoll(false);
    setRefreshKey(prev => prev + 1);
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting (useEffect will handle navigation)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {showCreatePoll ? (
          <div className={styles.createPollSection}>
            <div className={styles.createPollHeader}>
              <button 
                onClick={() => setShowCreatePoll(false)}
                className={styles.backToPollsBtn}
              >
                ← Back to Polls
              </button>
            </div>
            <PollCreation 
              onSuccess={handlePollCreated}
              isInDashboard={false}
            />
          </div>
        ) : (
          <>
            <div className={styles.pollsHeader}>
              <div className={styles.headerContent}>
                <div className={styles.welcomeSection}>
                  <h1>Welcome, {user?.name || 'User'}!</h1>
                  <p>Explore community polls and make your voice heard</p>
                </div>
                
                {/* {user?.role === 'citizen' && (
                  // <button 
                  //   onClick={() => setShowCreatePoll(true)}
                  //   className={styles.createPollBtn}
                  // >
                  //   <FaPlus /> Create New Poll
                  // </button>
                )} */}
              </div>
              
              {user?.role !== 'citizen' && (
                <div className={styles.roleInfo}>
                  <p>
                    You are logged in as a <strong>{user?.role}</strong>. 
                    Only citizens can create polls, but you can view and monitor all polls.
                  </p>
                </div>
              )}
            </div>
            
            <PollList key={refreshKey} />
          </>
        )}
      </div>
    </div>
  );
};

export default PollsPage;