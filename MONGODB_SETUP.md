# MongoDB Setup & Test User Creation Guide

## Current Issue

Your backend cannot connect to MongoDB Atlas because:
1. **IP Whitelist**: Your current IP is not whitelisted in MongoDB Atlas
2. **Invalid MONGO_URI**: The `.env` file has a placeholder password: `<db_password>`

## Step 1: Fix MongoDB Atlas Connection String

### Get Your Real Connection String:

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Login** to your account
3. **Click "Database"** in the left sidebar
4. **Click "Connect"** button on your cluster
5. **Select "Drivers"** (not "Compass")
6. **Copy the connection string** that looks like:
   ```
   mongodb+srv://username:password@cluster0.xyz.mongodb.net/debate-platform?retryWrites=true&w=majority&appName=Cluster0
   ```

### Update Your .env File:

Open `backend/.env` and replace this line:
```
MONGO_URI=mongodb+srv://admin:<db_password>@cluster0.ko4nwjt.mongodb.net/?appName=Cluster0
```

With your actual connection string (from MongoDB Atlas):
```
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xyz.mongodb.net/debate-platform?retryWrites=true&w=majority&appName=Cluster0
```

⚠️ **IMPORTANT**: Replace `your-username` and `your-password` with your actual MongoDB Atlas credentials.

---

## Step 2: Whitelist Your IP Address

Your MongoDB Atlas cluster needs to allow connections from your IP address.

### Find Your Current IP:

1. **Windows PowerShell** (Run as Administrator):
   ```powershell
   (Invoke-WebRequest -Uri "https://api.ipify.org?format=json").Content | ConvertFrom-Json
   ```
   Or visit: https://whatismyipaddress.com

2. **Note your public IP address** (e.g., `123.45.67.89`)

### Add to MongoDB Atlas Whitelist:

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Login** to your account
3. **Click "Security"** → **"Network Access"** in the left sidebar
4. **Click "Add IP Address"** button
5. **Paste your IP address** (e.g., `123.45.67.89`)
6. **Click "Confirm"**

⚠️ **Alternative (NOT RECOMMENDED for production)**: You can add `0.0.0.0/0` to allow all IPs, but this is a security risk.

---

## Step 3: Verify MongoDB Connection

Once you've updated `.env` and whitelisted your IP:

```powershell
cd "c:\Users\dell\Desktop\Web project\backend"
npm start
```

You should see:
```
Using public DNS servers for SRV resolution
Server running on port 5000
MongoDB connected
```

If you still see an error, check:
- [ ] Connection string is correct (copied from MongoDB Atlas)
- [ ] Username and password are in the connection string
- [ ] Your IP is whitelisted in MongoDB Atlas
- [ ] You're not using special characters that need URL encoding

---

## Step 4: Create Test User in Database

Once MongoDB is connected, create a test user:

```powershell
cd "c:\Users\dell\Desktop\Web project\backend"
node seed.js
```

You should see:
```
✅ MongoDB connected
✅ Test user created successfully!

📋 Test User Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: test@example.com
🔐 Password: TestPassword123
👤 Username: testuser
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 5: Login to Your Application

1. **Start the backend**:
   ```powershell
   cd "c:\Users\dell\Desktop\Web project\backend"
   npm start
   ```

2. **Start the frontend** (in another terminal):
   ```powershell
   cd "c:\Users\dell\Desktop\Web project\Front End"
   npm run serve
   ```

3. **Open your browser** and go to: `http://localhost:8000`

4. **Click "Login"** and use:
   - **Email**: `test@example.com`
   - **Password**: `TestPassword123`

5. **You should see the dashboard!** ✅

---

## Troubleshooting

### Error: "MongoDB connection failed: Could not connect to any servers"
- Check your IP is whitelisted in MongoDB Atlas
- Verify connection string is correct in .env
- Wait a few minutes for Atlas to apply the IP whitelist

### Error: "Authentication failed"
- Check username and password in connection string are correct
- If password has special characters, they need to be URL-encoded
- Example: `p@ssw0rd` becomes `p%40ssw0rd`

### Error: "Could not find server"
- Check cluster name in connection string matches your actual cluster
- Verify MongoDB Atlas cluster exists and is running

### Seed script fails
- Make sure backend `.env` is updated with correct connection string
- Run `npm install` in backend folder first
- Check MongoDB is accepting connections from your IP

---

## Next Steps

After login works:

1. **Create debates** from the dashboard
2. **Join debates** and vote
3. **Add comments** on debates
4. **Edit your profile**
5. **Test all features**

---

## Important Notes

- **Keep `.env` secret**: Never commit it to Git or share it
- **Password**: The test password is just for testing; change it in production
- **Multiple Users**: You can signup new users via the frontend signup page
- **Admin User**: To create an admin user, manually update the role in MongoDB Atlas or modify the seed script

---

## Quick Reference

| Component | URL |
|-----------|-----|
| **Backend API** | `http://localhost:5000` |
| **Frontend** | `http://localhost:8000` |
| **MongoDB Atlas** | https://www.mongodb.com/cloud/atlas |
| **API Status** | `http://localhost:5000/` (shows `{"status":"ok"}`) |

---

## Need Help?

1. Check MongoDB Atlas cluster status
2. Verify your IP is whitelisted
3. Check `.env` file for correct credentials
4. Run `npm install` in backend folder
5. Check browser console for errors (F12)
6. Check backend terminal for error messages
