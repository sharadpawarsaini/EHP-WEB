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
    <div className="min-h-screen bg-zinc-950 transition-colors duration-500 overflow-x-hidden selection:bg-cyan-500/30 text-white">
      
      {/* Background Infrastructure */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
        <div className="absolute inset-0 cyber-grid opacity-[0.05]"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-2xl border-b border-white/5 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-emerald-600 p-2.5 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">NEXUS EHP</span>
          </Link>
          <Link to="/" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-all">
            <ArrowLeft className="h-4 w-4" /> Back to Matrix
          </Link>
        </div>
      </nav>

      <main className="relative pt-40 pb-32">
        <div className="max-w-4xl mx-auto px-6">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24"
          >
            <div className="inline-flex items-center gap-4 bg-cyan-500/10 px-8 py-3 rounded-full border border-cyan-500/20 mb-10">
               <HelpCircle className="h-4 w-4 text-cyan-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500">Knowledge Archive</span>
            </div>
            <h1 className="text-5xl sm:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.9] uppercase">Support <br/> Manuals.</h1>
            
            {/* Search Hub */}
            <div className="relative max-w-xl mx-auto group">
               <div className="absolute inset-0 bg-cyan-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center px-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                  <Search className="h-6 w-6 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search the protocol..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent border-none outline-none p-6 text-base font-bold text-white placeholder:text-zinc-600 placeholder:font-black placeholder:uppercase placeholder:tracking-[0.3em]" 
                  />
               </div>
            </div>
          </motion.div>
          
          {/* FAQ Accordion */}
          <div className="space-y-8">
            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
              <motion.div 
                layout
                key={i} 
                className={`bg-white/5 backdrop-blur-2xl rounded-[3rem] border transition-all duration-500 overflow-hidden shadow-3xl ${openIndex === i ? 'border-cyan-500/30' : 'border-white/5'}`}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-12 py-10 flex justify-between items-center text-left group"
                >
                  <div className="space-y-2">
                     <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.6em]">{faq.category}</span>
                     <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{faq.q}</h3>
                  </div>
                  <div className={`p-4 rounded-2xl transition-all ${openIndex === i ? 'bg-cyan-500 text-zinc-950 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'bg-white/5 text-zinc-600 group-hover:bg-white/10'}`}>
                    {openIndex === i ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-12 pb-10 text-zinc-400 font-medium leading-relaxed italic"
                    >
                      <div className="pt-6 border-t border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )) : (
              <div className="py-24 text-center bg-white/5 rounded-[4rem] border-2 border-dashed border-white/5 shadow-inner">
                 <Info className="h-12 w-12 text-zinc-800 mx-auto mb-6" />
                 <p className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.5em]">No matching protocol entries found.</p>
              </div>
            )}
          </div>

          {/* Help Uplink */}
          <div className="mt-40 p-16 bg-zinc-900 border border-white/10 rounded-[5rem] text-white text-center shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
             <div className="relative z-10">
                <h4 className="text-4xl font-black mb-6 tracking-tighter uppercase leading-none">Still Disconnected?</h4>
                <p className="text-zinc-500 font-medium italic mb-12 max-w-lg mx-auto">Establish a secure signal link with our support nodes for direct technical synchronization.</p>
                <Link to="/contact" className="inline-flex items-center gap-4 bg-white text-zinc-950 px-12 py-6 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.5em] transition-all hover:scale-105 active:scale-95 shadow-2xl">
                   Open Signal Channel <ArrowLeft className="h-5 w-5 rotate-180" />
                </Link>
             </div>
          </div>
        </div>
      </main>

      <footer className="bg-zinc-950 border-t border-white/5 py-16 text-center">
         <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.6em]">&copy; {new Date().getFullYear()} NEXUS EHP GLOBAL REGISTRY • FAQ PROTOCOL</p>
      </footer>
    </div>
  );
};

export default FAQ;
