const Notification = require('../models/notification.model');
const User = require('../models/user.model'); // Assumes this exists for your auth system

// Create a notification for all users
exports.createNotification = async (req, res) => {
  try {
    const users = await User.find({}, '_id'); // Get all user IDs
    const notification = new Notification({
      message: req.body.message,
      users: users.map(u => u._id),
    });
    await notification.save();
    res.status(201).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get notifications for the logged-in user
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user; // From JWT auth middleware
    const notifications = await Notification.find({ users: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

