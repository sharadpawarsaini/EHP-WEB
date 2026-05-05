import { Request, Response } from 'express';
import { User } from '../models/User';
import { Feedback } from '../models/Feedback';
import { MedicalReport } from '../models/MedicalReport';
import { EmergencyLink } from '../models/EmergencyLink';
import { AccessLog } from '../models/AccessLog';
import { Profile } from '../models/Profile';

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReports = await MedicalReport.countDocuments();
    const activeEmergencyLinks = await EmergencyLink.countDocuments();
    const totalFeedback = await Feedback.countDocuments();

    // Get stats for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newUsersLastWeek = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const newReportsLastWeek = await MedicalReport.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.json({
      totalUsers,
      totalReports,
      activeEmergencyLinks,
      totalFeedback,
      newUsersLastWeek,
      newReportsLastWeek
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    const profiles = await Profile.find();

    const userWithProfiles = users.map(user => {
      const profile = profiles.find(p => p.userId.toString() === user._id.toString());
      return {
        ...user.toObject(),
        profile: profile || null
      };
    });

    res.json(userWithProfiles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const getAllFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback' });
  }
};

export const updateFeedbackStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(id, { status }, { new: true });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error updating feedback' });
  }
};

export const getAccessLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await AccessLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching access logs' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (id === (req as any).user.userId) {
      res.status(400).json({ message: 'You cannot delete yourself' });
      return;
    }
    
    await User.findByIdAndDelete(id);
    await Profile.deleteMany({ userId: id });
    // Add other cleanup logic if needed
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};
