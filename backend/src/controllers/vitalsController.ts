import { Response } from 'express';
import { Vitals } from '../models/Vitals';
import { AuthRequest } from '../middleware/authMiddleware';

export const getVitals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vitals = await Vitals.find({ 
      userId: req.user.userId,
      memberId: req.user.memberId 
    }).sort({ date: 1 });
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addVital = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, value, unit, date } = req.body;
    const vital = await Vitals.create({
      userId: req.user.userId,
      memberId: req.user.memberId,
      type,
      value,
      unit,
      date: date || new Date()
    });
    res.status(201).json(vital);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteVital = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Vitals.deleteOne({ _id: req.params.id, userId: req.user.userId });
    res.json({ message: 'Vital record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
