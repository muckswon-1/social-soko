import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router';
import './register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData.email, formData.password, formData.role);
      if (result.success) {
        setSuccessMessage(result.message || 'Registration successful! Please login.');

        // some delay to display success message
        setTimeout(() => {
          navigate('/login');
        }, 2000);

      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        
        {error && <div className="error-message">{error}</div>}

        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="customer">Customer</option>
            <option value="business">Business Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        
        <div className="auth-form-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Register;