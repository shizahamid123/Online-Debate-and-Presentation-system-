# API Configuration Guide

## For Local Development

All frontend files have this configuration:

```javascript
const API_BASE = 'http://localhost:5000';
```

This is correct for local development when backend runs on port 5000.

## For Production Deployment

After deploying your backend, update ALL frontend JavaScript files with your production API URL:

### Files to Update:
1. `Front End/js/login.js`
2. `Front End/js/signup.js`
3. `Front End/js/forgot-password.js`
4. `Front End/js/dashboard.js`
5. `Front End/js/create-debate.js`
6. `Front End/js/join-debate.js`
7. `Front End/js/profile.js`
8. `Front End/js/library.js`

### Update Method:

Find this line in each file:
```javascript
const API_BASE = 'http://localhost:5000';
```

Replace with your production URL (no trailing slash):
```javascript
// Example for Heroku
const API_BASE = 'https://your-app-name.herokuapp.com';

// Example for custom domain
const API_BASE = 'https://api.yourdomain.com';

// Example for AWS
const API_BASE = 'https://api-12345.us-east-1.elb.amazonaws.com';
```

## Backend API Base URL Determination

The backend API base URL is determined by:
1. **Hosting Platform**: Heroku, AWS, DigitalOcean, etc.
2. **Domain/Subdomain**: Your custom domain or platform-provided URL
3. **Port**: Typically omitted in production (uses 80/443), but can be specified

### Common Deployment Scenarios:

| Platform | URL Format |
|----------|-----------|
| **Heroku** | `https://app-name-12345.herokuapp.com` |
| **AWS EC2** | `https://your.custom.domain` or `https://ec2-ip.compute.amazonaws.com` |
| **DigitalOcean App Platform** | `https://your-app.ondigitalocean.app` |
| **Railway.app** | `https://your-project-production.up.railway.app` |
| **Custom VPS** | `https://api.yourdomain.com` |
| **AWS Lambda** | `https://api-gateway-id.execute-api.region.amazonaws.com` |

## After Updating API_BASE

1. **Clear browser cache**: Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. **Clear localStorage**: Open DevTools Console and run:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```
3. **Reload page**: Press Ctrl+R or Cmd+R
4. **Test authentication**: Try signup/login to verify API calls work

## Verifying API Connection

### Method 1: Browser DevTools
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to login or perform an action
4. Check API requests - they should show your new API_BASE URL
5. Look for successful responses (200-299 status codes)

### Method 2: Console Testing
```javascript
// In browser console, test API connectivity:
fetch('https://your-api-url/api/debates')
  .then(r => r.json())
  .then(data => console.log('API works!', data))
  .catch(err => console.error('API error:', err));
```

### Method 3: Check Network Requests
1. Login to the application
2. Go to DevTools > Network tab
3. Perform an action (create debate, vote, etc.)
4. Check request headers: Should have `Authorization: Bearer <token>`
5. Response should be JSON with expected data

## Troubleshooting API Connection

### Error: "Failed to fetch" or CORS error
- **Cause**: Frontend and backend domains don't match, CORS not configured
- **Solution**: Verify API_BASE is correct, check backend CORS settings

### Error: "401 Unauthorized"
- **Cause**: Token missing or invalid
- **Solution**: Clear localStorage, login again

### Error: "404 Not Found"
- **Cause**: API endpoint doesn't exist at that URL
- **Solution**: Verify API_BASE is correct, check backend is running

### Error: "500 Internal Server Error"
- **Cause**: Backend error
- **Solution**: Check backend logs for error details

## Best Practice: Environment-Based Configuration

For future versions, consider making API_BASE automatic based on environment:

```javascript
// Automatically detect API endpoint
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000'
  : 'https://api.yourdomain.com';
```

Or use an environment-specific config file that gets injected at deploy time.
