import React from 'react';
import { useNavigate } from 'react-router-dom';
import './otpverification.css';

function OtpVerification() {
  const navigate = useNavigate();

  const handleContinueClick = () => {
    navigate('/resetpassword');
  };

  return (
    <div className="otp-container">
      <div>
        <img src='/logo.png' alt="Logo" style={{ width: '95px', height: '45px', margin: '1rem' }} />
      </div>

      <div className="otp-left">
        <h2 className="otp-heading">
          <span className="green">Verify</span> email address
        </h2>
        <p className="otp-instructions">
          Enter the 4 digit code that you received on your email
        </p>

        <div className="otp-inputs">
          <input type="text" maxLength="1" className="otp-box" />
          <input type="text" maxLength="1" className="otp-box" />
          <input type="text" maxLength="1" className="otp-box" />
          <input type="text" maxLength="1" className="otp-box" />
        </div>

        <button className="otp-button" onClick={handleContinueClick}>
          Continue
        </button>
      </div>

      <div className="otp-right">
        <img src="/map.png" alt="Map" />
      </div>
    </div>
  );
}

export default OtpVerification;
