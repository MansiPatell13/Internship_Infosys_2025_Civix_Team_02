import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './forgot.css';

function Forgot() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleContinueClick = async () => {
    setError("");
    setSuccess("");
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send OTP");
      } else {
        setSuccess("OTP sent to your email");
        // Navigate to OTP verification after a short delay (optional)
        setTimeout(() => {
          navigate('/otpverification', { state: { email } });
        }, 1000);
      }
    } catch (err) {
      setError("Network error. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="forgot-container">
      <div>
        <img src="/logo.png" alt="Logo" style={{ width: '95px', height: '45px', margin: '1rem' }} />
      </div>

      <div className="forgot-left">
        <h2 className="forgot-title">
          <span className="green">Forgot</span> Password
        </h2>
        <p className="forgot-description">
          Please write your email to receive a confirmation code to set a new password
        </p>

        <div className="forgot-form">
          <label htmlFor="email" className="forgot-label">Email :</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your@mail.com"
            className="forgot-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button 
          className="forgot-button" 
          onClick={handleContinueClick}
          disabled={loading}
        >
          {loading ? "Sending..." : "Continue"}
        </button>
      </div>

      <div className="forgot-right">
        <img src="/map.png" alt="Map" />
      </div>
    </div>
  );
}

export default Forgot;
