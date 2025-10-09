import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, Pie, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BASE_URL = 'http://localhost:4000/api';

const COLORS_PETITION = ['#0088FE', '#00C49F', '#FFBB28'];
const COLORS_CATEGORY = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];
const COLORS_POLL = ['#8884d8', '#ff7300'];

const renderPieLabel = ({ name, value, percent }) => {
  if (value > 0) {
    return `${name} (${value})`;
  }
  return '';
};

const ReportDashboard = ({ isInDashboard }) => {
  const [petitionData, setPetitionData] = useState([]);
  const [petitionCategoryData, setPetitionCategoryData] = useState([]);
  const [pollData, setPollData] = useState([]);
  const [petitionStats, setPetitionStats] = useState({
    totalPetitions: 0,
    activePetitions: 0,
    closedPetitions: 0,
  });
  const [pollStats, setPollStats] = useState({
    totalPolls: 0,
    activePolls: 0,
    closedPolls: 0,
  });
  const [userRole, setUserRole] = useState('citizen');
  const [userLocation, setUserLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [reports, setReports] = useState([]);
  const [generatingReport, setGeneratingReport] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const headers = getAuthHeaders();
        const response = await fetch(`${BASE_URL}/dashboard`, { headers });
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user.role);
          setUserLocation(data.user.location);
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    fetchUserInfo();
  }, []);

  // Fetch all reports (for officials)
  const fetchReports = async () => {
    if (userRole !== 'official') return;
    
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/reports?location=${userLocation}`, { headers });
      
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  // Generate a new report (for officials)
  const handleGenerateReport = async () => {
    if (userRole !== 'official' || generatingReport) return;
    
    setGeneratingReport(true);
    setError(null);

    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      };

      // Calculate date range (last 30 days as default)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const response = await fetch(`${BASE_URL}/reports/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: 'monthly',
          location: userLocation,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate report');
      }

      const newReport = await response.json();
      setError('Report generated successfully!');
      setTimeout(() => setError(null), 3000);
      
      // Refresh reports list
      await fetchReports();
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.message || 'Failed to generate report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const fetchPetitionData = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/petitions`, { headers });
      
      if (!response.ok) {
        throw new Error('Failed to fetch petitions');
      }
      
      const allPetitions = await response.json();
      const userId = localStorage.getItem('userId');

      // For graphs: always show all petitions (no filtering)
      const statusCounts = {
        active: 0,
        closed: 0,
        'under-review': 0
      };
      
      const categoryCounts = {};
      
      allPetitions.forEach(petition => {
        const status = petition.status || 'active';
        if (status === 'active' || status === 'pending') {
          statusCounts.active++;
        } else if (status === 'closed' || status === 'completed') {
          statusCounts.closed++;
        } else if (status === 'under-review' || status === 'under_review' || status === 'under review') {
          statusCounts['under-review']++;
        }
        
        const category = petition.category || 'Uncategorized';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      const statusChartData = [
        { name: 'Active', value: statusCounts.active, status: 'Active' },
        { name: 'Closed', value: statusCounts.closed, status: 'Closed' },
        { name: 'Under Review', value: statusCounts['under-review'], status: 'Under Review' },
      ];
      
      setPetitionData(statusChartData);
      
      const categoryChartData = Object.entries(categoryCounts).map(([category, count]) => ({
        name: category,
        value: count,
        category: category
      }));
      
      setPetitionCategoryData(categoryChartData);
      
      // Stats card data - different logic for officials vs citizens
      if (userRole === 'official' && userLocation) {
        // For officials: show location-based stats
        const locationPetitions = allPetitions.filter(p => p.location === userLocation);
        const activeLocationPetitions = locationPetitions.filter(p => 
          p.status === 'active' || p.status === 'pending'
        );
        const closedLocationPetitions = locationPetitions.filter(p => 
          p.status === 'closed' || p.status === 'completed'
        );
        
        setPetitionStats({
          totalPetitions: locationPetitions.length,
          activePetitions: activeLocationPetitions.length,
          closedPetitions: closedLocationPetitions.length,
        });
      } else {
        // For citizens: show their own created petitions
        const userPetitions = allPetitions.filter(p => {
          const creatorId = p.createdBy?._id || p.createdBy || p.ownerId?._id || p.ownerId;
          return creatorId === userId;
        });
        
        const activeUserPetitions = userPetitions.filter(p => 
          p.status === 'active' || p.status === 'pending'
        );
        
        const closedUserPetitions = userPetitions.filter(p => 
          p.status === 'closed' || p.status === 'completed'
        );
        
        setPetitionStats({
          totalPetitions: userPetitions.length,
          activePetitions: activeUserPetitions.length,
          closedPetitions: closedUserPetitions.length,
        });
      }
      
    } catch (err) {
      console.error('Error fetching petition data:', err);
      setPetitionData([
        { name: 'Active', value: 0, status: 'Active' },
        { name: 'Closed', value: 0, status: 'Closed' },
        { name: 'Under Review', value: 0, status: 'Under Review' },
      ]);
      setPetitionCategoryData([]);
    }
  };

  const fetchPollData = async () => {
    try {
      const headers = getAuthHeaders();
      let allPolls = [];
      
      try {
        const response = await fetch(`${BASE_URL}/polls/list?limit=100`, { headers });
        if (response.ok) {
          const data = await response.json();
          allPolls = data.polls || data;
        }
      } catch (e) {
        console.log('List endpoint failed, trying alternative...');
      }
      
      if (allPolls.length === 0) {
        try {
          const response = await fetch(`${BASE_URL}/polls?limit=100`, { headers });
          if (response.ok) {
            const data = await response.json();
            allPolls = Array.isArray(data) ? data : (data.polls || []);
          }
        } catch (e) {
          console.log('Alternative endpoint also failed');
        }
      }
      
      const userId = localStorage.getItem('userId');

      // For graphs: always show all polls (no filtering)
      const today = new Date();
      let activeCount = 0;
      let closedCount = 0;
      
      if (Array.isArray(allPolls)) {
        allPolls.forEach(poll => {
          const closesOn = poll.closesOn || poll.endDate || poll.expiresAt;
          if (!closesOn || new Date(closesOn) >= today) {
            activeCount++;
          } else {
            closedCount++;
          }
        });
      }
      
      const chartData = [
        { name: 'Active', value: activeCount, status: 'Active' },
        { name: 'Closed', value: closedCount, status: 'Closed' },
      ];
      
      setPollData(chartData);
      
      // Stats card data - different logic for officials vs citizens
      if (userRole === 'official' && userLocation) {
        // For officials: show location-based stats
        const locationPolls = allPolls.filter(p => p.target_location === userLocation);
        const activeLocationPolls = locationPolls.filter(p => {
          const closesOn = p.closesOn || p.endDate || p.expiresAt;
          return !closesOn || new Date(closesOn) >= today;
        });
        const closedLocationPolls = locationPolls.filter(p => {
          const closesOn = p.closesOn || p.endDate || p.expiresAt;
          return closesOn && new Date(closesOn) < today;
        });
        
        setPollStats({
          totalPolls: locationPolls.length,
          activePolls: activeLocationPolls.length,
          closedPolls: closedLocationPolls.length,
        });
      } else {
        // For citizens: show their own created polls
        const userPolls = Array.isArray(allPolls) ? allPolls.filter(p => {
          if (!p.createdBy) return false;
          const creatorId = typeof p.createdBy === 'object' 
            ? (p.createdBy?._id || p.createdBy?.toString())
            : p.createdBy;
          return creatorId === userId;
        }) : [];
        
        const activeUserPolls = userPolls.filter(p => {
          const closesOn = p.closesOn || p.endDate || p.expiresAt;
          return !closesOn || new Date(closesOn) >= today;
        });
        const closedUserPolls = userPolls.filter(p => {
          const closesOn = p.closesOn || p.endDate || p.expiresAt;
          return closesOn && new Date(closesOn) < today;
        });
        
        setPollStats({
          totalPolls: userPolls.length,
          activePolls: activeUserPolls.length,
          closedPolls: closedUserPolls.length,
        });
      }
      
    } catch (err) {
      console.error('Error fetching poll data:', err);
      setPollData([
        { name: 'Active', value: 0, status: 'Active' },
        { name: 'Closed', value: 0, status: 'Closed' },
      ]);
    }
  };

  const handleDownload = async (type) => {
    setDownloading(true);
    setError(null);

    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${BASE_URL}/reports/export?type=${type}`, {
        headers,
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `civic_report_${new Date().toISOString().slice(0, 10)}.${type}`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setError(`${type.toUpperCase()} downloaded successfully!`);
      setTimeout(() => setError(null), 3000);

    } catch (err) {
      console.error(`Download failed for ${type}:`, err);
      setError(`Failed to download ${type.toUpperCase()}. Please try again.`);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPetitionData(),
        fetchPollData(),
        fetchReports()
      ]);
      setLoading(false);
    };
    
    if (userRole && (userRole !== 'official' || userLocation)) {
      fetchAllData();
    }
  }, [userRole, userLocation]);

  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading Report Data...
      </div>
    );
  }

  const containerStyle = isInDashboard ? {
    padding: '20px',
    backgroundColor: '#f4f7f9',
    borderRadius: '8px',
    maxWidth: '100%'
  } : {};

  const statsTitle = userRole === 'official' 
    ? `${userLocation} Location Statistics` 
    : 'Your Activity Summary';
  
  const statsDescription = userRole === 'official'
    ? `All petitions and polls in ${userLocation}`
    : 'Statistics for petitions and polls you created';

  return (
    <div className="report-dashboard" style={containerStyle}>
      {/* Stats Summary */}
      <section className="report-section user-section">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}>
          <div>
            <h2>{statsTitle}</h2>
            <p className="summary-note" style={{ marginTop: '5px', color: '#888' }}>
              {statsDescription}
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: '10px',
            paddingTop: '5px',
            flexWrap: 'wrap'
          }}>
            {userRole === 'official' ? (
              // Officials only see Generate Report button
              <button 
                onClick={handleGenerateReport} 
                className="generate-btn"
                disabled={generatingReport}
                style={{ 
                  padding: '8px 15px', 
                  fontSize: '0.9em',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: generatingReport ? 'not-allowed' : 'pointer',
                  opacity: generatingReport ? 0.6 : 1
                }}
              >
                {generatingReport ? 'Generating...' : 'Generate Report 📋'}
              </button>
            ) : (
              // Citizens see download buttons
              <>
                <button 
                  onClick={() => handleDownload('pdf')} 
                  className="export-btn pdf-btn"
                  disabled={downloading}
                  style={{ 
                    padding: '8px 15px', 
                    fontSize: '0.9em',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: downloading ? 'not-allowed' : 'pointer',
                    opacity: downloading ? 0.6 : 1
                  }}
                >
                  {downloading ? 'Downloading...' : 'Download PDF 📄'}
                </button>
                <button 
                  onClick={() => handleDownload('csv')} 
                  className="export-btn csv-btn"
                  disabled={downloading}
                  style={{ 
                    padding: '8px 15px', 
                    fontSize: '0.9em',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: downloading ? 'not-allowed' : 'pointer',
                    opacity: downloading ? 0.6 : 1
                  }}
                >
                  {downloading ? 'Downloading...' : 'Download CSV 📊'}
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div style={{
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '4px',
            backgroundColor: error.includes('success') ? '#d4edda' : '#f8d7da',
            color: error.includes('success') ? '#155724' : '#721c24',
            border: `1px solid ${error.includes('success') ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {error}
          </div>
        )}

        <div className="stat-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div className="stat-card" style={{
            backgroundColor: '#e9ecef',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h4>{userRole === 'official' ? 'Total Petitions' : 'My Total Created Petitions'}</h4>
            <p style={{ fontSize: '2.5em', fontWeight: '600', color: '#007bff' }}>
              {petitionStats.totalPetitions}
            </p>
          </div>
          <div className="stat-card" style={{
            backgroundColor: '#e9ecef',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h4>{userRole === 'official' ? 'Active Petitions' : 'My Active Petitions'}</h4>
            <p style={{ fontSize: '2.5em', fontWeight: '600', color: '#007bff' }}>
              {petitionStats.activePetitions}
            </p>
          </div>
          <div className="stat-card" style={{
            backgroundColor: '#e9ecef',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h4>{userRole === 'official' ? 'Closed Petitions' : 'My Closed Petitions'}</h4>
            <p style={{ fontSize: '2.5em', fontWeight: '600', color: '#007bff' }}>
              {petitionStats.closedPetitions}
            </p>
          </div>
          <div className="stat-card" style={{
            backgroundColor: '#e9ecef',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h4>{userRole === 'official' ? 'Total Polls' : 'My Total Created Polls'}</h4>
            <p style={{ fontSize: '2.5em', fontWeight: '600', color: '#007bff' }}>
              {pollStats.totalPolls}
            </p>
          </div>
        </div>
      </section>

      {/* Generated Reports Section (for officials) */}
      {userRole === 'official' && reports.length > 0 && (
        <>
          <hr style={{ border: 'none', borderTop: '1px dashed #ccc', margin: '40px 0' }} />
          <section className="reports-list-section">
            <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#007bff' }}>
              Generated Reports
            </h2>
            <div style={{ marginTop: '20px' }}>
              {reports.map((report) => (
                <div 
                  key={report._id} 
                  style={{
                    backgroundColor: 'white',
                    padding: '15px',
                    marginBottom: '15px',
                    borderRadius: '6px',
                    border: '1px solid #eee'
                  }}
                >
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{report.title}</h3>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>
                    <strong>Period:</strong> {new Date(report.period.startDate).toLocaleDateString()} - {new Date(report.period.endDate).toLocaleDateString()}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>
                    <strong>Location:</strong> {report.location}
                  </p>
                  <p style={{ margin: '10px 0', color: '#555' }}>{report.summary}</p>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '10px', fontSize: '0.9em', flexWrap: 'wrap' }}>
                    <span><strong>Total Petitions:</strong> {report.metrics.totalPetitions}</span>
                    <span><strong>Active:</strong> {report.metrics.activePetitions}</span>
                    <span><strong>Resolved:</strong> {report.metrics.resolvedPetitions}</span>
                    <span><strong>Total Polls:</strong> {report.metrics.totalPolls}</span>
                    <span><strong>Total Votes:</strong> {report.metrics.totalVotes}</span>
                    {/* <span><strong>Engagement Rate:</strong> {report.metrics.engagementRate}%</span> */}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <hr style={{ border: 'none', borderTop: '1px dashed #ccc', margin: '40px 0' }} />

      {/* Petition Status Overview */}
      <section className="report-section petitions-section">
        <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#007bff' }}>
          System-wide Petition Overview
        </h2>
        <p className="summary-note" style={{ marginTop: '10px', marginBottom: '20px', color: '#888' }}>
          All petitions across the platform
        </p>
        
        <div className="chart-container" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div className="chart-box" style={{
            flex: 1,
            minWidth: '300px',
            padding: '15px',
            border: '1px solid #eee',
            borderRadius: '6px',
            backgroundColor: 'white'
          }}>
            <h3 style={{ textAlign: 'center', color: '#555' }}>Petitions by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={petitionCategoryData}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={renderPieLabel}
                  labelLine={false}
                >
                  {petitionCategoryData.map((entry, index) => (
                    <Cell key={`cell-category-${index}`} fill={COLORS_CATEGORY[index % COLORS_CATEGORY.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box" style={{
            flex: 1,
            minWidth: '300px',
            padding: '15px',
            border: '1px solid #eee',
            borderRadius: '6px',
            backgroundColor: 'white'
          }}>
            <h3 style={{ textAlign: 'center', color: '#555' }}>Petitions by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={petitionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Total Count">
                  {petitionData.map((entry, index) => (
                    <Cell key={`bar-petition-${index}`} fill={COLORS_PETITION[index % COLORS_PETITION.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px dashed #ccc', margin: '40px 0' }} />

      {/* Poll Status Overview */}
      <section className="report-section polls-section">
        <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#007bff' }}>
          System-wide Poll Overview
        </h2>
        <p className="summary-note" style={{ marginTop: '10px', marginBottom: '20px', color: '#888' }}>
          All polls across the platform
        </p>
        <div className="chart-container" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div className="chart-box" style={{
            flex: 1,
            minWidth: '300px',
            padding: '15px',
            border: '1px solid #eee',
            borderRadius: '6px',
            backgroundColor: 'white'
          }}>
            <h3 style={{ textAlign: 'center', color: '#555' }}>Poll Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pollData}
                  dataKey="value"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  label={renderPieLabel}
                  labelLine={false}
                >
                  {pollData.map((entry, index) => (
                    <Cell key={`cell-poll-${index}`} fill={COLORS_POLL[index % COLORS_POLL.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box" style={{
            flex: 1,
            minWidth: '300px',
            padding: '15px',
            border: '1px solid #eee',
            borderRadius: '6px',
            backgroundColor: 'white'
          }}>
            <h3 style={{ textAlign: 'center', color: '#555' }}>Poll Counts</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pollData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Total Count">
                  {pollData.map((entry, index) => (
                    <Cell key={`bar-poll-${index}`} fill={COLORS_POLL[index % COLORS_POLL.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReportDashboard;
// done