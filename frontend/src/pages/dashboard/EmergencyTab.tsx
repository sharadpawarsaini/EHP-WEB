import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Copy, Download, Link as LinkIcon, Printer, Lock, Unlock, CreditCard } from 'lucide-react';
import jsPDF from 'jspdf';

const EmergencyTab = () => {
  const [linkData, setLinkData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [publicSlug, setPublicSlug] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchLink();
    fetchProfile();
  }, []);

  const fetchLink = async () => {
    try {
      const { data } = await api.get('/emergency/link');
      setLinkData(data);
      setPublicSlug(data.link.publicSlug);
      setAccessCode(data.link.accessCode);
    } catch (err) {
      console.log('No link found');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/profile');
      setProfile(data);
    } catch (err) {
      console.log('Profile not found');
    }
  };

  const generateLink = async () => {
    setGenerating(true);
    const generatedSlug = publicSlug || Math.random().toString(36).substring(2, 8);
    const generatedCode = accessCode || Math.random().toString(36).substring(2, 8).toUpperCase();
    
    try {
      const { data } = await api.post('/emergency/link', {
        publicSlug: generatedSlug,
        accessCode: generatedCode
      });
      setLinkData(data);
    } catch (err) {
      console.error(err);
      alert('Failed to generate link');
    } finally {
      setGenerating(false);
    }
  };

  const togglePrivacy = async () => {
    try {
      const { data } = await api.post('/emergency/toggle-privacy');
      setLinkData({ ...linkData, link: data });
    } catch (err) {
      alert('Failed to toggle privacy');
    }
  };

  const downloadEmergencyCard = () => {
    if (!linkData || !profile) {
      alert("Please complete your profile and generate a link first.");
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 54] // Standard credit card size
    });

    // Background Gradient (Simplified for PDF)
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 85.6, 54, 'F');
    
    // Header Strip
    doc.setFillColor(220, 38, 38); // Red-600
    doc.rect(0, 0, 85.6, 12, 'F');

    // Logo Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EMERGENCY HEALTH PASSPORT', 5, 8);

    // Profile Info
    doc.setTextColor(31, 41, 55); // Gray-800
    doc.setFontSize(10);
    doc.text(profile.fullName.toUpperCase(), 5, 22);
    
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text('BLOOD GROUP', 5, 28);
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38); // Red-600
    doc.text(profile.bloodGroup || 'UNK', 5, 34);

    // Access Code
    doc.setFontSize(7);
    doc.setTextColor(107, 114, 128);
    doc.text('DOCTOR ACCESS CODE', 5, 42);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(linkData.link.accessCode, 5, 47);

    // QR Code
    // The qrDataUrl is a base64 image
    doc.addImage(linkData.qrDataUrl, 'PNG', 50, 15, 30, 30);
    
    doc.setFontSize(6);
    doc.setTextColor(156, 163, 175);
    doc.text('SCAN TO VIEW PROFILE', 54, 47);

    // Footer
    doc.setFillColor(243, 244, 246);
    doc.rect(0, 50, 85.6, 4, 'F');
    doc.setFontSize(5);
    doc.setTextColor(107, 114, 128);
    doc.text('EHP - SECURING LIVES THROUGH ONE SCAN', 25, 52.5);

    doc.save(`${profile.fullName.replace(/\s+/g, '_')}_Emergency_Card.pdf`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Access</h2>
            <p className="text-gray-600 dark:text-gray-400">Generate a unique link and QR code for first responders.</p>
          </div>
          {linkData && profile && (
            <button
              onClick={downloadEmergencyCard}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <CreditCard className="h-5 w-5" /> Download Wallet Card
            </button>
          )}
        </div>

        {!linkData ? (
          <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-8 text-center mt-8">
            <LinkIcon className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">No Emergency Link Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Create your public emergency link to generate your QR code and secure Doctor Access Code.</p>
            <button
              onClick={generateLink}
              disabled={generating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              {generating ? 'Generating...' : 'Generate Emergency Link'}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Public Emergency Link</label>
                <div className="flex bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600 overflow-hidden shadow-sm">
                  <input 
                    readOnly
                    value={`${window.location.origin}/e/${linkData.link.publicSlug}`}
                    className="flex-1 bg-transparent px-4 py-3 outline-none text-gray-900 dark:text-white"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/e/${linkData.link.publicSlug}`);
                      alert('Link copied!');
                    }}
                    className="px-4 border-l border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Doctor Access Code</label>
                <div className="p-5 bg-gray-900 dark:bg-black/50 rounded-xl flex items-center justify-between shadow-inner border border-gray-800">
                  <span className="text-3xl font-mono font-bold text-white tracking-widest">{linkData.link.accessCode}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(linkData.link.accessCode);
                      alert('Code copied!');
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Copy className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">Only share this code with trusted medical professionals.</p>
              </div>

              <div className="pt-4">
                <button
                  onClick={generateLink}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center transition-colors"
                >
                  Regenerate Link & Code
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-8 border border-gray-200 dark:border-slate-600 rounded-2xl bg-gray-50/50 dark:bg-slate-700/30">
              <div className="w-full mb-8 bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${linkData.link.isLocked ? 'bg-red-50 dark:bg-red-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
                      {linkData.link.isLocked ? <Lock className="h-5 w-5 text-red-600 dark:text-red-400" /> : <Unlock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Privacy Lock</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{linkData.link.isLocked ? 'Profile Hidden' : 'Profile Public'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={togglePrivacy}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${linkData.link.isLocked ? 'bg-red-500' : 'bg-emerald-500'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${linkData.link.isLocked ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className={`bg-white p-4 rounded-xl shadow-md mb-8 border border-gray-100 transition-opacity ${linkData.link.isLocked ? 'opacity-20 grayscale' : 'opacity-100'}`}>
                <img src={linkData.qrDataUrl} alt="Emergency QR Code" className="w-56 h-56" />
              </div>
              <div className="flex gap-4">
                <a 
                  href={linkData.qrDataUrl} 
                  download="ehp-qr-code.png"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm transition-colors"
                >
                  <Download className="h-4 w-4" /> QR Image
                </a>
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm transition-colors"
                >
                  <Printer className="h-4 w-4" /> Print Page
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyTab;
