import React from "react";
import { useNavigate } from 'react-router-dom';
import './forgot.css';

function Forgot() {
  const navigate = useNavigate();

  const handleContinueClick = () => {
    navigate('/otpverification');
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
            type="text"
            id="email"
            name="email"
            placeholder="your@mail.com"
            className="forgot-input"
          />
        </div>

        <button className="forgot-button" onClick={handleContinueClick}>
          Continue
        </button>
      </div>

      <div className="forgot-right">
        <img src="/map.png" alt="Map" />
      </div>
    </div>
  );
}

export default Forgot;
