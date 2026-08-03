import mongoose from 'mongoose';

const ipBlocklistSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  reason: {
    type: String,
    default: 'Manual Administrative Security Block'
  },
  blockedBy: {
    type: String,
    default: 'ADMIN'
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export const IPBlocklist = mongoose.model('IPBlocklist', ipBlocklistSchema);
