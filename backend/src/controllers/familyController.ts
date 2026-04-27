import { Response } from 'express';
import { FamilyMember } from '../models/FamilyMember';
import { Profile } from '../models/Profile';
import { MedicalDetails } from '../models/MedicalDetails';
import { EmergencyLink } from '../models/EmergencyLink';
import { AuthRequest } from '../middleware/authMiddleware';

export const getFamilyMembers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const members = await FamilyMember.find({ userId: req.user.userId });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addFamilyMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, relation } = req.body;
    const member = await FamilyMember.create({
      userId: req.user.userId,
      name,
      relation
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteFamilyMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await FamilyMember.deleteOne({ _id: id, userId: req.user.userId });
    
    // Cleanup related data
    await Profile.deleteMany({ memberId: id });
    await MedicalDetails.deleteMany({ memberId: id });
    await EmergencyLink.deleteMany({ memberId: id });

    res.json({ message: 'Family member removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
