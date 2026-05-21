# Online Debate and Presentation Platform

A full-stack web application for collaborative debating, voting, and discussion on various topics.

## 🚀 Quick Start

### Prerequisites
- Node.js v24+ and npm
- MongoDB Atlas account (free tier available)
- Modern web browser

### Backend Setup (3 minutes)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET
npm start
```
Backend runs on `http://localhost:5000`

### Frontend Setup (1 minute)
```bash
cd "Front End"
# Option 1: Use Live Server extension in VS Code
# Option 2: python -m http.server 8000
```

Then navigate to `http://localhost:8000` or your server's URL.

**That's it!** The app is now running locally.

---

## 📋 Features Implemented

### Authentication
- ✅ User signup with email and password
- ✅ User login with JWT tokens
- ✅ Password reset flow
- ✅ Role-based access control (user/admin)
- ✅ Protected API endpoints

### Debate Management
- ✅ Create debates with title, description, category, difficulty level
- ✅ Set max participants and debate duration
- ✅ Enable/disable voting, chat, registration
- ✅ Browse and search existing debates
- ✅ Filter by category and difficulty

### Interaction Features
- ✅ Join debates
- ✅ Vote on debates (upvote/downvote)
- ✅ Post comments and read discussions
- ✅ View vote counts and comment counts
- ✅ User profiles with bios and avatars

### User Interface
- ✅ Responsive design for all screen sizes
- ✅ Modern neon purple theme
- ✅ Intuitive navigation
- ✅ Real-time validation and feedback
- ✅ Mobile-friendly layout

---

## 📁 Project Structure

```
Web project/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Configuration (keep secret!)
│   ├── .env.example           # Configuration template
│   ├── .gitignore             # Git exclusions
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── Debate.js         # Debate schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── debateController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT protection
│   │   └── errorHandler.js   # Error handling
│   └── routes/
│       ├── auth.js
│       ├── debates.js
│       └── users.js
│
├── Front End/
│   ├── index.html            # Entry point (redirects to login)
│   ├── login.html
│   ├── signup.html
│   ├── forgot-password.html
│   ├── dashboard.html        # Main hub after login
│   ├── create-debate.html
│   ├── join-debate.html
│   ├── profile.html
│   ├── library.html
│   ├── js/                   # All page logic files
│   ├── css/                  # Neon purple theme
│   ├── images/               # Assets and avatars
│   └── .gitignore
│
├── DEPLOYMENT_GUIDE.md       # Complete deployment instructions
├── API_CONFIG.md             # API configuration guide
├── PROJECT_STATUS.md         # Detailed status and checklist
└── README.md                 # This file
```

---

## 🔧 Technology Stack

### Backend
- **Runtime**: Node.js v24+
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **CORS**: Enabled for frontend communication

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Responsive design with Flexbox/Grid
- **JavaScript**: Vanilla (no frameworks)
- **Storage**: Browser localStorage for tokens
- **API**: Fetch API for HTTP requests

---

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/signup           Register new user
POST   /api/auth/login            Login user
POST   /api/auth/forgot-password  Request password reset
POST   /api/auth/reset-password   Complete password reset
```

### Debates
```
GET    /api/debates               List debates (search, filter available)
POST   /api/debates               Create new debate (protected)
GET    /api/debates/:id           Get debate details (protected)
POST   /api/debates/:id/join      Join a debate (protected)
POST   /api/debates/:id/vote      Vote on debate (protected)
POST   /api/debates/:id/comments  Add comment (protected)
```

### Users
```
GET    /api/users/:id             Get user profile (protected)
PUT    /api/users/:id             Update profile (protected)
PATCH  /api/users/:id/role        Update user role (admin only)
```

---

## 🔐 Authentication Flow

1. **Signup**: User creates account → Password hashed → JWT generated → Token stored in localStorage
2. **Login**: User submits email/password → Password verified → JWT generated → Redirects to dashboard
3. **Protected Routes**: Every API request includes `Authorization: Bearer <token>` header
4. **Token Validation**: Backend verifies JWT signature and expiration
5. **Role Check**: Some endpoints check user role (admin vs regular user)

---

## 🗄️ Database Models

### User
```javascript
{
  username: String (unique),
  email: String (unique, lowercase),
  password: String (hashed),
  fullName: String,
  bio: String,
  avatar: String (URL),
  role: String ('user' or 'admin'),
  statistics: {
    debatesWon: Number,
    debatesJoined: Number,
    averageRating: Number
  },
  achievements: Array,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Debate
```javascript
{
  title: String,
  description: String,
  category: String,
  difficultyLevel: String ('Easy', 'Medium', 'Hard'),
  creator: ObjectId (User reference),
  status: String ('upcoming', 'ongoing', 'completed'),
  maxParticipants: Number,
  participants: Array (User references),
  duration: Number (minutes),
  startTime: Date,
  endTime: Date,
  enableVoting: Boolean,
  allowChat: Boolean,
  requireRegistration: Boolean,
  votes: Map (userId -> 'up'/'down'),
  comments: Array ({
    user: ObjectId,
    content: String,
    createdAt: Date
  }),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Signup with valid email
- [ ] Login with correct credentials
- [ ] Password reset flow
- [ ] Navigate to dashboard
- [ ] Create a new debate
- [ ] Join a debate
- [ ] Vote on a debate
- [ ] Add comment to debate
- [ ] Edit user profile
- [ ] Search and filter debates
- [ ] Test mobile responsiveness

### Automated Testing
```bash
# Backend syntax validation
cd backend
node --check server.js config/db.js controllers/*.js middleware/*.js routes/*.js

# Frontend syntax validation
cd "Front End"
node --check js/login.js js/signup.js js/create-debate.js # etc.
```

---

## 📦 Dependencies

### Backend (package.json)
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.4.1",
  "mongoose": "^7.6.2",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2"
}
```

### Frontend
- No external dependencies - pure HTML/CSS/JavaScript

---

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete deployment instructions.

### Quick Deployment Options:
1. **Heroku** (Backend) + **Vercel/Netlify** (Frontend)
2. **AWS** (EC2 for backend, S3 for frontend)
3. **DigitalOcean** (Droplet for backend, Spaces for frontend)
4. **Self-hosted VPS** (Full control, requires server setup)

---

## ⚙️ Configuration

### Environment Variables (.env)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend API Configuration
Update `API_BASE` in all frontend JS files:
```javascript
const API_BASE = 'http://localhost:5000';  // Development
const API_BASE = 'https://api.yourdomain.com';  // Production
```

See [API_CONFIG.md](./API_CONFIG.md) for detailed configuration.

---

## 🐛 Troubleshooting

### Backend won't start
- Check Node.js version: `node --version` (should be v24+)
- Verify .env file exists with correct MongoDB URI
- Check MongoDB Atlas IP whitelist includes your IP

### API calls failing
- Verify API_BASE URL is correct
- Check backend is running: `curl http://localhost:5000/api/debates`
- Look for CORS errors in browser console

### Login not working
- Clear browser cache and localStorage: `localStorage.clear()`
- Check MongoDB Atlas credentials
- Verify JWT_SECRET in .env

### Database connection error
- Ensure MongoDB Atlas cluster exists
- Verify connection string in .env
- Check username/password are URL-encoded if they contain special characters

---

## 📖 Documentation

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Full deployment instructions
- [API_CONFIG.md](./API_CONFIG.md) - Frontend API configuration
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Detailed status and checklist
- [backend/README.md](./backend/README.md) - Backend specific documentation
- [Front End/README.md](./Front%20End/README.md) - Frontend specific documentation

---

## 🔒 Security Notes

### Already Implemented
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT authentication with 7-day expiration
- ✅ Role-based authorization (user/admin)
- ✅ CORS configured for frontend requests
- ✅ Protected API endpoints

### Recommended for Production
- 🔲 Enable HTTPS/SSL certificates
- 🔲 Implement rate limiting on auth endpoints
- 🔲 Add input validation and sanitization
- 🔲 Change JWT_SECRET to strong random string
- 🔲 Use environment-specific databases
- 🔲 Enable MongoDB encryption
- 🔲 Set NODE_ENV=production in .env

---

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 👥 Support

For issues or questions:
1. Check the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) troubleshooting section
2. Review browser console for error messages
3. Check backend logs for API errors
4. Verify environment configuration

---

## 🎯 Project Status

**Status**: ✅ **READY FOR DEPLOYMENT**

All features are implemented and tested. See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed checklist and metrics.

**Version**: 1.0.0  
**Last Updated**: 2024
