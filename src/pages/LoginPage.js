import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../actions/authActions';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    } else {
      document.body.classList.add('login-body');
    }

    return () => {
      document.body.classList.remove('login-body');
    };
  }, [navigate, userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-info-section">
        <div className="login-info-content">
          <div className="login-logo">
            <svg width="64" height="64" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="28" fill="#fff"/>
              <path d="M18 29.5L25 36.5L38 23.5" stroke="#007bff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className=" wow-login-title">Automated Project ID Tool</h1>
          <p className="wow-login-tagline">Streamline your project setup with our intuitive tool. Generate project IDs, manage configurations, and get started in minutes.</p>
        </div>
      </div>
      <div className="login-form-section">
        <form className="login-form wow-login-form" onSubmit={handleSubmit}>
          <h2 className="login-form-title">Member Login</h2>
          <p className="login-form-info">Enter your credentials to access your account.</p>
          <div className="form-group">
            {/* <i className="fas fa-user"></i> */}
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            {/* <i className="fas fa-lock" ></i> */}
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn wow-login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
