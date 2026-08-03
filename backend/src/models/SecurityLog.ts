import mongoose from 'mongoose';

const securityLogSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: [
      'LOGIN_SUCCESS',
      'LOGIN_FAILED',
      'UNAUTHORIZED_ACCESS',
      'EMERGENCY_ACCESS',
      'RATE_LIMIT_EXCEEDED',
      'BLOCKED_IP_ATTEMPT',
      'SETTINGS_CHANGED',
      'SUSPICIOUS_ACTIVITY'
    ]
  },
  severity: {
    type: String,
    enum: ['INFO', 'WARNING', 'CRITICAL'],
    default: 'INFO'
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  userAgent: {
    type: String,
    default: 'Unknown'
  },
  endpoint: {
    type: String,
    default: '/'
  },
  method: {
    type: String,
    default: 'GET'
  },
  statusCode: {
    type: Number,
    default: 200
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

securityLogSchema.index({ createdAt: -1 });
securityLogSchema.index({ ipAddress: 1 });
securityLogSchema.index({ severity: 1 });

export const SecurityLog = mongoose.model('SecurityLog', securityLogSchema);
