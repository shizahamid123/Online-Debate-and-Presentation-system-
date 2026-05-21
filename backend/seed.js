/**
 * Seed Script - Create Test User
 * Run this after fixing MongoDB connection: node seed.js
 */

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');
const dns = require('dns');

dotenv.config();

// Import User model
const User = require('./models/User');

const seedUsers = async () => {
  try {
    // Setup DNS for MongoDB Atlas SRV
    if (process.env.MONGO_URI.startsWith('mongodb+srv://')) {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
      console.log('Using public DNS servers for SRV resolution');
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('⚠️  Test user already exists with email: test@example.com');
      console.log('📧 Email: test@example.com');
      console.log('🔐 Password: TestPassword123');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('TestPassword123', salt);

    // Create test user
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      fullName: 'Test User',
      bio: 'This is a test account for the debate platform',
      avatar: '/images/default-avatar.svg',
      role: 'user',
      isVerified: true,
      statistics: {
        debatesWon: 0,
        debatesJoined: 0,
        averageRating: 0,
        totalDebates: 0,
      },
      achievements: [],
    });

    console.log('✅ Test user created successfully!');
    console.log('\n📋 Test User Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email: ${testUser.email}`);
    console.log(`🔐 Password: TestPassword123`);
    console.log(`👤 Username: ${testUser.username}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('ℹ️  Use these credentials to login on the frontend!');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Seed script completed. MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedUsers();
