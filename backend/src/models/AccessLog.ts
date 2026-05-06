import mongoose from 'mongoose';

const accessLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  resource: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['success', 'failure'],
    default: 'success'
  },
  accessType: {
    type: String,
    enum: ['public', 'doctor', 'admin'],
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
