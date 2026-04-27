import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'], required: true },
  bloodGroup: { type: String, required: true },
  photoUrl: { type: String, default: '' },
}, { timestamps: true });

export const Profile = mongoose.model('Profile', profileSchema);
