import mongoose from 'mongoose';

const medicalDetailsSchema = new mongoose.Schema({
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
  allergies: [{ type: String }],
  conditions: [{ type: String }],
  medications: [{ type: String }],
  surgeries: [{ type: String }],
  vaccinations: [{ type: String }],
  familyHistory: [{ type: String }],
  lifestyle: {
    smoking: { type: Boolean, default: false },
    alcohol: { type: Boolean, default: false },
    exercise: { type: String, default: 'None' }
  },
  insurances: [{
    provider: { type: String, default: '' },
    policyNumber: { type: String, default: '' },
    expiryDate: { type: Date },
    coverageType: { type: String, default: '' }
  }],
  doctorHistory: [{
    name: { type: String },
    specialty: { type: String },
    lastVisit: { type: Date }
  }],
  notes: { type: String, default: '' }
}, { timestamps: true });

export const MedicalDetails = mongoose.model('MedicalDetails', medicalDetailsSchema);
