// Main Backend Server File
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

connectDB();

const app = express();

// CORS — allow local dev + production Render frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'http://localhost:5001',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl)
    // In development, allow all localhost origins
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isLocalhost = origin && origin.includes('localhost');
    
    if (!origin || allowedOrigins.includes(origin) || (isDevelopment && isLocalhost)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed.`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Ecommerce API', status: 'ok' });
});

// User Routes
app.use('/api/users', require('./routes/userRoutes'));

// Product Routes
app.use('/api/products', require('./routes/productRoutes'));

// Order Routes
app.use('/api/orders', require('./routes/orderRoutes'));

// Payment Routes
app.use('/api/payments', require('./routes/paymentRoutes'));

// Admin Routes
app.use('/api/admin', require('./routes/adminRoutes'));

// Chatbot Routes
app.use('/api/chatbot', require('./routes/chatbotRoutes'));

// Recommendation Routes
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

// Order Tracking Routes
app.use('/api/tracking', require('./routes/trackingRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});
