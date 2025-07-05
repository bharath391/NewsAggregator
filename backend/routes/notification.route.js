const express = require('express');
const router = express.Router();
const { createNotification, getUserNotifications } = require('../controllers/notifications.controllers');
const auth = require('../middlewares/auth'); // assumes you have JWT middleware

// Admin or server logic can call this
router.post('/create', createNotification);

// Authenticated users can see their notifications
router.get('/my', auth, getUserNotifications);

module.exports = router;
