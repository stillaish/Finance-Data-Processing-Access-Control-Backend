const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const recordRoutes = require('./src/routes/recordRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

// Load environment variables
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined');
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI must be defined');
}

// Connect to Database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Logging middleware only in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Basic Route for health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// Mount Routes

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middlewares (must be after all routes)
app.use(notFound);
app.use(errorHandler);

// Setup Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
