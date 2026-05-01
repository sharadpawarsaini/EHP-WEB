import { Response } from 'express';
import { Feedback } from '../models/Feedback';
import { User } from '../models/User';
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
    
    // Fetch user details for the email
    const user = await User.findById(req.user.userId);
    const userEmail = user?.email || 'Unknown User';

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
        to: [process.env.EMAIL_USER, userEmail].filter(Boolean).join(','), // Sends to Admin and User
        subject: `New EHP Feedback: ${experience} (${rating}/5 Stars)`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb;">New User Feedback Received</h2>
            <p><strong>From:</strong> ${userEmail}</p>
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
        // Fire and forget to avoid blocking the user response
        transporter.sendMail(mailOptions)
          .then(() => console.log(`Feedback email sent successfully to ${process.env.EMAIL_USER}`))
          .catch((err: any) => {
            console.error('Background email failure:', err.message);
            console.error('TROUBLESHOOTING: Ensure you are using a 16-character Gmail APP PASSWORD, not your regular password. Also check if your server IP is blocked by Google.');
          });
      } else {
        console.warn('Feedback received but EMAIL_USER or EMAIL_PASS not configured in environment variables');
      }
    } catch (mailError) {
      console.error('Failed to initialize email transport:', mailError);
    }

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
