import { Request, Response } from 'express';
import { EmergencyLink } from '../models/EmergencyLink';
import { EmergencyContact } from '../models/EmergencyContact';
import { Profile } from '../models/Profile';
import { MedicalDetails } from '../models/MedicalDetails';
import { MedicalReport } from '../models/MedicalReport';
import { AccessLog } from '../models/AccessLog';
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

    let link = await EmergencyLink.findOne({ 
      userId: req.user.userId,
      memberId: req.user.memberId 
    });

    if (link) {
      link.publicSlug = publicSlug || link.publicSlug;
      link.accessCode = accessCode || link.accessCode;
      link.isLocked = req.body.isLocked !== undefined ? req.body.isLocked : link.isLocked;
      await link.save();
    } else {
      link = await EmergencyLink.create({
        userId: req.user.userId,
        memberId: req.user.memberId,
        publicSlug,
        accessCode,
        isLocked: req.body.isLocked || false,
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
    const link = await EmergencyLink.findOne({ 
      userId: req.user.userId,
      memberId: req.user.memberId 
    });
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

    if (link.isLocked) {
      res.status(403).json({ 
        message: 'This profile is currently locked by the owner.',
        isLocked: true,
        fullName: 'Private Profile'
      });
      return;
    }

    // Create Access Log
    await AccessLog.create({
      userId: link.userId,
      accessType: 'public',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    const profile = await Profile.findOne({ 
      userId: link.userId,
      memberId: link.memberId 
    });
    const medical = await MedicalDetails.findOne({ 
      userId: link.userId,
      memberId: link.memberId 
    });
    const contacts = await EmergencyContact.find({ 
      userId: link.userId,
      memberId: link.memberId 
    });

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

    // Create Access Log
    await AccessLog.create({
      userId: link.userId,
      accessType: 'doctor',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    const profile = await Profile.findOne({ 
      userId: link.userId,
      memberId: link.memberId 
    });
    const medical = await MedicalDetails.findOne({ 
      userId: link.userId,
      memberId: link.memberId 
    });
    const contacts = await EmergencyContact.find({ 
      userId: link.userId,
      memberId: link.memberId 
    });
    const reports = await MedicalReport.find({ 
      userId: link.userId,
      memberId: link.memberId 
    });

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

export const getAccessLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const logs = await AccessLog.find({ userId: req.user.userId }).sort({ createdAt: -1 }).limit(20);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contacts = await EmergencyContact.find({ 
      userId: req.user.userId,
      memberId: req.user.memberId 
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contactsCount = await EmergencyContact.countDocuments({ 
      userId: req.user.userId,
      memberId: req.user.memberId 
    });
    if (contactsCount >= 2) {
      res.status(400).json({ message: 'Maximum 2 emergency contacts allowed' });
      return;
    }

    const contact = await EmergencyContact.create({
      userId: req.user.userId,
      memberId: req.user.memberId,
      ...req.body
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const togglePrivacy = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const link = await EmergencyLink.findOne({ 
      userId: req.user.userId,
      memberId: req.user.memberId 
    });
    if (!link) {
      res.status(404).json({ message: 'Emergency link not found' });
      return;
    }
    link.isLocked = !link.isLocked;
    await link.save();
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await EmergencyContact.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId,
      memberId: req.user.memberId 
    });
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
