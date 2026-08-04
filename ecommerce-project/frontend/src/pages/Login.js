import React, { useMemo, useState } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = useMemo(() => {
    return form.email.trim() && form.password.trim();
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/users/login', {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('authUser', JSON.stringify(response.data.user));
      navigate('/');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Floating theme toggle button */}
      <button
        onClick={onToggleTheme}
        title="Toggle dark/light theme"
        style={{
          position: 'fixed', top: '20px', right: '20px',
          width: '44px', height: '44px', borderRadius: '50%',
          border: '2px solid var(--border)',
          background: 'var(--bg-white)',
          fontSize: '20px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--card-shadow)', zIndex: 1000,
          transition: 'all 0.2s ease',
        }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <div className="auth-card">
        <h1>Sign In</h1>
        <p className="auth-subtitle">Welcome back. Enter your account details.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading || !isFormValid}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
        <Link className="auth-back-link" to="/">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default Login;