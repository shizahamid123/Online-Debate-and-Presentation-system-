const mongoose = require('mongoose');

const debateSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  difficultyLevel: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'upcoming', enum: ['upcoming', 'ongoing', 'completed'] },
  maxParticipants: { type: Number, default: 8 },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  duration: { type: Number, default: 30 },
  votes: { type: Map, of: String, default: {} },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  startTime: { type: Date },
  endTime: { type: Date },
  enableVoting: { type: Boolean, default: true },
  allowChat: { type: Boolean, default: true },
  requireRegistration: { type: Boolean, default: true },
  votes: { type: Map, of: String },
}, { timestamps: true });

module.exports = mongoose.model('Debate', debateSchema);
