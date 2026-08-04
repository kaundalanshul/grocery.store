const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URL || process.env.MONGODB_URI;

  try {
    if (!mongoUri) {
      throw new Error('Missing MONGODB_URL/MONGODB_URI');
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed:', error.message);

    // In production, don't use in-memory DB — require a real connection
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Cannot use in-memory DB in production. Please set a valid MONGODB_URL or MONGODB_URI env var.');
      process.exit(1);
    }

    console.log('🚀 Running in development mode with in-memory DB fallback');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      global.isInMemoryDB = true;
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      await mongoose.connect(mongoUri);
      console.log('✅ In-memory MongoDB connected successfully!');

      // Auto-seed sample products
      const Product = require('../models/Product');
      const count = await Product.countDocuments();
      if (count === 0) {
        const { sampleProducts } = require('../utils/seedProducts');
        await Product.insertMany(sampleProducts);
        console.log(`✅ Auto-seeded ${sampleProducts.length} products to in-memory DB`);
      }
    } catch (inMemErr) {
      console.error('❌ Failed to start in-memory MongoDB:', inMemErr.message);
    }
  }
};

module.exports = connectDB;
