import { Response } from 'express';
import { MedicalReport } from '../models/MedicalReport';
import { AuthRequest } from '../middleware/authMiddleware';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const uploadReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Please upload a file' });
      return;
    }

    const { title } = req.body;
    
    const report = await MedicalReport.create({
      userId: req.user.userId,
      memberId: req.user.memberId,
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
    const reports = await MedicalReport.find({ 
      userId: req.user.userId,
      memberId: req.user.memberId 
    }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const report = await MedicalReport.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId,
      memberId: req.user.memberId 
    });
    
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

export const analyzeReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const report = await MedicalReport.findOne({ _id: id, userId: req.user.userId });

    if (!report) {
      res.status(404).json({ message: 'Report not found' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ message: 'Gemini API Key not configured' });
      return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const filePath = path.join(__dirname, '../../uploads/reports', report.fileName);
    const fileBuffer = fs.readFileSync(filePath);
    const base64File = fileBuffer.toString('base64');

    const prompt = "You are a helpful medical assistant. Please analyze this medical report and provide a summary in 3-4 simple bullet points for a non-medical person. Highlight any critical findings or things the patient should discuss with their doctor. Keep it concise and easy to understand.";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64File,
          mimeType: report.fileType
        }
      }
    ]);

    const analysis = result.response.text();
    res.json({ analysis });

  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ message: 'Failed to analyze report', error: error.message });
  }
};
