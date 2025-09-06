import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!username || !password) {
      setError(t('login.validation.required', 'Please enter both username and password'));
      return;
    }
    
    // Simulate login API call
    // In a real application, you would make an API call here
    if (username === 'admin' && password === 'password') {
      // Save token to localStorage (simulated)
      localStorage.setItem('authToken', 'fake-jwt-token');
      navigate('/dashboard');
    } else {
      setError(t('login.validation.invalid', 'Invalid username or password'));
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h2>{t('login.title')}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">{t('login.username')}</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('login.username')}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('login.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.password')}
            />
          </div>
          
          <button type="submit">{t('login.submit')}</button>
        </form>
        
        <div className="login-links">
          <a href="#forgot">{t('login.forgotPassword')}</a>
          <a href="#register">{t('login.register')}</a>
        </div>
      </div>
    </div>
  );
};

export default Login;