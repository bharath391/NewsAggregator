const express = require('express');
const router = express.Router();
const { register, login, logout, getPreferences, updatePreferences, getBookmarks, toggleBookmark } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/preferences', getPreferences);
router.post('/preferences', updatePreferences);
router.get('/bookmarks', getBookmarks);
router.post('/bookmarks/toggle', toggleBookmark);

module.exports = router;
