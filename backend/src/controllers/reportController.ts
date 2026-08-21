import { Response } from 'express';
import { MedicalReport } from '../models/MedicalReport';
import { AuthRequest } from '../middleware/authMiddleware';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const uploadReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      type,
      aiDiagnosis,
      aiCauses,
      aiSummary,
      aiUrgency,
      aiRecommendations,
      notes,
    } = req.body;

    if (!title && !req.file) {
      res.status(400).json({ message: 'Please provide a title or upload a report file' });
      return;
    }

    const report = await MedicalReport.create({
      userId: req.user.userId,
      memberId: req.user.memberId,
      title: title || req.file?.originalname || 'Diagnostic Lab Report',
      type: type || 'Blood Test',
      fileName: req.file ? req.file.filename : 'diagnostic_report.pdf',
      fileUrl: req.file ? `/uploads/reports/${req.file.filename}` : '/uploads/reports/diagnostic_report.pdf',
      fileType: req.file ? req.file.mimetype : 'application/pdf',
      fileSize: req.file ? req.file.size : 1024,
      aiDiagnosis: aiDiagnosis || null,
      aiCauses: aiCauses || null,
      aiSummary: aiSummary || null,
      aiUrgency: aiUrgency || null,
      aiRecommendations: Array.isArray(aiRecommendations) ? aiRecommendations : [],
      notes: notes || '',
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Error saving report:', error);
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

    // Delete file from filesystem if present
    if (report.fileName) {
      const filePath = path.join(__dirname, '../../uploads/reports', report.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
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

    const apiKey = (process.env.GROQ_API_KEY || '').trim();
    if (!apiKey) {
      res.status(500).json({ message: 'AI API Key not configured' });
      return;
    }

    const prompt = `You are a clinical diagnostic expert. Analyze this medical report title "${report.title}" and findings "${report.notes || ''}".
    Extract:
    1. Primary Disease / Detected Conditions
    2. Underlying Causes and Biomarker Anomalies
    3. Plain English Clinical Description & Summary
    4. Actionable Next Steps and Physician Recommendations.
    Format your response cleanly with clear section headings.`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are an advanced medical report diagnostic assistant. Be concise, clinical, and structured.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 700
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const analysis = response.data.choices[0].message.content;
    res.json({ analysis });
  } catch (error: any) {
    console.error('AI Analysis Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'AI analysis failed. Please try again in a moment.',
      details: error.response?.data?.error?.message || error.message 
    });
  }
};
