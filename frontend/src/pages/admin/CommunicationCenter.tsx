import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Send, 
  Users, 
  MessageSquare, 
  Search, 
  ShieldCheck, 
  Bell, 
  Clock,
  Filter,
  CheckCircle,
  AlertTriangle,
  Zap,
  Info,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommunicationCenter = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messageForm, setMessageForm] = useState({ title: '', content: '', priority: 'normal' });
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '', type: 'info' });
  const [activeTab, setActiveTab] = useState('broadcast');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users');
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.profile?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/admin/broadcast', broadcastForm);
      setBroadcastForm({ title: '', message: '', type: 'info' });
      alert('Global broadcast transmitted successfully.');
    } catch (error) {
      alert('Broadcast transmission failed.');
    } finally {
      setSending(false);
    }
  };

  const handleSendDM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSending(true);
    try {
      await api.post('/admin/message', {
        receiverId: selectedUser._id,
        ...messageForm
      });
      setMessageForm({ title: '', content: '', priority: 'normal' });
      setSelectedUser(null);
      alert(`Message sent to ${selectedUser.profile?.fullName || selectedUser.email}`);
    } catch (error) {
      alert('Direct message failed to send.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20"></div>
      
      <header className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">Communication Hub</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Unified System-Wide Messaging Matrix</p>
        </div>
        <div className="flex bg-[#0A0A0A] p-1.5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('broadcast')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'broadcast' ? 'bg-emerald-500 text-black shadow-2xl shadow-emerald-500/20' : 'text-slate-500 hover:text-white'}`}
          >
            Global Broadcast
          </button>
          <button 
            onClick={() => setActiveTab('direct')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'direct' ? 'bg-blue-500 text-white shadow-2xl shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}
          >
            Direct Transmission
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column: Form Section */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'broadcast' ? (
              <motion.div 
                key="broadcast"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-[#0A0A0A] border border-emerald-500/20 p-10 rounded-[3rem] relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Global System Alert</h2>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Broadcast to all active EHP nodes</p>
                  </div>
                </div>

                <form onSubmit={handleSendBroadcast} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Transmission Subject</label>
                    <input 
                      required
                      value={broadcastForm.title}
                      onChange={(e) => setBroadcastForm({...broadcastForm, title: e.target.value})}
                      placeholder="e.g. Scheduled Maintenance Notice"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Alert Content</label>
                    <textarea 
                      required
                      rows={6}
                      value={broadcastForm.message}
                      onChange={(e) => setBroadcastForm({...broadcastForm, message: e.target.value})}
                      placeholder="Specify the full details of the system-wide message..."
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Criticality Level</label>
                      <select 
                        value={broadcastForm.type}
                        onChange={(e) => setBroadcastForm({...broadcastForm, type: e.target.value})}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500 transition-all text-xs"
                      >
                        <option value="info">System Information</option>
                        <option value="warning">Service Warning</option>
                        <option value="emergency">Emergency Protocol</option>
                        <option value="update">Infrastructure Update</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    disabled={sending}
                    type="submit"
                    className="w-full py-5 bg-emerald-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all flex items-center justify-center gap-3"
                  >
                    {sending ? 'Transmitting...' : (
                      <>
                        <Zap className="w-4 h-4" /> Initialize Global Broadcast
                      </>
                    )}
                  </button>
                </form>
                <div className="scanline"></div>
              </motion.div>
            ) : (
              <motion.div 
                key="direct"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-[#0A0A0A] border border-blue-500/20 p-10 rounded-[3rem] relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Direct Node Link</h2>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Private transmission to specific user</p>
                  </div>
                </div>

                {!selectedUser ? (
                  <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                    <UserIcon className="w-12 h-12 text-white/5 mx-auto mb-4" />
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Select a target from the registry to begin</p>
                  </div>
                ) : (
                  <form onSubmit={handleSendDM} className="space-y-6">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                          {selectedUser.profile?.fullName?.[0] || selectedUser.email[0]}
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Recipient Targeted</p>
                          <p className="text-white text-xs font-bold">{selectedUser.profile?.fullName || selectedUser.email}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setSelectedUser(null)} className="text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest">Change</button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Message Title</label>
                      <input 
                        required
                        value={messageForm.title}
                        onChange={(e) => setMessageForm({...messageForm, title: e.target.value})}
                        placeholder="e.g. Action Required: Document Verification"
                        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Message Content</label>
                      <textarea 
                        required
                        rows={6}
                        value={messageForm.content}
                        onChange={(e) => setMessageForm({...messageForm, content: e.target.value})}
                        placeholder="Enter the private message content..."
                        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Priority Flag</label>
                        <select 
                          value={messageForm.priority}
                          onChange={(e) => setMessageForm({...messageForm, priority: e.target.value})}
                          className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500 transition-all text-xs"
                        >
                          <option value="normal">Normal Priority</option>
                          <option value="high">High Priority</option>
                          <option value="urgent">Urgent Intervention</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      disabled={sending}
                      type="submit"
                      className="w-full py-5 bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/20 hover:bg-blue-400 transition-all flex items-center justify-center gap-3"
                    >
                      {sending ? 'Transmitting...' : (
                        <>
                          <Send className="w-4 h-4" /> Secure Transmission
                        </>
                      )}
                    </button>
                  </form>
                )}
                <div className="scanline"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: User Registry (for DM targeting) */}
        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[3rem] h-[calc(100vh-250px)] flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-500" /> Registry Search
            </h3>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name or email..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
            {filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  setActiveTab('direct');
                }}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 group ${selectedUser?._id === user._id ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${selectedUser?._id === user._id ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-500 group-hover:text-white'}`}>
                  {user.profile?.fullName?.[0] || user.email[0].toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-bold text-white truncate">{user.profile?.fullName || 'No Name'}</p>
                  <p className="text-[8px] font-medium text-slate-500 truncate">{user.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommunicationCenter;
