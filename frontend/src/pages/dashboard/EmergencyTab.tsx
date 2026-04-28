import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Copy, 
  Download, 
  Link as LinkIcon, 
  Printer, 
  Lock, 
  Unlock, 
  CreditCard, 
  Smartphone, 
  ShieldAlert, 
  User, 
  Phone, 
  MapPin, 
  Zap, 
  Rss, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  QrCode as QrIcon,
  Palette
} from 'lucide-react';
import jsPDF from 'jspdf';
import { useProfileContext } from '../../context/ProfileContext';
import { motion, AnimatePresence } from 'framer-motion';

const EmergencyTab = () => {
  const [linkData, setLinkData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [publicSlug, setPublicSlug] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isWallpaperGenerating, setIsWallpaperGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [cardColor, setCardColor] = useState('#ef4444'); // Red-500 default
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
    const base = api.defaults.baseURL?.replace('/api', '') || '';
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const downloadEmergencyCard = async () => {
    if (!linkData || !profile) return;

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 54]
    });

    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 85.6, 54, 'F');
    
    // Header Bar (Dynamic Color)
    doc.setFillColor(cardColor); 
    doc.rect(0, 0, 85.6, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('EMERGENCY HEALTH PASSPORT', 5, 8);
    
    const finalPhotoUrl = getFullPhotoUrl(profile.photoUrl || photoUrl);
    if (finalPhotoUrl) {
      try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = finalPhotoUrl;
        });
        doc.addImage(img, 'JPEG', 5, 15, 15, 15);
      } catch (e) {
        doc.rect(5, 15, 15, 15);
      }
    }

    doc.setTextColor(31, 41, 55);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(profile.fullName.toUpperCase(), 22, 19);
    
    doc.setFontSize(6);
    doc.setTextColor(107, 114, 128);
    doc.text('BLOOD GROUP', 22, 23);
    doc.setFontSize(10);
    doc.setTextColor(cardColor);
    doc.text(profile.bloodGroup || 'UNK', 22, 28);

    if (contacts && contacts.length > 0) {
      doc.setFontSize(6);
      doc.setTextColor(107, 114, 128);
      doc.text('EMERGENCY CONTACT', 5, 36);
      doc.setFontSize(7);
      doc.setTextColor(31, 41, 55);
      doc.text(`${contacts[0].name} (${contacts[0].relation})`, 5, 40);
      doc.setFontSize(8);
      doc.setTextColor(cardColor);
      doc.text(contacts[0].phone, 5, 44);
    }

    doc.addImage(linkData.qrDataUrl, 'PNG', 50, 14, 30, 30);
    doc.save(`${profile.fullName.replace(/\s+/g, '_')}_EHP_Card.pdf`);
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

    ctx.fillStyle = cardColor; 
    ctx.fillRect(0, 0, canvas.width, 300);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EMERGENCY MEDICAL INFO', canvas.width / 2, 180);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 100px sans-serif';
    ctx.fillText(profile.fullName.toUpperCase(), canvas.width / 2, 550);

    ctx.fillStyle = cardColor;
    ctx.font = 'bold 180px sans-serif';
    ctx.fillText(profile.bloodGroup || '??', canvas.width / 2, 850);
    
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
      const link = document.createElement('a');
      link.download = `${profile.fullName}_EHP_Wallpaper.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsWallpaperGenerating(false);
    };
    img.src = linkData.qrDataUrl;
  };

  const WalletCardPreview = () => (
    <div className="relative w-full max-w-[400px] aspect-[1.586/1] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 group transition-all duration-500">
      {/* Header */}
      <div className="h-[22%] flex items-center px-4 transition-colors duration-500" style={{ backgroundColor: cardColor }}>
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
              <p className="text-sm sm:text-lg font-black leading-none transition-colors duration-500" style={{ color: cardColor }}>{profile?.bloodGroup || '??'}</p>
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Emergency Contact</p>
            {contacts.length > 0 ? (
              <div className="min-w-0">
                <p className="text-[9px] font-black text-gray-800 truncate">{contacts[0].name} ({contacts[0].relation})</p>
                <p className="text-[10px] font-black transition-colors duration-500" style={{ color: cardColor }}>{contacts[0].phone}</p>
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

      <div className="bg-gray-50 h-[10%] flex items-center justify-center border-t border-gray-100">
        <p className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em]">EHP • Securing Lives Through One Scan</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading SOS Command...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-full overflow-hidden">
      
      {/* Header Widget */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white dark:border-slate-700">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
           <div className="flex items-center gap-5">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
                 <LinkIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Emergency Command</h2>
                 <p className="text-gray-500 dark:text-gray-400 font-medium">Configure your public-facing SOS identity</p>
              </div>
           </div>
           <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <button onClick={() => setShowPreview(!showPreview)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-200 hover:bg-gray-100 transition-all">
                 <Eye className="h-4 w-4" /> Responder Preview
              </button>
              {linkData && (
                <button onClick={downloadEmergencyCard} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                  <Printer className="h-4 w-4" /> Print Card
                </button>
              )}
           </div>
        </div>

        {!linkData ? (
          <div className="mt-10 p-12 text-center bg-gray-50/50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-700">
             <QrIcon className="h-20 w-20 text-gray-200 mx-auto mb-6" />
             <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Passport Offline</h3>
             <p className="text-gray-500 max-w-sm mx-auto mb-10">Your public emergency profile is currently inactive. Generate your secure link to enable SOS features.</p>
             <button onClick={generateLink} disabled={generating} className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:scale-105 transition-all">
                {generating ? 'Encrypting...' : 'Initialize SOS Link'}
             </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10 mt-12">
             <div className="lg:col-span-2 space-y-8">
                
                {/* QR Customizer */}
                <div className="p-8 bg-gray-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-gray-100 dark:border-slate-700">
                   <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                         <Palette className="h-4 w-4 text-blue-600" />
                         Identity Themes
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400">Card Color</p>
                   </div>
                   <div className="flex gap-4">
                      {['#ef4444', '#2563eb', '#10b981', '#f59e0b', '#7c3aed', '#111827'].map(c => (
                         <button 
                           key={c} 
                           onClick={() => setCardColor(c)}
                           className={`w-10 h-10 rounded-full border-4 transition-all ${cardColor === c ? 'border-white dark:border-slate-700 scale-125 shadow-lg' : 'border-transparent'}`} 
                           style={{ backgroundColor: c }}
                         />
                      ))}
                   </div>
                </div>

                <div className="bg-gray-900 p-8 rounded-[2.5rem] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                      <Zap className="h-24 w-24 text-blue-400" />
                   </div>
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-4">Doctor Decryption Key</label>
                   <div className="flex items-center gap-6">
                      <span className="text-4xl sm:text-6xl font-black text-white tracking-[0.3em] font-mono">{linkData.link.accessCode}</span>
                      <button onClick={() => { navigator.clipboard.writeText(linkData.link.accessCode); alert('Key Copied!'); }} className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all">
                         <Copy className="h-6 w-6" />
                      </button>
                   </div>
                   <div className="mt-8 flex items-start gap-4 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                      <AlertCircle className="h-5 w-5 text-blue-400" />
                      <p className="text-xs text-blue-100 font-medium leading-relaxed italic">Provide this key to medical professionals to unlock your full history. Do not share publicly.</p>
                   </div>
                </div>

                <div className="pt-4">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 ml-2">Digital Wallet Preview</h4>
                   <WalletCardPreview />
                </div>
             </div>

             <div className="space-y-8">
                {/* NFC Feature */}
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                   <div className="absolute -top-10 -right-10 opacity-5">
                      <Rss className="h-40 w-40" />
                   </div>
                   <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                      <Rss className="h-4 w-4 text-emerald-600" />
                      NFC Bridge
                   </h4>
                   <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
                      Connect your EHP to a physical NFC tag or sticker for instant "Tap-to-View" emergency response.
                   </p>
                   <button className="w-full py-4 bg-emerald-600/10 text-emerald-600 border border-emerald-600/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
                      Initialize NFC Write
                   </button>
                </div>

                <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-[2.5rem] shadow-sm relative">
                   <div className="absolute top-6 right-6">
                      <div className={`p-2 rounded-xl ${linkData.link.isLocked ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                         {linkData.link.isLocked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                      </div>
                   </div>
                   
                   <div className="text-center mb-10 pt-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Global Link Status</p>
                      <div className="flex items-center justify-center gap-2">
                         <div className={`w-2 h-2 rounded-full animate-pulse ${linkData.link.isLocked ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                         <span className="text-xs font-black text-gray-900 dark:text-white">{linkData.link.isLocked ? 'OFFLINE' : 'LIVE'}</span>
                      </div>
                   </div>

                   <div className={`bg-white p-6 rounded-[2.5rem] shadow-2xl mb-10 border border-gray-100 transition-all duration-700 ${linkData.link.isLocked ? 'opacity-20 blur-sm scale-90' : 'opacity-100'}`}>
                     <img src={linkData.qrDataUrl} alt="QR" className="w-48 h-48 sm:w-56 sm:h-56" />
                   </div>

                   <button 
                     onClick={togglePrivacy}
                     className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest mb-6 transition-all shadow-xl ${
                       linkData.link.isLocked 
                       ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                       : 'bg-rose-600 text-white shadow-rose-600/20'
                     }`}
                   >
                     {linkData.link.isLocked ? 'ACTIVATE PASSPORT' : 'DISABLE PUBLIC LINK'}
                   </button>

                   <a 
                     href={linkData.qrDataUrl} 
                     download="EHP_QR_CODE.png"
                     className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-200 hover:bg-gray-100 transition-all"
                   >
                     <Download className="h-4 w-4" /> Save High-Res PNG
                   </a>
                </div>
             </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
             <div className="bg-slate-900 w-full max-w-sm rounded-[3rem] border border-white/10 overflow-hidden relative shadow-2xl">
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-20"></div>
                <div className="h-[700px] overflow-y-auto p-8 pt-20 custom-scrollbar">
                   <div className="bg-rose-600 p-4 rounded-2xl mb-6 flex items-center gap-3">
                      <ShieldAlert className="h-6 w-6 text-white animate-pulse" />
                      <span className="text-xs font-black text-white uppercase tracking-widest">Responder View</span>
                   </div>
                   <div className="space-y-6 text-white">
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-16 rounded-2xl bg-white/10"></div>
                         <div>
                            <h5 className="font-black text-xl">{profile?.fullName}</h5>
                            <p className="text-rose-500 font-black text-sm">{profile?.bloodGroup} POSITIVE</p>
                         </div>
                      </div>
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                         <p className="text-[10px] font-black text-gray-500 uppercase">Emergency Contact</p>
                         <p className="font-bold text-lg">{contacts[0]?.name}</p>
                         <p className="text-rose-500 font-black text-xl">{contacts[0]?.phone}</p>
                      </div>
                      <div className="text-center p-8 bg-white/5 rounded-3xl border border-dashed border-white/10">
                         <Lock className="h-8 w-8 text-gray-600 mx-auto mb-4" />
                         <p className="text-xs text-gray-500 font-medium">Full medical history is encrypted. Enter Doctor Key to decrypt.</p>
                      </div>
                   </div>
                </div>
                <button onClick={() => setShowPreview(false)} className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.2em] text-xs">Exit Preview</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-600/20 overflow-hidden relative group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-center md:text-left">
               <h3 className="text-3xl font-black mb-4 tracking-tighter">Physical SOS Bridge</h3>
               <p className="text-indigo-100 font-medium leading-relaxed">Combine your digital passport with a physical lock screen wallpaper or a printable wallet card for 100% emergency coverage.</p>
            </div>
            <button onClick={generateLockScreenWallpaper} className="w-full md:w-auto bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
               <Smartphone className="h-6 w-6" /> {isWallpaperGenerating ? 'Processing...' : 'Create SOS Wallpaper'}
            </button>
         </div>
      </div>
    </div>
  );
};

export default EmergencyTab;
