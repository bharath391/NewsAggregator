// backend/server.js
const express = require('express');
const dotenv = require('dotenv');

const cors = require('cors');
const connectDB = require('./config/db');
dotenv.config();
const errorHandler = require('./middlewares/error.middleware');
const newsRouter = require('./routes/news.route');


// connectDB();


const app = express();
app.use(express.json());
app.use(cors());

//Routes
// app.use('/api/auth', userRouter);
app.use('/api/news', newsRouter);
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/bookmarks', require('./routes/bookmarkRoutes'));
// app.use('/api/notifications', require('./routes/notificationRoutes'));

// Error Handler
// app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
