const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const debateRoutes = require('./routes/debates');
const userRoutes = require('./routes/users');
const User = require('./models/User');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: 'https://online-debate-and-presentation-syst-five.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
    credentials: true
}));
app.options('*', cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/debates', debateRoutes);
app.use('/api/users', userRoutes);

// ADD USER ROUTE
app.post('/add-user', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, and password are required' });
    }

    const newUser = new User({
      username: name,
      fullName: name,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User Added Successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'debate-platform-backend' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
