import { Response } from 'express';
import { MedicalReport } from '../models/MedicalReport';
import { AuthRequest } from '../middleware/authMiddleware';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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

    const apiKey = (process.env.GROQ_API_KEY || '').trim();
    if (!apiKey) {
      res.status(500).json({ message: 'AI API Key not configured' });
      return;
    }

    // Build context from report metadata
    const reportContext = `
      Report Title: ${report.title}
      File Type: ${report.fileType}
      File Size: ${(report.fileSize / 1024).toFixed(1)} KB
      Uploaded On: ${report.createdAt}
    `;

    // For text-readable files (PDFs), attempt to read content
    let fileContent = '';
    const filePath = path.join(__dirname, '../../uploads/reports', report.fileName);
    
    if (fs.existsSync(filePath) && report.fileType === 'application/pdf') {
      // Read raw text from PDF (basic extraction)
      const fileBuffer = fs.readFileSync(filePath);
      const rawText = fileBuffer.toString('utf-8');
      // Extract readable text chunks from PDF binary
      const textMatches = rawText.match(/\(([^)]+)\)/g);
      if (textMatches) {
        fileContent = textMatches
          .map(m => m.slice(1, -1))
          .filter(t => t.length > 2 && /[a-zA-Z0-9]/.test(t))
          .join(' ')
          .slice(0, 3000); // Limit to 3000 chars
      }
    }

    const prompt = fileContent 
      ? `You are a helpful medical assistant. Analyze this medical report content and provide a summary in 3-4 simple bullet points for a non-medical person. Highlight any critical findings.\n\nReport: "${report.title}"\nContent: ${fileContent}`
      : `You are a helpful medical assistant. Based on the report title "${report.title}", explain what this type of medical report typically contains, what key values a patient should look for, and what questions they should ask their doctor. Provide 3-4 concise bullet points.`;

    console.log('Starting Groq analysis for report:', report.title);

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a medical report analyst. Be concise, helpful, and use simple language. Always remind the patient to consult their doctor for professional advice.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 600
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const analysis = response.data.choices[0].message.content;
    console.log('Analysis successful');
    res.json({ analysis });

  } catch (error: any) {
    console.error('AI Analysis Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'AI analysis failed. Please try again in a moment.',
      details: error.response?.data?.error?.message || error.message 
    });
  }
};
