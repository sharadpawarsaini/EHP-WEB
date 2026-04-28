import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
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
  doctorName: { type: String, required: true },
  specialty: { type: String },
  hospitalName: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Cancelled'], 
    default: 'Scheduled' 
  },
  notes: { type: String }
}, { timestamps: true });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
