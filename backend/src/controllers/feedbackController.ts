import { Response } from 'express';
import { Feedback } from '../models/Feedback';
import { AuthRequest } from '../middleware/authMiddleware';

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

    // In a real app, you might want to send an email here using nodemailer
    // to sharadpawarsaini@gmail.com
    console.log('New Feedback Received for Sharad:', feedback);

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
