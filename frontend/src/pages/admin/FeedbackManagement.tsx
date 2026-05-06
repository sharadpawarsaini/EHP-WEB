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
      case 'Critical': return 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800';
      case 'Frustrated': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      default: return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved': return <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
      case 'Pending': return <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
      case 'Reviewed': return <AlertCircle className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />;
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
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-100 border-b-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-3">
             <div className="p-2.5 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                 <MessageSquare className="w-6 h-6 text-primary-600" />
             </div>
             User Feedback
          </h1>
          <p className="text-zinc-500 font-medium">Review and respond to platform experiences</p>
        </div>
        <button onClick={fetchFeedback} className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-primary-300 dark:hover:border-primary-700 rounded-xl transition-all shadow-sm flex items-center gap-2 group text-sm font-bold text-zinc-700 dark:text-zinc-300">
          <Zap className="w-4 h-4 text-amber-500" />
          Refresh Feed
        </button>
      </header>

      {/* AI Summary Box */}
      {summary && (
        <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800/30 p-6 sm:p-8 rounded-2xl relative overflow-hidden group shadow-sm z-10">
            <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                <div className="w-14 h-14 bg-white dark:bg-zinc-800 border border-primary-100 dark:border-primary-800 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                    <Zap className="w-6 h-6 text-primary-600" />
                </div>
                <div className="space-y-3">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">AI Executive Summary</h3>
                        <p className="text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mt-0.5">Automated Analysis</p>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed font-medium max-w-3xl">{summary.overall}</p>
                    <div className="flex items-center gap-3 pt-2">
                        <span className="px-3 py-1.5 bg-white dark:bg-zinc-800 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-lg border border-primary-100 dark:border-primary-800/50 shadow-sm">
                           Top Request: {summary.keyRequest}
                        </span>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 relative z-10">
        {feedback.map((item) => (
          <div 
            key={item._id} 
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl hover:border-primary-200 dark:hover:border-primary-800 transition-all shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center overflow-hidden">
                  {item.userAvatar ? (
                    <img src={item.userAvatar} alt={item.userName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-zinc-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-zinc-900 dark:text-white font-bold text-base">{item.userName}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getSentimentStyles(item.sentiment)}`}>
                        {item.sentiment}
                    </span>
                  </div>
                  <div className="text-zinc-500 text-xs font-semibold flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    {new Date(item.createdAt).toLocaleDateString()}
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                    Rating: {item.rating}/5
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                  item.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30' :
                  item.status === 'Reviewed' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30' :
                  'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30'
                }`}>
                  {getStatusIcon(item.status)}
                  {item.status}
                </div>
                
                <div className="relative group/menu">
                  <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all z-20 overflow-hidden">
                    {['Pending', 'Reviewed', 'Resolved'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(item._id, status)}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        Mark as {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800 relative mt-2">
                <div className="absolute -top-3 left-4 px-2 py-0.5 bg-white dark:bg-zinc-900 text-[10px] font-bold text-primary-600 border border-primary-200 dark:border-primary-800 rounded-md">
                    {item.experience} Experience
                </div>
              <p className="text-zinc-700 dark:text-zinc-300 text-sm pt-1">{item.comment}</p>
            </div>
            
            <div className="mt-5 flex items-center justify-between">
                <div className="text-xs font-bold text-zinc-500 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.rating >= 4 ? 'bg-emerald-500' : item.rating >= 3 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                    Priority: {item.rating <= 2 ? 'High' : 'Normal'}
                </div>
                <button className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">
                    Reply to User
                </button>
            </div>
          </div>
        ))}

        {feedback.length === 0 && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-16 rounded-2xl text-center shadow-sm">
            <MessageSquare className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-zinc-900 dark:text-white font-bold text-lg">No Feedback Found</h3>
            <p className="text-zinc-500 text-sm mt-1">Check back later for user reviews.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default FeedbackManagement;
