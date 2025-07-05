const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // target users
});

module.exports = mongoose.model('Notification', notificationSchema);
