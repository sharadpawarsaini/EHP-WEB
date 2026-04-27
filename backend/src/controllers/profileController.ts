import { Request, Response } from 'express';
import { Profile } from '../models/Profile';
import { AuthRequest } from '../middleware/authMiddleware';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne({ userId: req.user.userId });
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let profile = await Profile.findOne({ userId: req.user.userId });

    if (profile) {
      profile.fullName = req.body.fullName || profile.fullName;
      profile.dob = req.body.dob || profile.dob;
      profile.gender = req.body.gender || profile.gender;
      profile.bloodGroup = req.body.bloodGroup || profile.bloodGroup;
      profile.photoUrl = req.body.photoUrl || profile.photoUrl;

      const updatedProfile = await profile.save();
      res.json(updatedProfile);
    } else {
      profile = await Profile.create({
        userId: req.user.userId,
        fullName: req.body.fullName,
        dob: req.body.dob,
        gender: req.body.gender,
        bloodGroup: req.body.bloodGroup,
        photoUrl: req.body.photoUrl || '',
      });
      res.status(201).json(profile);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
