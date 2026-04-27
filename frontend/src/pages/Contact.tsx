import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, MessageSquare, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <nav className="px-8 py-6 max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold dark:text-white">EHP</span>
        </Link>
        <Link to="/" className="text-sm font-bold text-blue-600 hover:underline">Back to Home</Link>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
              Have questions about your account, security, or how EHP works? We're here to help.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold dark:text-white">Email Us</h4>
                  <p className="text-gray-600 dark:text-gray-400">sharadpawarsaini@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold dark:text-white">Live Support</h4>
                  <p className="text-gray-600 dark:text-gray-400">Available Mon-Fri, 9am - 6pm</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                  <MapPin className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold dark:text-white">Location</h4>
                  <p className="text-gray-600 dark:text-gray-400">Global Service Hub</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input type="text" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 dark:text-white" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input type="email" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 dark:text-white" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea rows={4} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 dark:text-white" placeholder="How can we help?"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all">
                <Send className="h-5 w-5" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
