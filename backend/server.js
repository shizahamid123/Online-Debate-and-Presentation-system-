const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const debateRoutes = require('./routes/debates');
const userRoutes = require('./routes/users');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect MongoDB — wrapped so a DB failure doesn't crash the server
connectDB().catch((err) => {
  console.error('MongoDB connection failed:', err.message);
  // Server keeps running; DB-dependent routes will fail gracefully
});

const app = express();

// =========================
// CORS Configuration
// =========================

const allowedOrigins = [
  'https://online-debate-and-presentation-syst-five.vercel.app',
  'http://localhost:5173',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn('CORS blocked origin:', origin);
    return callback(new Error(`CORS: origin "${origin}" not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};


app.options('*', cors(corsOptions));

// Apply CORS to all subsequent requests
app.use(cors(corsOptions));

// =========================
// Body Parsing Middleware
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// Health Check Route
// =========================

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Debate Platform Backend Running',
  });
});

// =========================
// API Routes
// =========================

app.use('/api/auth', authRoutes);
app.use('/api/debates', debateRoutes);
app.use('/api/users', userRoutes);

// =========================


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =========================
// FIX 3: Global Error Handler

app.use((err, req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  // Delegate to your custom error handler if it exists
  if (errorHandler) {
    return errorHandler(err, req, res, next);
  }

  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// =========================
// Start Server
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});