const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const debateRoutes = require('./routes/debates');
const userRoutes = require('./routes/users');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB().catch((err) => {
  console.error('MongoDB connection failed:', err.message);
});

const app = express();

// =========================
// CORS — must be FIRST
// =========================
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// =========================
// Body Parsing
// =========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// Health Check
// =========================
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Debate Platform Backend Running', version: 'cors-fix-v3' });
});

// =========================
// API Routes
// =========================
app.use('/api/auth', authRoutes);
app.use('/api/debates', debateRoutes);
app.use('/api/users', userRoutes);

// =========================
// 404 Handler
// =========================
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// =========================
// Error Handler
// =========================
app.use((err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.url} —`, err.message);
  if (errorHandler) return errorHandler(err, req, res, next);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
