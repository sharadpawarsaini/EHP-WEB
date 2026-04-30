import { Request, Response } from 'express';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateToken = (res: Response, userId: any): string => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProduction, // Only true in production (requires HTTPS)
    sameSite: isProduction ? 'none' : 'lax', // 'lax' is better for local dev
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  
  return token;
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, fullName, dob, gender, bloodGroup } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    if (user) {
      if (fullName && dob && gender && bloodGroup) {
        await Profile.create({
          userId: user._id,
          fullName,
          dob,
          gender,
          bloodGroup,
        });
      }

      const token = generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        email: user.email,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(res, user._id);
      res.json({
        _id: user._id,
        email: user.email,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logoutUser = (req: Request, res: Response): void => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  const userId = (req as any).user?._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Incorrect current password' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUserAccount = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?._id;

  try {
    // 1. Delete user
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // 2. Cleanup all associated data
    await Profile.deleteMany({ userId });
    
    // Using Dynamic Imports or requiring other models to avoid circular dependencies if any
    // but here we can just import them at the top if needed.
    // For now, let's just delete the main ones.
    const models = ['MedicalDetails', 'MedicalReport', 'EmergencyContact', 'EmergencyLink', 'FamilyMember', 'Vitals', 'HospitalVisit', 'AccessLog'];
    
    // We can iterate and delete if we import all models, but for simplicity:
    // (Note: In a real app, you'd want a more robust cleanup service)
    await require('../models/MedicalDetails').MedicalDetails.deleteMany({ userId });
    await require('../models/MedicalReport').MedicalReport.deleteMany({ userId });
    await require('../models/EmergencyContact').EmergencyContact.deleteMany({ userId });
    await require('../models/EmergencyLink').EmergencyLink.deleteMany({ userId });
    await require('../models/FamilyMember').FamilyMember.deleteMany({ userId });
    await require('../models/Vitals').Vitals.deleteMany({ userId });
    await require('../models/HospitalVisit').HospitalVisit.deleteMany({ userId });
    await require('../models/AccessLog').AccessLog.deleteMany({ userId });

    res.cookie('jwt', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(0),
    });

    res.json({ message: 'Account and all associated data deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error during account deletion' });
  }
};
