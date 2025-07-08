const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error.middleware');

// Load routers
const newsRouter = require('./routes/news.route');
const authRouter = require('./routes/auth.route');
const notificationRouter = require('./routes/notification.route');

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// API routes
app.use('/api/news', newsRouter);
app.use('/api/auth', authRouter);
app.use('/api/notifications', notificationRouter);

// Serve React static files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// ✅ Only serve frontend for non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
