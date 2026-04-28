import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Vaccination } from '../models/Vaccination';

export const getVaccinations = async (req: AuthRequest, res: Response) => {
  try {
    const vaccinations = await Vaccination.find({ 
      userId: req.user.userId,
      memberId: req.user.memberId 
    }).sort({ dateAdministered: -1 });
    res.json(vaccinations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vaccinations' });
  }
};

export const addVaccination = async (req: AuthRequest, res: Response) => {
  try {
    const vaccination = await Vaccination.create({
      ...req.body,
      userId: req.user.userId,
      memberId: req.user.memberId
    });
    res.status(201).json(vaccination);
  } catch (error) {
    res.status(400).json({ message: 'Error adding vaccination' });
  }
};

export const deleteVaccination = async (req: AuthRequest, res: Response) => {
  try {
    await Vaccination.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    res.json({ message: 'Vaccination record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting record' });
  }
};
