import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { PrivacyVault } from '../models/PrivacyVault';

const router = express.Router();

// @route   POST /api/privacy/vault
// @desc    Upload multiple zero-knowledge encrypted files to vault
// @access  Private
router.post('/vault', protect, async (req: any, res: any) => {
  try {
    const { files } = req.body;
    
    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ message: 'Invalid payload format' });
    }

    const userId = req.user._id;

    // Create array of documents to insert
    const documents = files.map((file: any) => ({
      userId,
      filename: file.filename,
      iv: file.iv,
      ciphertext: file.ciphertext
    }));

    await PrivacyVault.insertMany(documents);

    res.status(201).json({ message: 'Vault updated securely' });
  } catch (error) {
    console.error('Privacy Vault Upload Error:', error);
    res.status(500).json({ message: 'Failed to securely store vault documents' });
  }
});

// @route   GET /api/privacy/vault
// @desc    Get all encrypted vault files for user
// @access  Private
router.get('/vault', protect, async (req: any, res: any) => {
  try {
    const files = await PrivacyVault.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    console.error('Privacy Vault Fetch Error:', error);
    res.status(500).json({ message: 'Failed to fetch vault documents' });
  }
});

// @route   DELETE /api/privacy/vault/:id
// @desc    Delete a specific encrypted vault file
// @access  Private
router.delete('/vault/:id', protect, async (req: any, res: any) => {
  try {
    const file = await PrivacyVault.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!file) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json({ message: 'Document removed from vault' });
  } catch (error) {
    console.error('Privacy Vault Delete Error:', error);
    res.status(500).json({ message: 'Failed to delete vault document' });
  }
});

export default router;
