import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String },
});

const hospitalVisitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hospitalName: {
    type: String,
    required: true,
  },
  visitDate: {
    type: Date,
    required: true,
  },
  documents: [documentSchema],
}, {
  timestamps: true,
});

export const HospitalVisit = mongoose.model('HospitalVisit', hospitalVisitSchema);
