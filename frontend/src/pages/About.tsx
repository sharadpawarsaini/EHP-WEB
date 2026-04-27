import { motion } from 'framer-motion';
import { Shield, Users, Heart, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <nav className="px-8 py-6 max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold dark:text-white">EHP</span>
        </Link>
        <Link to="/" className="text-sm font-bold text-blue-600 hover:underline">Back to Home</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6">Our Mission</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            EHP (Emergency Health Passport) was born out of a simple realization: In medical emergencies, 
            the difference between life and death is often **seconds** and **data**.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700">
            <Users className="h-10 w-10 text-blue-600 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">For Families</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We empower families to manage the health data of their loved ones—children, elderly parents, and even themselves—in one secure dashboard.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700">
            <Heart className="h-10 w-10 text-rose-600 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">For First Responders</h3>
            <p className="text-gray-600 dark:text-gray-400">
              By providing instant access to blood groups, allergies, and conditions, we give paramedics the "vision" they need to provide accurate care.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Why Choose EHP?</h2>
          {[
            { title: "Privacy First", desc: "Your data is encrypted. You choose what first responders see." },
            { title: "AI-Powered", desc: "We use advanced AI to help you understand your complex medical reports." },
            { title: "Global Standard", desc: "Our platform is built on OpenStreetMap and modern medical data protocols." }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h4>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default About;
