const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true, trim: true },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  statistics: {
    debatesWon: { type: Number, default: 0 },
    debatesJoined: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalDebates: { type: Number, default: 0 },
  },
  achievements: [{ type: String }],
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
