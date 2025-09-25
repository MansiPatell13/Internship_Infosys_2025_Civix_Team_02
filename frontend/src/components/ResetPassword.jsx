import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './resetpassword.css';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const { sessionId, email } = location.state || {};

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetClick = async () => {
    setError('');

    if (!sessionId) {
      setError('Session expired or invalid. Please verify OTP again.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login on success
        navigate('/login');
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div>
        <img src="/logo.png" alt="Logo" className="reset-logo" />
      </div>

      <div className="reset-left">
        <h2 className="reset-heading">
          <span className="black-bold">Reset</span> <span className="green">Password</span>
        </h2>
        <p className="reset-instructions">Enter and confirm your new password</p>

        <div className="reset-form">
          <div className="reset-field">
            <label htmlFor="newPassword" className="reset-label">Enter New Password</label>
            <input
              type="password"
              id="newPassword"
              className="reset-input"
              placeholder="********"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="reset-field">
            <label htmlFor="confirmPassword" className="reset-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="reset-input"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

          <button
            className="reset-button"
            onClick={handleResetClick}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      </div>

      <div className="reset-right">
        <img src="/map.png" alt="Map" />
      </div>
    </div>
  );
}

export default ResetPassword;
