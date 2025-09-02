import React from 'react';
import { useNavigate } from 'react-router-dom';
import './resetpassword.css';

function ResetPassword() {
  const navigate = useNavigate();

  const handleResetClick = () => {
    navigate('/login');
  };

  return (
    <div className="reset-container">
      <div>
        <img src="/logo.png" alt="Logo" className="reset-logo" />
      </div>

      {/* Left Side */}
      <div className="reset-left">
        <h2 className="reset-heading">
          <span className="black-bold">Reset</span> <span className="green">Password</span>
        </h2>
        <p className="reset-instructions">Enter and confirm your new password</p>

        <div className="reset-form">
          <div className="reset-field">
            <label htmlFor="newPassword" className="reset-label">Enter New Password</label>
            <input type="password" id="newPassword" className="reset-input" placeholder="********" />
          </div>

          <div className="reset-field">
            <label htmlFor="confirmPassword" className="reset-label">Confirm Password</label>
            <input type="password" id="confirmPassword" className="reset-input" placeholder="********" />
          </div>

          <button className="reset-button" onClick={handleResetClick}>
            Reset Password
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="reset-right">
        <img src="/map.png" alt="Map" />
      </div>
    </div>
  );
}

export default ResetPassword;
