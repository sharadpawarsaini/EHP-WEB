import mongoose from 'mongoose';

const medicalReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyMember',
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'Blood Test',
  },
  fileName: {
    type: String,
    default: 'diagnostic_report.pdf',
  },
  fileUrl: {
    type: String,
    default: '/uploads/reports/diagnostic_report.pdf',
  },
  fileType: {
    type: String,
    default: 'application/pdf',
  },
  fileSize: {
    type: Number,
    default: 1024,
  },
  aiDiagnosis: {
    type: String,
    default: null,
  },
  aiCauses: {
    type: String,
    default: null,
  },
  aiSummary: {
    type: String,
    default: null,
  },
  aiUrgency: {
    type: String,
    default: null,
  },
  aiRecommendations: {
    type: [String],
    default: [],
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export const MedicalReport = mongoose.model('MedicalReport', medicalReportSchema);
