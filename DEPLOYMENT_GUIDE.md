# Deployment Guide - Online Debate and Presentation Platform

## Overview
This is a full-stack web application with a Node.js/Express backend and vanilla JavaScript frontend, using MongoDB Atlas for data persistence.

## System Requirements

### Backend
- **Node.js**: v24.0.0 or higher
- **npm**: 10.0.0 or higher
- **MongoDB Atlas**: Free or paid cluster (requires internet connection for cloud database)

### Frontend
- **Browser**: Any modern browser (Chrome, Firefox, Safari, Edge)
- **Static Server**: Apache, Nginx, or any HTTP server (or use VS Code Live Server extension)

## Pre-Deployment Checklist

### 1. Backend Setup

#### Step 1: Install Dependencies
```bash
cd backend
npm install
```

Expected output: All packages installed successfully (bcryptjs, cors, dotenv, express, jsonwebtoken, mongoose)

#### Step 2: Configure Environment Variables
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your actual values
```

Required variables in `.env`:
- `MONGO_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A strong random secret (min 32 characters for production)
- `PORT`: Server port (default 5000)
- `JWT_EXPIRES_IN`: Token expiration (default 7d)

#### Step 3: Verify MongoDB Connection
```bash
node server.js
```

Expected output:
```
Using public DNS servers for SRV resolution
Server running on port 5000
MongoDB connected successfully
```

If you see connection errors, check:
- MongoDB Atlas IP whitelist includes your IP
- `MONGO_URI` is correct in .env
- Username and password in URI have no special characters (or are URL-encoded)

### 2. Frontend Setup

No installation needed - it's pure HTML/CSS/JavaScript. However, you need to:

#### Step 1: Verify API Configuration
Check the `API_BASE` variable in all JavaScript files. Currently hardcoded to `http://localhost:5000`

For production, update the API endpoint in all `js/*.js` files:
- `login.js`
- `signup.js`
- `forgot-password.js`
- `dashboard.js`
- `create-debate.js`
- `join-debate.js`
- `profile.js`
- `library.js`

Find this line in each file:
```javascript
const API_BASE = 'http://localhost:5000';
```

Change to your production API URL:
```javascript
const API_BASE = 'https://your-production-api.com'; // without trailing slash
```

#### Step 2: Host Frontend
Choose one method:

**Option A: VS Code Live Server (Development)**
1. Install Live Server extension in VS Code
2. Right-click on `Front End/index.html`
3. Select "Open with Live Server"
4. Access at `http://127.0.0.1:5500`

**Option B: Python Simple Server**
```bash
cd "Front End"
python -m http.server 8000
# Access at http://localhost:8000
```

**Option C: Node.js HTTP Server**
```bash
npm install -g http-server
cd "Front End"
http-server -p 8000
# Access at http://localhost:8000
```

**Option D: Production Deployment**
Deploy the `Front End` folder to:
- AWS S3 + CloudFront
- Vercel
- Netlify  
- GitHub Pages
- Any static hosting service

### 3. Database Setup

#### MongoDB Atlas Configuration
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0 tier)
3. Create database named `debate-platform`
4. Create database user with username and password
5. Whitelist your IP address (or 0.0.0.0 for development only)
6. Get connection string and update `.env` file

## Complete Deployment Steps

### Local Development
```bash
# Terminal 1: Start Backend
cd backend
npm install
npm start
# Server runs on http://localhost:5000

# Terminal 2: Start Frontend
cd "Front End"
python -m http.server 8000
# Frontend runs on http://localhost:8000
```

### Production Deployment

#### Option 1: Heroku (Backend) + Static Hosting (Frontend)

**Backend on Heroku:**
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
heroku config:set MONGO_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-secret-key"
git push heroku main
```

**Frontend on Vercel/Netlify:**
1. Deploy `Front End` folder to Vercel/Netlify
2. Update API_BASE in all JS files to your Heroku URL
3. Redeploy frontend

#### Option 2: Cloud VM (AWS EC2, DigitalOcean, etc.)

**Backend Setup:**
```bash
# SSH into server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone/upload code
git clone your-repo
cd backend
npm install

# Set environment variables
nano .env
# Paste your configuration

# Start with PM2 (process manager)
npm install -g pm2
pm2 start server.js --name "debate-api"
pm2 startup
pm2 save
```

**Frontend Setup:**
```bash
# Install web server
sudo apt-get install -y nginx

# Copy frontend files
sudo cp -r "Front End"/* /var/www/html/

# Configure nginx for API proxy
sudo nano /etc/nginx/sites-available/default
# Add proxy configuration for /api requests

sudo systemctl restart nginx
```

## Post-Deployment Testing

### 1. Test Authentication
1. Navigate to `/login.html`
2. Sign up with test email: `test@example.com`
3. Password: `TestPassword123`
4. Should redirect to `/dashboard.html`
5. Check that token is stored in browser localStorage

### 2. Test Debate Creation
1. From dashboard, click "Create Debate"
2. Fill in form with:
   - Title: "Test Debate"
   - Category: "Technology"
   - Difficulty: "Medium"
   - Description: "Test debate content"
3. Click "Create Debate"
4. Should redirect to dashboard
5. Debate should appear in "Join Debates" section

### 3. Test Debate Interaction
1. Go to "Join Debates"
2. Find your created debate
3. Test voting (upvote/downvote)
4. Add a comment
5. Verify vote count and comment appear immediately

### 4. Test User Profile
1. Click on username in header
2. Go to "Profile"
3. Update bio
4. Verify bio saves and reloads correctly

### 5. Test Search and Filters
1. Go to "Join Debates"
2. Search for a debate by title
3. Filter by category
4. Filter by difficulty
5. Verify results update correctly

## Troubleshooting

### Backend Issues

**Error: `MONGO_URI is required`**
- Ensure `.env` file exists in `backend/` folder (not nested in `backend/backend/`)
- Restart server after creating/updating `.env`

**Error: `querySrv ECONNREFUSED`**
- MongoDB Atlas DNS resolution failed
- Solution: DNS is already fixed in `config/db.js` (uses public DNS servers)
- If error persists, check MongoDB Atlas IP whitelist

**Error: `Module not found`**
- Run `npm install` in backend folder
- Verify all dependencies installed: `npm list`

### Frontend Issues

**Error: `API calls returning 404`**
- Verify `API_BASE` is correct in all JS files
- Backend must be running
- Check browser console for actual error messages

**Error: `Token not persisting`**
- Check localStorage is enabled in browser
- Look for `debatePlatformToken` key in browser DevTools > Application > Local Storage

**Error: `CORS errors`**
- Backend's CORS is configured to allow all origins
- If error persists, check backend logs
- Verify browser is making requests to correct API URL

## Performance Optimization (Optional)

### Frontend
1. Minify CSS and JavaScript files
2. Compress images in `/images/` folder
3. Enable gzip compression on web server
4. Use CDN for static files

### Backend
1. Add MongoDB indexes on frequently searched fields (email, username)
2. Implement request rate limiting
3. Add caching headers for responses
4. Monitor API response times

## Security Considerations

### Before Production
1. ✅ Change `JWT_SECRET` to a strong random string (min 32 characters)
2. ✅ Update `MONGO_URI` to use dedicated database user (not admin)
3. ✅ Enable HTTPS on production servers
4. ✅ Set `NODE_ENV=production` in .env
5. ✅ Whitelist frontend domain in CORS if possible
6. ✅ Remove debug logging from controllers
7. ✅ Implement rate limiting on auth endpoints
8. ✅ Add input validation/sanitization on all endpoints
9. ✅ Use environment-specific database (not shared dev/prod)

### Already Implemented
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT token authentication
- ✅ Role-based authorization (user/admin)
- ✅ CORS enabled for frontend requests
- ✅ MongoDB connection with credentials

## Monitoring and Maintenance

### Logs to Monitor
- Backend: Check stdout for errors and connection status
- Database: Monitor MongoDB Atlas dashboard for query performance
- Frontend: Check browser console for JavaScript errors

### Regular Maintenance
- Monitor API response times
- Check database storage usage
- Review error logs weekly
- Update dependencies monthly (`npm outdated`)

## Support and Resources

- **Express.js Docs**: https://expressjs.com/
- **MongoDB Docs**: https://docs.mongodb.com/
- **Mongoose Docs**: https://mongoosejs.com/
- **JWT Info**: https://jwt.io/

## API Endpoint Reference

All endpoints can be found in `backend/routes/`:

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Initiate password reset
- `POST /api/auth/reset-password` - Complete password reset

### Debates
- `GET /api/debates` - List all debates (with search/filter)
- `POST /api/debates` - Create new debate (protected)
- `GET /api/debates/:id` - Get debate details (protected)
- `POST /api/debates/:id/join` - Join a debate (protected)
- `POST /api/debates/:id/vote` - Vote on debate (protected)
- `POST /api/debates/:id/comments` - Add comment (protected)

### Users
- `GET /api/users/:id` - Get user profile (protected)
- `PUT /api/users/:id` - Update user profile (protected)
- `PATCH /api/users/:id/role` - Update user role (admin only)

## Version History

- **v1.0.0** - Initial release
  - Complete auth system with JWT
  - Debate CRUD operations
  - Voting and comments system
  - User profiles with roles
  - Search and filtering
