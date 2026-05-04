import React, { useState, useEffect } from 'react';
import { EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { encryptData, generateKey, storeKey, retrieveKey } from '../../utils/encryption';
import api from '../../services/api';

// Simple modal component for passphrase entry
const PassphraseModal = ({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (pass: string) => void }) => {
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (pass !== confirm) {
      setError('Passphrases do not match');
      return;
    }
    if (pass.length < 6) {
      setError('Passphrase must be at least 6 characters');
      return;
    }
    onSave(pass);
    setPass('');
    setConfirm('');
    setError('');
    onClose();
  };

  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Set Your Private Vault Passphrase</h2>
        <input
          type="password"
          placeholder="Passphrase"
          value={pass}
          onChange={e => setPass(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm Passphrase"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Privacy Vault component
const PrivacyVault = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  // On mount, check if a key is already stored (via passphrase)
  useEffect(() => {
    const stored = localStorage.getItem('ehp_user_passphrase');
    setHasKey(!!stored);
  }, []);

  const handlePassSave = async (pass: string) => {
    // Generate a fresh encryption key and store it encrypted with the passphrase
    const key = await generateKey();
    await storeKey(pass, key);
    localStorage.setItem('ehp_user_passphrase', pass);
    setHasKey(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadEncrypted = async () => {
    if (!hasKey) {
      setShowPassModal(true);
      return;
    }
    const pass = localStorage.getItem('ehp_user_passphrase') || '';
    setLoading(true);
    try {
      const keyBase64 = await retrieveKey(pass);
      if (!keyBase64) throw new Error('Unable to retrieve encryption key');
      // Read each file as ArrayBuffer, encrypt, and send to backend
      const encryptedPayloads = await Promise.all(
        files.map(async file => {
          const arrayBuffer = await file.arrayBuffer();
          // Convert binary to Uint8Array for encryption utility (it expects JSON-serializable, but we can wrap as base64 string)
          const data = { name: file.name, content: btoa(String.fromCharCode(...new Uint8Array(arrayBuffer))) };
          const encrypted = await encryptData(data, keyBase64);
          return { filename: file.name, ...encrypted };
        })
      );
      await api.post('/privacy/vault', { files: encryptedPayloads });
      setStatus('Files uploaded securely!');
      setFiles([]);
    } catch (err: any) {
      console.error(err);
      setStatus(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Passphrase modal */}
      <PassphraseModal open={showPassModal} onClose={() => setShowPassModal(false)} onSave={handlePassSave} />

      <h1 className="text-2xl font-bold mb-4">Privacy Vault</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Upload medical documents with Zero‑Knowledge encryption. Your data is encrypted in the browser and never readable by the server.
      </p>

      <input type="file" multiple onChange={handleFileChange} className="border p-2 rounded w-full" />
      {files.length > 0 && (
        <ul className="list-disc pl-5 text-sm">
          {files.map((f, i) => (
            <li key={i}>{f.name}</li>
          ))}
        </ul>
      )}

      <button
        onClick={uploadEncrypted}
        disabled={loading || files.length === 0}
        className="btn-primary px-6 py-2 mt-4 flex items-center gap-2"
      >
        {loading ? 'Encrypting...' : 'Upload Securely'}
        <EyeOff className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {status && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-4 text-sm text-emerald-700 dark:text-emerald-300"
          >
            {status}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrivacyVault;
