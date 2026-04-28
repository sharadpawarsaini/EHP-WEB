import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Copy, Download, Link as LinkIcon, Printer, Lock, Unlock, CreditCard, Smartphone, ShieldAlert, User, Phone, MapPin } from 'lucide-react';
import jsPDF from 'jspdf';
import { useProfileContext } from '../../context/ProfileContext';

const EmergencyTab = () => {
  const [linkData, setLinkData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [publicSlug, setPublicSlug] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isWallpaperGenerating, setIsWallpaperGenerating] = useState(false);
  const { photoUrl } = useProfileContext();

  useEffect(() => {
    fetchLink();
    fetchProfile();
    fetchContacts();
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

  const fetchContacts = async () => {
    try {
      const { data } = await api.get('/emergency/contacts');
      setContacts(data);
    } catch (err) {
      console.log('Contacts not found');
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

  const getFullPhotoUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('data:')) return url;
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL.replace('/api', '')}${url}`;
  };

  const downloadEmergencyCard = async () => {
    if (!linkData || !profile) {
      alert("Please complete your profile and generate a link first.");
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 54] // Standard credit card size
    });

    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 85.6, 54, 'F');
    
    // Header Bar
    doc.setFillColor(220, 38, 38); // Red-600
    doc.rect(0, 0, 85.6, 12, 'F');
    
    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('EMERGENCY HEALTH PASSPORT', 5, 8);
    
    // Profile Photo
    const finalPhotoUrl = getFullPhotoUrl(profile.photoUrl || photoUrl);
    if (finalPhotoUrl) {
      try {
        // We need to convert image to base64 for jsPDF if it's a URL
        const img = new Image();
        img.crossOrigin = "Anonymous";
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = finalPhotoUrl;
        });
        doc.addImage(img, 'JPEG', 5, 15, 15, 15);
      } catch (e) {
        console.error("Failed to add profile photo to PDF", e);
      }
    } else {
      doc.setDrawColor(200, 200, 200);
      doc.rect(5, 15, 15, 15);
      doc.setFontSize(6);
      doc.setTextColor(150, 150, 150);
      doc.text('PHOTO', 8, 23);
    }

    // Name and Blood Group
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(profile.fullName.toUpperCase(), 22, 19);
    
    doc.setFontSize(6);
    doc.setTextColor(107, 114, 128);
    doc.text('BLOOD GROUP', 22, 23);
    doc.setFontSize(10);
    doc.setTextColor(220, 38, 38);
    doc.text(profile.bloodGroup || 'UNK', 22, 28);

    // Emergency Contact
    if (contacts && contacts.length > 0) {
      doc.setFontSize(6);
      doc.setTextColor(107, 114, 128);
      doc.setFont('helvetica', 'normal');
      doc.text('EMERGENCY CONTACT', 5, 36);
      doc.setFontSize(7);
      doc.setTextColor(31, 41, 55);
      doc.setFont('helvetica', 'bold');
      doc.text(`${contacts[0].name} (${contacts[0].relation})`, 5, 40);
      doc.setFontSize(8);
      doc.setTextColor(220, 38, 38);
      doc.text(contacts[0].phone, 5, 44);
    }

    // QR Code
    doc.addImage(linkData.qrDataUrl, 'PNG', 50, 14, 30, 30);
    doc.setFontSize(5);
    doc.setTextColor(156, 163, 175);
    doc.text('SCAN TO VIEW PROFILE', 54, 46);
    
    // Bottom Bar
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

    canvas.width = 1242;
    canvas.height = 2688;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0f172a'); 
    gradient.addColorStop(1, '#020617'); 
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    ctx.fillStyle = '#ef4444'; 
    ctx.fillRect(0, 0, canvas.width, 300);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EMERGENCY MEDICAL INFO', canvas.width / 2, 180);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 100px sans-serif';
    ctx.fillText(profile.fullName.toUpperCase(), canvas.width / 2, 550);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 180px sans-serif';
    ctx.fillText(profile.bloodGroup || '??', canvas.width / 2, 850);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText('BLOOD GROUP', canvas.width / 2, 920);

    // Add Emergency Contact to Wallpaper
    if (contacts && contacts.length > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = 'bold 60px sans-serif';
      ctx.fillText(`${contacts[0].name}: ${contacts[0].phone}`, canvas.width / 2, 1050);
    }

    const qrSize = 800;
    const qrX = (canvas.width - qrSize) / 2;
    const qrY = 1200;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(qrX - 40, qrY - 40, qrSize + 80, qrSize + 80, 60);
    ctx.fill();

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 50px sans-serif';
      ctx.fillText('SCAN IN CASE OF EMERGENCY', canvas.width / 2, 2200);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '40px sans-serif';
      ctx.fillText('EHP Health Passport • ehp.secure', canvas.width / 2, 2550);

      const link = document.createElement('a');
      link.download = `${profile.fullName}_EHP_Wallpaper.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsWallpaperGenerating(false);
    };
    img.src = linkData.qrDataUrl;
  };

  const WalletCardPreview = () => (
    <div className="relative w-full max-w-[400px] aspect-[1.586/1] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 group">
      {/* Header */}
      <div className="bg-red-600 h-[22%] flex items-center px-4">
        <h4 className="text-[10px] sm:text-xs font-black text-white uppercase tracking-tighter">Emergency Health Passport</h4>
      </div>
      
      {/* Content */}
      <div className="p-4 flex gap-4 h-[68%]">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex gap-3 items-start">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
              {getFullPhotoUrl(profile?.photoUrl || photoUrl) ? (
                <img src={getFullPhotoUrl(profile?.photoUrl || photoUrl)!} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-full h-full p-2 text-gray-300" />
              )}
            </div>
            <div className="min-w-0">
              <h5 className="text-xs sm:text-sm font-black text-gray-900 uppercase truncate leading-tight">{profile?.fullName}</h5>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Blood Group</p>
              <p className="text-sm sm:text-lg font-black text-red-600 leading-none">{profile?.bloodGroup || '??'}</p>
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Emergency Contact</p>
            {contacts.length > 0 ? (
              <div className="min-w-0">
                <p className="text-[9px] font-black text-gray-800 truncate">{contacts[0].name} ({contacts[0].relation})</p>
                <p className="text-[10px] font-black text-red-600">{contacts[0].phone}</p>
              </div>
            ) : (
              <p className="text-[9px] font-bold text-gray-300 italic">No contact added</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white p-1 border border-gray-100 rounded-lg shadow-sm">
            <img src={linkData?.qrDataUrl} alt="QR" className="w-full h-full" />
          </div>
          <p className="text-[6px] font-black text-gray-400 uppercase mt-1">Scan for Info</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 h-[10%] flex items-center justify-center border-t border-gray-100">
        <p className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em]">EHP • Securing Lives Through One Scan</p>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );

  if (loading) return <div className="text-gray-500 animate-pulse p-8">Loading emergency settings...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-full overflow-hidden">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-4 sm:p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Emergency Access</h2>
            <p className="text-gray-500 dark:text-gray-400">Control your public profile and SOS tools</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            {linkData && profile && (
              <>
                <button
                  onClick={downloadEmergencyCard}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 text-gray-700 dark:text-gray-200 px-5 py-3 rounded-2xl font-bold shadow-sm transition-all active:scale-95"
                >
                  <CreditCard className="h-5 w-5 text-blue-600" /> Wallet Card
                </button>
                <button
                  onClick={generateLockScreenWallpaper}
                  disabled={isWallpaperGenerating}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                >
                  <Smartphone className={`h-5 w-5 ${isWallpaperGenerating ? 'animate-bounce' : ''}`} /> 
                  {isWallpaperGenerating ? 'Generating...' : 'Lock Screen SOS'}
                </button>
              </>
            )}
          </div>
        </div>

        {!linkData ? (
          <div className="bg-blue-50/30 dark:bg-blue-900/10 border border-dashed border-blue-200 dark:border-blue-800/50 rounded-[2.5rem] p-8 sm:p-12 text-center mt-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <LinkIcon className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-3">Activate Emergency Passport</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto font-medium text-sm sm:text-base">Get your unique QR code and private access key. Be prepared for the unexpected.</p>
            <button
              onClick={generateLink}
              disabled={generating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 sm:px-10 sm:py-4 rounded-2xl font-black shadow-2xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
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
                    className="flex-1 bg-transparent px-4 py-3 sm:px-5 sm:py-4 outline-none text-gray-900 dark:text-white font-medium text-sm"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/e/${linkData.link.publicSlug}`);
                      alert('Link copied to clipboard!');
                    }}
                    className="px-4 sm:px-6 bg-blue-50 dark:bg-blue-900/30 border-l border-gray-100 dark:border-slate-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors flex items-center justify-center"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-3 tracking-wider flex items-center gap-2">
                   <ShieldAlert className="h-3 w-3 text-amber-500" /> Public link shows only basic life-saving info
                </p>
              </div>

              <div className="bg-gray-900 dark:bg-black p-6 sm:p-8 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-all"></div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-4">Doctor Access Key</label>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-3xl sm:text-5xl font-black text-white tracking-[0.3em] font-mono">{linkData.link.accessCode}</span>
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

              {/* Wallet Card Preview Section */}
              <div className="pt-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Wallet Card Preview</h4>
                <div className="flex justify-center lg:justify-start">
                  <WalletCardPreview />
                </div>
                <p className="text-xs text-gray-400 mt-4 italic font-medium">This is how your physical emergency card will look. Download the PDF to print it.</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-[2rem] shadow-sm relative">
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

              <div className={`bg-white p-4 sm:p-6 rounded-[2rem] shadow-2xl mb-8 border border-gray-100 transition-all duration-500 ${linkData.link.isLocked ? 'opacity-10 grayscale scale-95 rotate-6' : 'opacity-100'}`}>
                <img src={linkData.qrDataUrl} alt="Emergency QR Code" className="w-48 h-48 sm:w-56 sm:h-56" />
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
      
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl shadow-indigo-600/20 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-center md:text-left">
               <h3 className="text-xl sm:text-2xl font-black mb-3">Prepare your smartphone</h3>
               <p className="text-indigo-100 font-medium leading-relaxed text-sm sm:text-base">Did you know? First responders check phone lock screens first. Use our <strong>Lock Screen SOS</strong> feature to set a high-visibility wallpaper with your QR code.</p>
            </div>
            <button 
               onClick={generateLockScreenWallpaper}
               className="w-full md:w-auto bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
               <Smartphone className="h-6 w-6" /> Create SOS Wallpaper
            </button>
         </div>
      </div>
    </div>
  );
};

export default EmergencyTab;
