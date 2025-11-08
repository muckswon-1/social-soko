import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import './login.css';

import {login} from '../../features/auth/authThunk'
import { useDispatch, useSelector } from 'react-redux';
import { authErrorSelector, authLoadingSelector } from '../../features/auth/authSlice';



const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  //const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loading = useSelector(authLoadingSelector);
  const dispatch = useDispatch();




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      //const result = await login(formData.email, formData.password);
      const result = await dispatch(login({email: formData.email, password: formData.password})).unwrap();
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
     setError(err.error);
      console.error('Login error:', err);
    } 
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
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
            autoComplete="current-password"
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="auth-form-footer">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>

          <p>
            Forgot password? <Link to="/forgot-password">Reset password</Link>
            </p>
        </div>
      </form>
    </div>
  );
};

export default Login;