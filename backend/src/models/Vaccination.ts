import mongoose from 'mongoose';

const vaccinationSchema = new mongoose.Schema({
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
  vaccineName: { type: String, required: true },
  disease: { type: String, required: true },
  dateAdministered: { type: Date, required: true },
  provider: { type: String },
  batchNumber: { type: String },
  nextDoseDate: { type: Date },
  isBooster: { type: Boolean, default: false },
  notes: { type: String }
}, { timestamps: true });

export const Vaccination = mongoose.model('Vaccination', vaccinationSchema);
