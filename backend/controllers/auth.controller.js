const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to validate email format
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'All fields are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: 'Invalid email format.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters.' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email is already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hash });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token as HTTP-only cookie
    res
      .status(201)
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only https in prod
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000 // 1 hour
      })
      .json({ message: 'Registration successful' });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'All fields are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token as HTTP-only cookie
    res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000 // 1 hour
      })
      .json({ message: 'Login successful' });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.logout = (req, res) => {
  try {
    res
      .clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .status(200)
      .json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user preferences
exports.getPreferences = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ msg: 'Email required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({
      preferences: {
        categories: user.interests || [],
        sources: user.notifications || [],
        country: user.country || 'us',
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update user preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { email, categories, sources, country } = req.body;
    if (!email) return res.status(400).json({ msg: 'Email required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (categories) user.interests = categories;
    if (sources) user.notifications = sources;
    if (country) user.country = country;
    await user.save();
    res.json({ message: 'Preferences updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user bookmarks
exports.getBookmarks = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ msg: 'Email required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ bookmarks: user.bookmarks || [] });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Add or remove a bookmark
exports.toggleBookmark = async (req, res) => {
  try {
    const { email, article } = req.body;
    if (!email || !article) return res.status(400).json({ msg: 'Email and article required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const articleId = article.url || article.title;
    const exists = user.bookmarks.some(b => (b.url || b.title) === articleId);
    if (exists) {
      user.bookmarks = user.bookmarks.filter(b => (b.url || b.title) !== articleId);
    } else {
      user.bookmarks.push(article);
    }
    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
