import mongoose from 'mongoose';

const emergencyLinkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyMember',
    default: null
  },
  publicSlug: {
    type: String,
    required: true,
    unique: true
  },
  accessCode: {
    type: String,
    required: true
  },
  isLocked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const EmergencyLink = mongoose.model('EmergencyLink', emergencyLinkSchema);
