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
  ChevronDown
} from 'lucide-react';

const FeedbackManagement = () => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const { data } = await api.get('/admin/feedback');
      setFeedback(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'Pending': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'Reviewed': return <AlertCircle className="w-4 h-4 text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-emerald-400" />
          Feedback Hub
        </h1>
        <p className="text-slate-400 mt-1">Review and manage user suggestions and issues.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {feedback.map((item) => (
          <div 
            key={item._id} 
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{item.name || 'Anonymous User'}</h3>
                  <div className="text-slate-500 text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                  item.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  item.status === 'Reviewed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {getStatusIcon(item.status)}
                  {item.status}
                </div>
                
                <div className="relative group/menu">
                  <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all z-10 overflow-hidden">
                    {['Pending', 'Reviewed', 'Resolved'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(item._id, status)}
                        className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        Mark as {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-800/50">
              <p className="text-slate-300 leading-relaxed">{item.feedback}</p>
            </div>
            
            {item.email && (
              <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
                Contact: <span className="text-slate-400 underline decoration-slate-700">{item.email}</span>
              </div>
            )}
          </div>
        ))}

        {feedback.length === 0 && (
          <div className="bg-slate-900/50 border border-slate-800 p-12 rounded-3xl text-center">
            <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-white font-medium">No feedback yet</h3>
            <p className="text-slate-500">User feedback will appear here as it arrives.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackManagement;
