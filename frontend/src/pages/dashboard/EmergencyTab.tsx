import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Copy, Download, Link as LinkIcon, Printer, Lock, Unlock, CreditCard, Smartphone, ShieldAlert } from 'lucide-react';
import jsPDF from 'jspdf';

const EmergencyTab = () => {
  const [linkData, setLinkData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [publicSlug, setPublicSlug] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isWallpaperGenerating, setIsWallpaperGenerating] = useState(false);

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

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 85.6, 54, 'F');
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, 85.6, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EMERGENCY HEALTH PASSPORT', 5, 8);
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(10);
    doc.text(profile.fullName.toUpperCase(), 5, 22);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('BLOOD GROUP', 5, 28);
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text(profile.bloodGroup || 'UNK', 5, 34);
    doc.addImage(linkData.qrDataUrl, 'PNG', 45, 15, 30, 30);
    doc.setFontSize(6);
    doc.setTextColor(156, 163, 175);
    doc.text('SCAN TO VIEW PROFILE', 49, 47);
    doc.setFillColor(243, 244, 246);
    doc.rect(0, 50, 85.6, 4, 'F');
    doc.setFontSize(5);
    doc.setTextColor(107, 114, 128);
    doc.text('EHP - SECURING LIVES THROUGH ONE SCAN', 25, 52.5);
    doc.save(`${profile.fullName.replace(/\s+/g, '_')}_Emergency_Card.pdf`);
  };

  const generateLockScreenWallpaper = () => {
    if (!linkData || !profile) return;
    setIsWallpaperGenerating(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // iPhone 14 Pro Max / Standard High-Res Portrait Ratio (1290 x 2796)
    canvas.width = 1242;
    canvas.height = 2688;

    // Background - Dark Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0f172a'); // slate-900
    gradient.addColorStop(1, '#020617'); // slate-950
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle Grid Pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Top Header - Emergency Warning
    ctx.fillStyle = '#ef4444'; // red-500
    ctx.fillRect(0, 0, canvas.width, 300);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EMERGENCY MEDICAL INFO', canvas.width / 2, 180);

    // Patient Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 100px sans-serif';
    ctx.fillText(profile.fullName.toUpperCase(), canvas.width / 2, 550);

    // Blood Group
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 180px sans-serif';
    ctx.fillText(profile.bloodGroup || '??', canvas.width / 2, 850);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText('BLOOD GROUP', canvas.width / 2, 920);

    // QR Code Container
    const qrSize = 800;
    const qrX = (canvas.width - qrSize) / 2;
    const qrY = 1100;

    // White background for QR
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(qrX - 40, qrY - 40, qrSize + 80, qrSize + 80, 60);
    ctx.fill();

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

      // Bottom Message
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 50px sans-serif';
      ctx.fillText('SCAN IN CASE OF EMERGENCY', canvas.width / 2, 2100);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '40px sans-serif';
      ctx.fillText('EHP Health Passport • ehp.secure', canvas.width / 2, 2550);

      // Final Download
      const link = document.createElement('a');
      link.download = `${profile.fullName}_EHP_Wallpaper.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsWallpaperGenerating(false);
    };
    img.src = linkData.qrDataUrl;
  };

  if (loading) return <div className="text-gray-500 animate-pulse p-8">Loading emergency settings...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Emergency Access</h2>
            <p className="text-gray-500 dark:text-gray-400">Control your public profile and SOS tools</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {linkData && profile && (
              <>
                <button
                  onClick={downloadEmergencyCard}
                  className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 text-gray-700 dark:text-gray-200 px-5 py-3 rounded-2xl font-bold shadow-sm transition-all active:scale-95"
                >
                  <CreditCard className="h-5 w-5 text-blue-600" /> Wallet Card
                </button>
                <button
                  onClick={generateLockScreenWallpaper}
                  disabled={isWallpaperGenerating}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                >
                  <Smartphone className={`h-5 w-5 ${isWallpaperGenerating ? 'animate-bounce' : ''}`} /> 
                  {isWallpaperGenerating ? 'Generating...' : 'Lock Screen SOS'}
                </button>
              </>
            )}
          </div>
        </div>

        {!linkData ? (
          <div className="bg-blue-50/30 dark:bg-blue-900/10 border border-dashed border-blue-200 dark:border-blue-800/50 rounded-[2.5rem] p-12 text-center mt-8">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <LinkIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Activate Emergency Passport</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto font-medium">Get your unique QR code and private access key. Be prepared for the unexpected.</p>
            <button
              onClick={generateLink}
              disabled={generating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              {generating ? 'Processing...' : 'Generate My SOS Link'}
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-gray-100 dark:border-slate-700">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3">Public Profile URL</label>
                <div className="flex bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                  <input 
                    readOnly
                    value={`${window.location.origin}/e/${linkData.link.publicSlug}`}
                    className="flex-1 bg-transparent px-5 py-4 outline-none text-gray-900 dark:text-white font-medium"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/e/${linkData.link.publicSlug}`);
                      alert('Link copied to clipboard!');
                    }}
                    className="px-6 bg-blue-50 dark:bg-blue-900/30 border-l border-gray-100 dark:border-slate-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors flex items-center justify-center"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-3 tracking-wider flex items-center gap-2">
                   <ShieldAlert className="h-3 w-3 text-amber-500" /> Public link shows only basic life-saving info
                </p>
              </div>

              <div className="bg-gray-900 dark:bg-black p-8 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-all"></div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-4">Doctor Access Key</label>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-5xl font-black text-white tracking-[0.3em] font-mono">{linkData.link.accessCode}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(linkData.link.accessCode);
                      alert('Access key copied!');
                    }}
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                  >
                    <Copy className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                   <p className="text-xs text-amber-500 font-bold leading-relaxed">CRITICAL: Only share this with doctors to unlock your full medical history during an emergency.</p>
                </div>
              </div>

              <button
                onClick={generateLink}
                className="text-xs font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest flex items-center gap-2 transition-colors ml-2"
              >
                Regenerate Credentials
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-[2rem] shadow-sm relative">
              <div className="absolute top-6 left-6">
                 <div className={`p-2 rounded-xl ${linkData.link.isLocked ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {linkData.link.isLocked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                 </div>
              </div>
              
              <div className="text-center mb-8 pt-4">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Live QR Status</p>
                 <div className="flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${linkData.link.isLocked ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{linkData.link.isLocked ? 'HIDDEN' : 'ACTIVE'}</span>
                 </div>
              </div>

              <div className={`bg-white p-6 rounded-[2rem] shadow-2xl mb-8 border border-gray-100 transition-all duration-500 ${linkData.link.isLocked ? 'opacity-10 grayscale scale-95 rotate-6' : 'opacity-100'}`}>
                <img src={linkData.qrDataUrl} alt="Emergency QR Code" className="w-56 h-56" />
              </div>

              <button 
                onClick={togglePrivacy}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest mb-6 transition-all shadow-lg ${
                  linkData.link.isLocked 
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                  : 'bg-red-600 text-white shadow-red-600/20'
                }`}
              >
                {linkData.link.isLocked ? 'Activate QR Code' : 'Disable Public Access'}
              </button>

              <div className="flex gap-4 w-full">
                <a 
                  href={linkData.qrDataUrl} 
                  download="EHP_QR_CODE.png"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
                >
                  <Download className="h-3 w-3" /> Save PNG
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-600/20 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-center md:text-left">
               <h3 className="text-2xl font-black mb-3">Prepare your smartphone</h3>
               <p className="text-indigo-100 font-medium leading-relaxed">Did you know? First responders check phone lock screens first. Use our <strong>Lock Screen SOS</strong> feature to set a high-visibility wallpaper with your QR code.</p>
            </div>
            <button 
               onClick={generateLockScreenWallpaper}
               className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
               <Smartphone className="h-6 w-6" /> Create SOS Wallpaper
            </button>
         </div>
      </div>
    </div>
  );
};

export default EmergencyTab;
