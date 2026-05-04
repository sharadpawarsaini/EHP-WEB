import React, { useState } from 'react';
import { EyeOff, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const StealthBanner = () => {
  const { isStealthMode } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (!isStealthMode) return null;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-zinc-950 text-white px-4 py-3 flex items-center justify-between gap-4 border-b border-amber-900/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full animate-pulse">
              <EyeOff className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Ghost Mode Active</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-zinc-400" />
              <p className="text-sm text-zinc-300 font-medium">
                Showing a <span className="text-amber-400 font-bold">sanitized ghost profile</span>. Your real medical data is fully hidden.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-zinc-500 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StealthBanner;
