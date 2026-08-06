import { useState } from 'react';
import { Shield, Plus, Minus, Search, HelpCircle, Activity, ArrowLeft, Zap, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      category: "Getting Started",
      q: "What is an Electronic Health Passport (EHP)?",
      a: "EHP is a simple digital health passport that keeps your essential medical details safe. In an emergency, first responders can scan your personal QR code or NFC tag to immediately view your blood group, allergies, and emergency contacts."
    },
    {
      category: "Privacy & Security",
      q: "Is my medical data private and secure?",
      a: "Yes! Your data is protected using strong medical-grade encryption. Your full medical history is locked, and only public emergency information (like blood type and allergies) is visible to responders unless unlocked with your permission."
    },
    {
      category: "Using QR & NFC",
      q: "How do I use my Emergency QR code?",
      a: "Go to the 'Emergency' section in your dashboard. You can save your QR code as your phone lock screen wallpaper, print it as a wallet card, or tap an NFC sticker on your phone case."
    },
    {
      category: "Family Records",
      q: "Can I add health records for my family members?",
      a: "Yes! You can easily add profiles for your children, spouse, or parents under your main account in the 'Family' section of your dashboard."
    },
    {
      category: "AI Health Assistant",
      q: "How does the AI Assistant help me?",
      a: "Our AI assistant reads your uploaded medical reports and explains complex lab results in simple, easy-to-understand language."
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-sky-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors duration-500 overflow-x-hidden text-slate-900 dark:text-white">
      
      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-sky-400/10 blur-[150px] rounded-full animate-pulse delay-700"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-2xl border-b border-blue-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-sky-400 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">EHP</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all">
            <ArrowLeft className="h-4 w-4" /> Go to Home
          </Link>
        </div>
      </nav>

      <main className="relative pt-40 pb-32">
        <div className="max-w-4xl mx-auto px-6">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 bg-blue-500/10 px-6 py-2.5 rounded-full border border-blue-500/20 mb-8">
               <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
               <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Frequently Asked Questions</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 text-slate-900 dark:text-white">How Can We Help You?</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto mb-10">
              Find answers to common questions about using your Electronic Health Passport.
            </p>

            <div className="relative max-w-xl mx-auto">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
               <input
                 type="text"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search questions..."
                 className="health-input pl-14 shadow-xl"
               />
            </div>
          </motion.div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] border border-blue-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-6 sm:p-8 text-left flex items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">{faq.category}</span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{faq.q}</h3>
                    </div>
                    <div className={`p-2 rounded-xl border transition-all ${isOpen ? 'bg-blue-500 text-white border-blue-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}>
                      {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 sm:px-8 pb-8 text-slate-600 dark:text-slate-300 font-medium leading-relaxed"
                      >
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>
      </main>

      <footer className="bg-white dark:bg-slate-950 border-t border-blue-100 dark:border-slate-800 py-12 text-center">
         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">&copy; {new Date().getFullYear()} EHP ELECTRONIC HEALTH PASSPORT</p>
      </footer>
    </div>
  );
};

export default FAQ;
