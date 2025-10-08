import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);

  // Decode JWT token function
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Check token validity
  const isTokenValid = (token) => {
    const decoded = decodeToken(token);
    if (!decoded) return false;
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return false;
    return true;
  };

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLoginClick = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);

        const decodedToken = decodeToken(data.token);

        if (decodedToken) {
          const userObject = {
            id: decodedToken.sub || decodedToken.id,
            _id: decodedToken.sub || decodedToken.id,
            email: decodedToken.email,
            role: decodedToken.role,
            userType: decodedToken.role,
          };
          localStorage.setItem('userId', userObject.id);
          localStorage.setItem('user', JSON.stringify(userObject));
        }

        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError(data.message || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="login">
      {loading && (
        <div className="full-screen-loader">
          <div className="spinner"></div>
          <p>Logging in, please wait...</p>
        </div>
      )}

      {!loading && (
        <>
          <div>
            <img
              src="/logo.png"
              style={{ width: '95px', height: '45px', margin: '1rem' }}
              alt="Logo"
            />
          </div>

          <div className="login1">
            <h2 className="heading">
              <span className="green">Welcome</span> Back!
            </h2>
            <p className="para">Join our platform to make your voice heard</p>

            <div className="but">
              <Link
                to="/login"
                className={`b ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`b ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </Link>
            </div>

            <div className="container">
              <div className="field">
                <label htmlFor="email" className="content">
                  Email :
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="your@mail.com"
                  className="content1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="password" className="content">
                  Password :
                </label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="********"
                    className="content1 password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.89 10.89 0 0112 19c-5 0-9.27-3.11-11-7a10.91 10.91 0 012.54-4.32M1 1l22 22" />
                        <path d="M9.88 9.88a3 3 0 104.24 4.24" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="r field">
                
                <Link to="/forgot" style={{ marginLeft: '10rem' }} className="r1">
                  Forgot Password?
                </Link>
              </div>

              {error && (
                <p
                  style={{
                    color: 'red',
                    marginTop: '1rem',
                    textAlign: 'center',
                    fontWeight: '600',
                    width: '100%',
                  }}
                >
                  {error}
                </p>
              )}

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button className="but3" onClick={handleLoginClick}>
                  Login
                </button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p>
                  Don't have an account?{' '}
                  <Link to="/signup" className="r1">
                    Register Here
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="login1 h">
            <img src="/map.png" alt="Map" className="img" />
          </div>
        </>
      )}
    </div>
  );
}

export default Login;