import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginClick = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div className='login'>
      <div>
        <img src='/logo.png' style={{ width: '95px', height: '45px', margin: '1rem' }} />
      </div>
      <div className='login1'>
        <h2 className='heading'><span className='green'>Welcome</span> Back!</h2>
        <p className='para'>Join our platform to make your voice heard</p>

        <div className='but'>
          <Link to="/login" className='b'>Login</Link>
          <Link to="/signup" className='b'>Sign Up</Link>
        </div>

        <button className='but1'>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            style={{ width: '20px', height: '20px' }}
          />
          Login with Google
        </button>

        <div className='h'>
          <hr /><span>OR</span><hr />
        </div>

        <div className='container'>
          <div className='field'>
            <label htmlFor="email" className='content'>Email :</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder='your@mail.com'
              className='content1'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='field'>
            <label htmlFor="password" className='content'>Password :</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='********'
              className='content1'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className='r field'>
            <input type="checkbox" id="rememberme" name="rememberme" />
            <label htmlFor="rememberme">Remember Me</label>
            <Link to="/forgot" style={{ marginLeft: '2rem' }} className='r1'>Forgot Password?</Link>
          </div>
        </div>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

        <div style={{textAlign:"center"}}>
          <button className='but3' onClick={handleLoginClick}>Login</button>
        </div>

        <div >
          <p style={{textAlign:"center"}}>Don't have an account? <Link to="/signup" className='r1'>Register Here</Link></p>
        </div>
      </div>

      <div className='login1 h'>
        <img src='/map.png' alt="Map" className='img' />
      </div>
    </div>
  );
}

export default Login;
