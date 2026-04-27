import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      q: "What is an Emergency Health Passport?",
      a: "EHP is a digital platform that stores your critical medical data and makes it accessible via a unique QR code. In an emergency, first responders scan your code to see your blood group, allergies, and emergency contacts instantly."
    },
    {
      q: "Is my data secure?",
      a: "Yes. We use industry-standard encryption to protect your data. Your full medical history is protected by a private 'Doctor Access Code' that only you or your trusted family members know."
    },
    {
      q: "How do I use the QR code?",
      a: "After building your profile, go to the 'Emergency Link' tab. Download the QR code and set it as your phone's lock screen wallpaper or print it as a wallet card."
    },
    {
      q: "Can I manage my family's records?",
      a: "Absolutely. Our 'Family Management' feature allows you to create separate profiles for your children, parents, or spouse under a single account."
    },
    {
      q: "What does the AI Analysis do?",
      a: "Our AI (powered by Google Gemini) scans your uploaded lab reports or doctor's notes and summarizes them into simple, non-medical terms so you can understand your health better."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <nav className="px-8 py-6 max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold dark:text-white">EHP</span>
        </Link>
        <Link to="/" className="text-sm font-bold text-blue-600 hover:underline">Back to Home</Link>
      </nav>

      <main className="max-w-3xl mx-auto px-8 py-20">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-12 text-center">Frequently Asked Questions</h1>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 flex justify-between items-center text-left"
              >
                <span className="text-lg font-bold text-gray-900 dark:text-white">{faq.q}</span>
                {openIndex === i ? <Minus className="h-5 w-5 text-blue-600" /> : <Plus className="h-5 w-5 text-gray-400" />}
              </button>
              {openIndex === i && (
                <div className="px-8 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FAQ;
