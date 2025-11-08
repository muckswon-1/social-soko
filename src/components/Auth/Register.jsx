import React, { useState } from 'react';
import { register } from '../../features/auth/authThunk';
import { Link, useNavigate } from 'react-router';
import './register.css';
import { useDispatch, useSelector } from 'react-redux';
import { authLoadingSelector } from '../../features/auth/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loading = useSelector(authLoadingSelector);
  const dispatch = useDispatch();
  
  
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
   
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
     
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
  
      return;
    }

    try {
      const result = await dispatch(register({email: formData.email, password: formData.password, role: formData.role})).unwrap();

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