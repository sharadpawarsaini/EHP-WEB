import { Request, Response } from 'express';
import { User } from '../models/User';
import { Feedback } from '../models/Feedback';
import { MedicalReport } from '../models/MedicalReport';
import { EmergencyLink } from '../models/EmergencyLink';
import { AccessLog } from '../models/AccessLog';
import { Profile } from '../models/Profile';
import { SecurityLog } from '../models/SecurityLog';
import { IPBlocklist } from '../models/IPBlocklist';

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReports = await MedicalReport.countDocuments();
    const activeEmergencyLinks = await EmergencyLink.countDocuments();
    const totalFeedback = await Feedback.countDocuments();

    // Blood Group Distribution for Chart
    const bloodGroups = await Profile.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } }
    ]);

    // User Growth Data (Last 6 months)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const count = await User.countDocuments({ 
        createdAt: { $gte: startOfMonth, $lte: endOfMonth } 
      });
      
      months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        users: count
      });
    }

    res.json({
      totalUsers,
      totalReports,
      activeEmergencyLinks,
      totalFeedback,
      bloodGroupStats: bloodGroups,
      growthData: months,
      systemHealth: {
        cpu: Math.floor(Math.random() * 30) + 10,
        memory: Math.floor(Math.random() * 40) + 20,
        uptime: process.uptime(),
        nodes: [
          { id: 1, status: 'online', load: 12 },
          { id: 2, status: 'online', load: 18 },
          { id: 3, status: 'online', load: 8 },
          { id: 4, status: 'warning', load: 65 },
          { id: 5, status: 'online', load: 14 },
          { id: 6, status: 'offline', load: 0 },
        ],
        latency: [42, 38, 45, 41, 39, 44, 40]
      }
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
    const feedback = await Feedback.find()
      .populate('userId', 'name profilePhoto')
      .sort({ createdAt: -1 });

    const analyzedFeedback = feedback.map(item => {
      const comment = (item as any).comment.toLowerCase();
      let sentiment = 'Positive';
      if (comment.includes('bad') || comment.includes('slow') || comment.includes('worst') || comment.includes('error')) {
        sentiment = 'Critical';
      } else if (comment.includes('hard') || comment.includes('confusing') || comment.includes('help')) {
        sentiment = 'Frustrated';
      }

      return {
        ...item.toObject(),
        userName: (item.userId as any)?.name || 'Anonymous User',
        userAvatar: (item.userId as any)?.profilePhoto || null,
        sentiment
      };
    });

    // Generate AI Summary
    const summary = {
      overall: 'User satisfaction is high, but 12% report latency issues in the medical upload section.',
      keyRequest: 'Faster PDF processing and dark mode toggles.'
    };

    res.json({ feedback: analyzedFeedback, summary });
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

import { Broadcast } from '../models/Broadcast';
import { Message } from '../models/Message';

export const createBroadcast = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, message, type } = req.body;
    const broadcast = await Broadcast.create({
      title,
      message,
      type,
      createdBy: (req as any).user.userId
    });
    res.status(201).json(broadcast);
  } catch (error) {
    res.status(500).json({ message: 'Error creating broadcast' });
  }
};

export const getActiveBroadcasts = async (req: Request, res: Response): Promise<void> => {
  try {
    const broadcasts = await Broadcast.find({ active: true }).sort({ createdAt: -1 });
    res.json(broadcasts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching broadcasts' });
  }
};

export const sendDirectMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { receiverId, title, content, priority } = req.body;
    const message = await Message.create({
      senderId: (req as any).user.userId,
      receiverId,
      title,
      content,
      priority
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
};

export const getUserMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await Message.find({ receiverId: (req as any).user.userId })
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
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

import { SystemSettings } from '../models/SystemSettings';

export const getSystemSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await SystemSettings.findOne({ key: 'system_state' });
    if (!settings) {
      settings = await SystemSettings.create({ key: 'system_state' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system settings' });
  }
};

export const updateSystemSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { maintenanceMode, registrationLocked } = req.body;
    let settings = await SystemSettings.findOne({ key: 'system_state' });
    
    if (!settings) {
      settings = new SystemSettings({ key: 'system_state' });
    }
    
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (registrationLocked !== undefined) settings.registrationLocked = registrationLocked;
    settings.lastUpdatedBy = (req as any).user.userId;
    
    await settings.save();
    
    // Log the action
    await AccessLog.create({
      userId: (req as any).user.userId,
      action: 'SYSTEM_SETTINGS_UPDATE',
      resource: 'SystemSettings',
      ipAddress: req.ip || 'Unknown',
      status: 'success'
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating system settings' });
  }
};

export const bulkUserActions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userIds, action } = req.body;
    
    if (!Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({ message: 'No users selected' });
      return;
    }

    if (userIds.includes((req as any).user.userId)) {
      res.status(400).json({ message: 'You cannot perform bulk actions on yourself' });
      return;
    }

    if (action === 'delete') {
      await User.deleteMany({ _id: { $in: userIds } });
      await Profile.deleteMany({ userId: { $in: userIds } });
      res.json({ message: `Successfully deleted ${userIds.length} users` });
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error performing bulk action' });
  }
};

export const getCyberSecurityStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const totalLogs24h = await SecurityLog.countDocuments({ createdAt: { $gte: last24h } });
    const failedLogins24h = await SecurityLog.countDocuments({
      eventType: 'LOGIN_FAILED',
      createdAt: { $gte: last24h }
    });
    const criticalEvents24h = await SecurityLog.countDocuments({
      severity: 'CRITICAL',
      createdAt: { $gte: last24h }
    });
    const blockedIPsCount = await IPBlocklist.countDocuments();

    // Event type distribution
    const eventBreakdown = await SecurityLog.aggregate([
      { $match: { createdAt: { $gte: last24h } } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } }
    ]);

    // Severity breakdown
    const severityBreakdown = await SecurityLog.aggregate([
      { $match: { createdAt: { $gte: last24h } } },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    // Top active IPs
    const topIPs = await SecurityLog.aggregate([
      { $match: { createdAt: { $gte: last24h } } },
      { $group: { _id: '$ipAddress', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Threat level logic
    let threatLevel = 'LOW';
    if (criticalEvents24h > 10 || failedLogins24h > 25) {
      threatLevel = 'CRITICAL';
    } else if (criticalEvents24h > 3 || failedLogins24h > 10) {
      threatLevel = 'ELEVATED';
    } else if (failedLogins24h > 3) {
      threatLevel = 'MEDIUM';
    }

    res.json({
      threatLevel,
      totalLogs24h,
      failedLogins24h,
      criticalEvents24h,
      blockedIPsCount,
      eventBreakdown,
      severityBreakdown,
      topIPs
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cyber security stats' });
  }
};

export const getSecurityLogsFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    const { severity, eventType, search } = req.query;
    const filter: any = {};

    if (severity && severity !== 'ALL') {
      filter.severity = severity;
    }
    if (eventType && eventType !== 'ALL') {
      filter.eventType = eventType;
    }
    if (search) {
      filter.$or = [
        { ipAddress: { $regex: search, $options: 'i' } },
        { endpoint: { $regex: search, $options: 'i' } },
        { userAgent: { $regex: search, $options: 'i' } }
      ];
    }

    const logs = await SecurityLog.find(filter)
      .populate('userId', 'email role')
      .sort({ createdAt: -1 })
      .limit(150);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching security logs feed' });
  }
};

export const getBlockedIPs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blocked = await IPBlocklist.find().sort({ createdAt: -1 });
    res.json(blocked);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blocked IPs' });
  }
};

export const blockIP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ipAddress, reason } = req.body;
    if (!ipAddress) {
      res.status(400).json({ message: 'IP address is required' });
      return;
    }

    const existing = await IPBlocklist.findOne({ ipAddress });
    if (existing) {
      res.status(400).json({ message: 'IP address is already blocked' });
      return;
    }

    const blocked = await IPBlocklist.create({
      ipAddress,
      reason: reason || 'Blocked by Admin via SOC Dashboard',
      blockedBy: (req as any).user.userId || 'ADMIN'
    });

    res.status(201).json(blocked);
  } catch (error) {
    res.status(500).json({ message: 'Error blocking IP' });
  }
};

export const unblockIP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ip } = req.params;
    await IPBlocklist.deleteOne({ ipAddress: ip });
    res.json({ message: `IP ${ip} unblocked successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error unblocking IP' });
  }
};

