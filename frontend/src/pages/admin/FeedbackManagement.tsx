import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Filter,
  User,
  Calendar,
  ChevronDown,
  Zap
} from 'lucide-react';

const FeedbackManagement = () => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      const { data } = await api.get('/admin/feedback');
      // The backend now returns { feedback, summary }
      setFeedback(data.feedback || []);
      setSummary(data.summary || null);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case 'Critical': return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
      case 'Frustrated': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      default: return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'Pending': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'Reviewed': return <AlertCircle className="w-4 h-4 text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/feedback/${id}`, { status });
      setFeedback(feedback.map(f => f._id === id ? { ...f, status } : f));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pb-20">
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20"></div>
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">Intelligence Feed</h1>
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em]">AI-Analyzed User Transmissions</p>
        </div>
        <button onClick={fetchFeedback} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group">
          <MessageSquare className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform" />
        </button>
      </header>

      {/* AI Summary Box */}
      {summary && (
        <div className="bg-[#0A0A0A] border border-emerald-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group z-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
            <div className="flex items-start gap-6 relative z-10">
                <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl shadow-emerald-500/20">
                    <Zap className="w-8 h-8 text-black" />
                </div>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">AI Executive Summary</h3>
                        <p className="text-emerald-500/70 text-[10px] font-black uppercase tracking-widest">Neural Analysis Complete</p>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed font-medium">{summary.overall}</p>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 rounded-lg">Top Request: {summary.keyRequest}</span>
                    </div>
                </div>
            </div>
            <div className="scanline"></div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 relative z-10">
        {feedback.map((item) => (
          <div 
            key={item._id} 
            className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[2rem] hover:border-emerald-500/30 transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center overflow-hidden border border-emerald-500/20">
                  {item.userAvatar ? (
                    <img src={item.userAvatar} alt={item.userName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-emerald-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-bold text-lg">{item.userName}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getSentimentStyles(item.sentiment)}`}>
                        {item.sentiment}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    Rating: {item.rating}/5
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                  item.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  item.status === 'Reviewed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {getStatusIcon(item.status)}
                  {item.status}
                </div>
                
                <div className="relative group/menu">
                  <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all z-10 overflow-hidden backdrop-blur-xl">
                    {['Pending', 'Reviewed', 'Resolved'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(item._id, status)}
                        className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                      >
                        Mark as {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/5 relative">
                <div className="absolute -top-3 left-6 px-3 bg-[#0A0A0A] text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] border border-emerald-500/20 rounded-full">
                    {item.experience} Experience
                </div>
              <p className="text-slate-300 leading-relaxed text-sm">{item.comment}</p>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.rating >= 4 ? 'bg-emerald-500' : item.rating >= 3 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                    Priority: {item.rating <= 2 ? 'High' : 'Normal'}
                </div>
                <button className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] hover:text-emerald-400 transition-colors">
                    Reply to User
                </button>
            </div>
          </div>
        ))}

        {feedback.length === 0 && (
          <div className="bg-[#0A0A0A] border border-white/5 p-16 rounded-[3rem] text-center">
            <MessageSquare className="w-16 h-16 text-white/5 mx-auto mb-6" />
            <h3 className="text-white font-bold text-xl">No Transmissions</h3>
            <p className="text-slate-500 text-sm mt-2">The feedback frequency is currently silent.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default FeedbackManagement;
