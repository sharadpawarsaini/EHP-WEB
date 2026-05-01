import { Request, Response } from 'express';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
      if (userExists.isVerified) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, salt);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    let user;
    if (userExists && !userExists.isVerified) {
      userExists.password = hashedPassword;
      userExists.otp = hashedOtp;
      userExists.otpExpires = otpExpires;
      await userExists.save();
      user = userExists;
    } else {
      user = await User.create({
        email,
        password: hashedPassword,
        isVerified: false,
        otp: hashedOtp,
        otpExpires,
      });
    }

    if (user) {
      if (fullName && dob && gender && bloodGroup) {
        if (userExists) await Profile.deleteOne({ userId: user._id });
        await Profile.create({
          userId: user._id,
          fullName,
          dob,
          gender,
          bloodGroup,
        });
      }

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'EHP Identity Verification - OTP Code',
          html: `<p>Your secure EHP verification code is: <strong style="font-size: 24px;">${otp}</strong></p><p>This code expires in 10 minutes.</p>`
        });
      } catch (err) {
        console.error("Failed to send email", err);
      }

      res.status(201).json({
        message: 'OTP sent successfully to email',
        email: user.email
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
      if (!user.isVerified) {
        res.status(401).json({ message: 'Please verify your email first', notVerified: true });
        return;
      }

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

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: 'User is already verified' });
      return;
    }

    if (!user.otp || !user.otpExpires || user.otpExpires.getTime() < Date.now()) {
      res.status(400).json({ message: 'OTP expired or invalid. Please request a new one.' });
      return;
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      res.status(400).json({ message: 'Incorrect OTP' });
      return;
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(res, user._id);
    res.json({
      _id: user._id,
      email: user.email,
      token,
      message: 'Email verified successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: 'User is already verified' });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'EHP Identity Verification - New OTP Code',
        html: `<p>Your new secure EHP verification code is: <strong style="font-size: 24px;">${otp}</strong></p><p>This code expires in 10 minutes.</p>`
      });
    } catch (err) {
      console.error("Failed to send email", err);
    }

    res.json({ message: 'New OTP sent successfully' });
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
