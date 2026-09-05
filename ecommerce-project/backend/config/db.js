const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed:', error.message);
    console.log('🚀 Running in development mode without persistent DB');
  }
};

module.exports = connectDB;