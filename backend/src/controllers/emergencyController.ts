import { Request, Response } from 'express';
import { EmergencyLink } from '../models/EmergencyLink';
import { EmergencyContact } from '../models/EmergencyContact';
import { Profile } from '../models/Profile';
import { MedicalDetails } from '../models/MedicalDetails';
import { MedicalReport } from '../models/MedicalReport';
import { AuthRequest } from '../middleware/authMiddleware';
import QRCode from 'qrcode';

export const generateEmergencyLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { publicSlug, accessCode } = req.body;
    
    const existingSlug = await EmergencyLink.findOne({ publicSlug });
    if (existingSlug && existingSlug.userId.toString() !== req.user.userId) {
      res.status(400).json({ message: 'Slug already taken' });
      return;
    }

    let link = await EmergencyLink.findOne({ userId: req.user.userId });

    if (link) {
      link.publicSlug = publicSlug || link.publicSlug;
      link.accessCode = accessCode || link.accessCode;
      await link.save();
    } else {
      link = await EmergencyLink.create({
        userId: req.user.userId,
        publicSlug,
        accessCode,
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'https://ehp-tan-eight.vercel.app';
    const qrDataUrl = await QRCode.toDataURL(`${frontendUrl}/e/${link.publicSlug}`);


    res.status(201).json({
      link,
      qrDataUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEmergencyLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const link = await EmergencyLink.findOne({ userId: req.user.userId });
    if (link) {
      const frontendUrl = process.env.FRONTEND_URL || 'https://ehp-tan-eight.vercel.app';
      const qrDataUrl = await QRCode.toDataURL(`${frontendUrl}/e/${link.publicSlug}`);

      res.json({ link, qrDataUrl });
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPublicEmergencyData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const link = await EmergencyLink.findOne({ publicSlug: slug });
    
    if (!link) {
      res.status(404).json({ message: 'Emergency profile not found' });
      return;
    }

    const profile = await Profile.findOne({ userId: link.userId });
    const medical = await MedicalDetails.findOne({ userId: link.userId });
    const contacts = await EmergencyContact.find({ userId: link.userId });

    res.json({
      profile: {
        fullName: profile?.fullName,
        bloodGroup: profile?.bloodGroup,
        photoUrl: profile?.photoUrl,
      },
      medical: {
        allergies: medical?.allergies,
        conditions: medical?.conditions,
        medications: medical?.medications,
      },
      contacts,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyDoctorAccess = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const { accessCode } = req.body;

    const link = await EmergencyLink.findOne({ publicSlug: slug });
    
    if (!link) {
      res.status(404).json({ message: 'Emergency profile not found' });
      return;
    }

    if (link.accessCode !== accessCode) {
      res.status(401).json({ message: 'Invalid access code' });
      return;
    }

    const profile = await Profile.findOne({ userId: link.userId });
    const medical = await MedicalDetails.findOne({ userId: link.userId });
    const contacts = await EmergencyContact.find({ userId: link.userId });
    const reports = await MedicalReport.find({ userId: link.userId });

    res.json({
      profile,
      medical,
      contacts,
      reports,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contacts = await EmergencyContact.find({ userId: req.user.userId });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contactsCount = await EmergencyContact.countDocuments({ userId: req.user.userId });
    if (contactsCount >= 2) {
      res.status(400).json({ message: 'Maximum 2 emergency contacts allowed' });
      return;
    }

    const contact = await EmergencyContact.create({
      userId: req.user.userId,
      ...req.body
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await EmergencyContact.findOne({ _id: req.params.id, userId: req.user.userId });
    if (contact) {
      await EmergencyContact.deleteOne({ _id: req.params.id });
      res.json({ message: 'Contact removed' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
