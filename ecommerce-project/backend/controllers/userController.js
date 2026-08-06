const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const mockData = require('../utils/mockData');

const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      return res.status(201).json({
        message: 'Registration successful.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    } else {
      const existingUser = mockData.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = mockData.addUser({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      return res.status(201).json({
        message: 'Registration successful.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    let user;
    if (isMongoConnected()) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = mockData.findUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed.', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    let user;
    if (isMongoConnected()) {
      user = await User.findById(req.user.id).select('-password');
      if (!user && global.isInMemoryDB) {
        // Auto-create user in the in-memory database to prevent token invalidation on db restart
        const hashedPassword = await bcrypt.hash('password123', 10);
        const newUserObj = await User.create({
          _id: req.user.id,
          name: 'anshul',
          email: 'anshul@example.com',
          password: hashedPassword,
        });
        user = newUserObj.toObject();
        delete user.password;
      }
    } else {
      user = mockData.findUserById(req.user.id);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        user = userWithoutPassword;
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch profile.', error: error.message });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    if (isMongoConnected()) {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const index = user.wishlist.indexOf(productId);
      if (index > -1) {
        user.wishlist.splice(index, 1);
      } else {
        user.wishlist.push(productId);
      }

      await user.save();
      return res.status(200).json({ wishlist: user.wishlist });
    } else {
      const user = mockData.findUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const index = user.wishlist.indexOf(productId);
      if (index > -1) {
        user.wishlist.splice(index, 1);
      } else {
        user.wishlist.push(productId);
      }

      return res.status(200).json({ wishlist: user.wishlist });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update wishlist.', error: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    let user;
    if (isMongoConnected()) {
      user = await User.findById(req.user.id).populate('wishlist');
    } else {
      user = mockData.findUserById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const wishlist = isMongoConnected()
      ? (user.wishlist || [])
      : (user.wishlist || []).map((id) => mockData.findProductById(id)).filter(Boolean);
    return res.status(200).json({ wishlist });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch wishlist.', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  toggleWishlist,
  getWishlist,
};