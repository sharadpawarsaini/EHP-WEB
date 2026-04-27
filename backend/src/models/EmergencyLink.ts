import mongoose from 'mongoose';

const emergencyLinkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  publicSlug: {
    type: String,
    required: true,
    unique: true
  },
  accessCode: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const EmergencyLink = mongoose.model('EmergencyLink', emergencyLinkSchema);
