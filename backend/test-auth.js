// Simple test to verify authentication setup
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Mock authentication endpoints
app.post('/api/auth/register', (req, res) => {
  const { email, password, role } = req.body;
  console.log('Register request:', { email, role });
  
  // Simulate API delay
  setTimeout(() => {
    res.json({
      message: 'User registered successfully',
      token: 'mock-jwt-token-for-testing',
      user: { id: '1', email, role }
    });
  }, 500);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', { email });
  
  // Simulate API delay
  setTimeout(() => {
    res.json({
      message: 'Login successful',
      token: 'mock-jwt-token-for-testing',
      user: { id: '1', email, role: 'customer' }
    });
  }, 500);
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});