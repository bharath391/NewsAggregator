const Notification = require('../models/notification.model');
const User = require('../models/user.model');

// After new article is created
const users = await User.find({}, '_id');
await Notification.create({
  message: `🆕 New article: "${newArticle.title}" has been published!`,
  users: users.map(u => u._id)
});
