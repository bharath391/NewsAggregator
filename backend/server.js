// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error.middleware');

// Route files
const newsRouter = require('./routes/news.route');
const authRouter = require('./routes/auth.route');
const notificationRouter = require('./routes/notification.route'); // ✅ added

// Connect to database
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Console log the requests - easy debugging
app.use((req, res, next) => {
  console.log(`🔍 Request: ${req.method} ${req.url}`);
  next();
});

// Route setup
app.use('/api/news', newsRouter);
app.use('/api/auth', authRouter);
app.use('/api/notifications', notificationRouter); // ✅ added

// Global error handler (keep this last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));