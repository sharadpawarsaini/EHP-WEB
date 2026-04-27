import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle, MessageSquareHeart, Smile, Frown, Meh, Languages } from 'lucide-react';
import api from '../../services/api';

const FeedbackTab = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [experience, setExperience] = useState('Excellent');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const experiences = [
    { id: 'Excellent', icon: Smile, color: 'text-emerald-500' },
    { id: 'Good', icon: Smile, color: 'text-blue-500' },
    { id: 'Average', icon: Meh, color: 'text-amber-500' },
    { id: 'Poor', icon: Frown, color: 'text-rose-500' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await api.post('/feedback', { rating, comment, experience });
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-12 w-12 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Thank You!</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-8">
          Your feedback has been received. We appreciate you helping us make EHP better for everyone.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="text-blue-600 font-bold hover:underline"
        >
          Submit another feedback
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share Your Experience</h2>
        <p className="text-gray-600 dark:text-gray-400">Your feedback helps us improve the platform for life-saving emergencies.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Experience Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">How was your overall experience?</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {experiences.map((exp) => {
                const Icon = exp.icon;
                const isActive = experience === exp.id;
                return (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setExperience(exp.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600 dark:border-blue-400' 
                        : 'bg-gray-50 dark:bg-slate-900/50 border-transparent hover:border-gray-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`h-8 w-8 ${isActive ? exp.color : 'text-gray-400'}`} />
                    <span className={`text-xs font-bold ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500'}`}>{exp.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Rate the features (1-5 Stars)</label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-90"
                >
                  <Star 
                    className={`h-10 w-10 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-slate-700'}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Detailed Feedback</label>
            <textarea
              required
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Tell us what you liked or what we can improve..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
          >
            {loading ? <div className="animate-spin h-6 w-6 border-2 border-white/30 border-t-white rounded-full" /> : <Send className="h-6 w-6" />}
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      <div className="flex items-center gap-3 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
        <MessageSquareHeart className="h-8 w-8 text-blue-600" />
        <p className="text-sm text-blue-800 dark:text-blue-300">
          Your feedback is directly shared with the development team at <strong>sharadpawarsaini@gmail.com</strong>.
        </p>
      </div>
    </div>
  );
};

export default FeedbackTab;
