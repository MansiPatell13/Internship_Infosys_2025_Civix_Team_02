
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';

function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState('signup');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    registration: 'citizen',
  });

  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({ ...prev, registration: e.target.value }));
  };

  const handleSignupClick = async () => {
    setError('');
    const { name, email, password, location, registration } = formData;

    if (!name || !email || !password || !location) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/register-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, location, role: registration }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailForVerification(email);
        setStep('verify');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next box
    if (value && index < 3) {
      otpRefs[index + 1].current.focus();
    }

    // Auto focus previous on delete
    if (!value && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleVerifyClick = async () => {
    setError('');
    const fullOtp = otp.join('');
    if (fullOtp.length !== 4) {
      setError('Please enter a valid 4-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailForVerification, otp: fullOtp }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate('/login');
        }, 2500);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailForVerification }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('New OTP sent to your email');
      } else {
        setError(data.message || 'Could not resend OTP');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div>
        <img src="/logo.png" alt="Logo" style={{ width: '95px', height: '45px', margin: '1rem' }} />
      </div>

      <div className="signup-content">
        {step === 'signup' && (
          <>
            <h2 className="signup-heading">
              <span className="highlight-green">Welcome</span> Back!
            </h2>
            <p className="signup-subtitle">Join our platform to make your voice heard</p>

            <div className="tab-switcher">
              <Link to="/login" className="b">Login</Link>
              <Link to="/signup" className="b active">Sign Up</Link>
            </div>

            <div className="form-wrapper">
              <div className="form-field">
                <label htmlFor="name" className="label-text">Full Name :</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  className="input-box"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="email" className="label-text">Email :</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="your@mail.com"
                  className="input-box"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="password" className="label-text">Password :</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="********"
                    className="input-box password-input"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                        <path d="M17.94 17.94A10.89 10.89 0 0112 19c-5 0-9.27-3.11-11-7a10.91 10.91 0 012.54-4.32M1 1l22 22" />
                        <path d="M9.88 9.88a3 3 0 104.24 4.24" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="location" className="label-text">Location :</label>
                <input
                  type="search"
                  id="location"
                  name="location"
                  placeholder="search"
                  className="input-box"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field radio-group">
                <p>
                  I am registering as{' '}
                  <label>
                    <input
                      type="radio"
                      name="registration"
                      value="citizen"
                      checked={formData.registration === 'citizen'}
                      onChange={handleRadioChange}
                    /> Citizen
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="registration"
                      value="official"
                      checked={formData.registration === 'official'}
                      onChange={handleRadioChange}
                    /> Public Official
                  </label>
                </p>
              </div>

              {error && <p className="error-text">{error}</p>}

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button className="submit-btn" onClick={handleSignupClick} disabled={loading}>
                  {loading ? 'Processing...' : 'Sign Up'}
                </button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p>Already have an account? <Link to="/login" className="login-link">Login</Link></p>
              </div>
            </div>
          </>
        )}

        {step === 'verify' && (
          <>
            <h2 className="signup-heading">
              <span className="highlight-green">Verify</span> Your Email
            </h2>
            <p className="signup-subtitle">
              We sent a 4-digit verification code to <strong>{emailForVerification}</strong>. Please enter it below.
            </p>

            <div className="form-wrapper otp-verification">
              <div className="form-field">
                <label className="label-text">Enter OTP:</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      className="input-box otp-input"
                      value={digit}
                      ref={otpRefs[idx]}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                          otpRefs[idx - 1].current.focus();
                        }
                      }}
                    />
                  ))}
                </div>
              </div>

              {error && <p className="error-text">{error}</p>}

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button className="submit-btn" onClick={handleVerifyClick} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p>
                  Didn't receive the code?{' '}
                  <button className="resend-btn" onClick={handleResendOtp} disabled={loading}>
                    Resend OTP
                  </button>
                </p>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button className="cancel-btn" onClick={() => setStep('signup')} disabled={loading}>
                  Cancel & Go Back
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="signup-content image-section">
        <img src="/map.png" alt="Map" className="signup-image" />
      </div>

      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-content popup-success">
            <svg
              className="popup-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4caf50"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="60"
              height="60"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <h3>Verification Successful!</h3>
            <p>You will be redirected to login shortly.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
