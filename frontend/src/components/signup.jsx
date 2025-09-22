import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    registration: 'citizen', // default selected
  });

  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle radio buttons separately
  const handleRadioChange = (e) => {
    setFormData(prev => ({ ...prev, registration: e.target.value }));
  };

  // Submit form to backend signup API
  const handleSignupClick = async () => {
    setError('');
    const { name, email, password, location, registration } = formData;

    if (!name || !email || !password || !location) {
      setError('Please fill all fields');
      return;
    }

    try {
      // Map registration to role for backend
      const bodyToSend = { name, email, password, location, role: registration };

      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyToSend),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div className='signup-wrapper'>
      <div>
        <img src='/logo.png' alt='Logo' style={{ width: '95px', height: '45px', margin: '1rem' }} />
      </div>

      <div className='signup-content'>
        <h2 className='signup-heading'><span className='highlight-green'>Welcome</span> Back!</h2>
        <p className='signup-subtitle'>Join our platform to make your voice heard</p>

        <div className='tab-switcher'>
          <Link to="/login" className='tab-link'>Login</Link>
          <Link to="/signup" className='tab-link'>Sign Up</Link>
        </div>

        <div className='form-wrapper'>
          <div className='form-field'>
            <label htmlFor="name" className='label-text'>Full Name :</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder='John Doe'
              className='input-box'
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className='form-field'>
            <label htmlFor="email" className='label-text'>Email :</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder='your@mail.com'
              className='input-box'
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className='form-field'>
            <label htmlFor="password" className='label-text'>Password :</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='********'
              className='input-box'
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className='form-field'>
            <label htmlFor="location" className='label-text'>Location :</label>
            <input
              type="search"
              id="location"
              name="location"
              placeholder='search'
              className='input-box'
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className='form-field radio-group'>
            <p>I am registering as
              <label>
                <input
                  type='radio'
                  name="registration"
                  value="citizen"
                  checked={formData.registration === 'citizen'}
                  onChange={handleRadioChange}
                /> Citizen
              </label>
              <label>
                <input
                  type='radio'
                  name="registration"
                  value="official"
                  checked={formData.registration === 'official'}
                  onChange={handleRadioChange}
                /> Public Official
              </label>
            </p>
          </div>
        </div>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

        <div>
          <button className='submit-btn' onClick={handleSignupClick}>Sign Up</button>
        </div>

        <div>
          <p>Already have an account? <Link to="/login" className='login-link'>Login</Link></p>
        </div>
      </div>

      <div className='signup-content image-section'>
        <img src='/map.png' alt="Map" className='signup-image' />
      </div>
    </div>
  );
}

export default Signup;
