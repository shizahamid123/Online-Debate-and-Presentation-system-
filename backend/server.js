const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

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
  'https://online-debate-and-presentation-system-production-8b5c.up.railway.app/api/auth/login',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204 // Gracefully handles preflight OPTIONS requests status
}));

// =========================
// Body Parsing Middleware
// =========================
app.use(cors(allowedOrigins));
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
// 404 Fallback Route
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =========================
// Global Error Handler
// =========================

app.use((err, req, res, next) => {
  // The 'cors' package handles headers automatically, even during errors.
  // We log the error here for clean Railway debugging logs.
  console.error(`[Error Handler] ${req.method} ${req.url} —`, err.message);

  // Delegate to your custom error middleware if it exists
  if (errorHandler) {
    return errorHandler(err, req, res, next);
  }

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