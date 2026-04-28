import { Response } from 'express';
import { HospitalVisit } from '../models/HospitalVisit';
import { AuthRequest } from '../middleware/authMiddleware';

export const createVisit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { hospitalName, visitDate } = req.body;
    
    if (!hospitalName || !visitDate) {
      res.status(400).json({ message: 'Hospital name and visit date are required' });
      return;
    }

    const documents = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        documents.push({
          title: file.originalname,
          fileUrl: `/uploads/visits/${file.filename}`,
          fileType: file.mimetype,
        });
      }
    }

    const visit = await HospitalVisit.create({
      userId: req.user.userId,
      hospitalName,
      visitDate,
      documents
    });

    res.status(201).json(visit);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getVisits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const visits = await HospitalVisit.find({ userId: req.user.userId }).sort({ visitDate: -1 });
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getVisitById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const visit = await HospitalVisit.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!visit) {
      res.status(404).json({ message: 'Visit not found' });
      return;
    }
    res.json(visit);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
