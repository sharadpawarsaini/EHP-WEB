import { useState } from 'react';
import { Shield, Plus, Minus, Search, HelpCircle, Activity, ArrowLeft, Zap, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      category: "Critical Basics",
      q: "What is an Emergency Health Passport?",
      a: "EHP is a digital platform that stores your critical medical data and makes it accessible via a unique QR code node. In an emergency, first responders scan your code to see your blood group, allergies, and emergency contacts instantly."
    },
    {
      category: "Security & Encryption",
      q: "Is my medical data secure?",
      a: "Yes. We utilize industry-standard AES-256 encryption. Your deep clinical history is protected by a private 'Doctor Access Code' (Neural Key) that only you or your authorized nodes can decrypt."
    },
    {
      category: "Deployment",
      q: "How do I deploy the QR code?",
      a: "After finalizing your profile, navigate to the 'Emergency Command' center. Download the high-resolution QR node and set it as your device lock screen wallpaper or initialize an NFC physical bridge."
    },
    {
      category: "Advanced Features",
      q: "Can I manage my family nodes?",
      a: "Absolutely. Our 'Family Management' protocol allows you to initialize separate medical identities for your children, parents, or spouse under a single master account."
    },
    {
      category: "AI Integration",
      q: "What does the AI Synthesis do?",
      a: "Our AI engine (powered by Google Gemini) decrypts complex lab reports and clinical notes, synthesizing them into simplified, non-medical summaries for patient understanding while preserving clinical detail for doctors."
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-500 overflow-x-hidden selection:bg-primary-500/30">
      
      {/* Immersive Background Nodes */}
      <div className="absolute top-0 left-0 w-full h-[1000px] pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[80%] bg-primary-600/10 dark:bg-primary-600/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[70%] bg-emerald-600/10 dark:bg-emerald-600/5 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b border-gray-100 dark:border-white/5 bg-white/70 dark:bg-[#0A0A0A]/70">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary-600 p-2 rounded-xl shadow-2xl shadow-primary-600/20 group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">EHP</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-primary-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </nav>

      <main className="relative pt-40 pb-32">
        <div className="max-w-4xl mx-auto px-6">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-3 bg-emerald-50 dark:bg-emerald-600/10 px-6 py-2.5 rounded-full border border-emerald-100 dark:border-emerald-600/20 mb-8">
               <HelpCircle className="h-4 w-4 text-emerald-600" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Knowledge Base</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter leading-none">Frequently Asked <br/> Questions.</h1>
            
            {/* Search Hub */}
            <div className="relative max-w-xl mx-auto group">
               <div className="absolute inset-0 bg-primary-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative bg-white dark:bg-white/5 backdrop-blur-3xl border border-gray-100 dark:border-white/10 rounded-2xl flex items-center px-6 shadow-2xl">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search the protocol..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent border-none outline-none p-5 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 placeholder:font-black placeholder:uppercase placeholder:tracking-widest" 
                  />
               </div>
            </div>
          </motion.div>
          
          {/* FAQ Accordion */}
          <div className="space-y-6">
            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
              <motion.div 
                layout
                key={i} 
                className={`bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2rem] border transition-all duration-500 overflow-hidden shadow-2xl ${openIndex === i ? 'border-primary-500/30' : 'border-gray-100 dark:border-white/10'}`}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-10 py-8 flex justify-between items-center text-left group"
                >
                  <div className="space-y-1">
                     <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{faq.category}</span>
                     <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{faq.q}</h3>
                  </div>
                  <div className={`p-3 rounded-xl transition-all ${openIndex === i ? 'bg-primary-600 text-white' : 'bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-primary-50'}`}>
                    {openIndex === i ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-10 pb-8 text-gray-500 dark:text-gray-400 font-medium leading-relaxed"
                    >
                      <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )) : (
              <div className="py-20 text-center bg-gray-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-white/10">
                 <Info className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                 <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No matching protocol found.</p>
              </div>
            )}
          </div>

          {/* Help Sidebar */}
          <div className="mt-32 p-10 bg-gradient-to-br from-primary-600 to-emerald-700 rounded-[3rem] text-white text-center shadow-3xl shadow-primary-600/20 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
             <div className="relative z-10">
                <h4 className="text-2xl font-black mb-4 tracking-tighter">Still have questions?</h4>
                <p className="text-primary-100 font-medium mb-8">Connect with our support nodes for personalized technical assistance.</p>
                <Link to="/contact" className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                   Open Support Ticket <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
             </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 py-12 text-center">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">&copy; {new Date().getFullYear()} EHP GLOBAL REGISTRY • FAQ PROTOCOL</p>
      </footer>
    </div>
  );
};

export default FAQ;
