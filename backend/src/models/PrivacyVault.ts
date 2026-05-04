import mongoose from 'mongoose';

const privacyVaultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  ciphertext: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const PrivacyVault = mongoose.model('PrivacyVault', privacyVaultSchema);
