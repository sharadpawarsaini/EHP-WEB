import { Link } from 'react-router-dom';
import { Shield, Activity, Clock, QrCode, Heart, CheckCircle, ArrowRight, Smartphone, Stethoscope, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className="min-h-screen relative font-sans text-gray-900 dark:text-gray-100 overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 blur-[100px] rounded-full mix-blend-multiply"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
            <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">EHP</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/about" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">About</Link>
          <Link to="/faq" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">FAQ</Link>
          <Link to="/contact" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Contact</Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex bg-gray-100 dark:bg-slate-800 p-1 rounded-full border border-gray-200 dark:border-slate-700">
            {['en', 'hi', 'es'].map((lang) => (
              <button
                key={lang}
                onClick={() => i18n.changeLanguage(lang)}
                className={`px-2 py-1 rounded-full text-[9px] font-bold transition-all uppercase ${i18n.language.startsWith(lang) ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {lang}
              </button>
            ))}
          </div>
          <ThemeToggle />
          <Link to="/login" className="hidden sm:block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors">{t('nav_login', 'Log in')}</Link>
          <Link to="/register" className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg">
            {t('nav_get_started', 'Get Started')}
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-gray-200/50 dark:border-slate-700/50 px-4 py-2 rounded-full mb-6 shadow-sm"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">EHP 2.0 is now live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-5 leading-tight"
          >
            {t('home_hero_line1', 'Your life-saving data,')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">{t('home_hero_line2', 'instantly accessible.')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed px-2"
          >
            {t('home_hero_desc', 'The Emergency Health Passport gives first responders instant access to your critical medical history via a secure, beautifully designed QR code system.')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
          >
            <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-base sm:text-lg transition-all shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1">
              {t('home_cta_create', 'Create Free Profile')}
            </Link>
            <Link to="/login" className="sm:hidden bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 px-8 py-4 rounded-full font-semibold text-base transition-all shadow-md hover:-translate-y-1">
              Log In
            </Link>
          </motion.div>
        </div>

        <div className="mt-20 sm:mt-32 grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700 hover:-translate-y-2 transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <QrCode className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Instant QR Access</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Generate a unique QR code for your lock screen or wallet. First responders scan it for immediate context.</p>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700 hover:-translate-y-2 transition-all duration-300">
            <div className="bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/50 dark:to-rose-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Clock className="h-8 w-8 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Critical Time Saved</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">In emergencies, seconds matter. Your allergies, blood type, and conditions are immediately visible.</p>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700 hover:-translate-y-2 transition-all duration-300">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/50 dark:to-teal-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Shield className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Secure & Private</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Public profile only shows critical data. Full medical history requires your secure Doctor Access Code.</p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mt-32 pt-20 border-t border-gray-200/50 dark:border-slate-800">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6"
              >
                Our Mission is to <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">save lives.</span>
              </motion.h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Medical emergencies happen when we least expect them. Without access to your critical health history, first responders are flying blind. We believe everyone deserves to carry their medical identity safely and securely.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Empowering patients with their own data",
                  "Reducing medical errors in ERs globally",
                  "Providing peace of mind for families"
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 font-medium">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-[3rem] blur-2xl opacity-20 transform rotate-3"></div>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white dark:border-slate-700 p-8 rounded-[3rem] shadow-2xl dark:shadow-none relative z-10 flex flex-col items-center justify-center min-h-[400px]">
                <Heart className="h-24 w-24 text-rose-500 mb-6 drop-shadow-md animate-pulse" />
                <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Health First</h3>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-32 pt-20 border-t border-gray-200/50 dark:border-slate-800 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-16"
          >
            How EHP Works
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center group">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-blue-500/10 dark:shadow-none border border-blue-50 dark:border-slate-700 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                <Smartphone className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 dark:text-white">1. Build Profile</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-xs">Sign up and enter your essential health data, allergies, and emergency contacts.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center group">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-indigo-500/10 dark:shadow-none border border-indigo-50 dark:border-slate-700 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                <Lock className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 dark:text-white">2. Generate QR</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-xs">Get your unique QR code and private Doctor Access Code. Set it as your lock screen.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center group">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-purple-500/10 dark:shadow-none border border-purple-50 dark:border-slate-700 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                <Stethoscope className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 dark:text-white">3. Instant Access</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-xs">First responders scan your code to instantly view life-saving information.</p>
            </div>
          </div>
        </div>

        {/* Meet the Founder Section */}
        <div className="mt-32 pt-20 border-t border-gray-200/50 dark:border-slate-800">
          <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-3xl rounded-[2rem] sm:rounded-[4rem] p-6 sm:p-10 md:p-16 border border-white/50 dark:border-slate-700/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12 items-center relative z-10">
              <div className="lg:col-span-2">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative rounded-[3rem] overflow-hidden border-4 border-white dark:border-slate-700 shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500">
                    <img 
                      src="/assets/founder.jpeg" 
                      alt="Sharad Pawar Saini - Founder of EHP" 
                      className="w-full h-full object-cover aspect-[4/5]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://github.com/sharadpawarsaini/EHP-WEB/issues/1#issue-4338906456';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 pt-20">
                      <h4 className="text-2xl font-bold text-white mb-1">Sharad Pawar Saini</h4>
                      <p className="text-blue-400 font-bold text-sm tracking-widest uppercase">Founder & Lead Architect</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-3 space-y-8">
                <div className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest">
                  Meet the Visionary
                </div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  Driving Innovation in <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Emergency Healthcare.</span>
                </h2>
                <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  <p>
                    Sharad Pawar Saini is a Computer Science undergraduate and the Founder of EHP (Emergency Health Passport), a platform built to bridge the critical gap between patients and life-saving medical information during emergencies. With a clear vision to create real-world impact through technology, I lead the platform’s development, strategy, and long-term direction.
                  </p>
                  <p>
                    Focused on building scalable, secure, and user-centric solutions, he combines strong expertise in full-stack development with a problem-solving mindset to address real-world challenges. I am actively leveraging modern technologies such as AI, web platforms, and secure data systems to redefine how emergency healthcare information is accessed and utilized.
                  </p>
                  <p className="italic border-l-4 border-blue-600 pl-6 py-2 bg-blue-50/50 dark:bg-blue-900/10 rounded-r-2xl">
                    "My mission is to ensure that essential medical data is instantly available when it matters the most, ultimately aiming to build a reliable, globally accessible emergency healthcare support system."
                  </p>
                </div>
                
                <div className="flex gap-4 pt-4">
                   <div className="flex flex-col">
                      <span className="text-3xl font-black text-gray-900 dark:text-white">CS</span>
                      <span className="text-xs font-bold text-gray-500 uppercase">Undergrad</span>
                   </div>
                   <div className="w-px h-12 bg-gray-200 dark:bg-slate-700 mx-4"></div>
                   <div className="flex flex-col">
                      <span className="text-3xl font-black text-gray-900 dark:text-white">AI</span>
                      <span className="text-xs font-bold text-gray-500 uppercase">Focused</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern CTA */}
        <div className="mt-32 relative overflow-hidden rounded-[3rem] bg-gray-900 shadow-2xl">
          {/* CTA Background Gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-600 to-indigo-600 blur-[100px] opacity-40"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-rose-500 to-purple-600 blur-[100px] opacity-40"></div>
          
          <div className="relative z-10 px-6 sm:px-8 py-14 sm:py-20 md:py-28 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5">
              Ready to protect yourself?
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Join thousands of users who carry their medical identity with pride. It's 100% free, secure, and life-saving.
            </p>
            <Link to="/register" className="inline-flex items-center space-x-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-xl shadow-white/10">
              <span>Create Your Passport</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">EHP</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                The Emergency Health Passport gives first responders instant access to your critical medical history.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="/register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Create Profile</Link></li>
                <li><Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Log In</Link></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200/50 dark:border-slate-800 text-center md:text-left text-gray-500 dark:text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Emergency Health Passport. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Designed for safety.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
