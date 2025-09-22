import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './otpverification.css';

function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromState = location.state?.email || '';
  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const enteredOtp = otp.join('');

  const handleContinueClick = async () => {
    setError('');

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    if (enteredOtp.length < 4) {
      setError('Please enter the complete 4-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: enteredOtp }),
      });

      const data = await response.json();

      if (response.ok && data.sessionId) {
        // OTP verified successfully
        navigate('/resetpassword', {
          state: { sessionId: data.sessionId, email },
        });
      } else {
        setError(data.message || 'Invalid or expired OTP');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <div>
        <img src="/logo.png" alt="Logo" style={{ width: '95px', height: '45px', margin: '1rem' }} />
      </div>

      <div className="otp-left">
        <h2 className="otp-heading">
          <span className="green">Verify</span> email address
        </h2>
        <p className="otp-instructions">
          Enter the 4 digit code that you received on your email
        </p>

        {!emailFromState && (
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@mail.com"
              style={{ padding: '0.5rem', marginBottom: '1rem', width: '100%' }}
            />
          </div>
        )}

        <div className="otp-inputs">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              maxLength="1"
              className="otp-box"
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                  document.getElementById(`otp-${idx - 1}`)?.focus();
                }
              }}
              inputMode="numeric"
              pattern="\d*"
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

        <button className="otp-button" onClick={handleContinueClick} disabled={loading}>
          {loading ? 'Verifying...' : 'Continue'}
        </button>
      </div>

      <div className="otp-right">
        <img src="/map.png" alt="Map" />
      </div>
    </div>
  );
}

export default OtpVerification;
