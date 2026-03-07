// Main Backend Server File
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Ecommerce API' });
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend Server running on http://localhost:${PORT}`);
});