import mongoose from 'mongoose';

const accessLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accessType: {
    type: String,
    enum: ['public', 'doctor'],
    default: 'public',
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  location: {
    type: String,
    default: 'Unknown',
  },
}, {
  timestamps: true,
});

export const AccessLog = mongoose.model('AccessLog', accessLogSchema);
