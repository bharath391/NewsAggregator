// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');

const connectDB = require('./config/db');
dotenv.config();
const errorHandler = require('./middlewares/error.middleware');
const newsRouter = require('./routes/news.route');


// connectDB();

// Route files
const newsRouter = require('./routes/news.route');
const authRouter = require('./routes/auth.route'); // <-- Add this route file when you create it


connectDB(); // Make sure DB connection is active


const app = express();
app.use(express.json());
app.use(cors());


// Routes
app.use('/api/news', newsRouter);
app.use('/api/auth', authRouter); // <-- Register/login/logout

// Global error handler (keep this last)
app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
