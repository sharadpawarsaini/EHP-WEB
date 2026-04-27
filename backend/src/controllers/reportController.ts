import { Response } from 'express';
import { MedicalReport } from '../models/MedicalReport';
import { AuthRequest } from '../middleware/authMiddleware';
import fs from 'fs';
import path from 'path';

export const uploadReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Please upload a file' });
      return;
    }

    const { title } = req.body;
    
    const report = await MedicalReport.create({
      userId: req.user.userId,
      title: title || req.file.originalname,
      fileName: req.file.filename,
      fileUrl: `/uploads/reports/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reports = await MedicalReport.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const report = await MedicalReport.findOne({ _id: req.params.id, userId: req.user.userId });
    
    if (!report) {
      res.status(404).json({ message: 'Report not found' });
      return;
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../../uploads/reports', report.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await MedicalReport.deleteOne({ _id: req.params.id });
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
