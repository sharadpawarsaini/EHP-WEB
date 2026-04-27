import { Request, Response } from 'express';
import { MedicalDetails } from '../models/MedicalDetails';
import { AuthRequest } from '../middleware/authMiddleware';

export const getMedicalDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const details = await MedicalDetails.findOne({ userId: req.user.userId });
    if (details) {
      res.json(details);
    } else {
      res.status(404).json({ message: 'Medical details not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateMedicalDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let details = await MedicalDetails.findOne({ userId: req.user.userId });

    if (details) {
      Object.assign(details, req.body);
      const updatedDetails = await details.save();
      res.json(updatedDetails);
    } else {
      details = await MedicalDetails.create({
        userId: req.user.userId,
        ...req.body,
      });
      res.status(201).json(details);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
