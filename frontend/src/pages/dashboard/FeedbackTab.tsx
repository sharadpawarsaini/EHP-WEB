import { useState } from 'react';
import { 
  Star, 
  Send, 
  CheckCircle, 
  MessageSquareHeart, 
  Smile, 
  Frown, 
  Meh, 
  Heart, 
  Sparkles, 
  Zap, 
  Bug, 
  Layout, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackTab = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [experience, setExperience] = useState('Excellent');
  const [topic, setTopic] = useState('General');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const experiences = [
    { id: 'Excellent', icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 'Good', icon: Smile, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'Average', icon: Meh, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: 'Poor', icon: Frown, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  ];

  const topics = [
    { id: 'General', icon: MessageCircle, label: 'General' },
    { id: 'UI/UX', icon: Layout, label: 'Design' },
    { id: 'Bug', icon: Bug, label: 'Report Bug' },
    { id: 'Feature', icon: Zap, label: 'Feature Request' },
    { id: 'Security', icon: ShieldCheck, label: 'Security' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      // Prepend topic to comment for the backend since it doesn't have a category field
      const finalComment = `[${topic}] ${comment}`;
      await api.post('/feedback', { rating, comment: finalComment, experience });
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-xl mx-auto"
      >
        <div className="relative mb-8">
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
             className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center relative z-10"
           >
             <CheckCircle className="h-16 w-16 text-emerald-600" />
           </motion.div>
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
             transition={{ repeat: Infinity, duration: 3 }}
             className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl -z-0"
           />
        </div>
        
        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">You're Awesome!</h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-10">
          Your insights are invaluable. We're already analyzing your feedback to make the Emergency Health Passport even more powerful for the global community.
        </p>
        
        <div className="grid grid-cols-2 gap-4 w-full">
           <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
              <Sparkles className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Impact</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">Community</p>
           </div>
           <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
              <Zap className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">Reviewed</p>
           </div>
        </div>

        <button 
          onClick={() => { setSubmitted(false); setRating(0); setComment(''); }}
          className="mt-12 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-xs hover:gap-4 transition-all"
        >
          <span>Share More Thoughts</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-xl">
           <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">Feedback Loop</span>
           </div>
           <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">Shape the Future of EHP</h2>
           <p className="text-gray-500 dark:text-gray-400 font-medium">Your experience fuels our innovation. Every word you share helps us protect lives better.</p>
        </div>
        <div className="flex -space-x-3">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-50 dark:border-slate-900 bg-gray-200 dark:bg-slate-800 overflow-hidden shadow-xl">
                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
             </div>
           ))}
           <div className="w-12 h-12 rounded-full border-4 border-slate-50 dark:border-slate-900 bg-blue-600 flex items-center justify-center text-white text-xs font-black shadow-xl">
              +5k
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
         <div className="lg:col-span-3">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Topic Selector */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-5">What are we talking about?</label>
                  <div className="flex flex-wrap gap-3">
                    {topics.map((t) => {
                      const Icon = t.icon;
                      const isActive = topic === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTopic(t.id)}
                          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 transition-all font-bold text-sm ${
                            isActive 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                              : 'bg-gray-50 dark:bg-slate-900/50 border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Experience Selection */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-5">Overall Experience</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {experiences.map((exp) => {
                      const Icon = exp.icon;
                      const isActive = experience === exp.id;
                      return (
                        <button
                          key={exp.id}
                          type="button"
                          onClick={() => setExperience(exp.id)}
                          className={`flex flex-col items-center gap-3 p-5 rounded-3xl border-2 transition-all relative overflow-hidden group ${
                            isActive 
                              ? `${exp.bg} border-blue-600 dark:border-blue-400` 
                              : 'bg-gray-50 dark:bg-slate-900/50 border-transparent hover:bg-gray-100 dark:hover:bg-slate-900'
                          }`}
                        >
                          <Icon className={`h-10 w-10 relative z-10 transition-transform group-hover:scale-110 ${isActive ? exp.color : 'text-gray-400'}`} />
                          <span className={`text-xs font-black uppercase tracking-tight relative z-10 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{exp.id}</span>
                          {isActive && <motion.div layoutId="bg-exp" className="absolute inset-0 bg-white/10 dark:bg-white/5 pointer-events-none" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-5">Product Rating</label>
                  <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-700 w-fit">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="transition-all active:scale-75 relative group"
                      >
                        <Star 
                          className={`h-10 w-10 transition-all duration-300 ${
                            star <= (hoverRating || rating) 
                              ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
                              : 'text-gray-200 dark:text-slate-700 group-hover:text-gray-300'
                          }`} 
                        />
                        {star <= rating && (
                           <motion.div 
                             layoutId="star-glow"
                             className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl pointer-events-none"
                           />
                        )}
                      </button>
                    ))}
                    <span className="ml-4 text-2xl font-black text-gray-900 dark:text-white">{rating || '-'}/5</span>
                  </div>
                </div>

                {/* Comment */}
                <div className="relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Detailed Insights</label>
                  <textarea
                    required
                    rows={6}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-6 rounded-3xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none"
                    placeholder="Tell us everything. What works? What doesn't? We're listening..."
                  ></textarea>
                  <div className="absolute bottom-4 right-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                     {comment.length} characters
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/40 transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98] group"
                >
                  {loading ? (
                    <div className="animate-spin h-6 w-6 border-4 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <>
                      <span>Transmit Feedback</span>
                      <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
         </div>

         <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-20">
                  <Heart className="h-32 w-32 text-red-500 animate-pulse" />
               </div>
               <h3 className="text-xl font-black mb-6 relative z-10 flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-emerald-400" />
                  Human Centric
               </h3>
               <p className="text-gray-400 font-medium leading-relaxed mb-8 relative z-10">
                  "Your privacy is our priority. Every feedback is encrypted and handled with the highest level of care. We use these insights solely to enhance your security."
               </p>
               <div className="pt-6 border-t border-white/10 relative z-10">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Lead Developer</p>
                  <p className="text-sm font-bold text-white mb-1">Sharad Pawar Saini</p>
                  <p className="text-xs text-blue-400">sharadpawarsaini@gmail.com</p>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-700">
               <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Community Pulse</h3>
               <div className="space-y-6">
                  {[
                    { label: 'Platform Satisfaction', val: 94 },
                    { label: 'Security Trust', val: 98 },
                    { label: 'Ease of Use', val: 89 },
                  ].map((item, idx) => (
                    <div key={idx}>
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{item.label}</span>
                          <span className="text-xs font-black text-blue-600">{item.val}%</span>
                       </div>
                       <div className="h-2 w-full bg-gray-100 dark:bg-slate-900 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.val}%` }}
                            transition={{ duration: 1, delay: idx * 0.2 }}
                            className="h-full bg-blue-600 rounded-full"
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] border border-blue-100 dark:border-blue-800/30 flex items-start gap-4">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                 <MessageSquareHeart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                 <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm mb-1">Direct Line</h4>
                 <p className="text-xs text-blue-700/70 dark:text-blue-400/70 leading-relaxed">
                   Need urgent help or have a business inquiry? Reach out directly. We aim for 24h response time.
                 </p>
              </div>
            </div>
          </div>
       </div>

       <div className="pt-10">
          <div className="flex items-center gap-4 mb-8">
             <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Community Wall of Love</h3>
             <div className="h-px flex-1 bg-gray-100 dark:bg-slate-800"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
             {[
               { name: 'Sarah J.', text: 'The SOS feature saved my life during a hiking accident. Amazing work!', rate: 5 },
               { name: 'David M.', text: 'Finally a health app that respects my privacy and connects my watch easily.', rate: 5 },
               { name: 'Linda K.', text: 'Managing my parents health profile has never been easier. Thank you EHP!', rate: 4 }
             ].map((wall, i) => (
               <div key={i} className="p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="flex gap-1 mb-4">
                     {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`h-3 w-3 ${s <= wall.rate ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                     ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic font-medium mb-6">"{wall.text}"</p>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600 uppercase tracking-widest">{wall.name.charAt(0)}</div>
                     <span className="text-xs font-black text-gray-900 dark:text-white">{wall.name}</span>
                  </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default FeedbackTab;
