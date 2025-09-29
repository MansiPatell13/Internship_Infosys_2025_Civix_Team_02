import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock, FaUsers, FaSearch, FaFilter } from 'react-icons/fa';
import { MdOutlinePoll } from 'react-icons/md';
import { useAuth } from '../Auth/AuthContext';
import { pollAPI } from '../../utils/api';
import PollDetail from './PollDetail';
import styles from './PollList.module.css';

const PollList = () => {
  const { user } = useAuth(); // user contains info like role, id, etc.
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPoll, setSelectedPoll] = useState(null);

  const [filters, setFilters] = useState({
    location: '',
    createdBy: '',
    page: 1,
    limit: 12
  });

  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError('');

      const params = { ...filters };
      if (searchTerm.trim()) {
        params.location = searchTerm.trim();
      }

      const response = await pollAPI.getList(params);
      setPolls(response.polls || []);
      setTotalCount(response.totalCount || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch polls');
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
    fetchPolls();
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalCount / filters.limit);
  const startItem = (filters.page - 1) * filters.limit + 1;
  const endItem = Math.min(filters.page * filters.limit, totalCount);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Closed';
    if (diffDays === 0) return 'Closes today';
    if (diffDays === 1) return 'Closes tomorrow';
    return `${diffDays} days left`;
  };

  const isPollClosed = (closesOn) => {
    return new Date(closesOn) < new Date();
  };

  if (selectedPoll) {
    return (
      <PollDetail
        pollId={selectedPoll}
        onBack={() => setSelectedPoll(null)}
        onVoteSuccess={fetchPolls}
        canVote={user?.role === 'user'} // Only users can vote
      />
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            <MdOutlinePoll className={styles.titleIcon} />
            Community Polls
          </h1>
          <p className={styles.subtitle}>
            {user?.role === 'official'
              ? 'As an official, you can view all community polls.'
              : 'Participate in community decisions and see what others think.'}
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{totalCount}</span>
            <span className={styles.statLabel}>Total Polls</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className={styles.controlsSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchInputGroup}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search polls by location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </div>
        </form>

        <div className={styles.filterSection}>
          <button className={styles.filterToggle} onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> Filters
          </button>

          {showFilters && (
            <div className={styles.filterPanel}>
              <div className={styles.filterGroup}>
                <label>Show polls by:</label>
                <select
                  value={filters.createdBy}
                  onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="">All</option>
                  <option value={user?.id || user?._id}>My Polls Only</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Results per page:</label>
                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                  className={styles.filterSelect}
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Poll Cards */}
      {!loading && polls.length > 0 && (
        <div className={styles.pollsGrid}>
          {polls.map((poll) => (
            <div
              key={poll._id}
              className={`${styles.pollCard} ${isPollClosed(poll.closesOn) ? styles.closedPoll : ''}`}
              onClick={() => setSelectedPoll(poll._id)}
            >
              <div className={styles.pollHeader}>
                <h3 className={styles.pollTitle}>{poll.title}</h3>
                <span className={`${styles.statusBadge} ${isPollClosed(poll.closesOn) ? styles.closedBadge : styles.activeBadge}`}>
                  {isPollClosed(poll.closesOn) ? 'Closed' : 'Active'}
                </span>
              </div>

              <p className={styles.pollDescription}>
                {poll.description.length > 150 ? `${poll.description.substring(0, 150)}...` : poll.description}
              </p>

              <div className={styles.pollOptions}>
                <p className={styles.optionsLabel}>Options:</p>
                <div className={styles.optionsList}>
                  {poll.options.slice(0, 3).map((opt, idx) => (
                    <span key={idx} className={styles.optionTag}>{opt.text}</span>
                  ))}
                  {poll.options.length > 3 && (
                    <span className={styles.moreOptions}>+{poll.options.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className={styles.pollMeta}>
                <div className={styles.metaItem}>
                  <FaUsers className={styles.metaIcon} />
                  <span>{poll.options.reduce((acc, opt) => acc + (opt.votes || 0), 0)} votes</span>
                </div>
                {poll.targetLocation && (
                  <div className={styles.metaItem}>
                    <FaMapMarkerAlt className={styles.metaIcon} />
                    <span>{poll.targetLocation}</span>
                  </div>
                )}
                <div className={styles.metaItem}>
                  <FaClock className={styles.metaIcon} />
                  <span className={isPollClosed(poll.closesOn) ? styles.closedText : styles.activeText}>
                    {formatDate(poll.closesOn)}
                  </span>
                </div>
              </div>

              <div className={styles.pollFooter}>
                <span>By: {poll.createdBy?.name || 'Unknown'}</span>
                <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && polls.length === 0 && !error && (
        <div className={styles.emptyState}>
          <MdOutlinePoll className={styles.emptyIcon} />
          <h3>No polls found</h3>
          <p>
            {searchTerm
              ? `No polls found matching "${searchTerm}". Try a different search term.`
              : 'No polls are available at the moment. Be the first to create one!'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && polls.length > 0 && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className={styles.pageButton}
          >
            Previous
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum = filters.page <= 3
              ? i + 1
              : filters.page >= totalPages - 2
              ? totalPages - 4 + i
              : filters.page - 2 + i;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`${styles.pageButton} ${filters.page === pageNum ? styles.activePage : ''}`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === totalPages}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PollList;
