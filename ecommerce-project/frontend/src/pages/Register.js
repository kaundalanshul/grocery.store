import React, { useMemo, useState } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({ theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isFormValid = useMemo(() => {
    return form.name.trim() &&
      form.email.trim() &&
      form.password.trim() &&
      form.confirmPassword.trim() &&
      form.password === form.confirmPassword &&
      form.password.length >= 6;
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/users/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setSuccess('Registration successful! Redirecting to login...');
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('authUser', JSON.stringify(response.data.user));
      window.dispatchEvent(new Event('auth-change'));
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Registration failed. Please try again.');
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
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join us and start shopping today.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
          />

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
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button type="submit" className="auth-submit" disabled={loading || !isFormValid}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
        <Link className="auth-back-link" to="/">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default Register;
