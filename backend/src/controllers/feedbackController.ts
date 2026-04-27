import { Response } from 'express';
import { Feedback } from '../models/Feedback';
import { AuthRequest } from '../middleware/authMiddleware';
import nodemailer from 'nodemailer';

export const submitFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rating, comment, experience } = req.body;

    if (!rating || !comment || !experience) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const feedback = await Feedback.create({
      userId: req.user.userId,
      rating,
      comment,
      experience
    });

    // Email Mechanism
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // Your email (sharadpawarsaini@gmail.com)
          pass: process.env.EMAIL_PASS  // Your Gmail App Password
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'sharadpawarsaini@gmail.com',
        subject: `New EHP Feedback: ${experience} (${rating}/5 Stars)`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb;">New User Feedback Received</h2>
            <p><strong>User ID:</strong> ${req.user.userId}</p>
            <p><strong>Experience:</strong> ${experience}</p>
            <p><strong>Rating:</strong> ${rating} / 5</p>
            <hr />
            <p><strong>Comment:</strong></p>
            <p style="background: #f9fafb; padding: 15px; border-radius: 8px;">${comment}</p>
          </div>
        `
      };

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        console.log('Feedback email sent to Sharad');
      } else {
        console.warn('Feedback received but EMAIL_USER or EMAIL_PASS not configured in .env');
      }
    } catch (mailError) {
      console.error('Failed to send feedback email:', mailError);
      // We don't return error to user because feedback is already saved in DB
    }

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
