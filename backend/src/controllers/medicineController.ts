import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Medicine } from '../models/Medicine';

export const getMedicines = async (req: AuthRequest, res: Response) => {
  try {
    const medicines = await Medicine.find({ 
      userId: req.user.userId,
      memberId: req.user.memberId 
    });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicines' });
  }
};

export const addMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const medicine = await Medicine.create({
      ...req.body,
      userId: req.user.userId,
      memberId: req.user.memberId
    });
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: 'Error adding medicine' });
  }
};

export const deleteMedicine = async (req: AuthRequest, res: Response) => {
  try {
    await Medicine.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    res.json({ message: 'Medicine deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting medicine' });
  }
};

export const toggleMedicineStatus = async (req: AuthRequest, res: Response) => {
  try {
    const medicine = await Medicine.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    if (medicine) {
      medicine.active = !medicine.active;
      await medicine.save();
      res.json(medicine);
    } else {
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error toggling status' });
  }
};
