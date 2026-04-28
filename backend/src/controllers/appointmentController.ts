import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Appointment } from '../models/Appointment';

export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await Appointment.find({ 
      userId: req.user.userId,
      memberId: req.user.memberId 
    }).sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

export const addAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      userId: req.user.userId,
      memberId: req.user.memberId
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: 'Error adding appointment' });
  }
};

export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { status: req.body.status },
      { new: true }
    );
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
};

export const deleteAppointment = async (req: AuthRequest, res: Response) => {
  try {
    await Appointment.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment' });
  }
};
