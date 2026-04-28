import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { Camera, UserCircle, UploadCloud, CheckCircle2 } from 'lucide-react';
import { differenceInYears, format } from 'date-fns';

const ProfileTab = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    dob: '',
    gender: 'Prefer not to say',
    bloodGroup: '',
    photoUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile');
        if (data && data.fullName) {
          setProfile({
            ...data,
            dob: data.dob ? data.dob.split('T')[0] : ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setUploading(true);
    try {
      const { data } = await api.post('/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile({ ...profile, photoUrl: data.photoUrl });
      setMessage('Profile photo updated');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/profile', profile);
      setMessage('Profile saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const getFullPhotoUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL.replace('/api', '')}${url}`;
  };

  if (loading) return <div className="text-gray-500 animate-pulse p-8">Loading profile...</div>;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Personal Profile</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your basic information and photo</p>
        </div>
        {message && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-400 rounded-xl flex items-center gap-2 shadow-sm animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-bold">{message}</span>
          </div>
        )}
      </div>
      
      <div className="mb-10 flex flex-col items-center md:items-start">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
            {profile.photoUrl ? (
              <img src={getFullPhotoUrl(profile.photoUrl)!} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-20 h-20 text-gray-300 dark:text-gray-500" />
            )}
            
            {uploading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 hover:scale-110 transition-all border-2 border-white dark:border-slate-800"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoUpload} 
            className="hidden" 
            accept="image/*"
          />
        </div>
        <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <UploadCloud className="h-3 w-3" /> Click camera to upload new photo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <input
              type="text"
              required
              value={profile.fullName}
              placeholder="Enter your full name"
              onChange={(e) => setProfile({...profile, fullName: e.target.value})}
              className="w-full px-5 py-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-[1.25rem] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white transition-all shadow-sm outline-none font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
            <input
              type="date"
              required
              value={profile.dob}
              onChange={(e) => setProfile({...profile, dob: e.target.value})}
              className="w-full px-5 py-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-[1.25rem] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white transition-all shadow-sm outline-none font-medium"
            />
            {profile.dob && (
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest ml-1">
                Calculated Age: {differenceInYears(new Date(), new Date(profile.dob))} Years
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
            <select
              value={profile.gender}
              onChange={(e) => setProfile({...profile, gender: e.target.value})}
              className="w-full px-5 py-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-[1.25rem] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white transition-all shadow-sm outline-none font-medium"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Blood Group</label>
            <select
              required
              value={profile.bloodGroup}
              onChange={(e) => setProfile({...profile, bloodGroup: e.target.value})}
              className="w-full px-5 py-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-[1.25rem] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white transition-all shadow-sm outline-none font-medium"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-100 dark:border-slate-700 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-70 disabled:translate-y-0"
          >
            {saving ? 'Updating Profile...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
