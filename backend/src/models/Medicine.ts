import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
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
  name: { type: String, required: true },
  dosage: { type: String, required: true }, // e.g., "500mg"
  frequency: { type: String, required: true }, // e.g., "Twice a day"
  times: [{ type: String }], // e.g., ["08:00", "20:00"]
  startDate: { type: Date },
  endDate: { type: Date },
  notes: { type: String },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const Medicine = mongoose.model('Medicine', medicineSchema);
