import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Activity, 
  Clock, 
  QrCode, 
  Heart, 
  CheckCircle, 
  ArrowRight, 
  Smartphone, 
  Stethoscope, 
  Lock, 
  Menu, 
  X,
  ShieldCheck,
  Globe,
  Database,
  Mic,
  Volume2,
  MessageSquare,
  Sparkles,
  Cross,
  FileText,
  UserPlus,
  PhoneCall
} from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  // AI Demo State
  const [showAIDemo, setShowAIDemo] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleAISpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      sendToAI(transcript);
    };

    recognition.start();
  };

  const sendToAI = async (message: string) => {
    setAiLoading(true);
    setAiResponse('');
    try {
      const response = await api.post('/ai/demo', {
        message,
        history: chatHistory
      });
      
      const newResponse = response.data.text;
      setAiResponse(newResponse);
      setChatHistory([...chatHistory, 
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: newResponse }] }
      ]);
      handleAISpeech(newResponse);
    } catch (err) {
      setAiResponse("Clinical Assistant is currently unavailable. Please try again in a moment.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-800 dark:text-slate-200 overflow-x-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-500 selection:bg-blue-200 dark:selection:bg-blue-900">
      
      {/* Clean Medical Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-md shadow-blue-600/20">
              <Activity className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">EHP Services</span>
              <span className="text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400 tracking-wider">Clinical Registry</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {['Patients', 'Providers', 'Emergency API', 'Contact'].map((item) => (
              <Link key={item} to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{item}</Link>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              {['en', 'hi'].map((lang) => (
                <button key={lang} onClick={() => i18n.changeLanguage(lang)} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all uppercase ${i18n.language.startsWith(lang) ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400'}`}>{lang}</button>
              ))}
            </div>
            <ThemeToggle />
            <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Patient Login</Link>
            <Link to="/register" className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 text-sm font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all">
              <UserPlus className="w-4 h-4" /> Register
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-900 dark:text-white">{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-[90] bg-white dark:bg-slate-900 pt-24 px-6">
             <div className="flex flex-col gap-6">
                {['Patients', 'Providers', 'Emergency API', 'Contact'].map((item) => (
                   <Link key={item} to={`/${item.toLowerCase().replace(' ', '-')}`} onClick={() => setMenuOpen(false)} className="text-2xl font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">{item}</Link>
                ))}
                <div className="pt-8 flex flex-col gap-4">
                   <Link to="/login" className="w-full py-4 text-center font-bold border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200">Patient Login</Link>
                   <Link to="/register" className="w-full py-4 text-center font-bold bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/20">Register Patient</Link>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative pt-20">
        
        {/* Clinical Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-slate-50 dark:from-slate-900 dark:to-slate-900 pt-20 pb-32">
          {/* Subtle medical cross background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] dark:opacity-[0.02] pointer-events-none">
             <svg width="800" height="800" viewBox="0 0 100 100" fill="currentColor" className="text-blue-900">
                <path d="M 35 0 L 65 0 L 65 35 L 100 35 L 100 65 L 65 65 L 65 100 L 35 100 L 35 65 L 0 65 L 0 35 L 35 35 Z" />
             </svg>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="max-w-2xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800/50 mb-8">
                  <ShieldCheck className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">HIPAA Compliant Protocol</span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
                  Critical Health <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Data Connectivity.</span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                  The Emergency Health Passport provides first responders and medical facilities with instant, secure access to life-saving patient medical records via QR technology.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 text-base font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all">
                    Create Patient Profile <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/about" className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white border-2 border-slate-200 dark:border-slate-700 py-4 px-8 text-base font-bold rounded-xl transition-all">
                    <Stethoscope className="w-4 h-4" /> Provider Access
                  </Link>
                </motion.div>

                {/* Trust Stats */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-10 mt-12 pt-10 border-t border-slate-200 dark:border-slate-800">
                  {[
                    { num: '256-bit', label: 'AES Encryption' },
                    { num: '< 2s', label: 'Record Retrieval' },
                    { num: '24/7', label: 'Emergency Uptime' },
                  ].map((s, i) => (
                    <div key={i}>
                      <p className="text-2xl font-black text-slate-900 dark:text-white mb-1">{s.num}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Clinical Visual */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="hidden lg:block relative">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 relative z-10">
                  
                  {/* Mock Medical Dashboard */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border-2 border-white dark:border-slate-600 shadow-sm">
                           <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Patient" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Alex R. Mercer</h3>
                          <p className="text-xs text-slate-500 font-medium">DOB: 12/04/1988 | Blood: O-</p>
                        </div>
                      </div>
                      <QrCode className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                         <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-rose-500" />
                            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Allergies</span>
                         </div>
                         <p className="font-bold text-slate-800 dark:text-white">Penicillin, Peanuts</p>
                         <p className="text-xs text-slate-500 mt-1">Severe anaphylaxis risk</p>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                         <div className="flex items-center gap-2 mb-2">
                            <Heart className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Conditions</span>
                         </div>
                         <p className="font-bold text-slate-800 dark:text-white">Type 1 Diabetes</p>
                         <p className="text-xs text-slate-500 mt-1">Insulin-dependent</p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Medications</span>
                         <span className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Verified</span>
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Novolog (Insulin Aspart)</span>
                            <span className="text-slate-500 text-xs">As directed</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Lisinopril</span>
                            <span className="text-slate-500 text-xs">10mg / Daily</span>
                         </div>
                      </div>
                    </div>
                  </div>

                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -left-6 bg-teal-500 text-white p-5 rounded-2xl shadow-xl z-20 flex items-center gap-3">
                  <ShieldCheck className="h-8 w-8" />
                  <div>
                     <p className="text-xs font-bold uppercase tracking-wider opacity-80">System Status</p>
                     <p className="font-bold">Records Secured</p>
                  </div>
                </div>
                <div className="absolute top-10 -right-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-10 -left-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl -z-10"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Clinical Protocol / How It Works */}
        <section className="py-24 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 block">Emergency Protocol</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">How First Responders Use EHP</h2>
              <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">A standardized, four-step clinical pathway ensuring rapid data delivery during critical interventions.</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Desktop connecting line */}
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-100 dark:bg-slate-800 z-0"></div>

              {[
                { icon: UserPlus, title: 'Patient Registration', desc: 'Patient securely inputs vital health markers, allergies, and emergency contacts into the encrypted vault.' },
                { icon: QrCode, title: 'ID Generation', desc: 'The system generates a secure, scan-ready QR passport linked to the patient\'s public identifiers.' },
                { icon: Smartphone, title: 'Emergency Scan', desc: 'Paramedics scan the QR code using any standard clinical device or smartphone during triage.' },
                { icon: Activity, title: 'Immediate Access', desc: 'Critical, life-saving context is displayed instantly, guiding rapid medical intervention.' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative z-10 text-center flex flex-col items-center">
                  <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full border-8 border-slate-50 dark:border-slate-950 flex items-center justify-center mb-6 shadow-xl shadow-blue-900/5">
                     <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <item.icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                     </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Clinical Features */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
               <div className="max-w-2xl">
                 <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 block">System Capabilities</span>
                 <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Comprehensive Health Infrastructure</h2>
                 <p className="text-slate-500 font-medium text-lg">Engineered to support modern medical facilities and protect patient identity.</p>
               </div>
               <Link to="/features" className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                  View full technical specs <ArrowRight className="w-4 h-4" />
               </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Lock, title: 'Zero-Knowledge Privacy', desc: 'Patient data is encrypted client-side. Not even EHP administrators can view the clinical details.', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-200 dark:bg-slate-800' },
                { icon: Globe, title: 'Universal Compatibility', desc: 'Accessible by any hospital system globally. No proprietary hardware or software required for triage.', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                { icon: FileText, title: 'Document Attachments', desc: 'Securely attach ECGs, MRI reports, and signed DNR directives to your digital passport.', color: 'text-teal-600', bg: 'bg-teal-100 dark:bg-teal-900/30' },
                { icon: PhoneCall, title: 'Automated SOS Alerts', desc: 'Emergency contacts are automatically pinged with GPS coordinates when a passport is scanned.', color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30' },
                { icon: Database, title: 'Audit Logging', desc: 'Every access attempt is logged with timestamp and IP address to ensure medical compliance.', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
                { icon: Stethoscope, title: 'Clinical AI Assistant', desc: 'Integrated clinical logic to highlight drug interactions and contraindications instantly.', color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
              ].map((feat, i) => {
                const Icon = feat.icon as any;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all group">
                     <div className={`w-14 h-14 rounded-xl ${feat.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-6 w-6 ${feat.color}`} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feat.title}</h3>
                     <p className="text-sm text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>


        {/* Clinical AI Assistant Section */}
        <section className="py-24 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
           <div className="max-w-7xl mx-auto px-6">
              <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
                 {/* Decorative */}
                 <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                 
                 <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-8">
                       <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                          <Sparkles className="w-4 h-4" /> EHP Intelligence
                       </span>
                       <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                         Clinical AI <br/>
                         Triage Assistant.
                       </h2>
                       <p className="text-lg text-slate-300 font-medium leading-relaxed">
                         Our proprietary AI engine analyzes the patient's passport in real-time, providing responders with voice-guided, prioritized first-aid protocols tailored specifically to the patient's underlying conditions and allergies.
                       </p>
                       <div className="flex gap-4 pt-4">
                          <button 
                            onClick={() => setShowAIDemo(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/50 flex items-center gap-3"
                          >
                            <Mic className="h-5 w-5" /> Test Voice Demo
                          </button>
                       </div>
                    </div>

                    <div className="relative">
                       <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl">
                          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                                   <Activity className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                   <p className="text-white font-bold">Active Incident</p>
                                   <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Patient ID: #8892-A</p>
                                </div>
                             </div>
                             <div className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-xs font-bold animate-pulse">
                                CRITICAL
                             </div>
                          </div>
                          
                          <div className="space-y-6">
                             <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                                   <UserPlus className="w-4 h-4 text-slate-400" />
                                </div>
                                <div className="bg-slate-700/50 rounded-2xl rounded-tl-none p-4 text-sm text-slate-200">
                                   Patient is unresponsive and swelling rapidly.
                                </div>
                             </div>
                             <div className="flex gap-4 flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                   <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl rounded-tr-none p-4 text-sm text-slate-200">
                                   <span className="font-bold text-white block mb-2">ALERT: Severe Peanut Allergy Detected.</span>
                                   Anaphylaxis highly probable. Locate patient's auto-injector (EpiPen) and administer to outer thigh immediately. Contacting EMS...
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Global CTA */}
        <section className="py-32 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
           {/* Background Grid Pattern */}
           <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3 }}></div>
           <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">Establish Your Clinical Identity</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 font-medium">Join thousands of patients who secure their medical future with the Emergency Health Passport. Fast, encrypted, and globally recognized.</p>
              <Link to="/register" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1">
                 Register Patient Profile <ArrowRight className="h-5 w-5" />
              </Link>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
               <div className="flex items-center gap-3 mb-6">
                  <div className="bg-slate-900 dark:bg-white p-2 rounded-lg text-white dark:text-slate-900">
                    <Activity className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">EHP Registry</span>
               </div>
               <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed mb-6">The secure, globally compliant standard for emergency medical data retrieval. Built for patients, engineered for responders.</p>
               <div className="flex gap-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"><Globe className="w-5 h-5"/></span>
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"><Shield className="w-5 h-5"/></span>
               </div>
            </div>
            {['Services', 'Compliance'].map((title, i) => (
              <div key={i}>
                 <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">{title}</h4>
                 <ul className="space-y-4">
                    {title === 'Services' ? (
                      <>
                        <li><Link to="/register" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Patient Registration</Link></li>
                        <li><Link to="/providers" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Healthcare Providers</Link></li>
                        <li><Link to="/about" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Platform Architecture</Link></li>
                      </>
                    ) : (
                      <>
                        <li><Link to="/hipaa" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">HIPAA Standards</Link></li>
                        <li><Link to="/privacy" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Privacy & Encryption</Link></li>
                        <li><Link to="/terms" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                      </>
                    )}
                 </ul>
              </div>
            ))}
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-medium text-slate-400">&copy; {new Date().getFullYear()} Emergency Health Passport Systems. All rights reserved.</p>
            <div className="flex gap-2">
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">System Status: Nominal</span>
            </div>
         </div>
      </footer>


      {/* AI Assistant Demo Panel */}
      <AnimatePresence>
        {showAIDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden relative flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-inner">
                       <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-900 dark:text-white leading-tight">Clinical AI Demo</h3>
                       <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Mock Patient: John Doe</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => {
                     setShowAIDemo(false);
                     window.speechSynthesis.cancel();
                   }}
                   className="p-2 bg-white dark:bg-slate-700 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm border border-slate-200 dark:border-slate-600"
                 >
                   <X className="h-5 w-5" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#0f172a] space-y-6">
                {aiResponse ? (
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                     <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">AI Response</p>
                     <div className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                       {aiResponse.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-blue-700 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 px-1 rounded">{part}</strong> : part)}
                     </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-10 space-y-4 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                       <Mic className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                       <p className="font-bold text-slate-700 dark:text-slate-300">Awaiting Voice Input</p>
                       <p className="text-xs text-slate-500 mt-1 max-w-xs">Ask the AI a triage question regarding the mock patient (e.g. Peanut Allergy)</p>
                    </div>
                  </div>
                )}
                {aiLoading && (
                  <div className="flex justify-center p-4">
                    <div className="flex gap-1.5 items-center">
                       <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
                       <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                       <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <button
                  onClick={startListening}
                  disabled={isListening || aiLoading}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-sm transition-all shadow-sm border ${isListening ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400 animate-pulse' : 'bg-blue-600 hover:bg-blue-700 border-blue-600 text-white shadow-blue-600/20'}`}
                >
                  {isListening ? (
                     <>
                       <div className="flex gap-1 items-center">
                         {[1,2,3,4].map(i => <motion.div key={i} animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }} className="w-1 bg-current rounded-full" />)}
                       </div>
                       Listening...
                     </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5" /> Click to Speak
                    </>
                  )}
                </button>
                
                <div className="pt-6 flex flex-wrap gap-2 justify-center">
                  <span className="w-full text-center text-xs font-semibold text-slate-400 mb-1">Try asking:</span>
                  {['Help, he ate a nut!', 'How to use EpiPen?', 'Is he in danger?'].map(tag => (
                    <button key={tag} onClick={() => sendToAI(tag)} className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700">{tag}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
