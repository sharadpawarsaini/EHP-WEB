import mongoose from 'mongoose';

const vitalsSchema = new mongoose.Schema({
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
  type: {
    type: String,
    required: true,
    enum: ['Blood Pressure', 'Blood Glucose', 'Heart Rate', 'Weight']
  },
  value: {
    type: String, // String to handle BP (e.g., 120/80)
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const Vitals = mongoose.model('Vitals', vitalsSchema);
