import mongoose from 'mongoose';

const familyMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  relation: {
    type: String,
    required: true
  },
  photoUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export const FamilyMember = mongoose.model('FamilyMember', familyMemberSchema);
