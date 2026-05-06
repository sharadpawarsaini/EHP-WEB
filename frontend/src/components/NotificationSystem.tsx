import React, { useState, useEffect } from 'react';
import { Bell, X, Info, AlertTriangle, Zap, CheckCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const NotificationSystem = () => {
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPopup, setCurrentPopup] = useState<any>(null);
  const [hasSeenPopup, setHasSeenPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [broadcastRes, messageRes] = await Promise.all([
          api.get('/profile/broadcasts'),
          api.get('/profile/messages')
        ]);
        
        const combined = [
          ...broadcastRes.data.map((b: any) => ({ ...b, itemType: 'broadcast' })),
          ...messageRes.data.map((m: any) => ({ ...m, itemType: 'message', type: 'dm' }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setBroadcasts(combined);
        
        // Show popup for the latest broadcast if it's new
        if (broadcastRes.data.length > 0 && !hasSeenPopup) {
            const latest = broadcastRes.data[0];
            const seenId = localStorage.getItem('last_seen_broadcast');
            if (seenId !== latest._id) {
                setCurrentPopup(latest);
            }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchData();
  }, [hasSeenPopup]);

  const markAsSeen = () => {
      if (currentPopup) {
          localStorage.setItem('last_seen_broadcast', currentPopup._id);
          setCurrentPopup(null);
          setHasSeenPopup(true);
      }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'warning': return { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
      case 'emergency': return { icon: Zap, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
      case 'update': return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
      case 'dm': return { icon: User, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' };
      default: return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
    }
  };

  return (
    <>
      {/* Bell Icon & Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
        >
          <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          {broadcasts.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0A0A0A] animate-pulse"></span>
          )}
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 bg-[#0F0F0F] border border-white/10 rounded-[2rem] shadow-3xl z-[100] overflow-hidden backdrop-blur-2xl"
            >
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">System Transmissions</h3>
                <span className="px-2 py-0.5 bg-white/5 rounded-full text-[8px] font-black text-slate-500">{broadcasts.length} Active</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {broadcasts.map((b) => {
                  const styles = getTypeStyles(b.type);
                  return (
                    <div key={b._id} className="p-5 border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                      <div className="flex gap-4">
                        <div className={`w-8 h-8 rounded-lg ${styles.bg} flex items-center justify-center shrink-0`}>
                          <styles.icon className={`w-4 h-4 ${styles.color}`} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {b.itemType === 'message' ? `Direct: ${b.title}` : b.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            {b.itemType === 'message' ? b.content : b.message}
                          </p>
                          <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest pt-1 flex items-center gap-2">
                            {new Date(b.createdAt).toLocaleDateString()}
                            {b.itemType === 'message' && <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-md text-[6px]">PRIVATE</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {broadcasts.length === 0 && (
                  <div className="p-10 text-center">
                    <Bell className="w-8 h-8 text-white/5 mx-auto mb-3" />
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No Transmissions</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Popup */}
      <AnimatePresence>
        {currentPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className={`max-w-md w-full bg-[#0A0A0A] border rounded-[3rem] p-10 relative overflow-hidden shadow-3xl ${getTypeStyles(currentPopup.type).border}`}
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16 rounded-full"></div>
                
                <div className={`w-16 h-16 rounded-3xl ${getTypeStyles(currentPopup.type).bg} flex items-center justify-center mb-8 relative z-10`}>
                    {(() => {
                        const IconComponent = getTypeStyles(currentPopup.type).icon;
                        return <IconComponent className={`w-8 h-8 ${getTypeStyles(currentPopup.type).color}`} />;
                    })()}
                </div>

                <div className="relative z-10">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{currentPopup.title}</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Inbound System Transmission</p>
                    <p className="text-slate-300 leading-relaxed mb-10">{currentPopup.message}</p>
                    
                    <button 
                        onClick={markAsSeen}
                        className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-500 hover:text-white transition-all shadow-2xl shadow-white/5"
                    >
                        Acknowledge & Close
                    </button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationSystem;
