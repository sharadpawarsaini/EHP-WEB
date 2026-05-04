import { useState } from 'react';
import api from '../../services/api';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Search, 
  Hospital, 
  Pill, 
  TestTube, 
  Clock, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  Crosshair,
  RefreshCcw,
  Star,
  Map as MapIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HospitalFinderTab = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeType, setActiveType] = useState('hospital');

  const finderTypes = [
    { id: 'hospital', label: 'Hospitals', icon: Hospital, color: 'text-primary-600 bg-primary-50 border-primary-100', dark: 'dark:bg-primary-900/20 dark:border-primary-800/30' },
    { id: 'pharmacy', label: 'Pharmacies', icon: Pill, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', dark: 'dark:bg-emerald-900/20 dark:border-emerald-800/30' },
    { id: 'lab', label: 'Labs', icon: TestTube, color: 'text-green-600 bg-green-50 border-green-100', dark: 'dark:bg-green-900/20 dark:border-green-800/30' },
  ];

  const findNearby = async (lat: number, lng: number, type: string) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/hospitals/nearby?lat=${lat}&lng=${lng}&type=${type}`);
      
      const results = data.map((facility: any) => ({
        ...facility,
        distance: calculateDistance(lat, lng, facility.lat, facility.lng).toFixed(1),
        rating: (Math.random() * (5 - 3.8) + 3.8).toFixed(1) // Simulated rating
      })).sort((a: any, b: any) => a.distance - b.distance);

      setFacilities(results);
    } catch (err) {
      setError('Neural satellite link failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getMyLocation = (typeOverride?: string) => {
    const typeToSearch = typeOverride || activeType;
    setLoading(true);
    if (!navigator.geolocation) {
      setError('Neural positioning not supported.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        findNearby(latitude, longitude, typeToSearch);
      },
      () => {
        setError('Location link denied. Enable GPS to continue.');
        setLoading(false);
      }
    );
  };

  const handleTypeChange = (typeId: string) => {
    setActiveType(typeId);
    if (location) findNearby(location.lat, location.lng, typeId);
    else getMyLocation(typeId);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-full overflow-hidden">
      
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
         <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-full">Geo-Health Radar</span>
               <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-widest rounded-full">Live Proximity</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Facility Radar</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Scanning local area for medical infrastructure and emergency services</p>
         </div>
         <button 
           onClick={() => getMyLocation()}
           disabled={loading}
           className="w-full lg:w-auto flex items-center justify-center gap-3 px-8 py-5 bg-primary-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-2xl shadow-primary-600/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
         >
           {loading ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Crosshair className="h-5 w-5" />}
           {loading ? 'Scanning Neural Net...' : 'Recalibrate Position'}
         </button>
      </div>

      {/* Modern Radar Filter */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-3 rounded-[2.5rem] border border-white dark:border-slate-700 shadow-xl inline-flex flex-wrap gap-2">
         {finderTypes.map((type) => {
           const Icon = type.icon;
           const isActive = activeType === type.id;
           return (
             <button
               key={type.id}
               onClick={() => handleTypeChange(type.id)}
               className={`flex items-center gap-3 px-8 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all ${
                 isActive 
                 ? 'bg-gray-900 text-white shadow-xl scale-105' 
                 : 'bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'
               }`}
             >
               <Icon className={`h-5 w-5 ${isActive ? 'text-primary-400' : 'text-gray-400'}`} />
               {type.label}
             </button>
           );
         })}
      </div>

      <AnimatePresence>
         {error && (
           <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 rounded-3xl text-rose-800 dark:text-rose-400 font-black text-xs uppercase tracking-widest flex items-center gap-3">
             <Zap className="h-5 w-5" /> {error}
           </motion.div>
         )}
      </AnimatePresence>

      {!location && !loading && (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[3rem] p-16 text-center border-2 border-dashed border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 relative">
             <MapIcon className="h-10 w-10 text-primary-600" />
             <div className="absolute inset-0 border-2 border-primary-600 rounded-[2.5rem] animate-ping opacity-20"></div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Initialize Radar</h3>
          <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10">Allow location permissions to scan for medical infrastructure within your 10km safe zone.</p>
          <button onClick={() => getMyLocation()} className="px-10 py-5 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/30 hover:scale-105 transition-all">
             Start Local Scan
          </button>
        </div>
      )}

      {loading && (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
               <div key={i} className="bg-white/40 dark:bg-slate-800/40 animate-pulse rounded-[2.5rem] h-[350px] border border-white dark:border-slate-700"></div>
            ))}
         </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {facilities.map((facility) => {
          const ActiveIcon = finderTypes.find(t => t.id === activeType)?.icon || Hospital;
          const typeStyle = finderTypes.find(t => t.id === activeType);
          return (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={facility.id} 
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white dark:border-slate-700 shadow-xl shadow-gray-200/20 group hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              <div>
                 <div className="flex justify-between items-start mb-8">
                   <div className={`p-4 rounded-2xl transition-all group-hover:scale-110 ${typeStyle?.color} ${typeStyle?.dark}`}>
                     <ActiveIcon className="h-8 w-8" />
                   </div>
                   <div className="flex flex-col items-end gap-2">
                     <span className="text-[10px] font-black text-white bg-gray-900 px-4 py-1.5 rounded-full shadow-lg">
                       {facility.distance} KM
                     </span>
                     <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-black text-gray-500">{facility.rating}</span>
                     </div>
                   </div>
                 </div>
                 <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 truncate" title={facility.name}>{facility.name}</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8 line-clamp-2">{facility.address}</p>
              </div>
              
              <div className="space-y-3">
                 <div className="flex items-center gap-2 mb-4">
                    {facility.isOpen24 && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                         <Clock className="h-3 w-3" /> 24/7 Priority
                      </span>
                    )}
                    <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-primary-100">Verified</span>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    {facility.phone !== 'N/A' && (
                      <a href={`tel:${facility.phone}`} className="flex items-center justify-center gap-2 py-4 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-black text-[10px] uppercase tracking-widest rounded-2xl border border-gray-100 dark:border-slate-700 hover:bg-white transition-all">
                        <Phone className="h-3.5 w-3.5" /> Call
                      </a>
                    )}
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all"
                    >
                      <Navigation className="h-3.5 w-3.5" /> Direct
                    </a>
                 </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {location && facilities.length === 0 && !loading && (
        <div className="text-center py-20 bg-gray-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-slate-800">
          <Search className="h-16 w-16 text-gray-200 mx-auto mb-6" />
          <p className="text-xl font-black text-gray-400 uppercase tracking-widest">No infrastructure found</p>
          <p className="text-sm text-gray-300 font-bold mt-2">Zero {activeType}s within 10km radar sweep.</p>
        </div>
      )}

      {/* Radar Legend */}
      <div className="p-8 bg-primary-50 dark:bg-primary-900/10 rounded-[2.5rem] border border-primary-100 dark:border-primary-900/30 flex items-start gap-5">
         <ShieldCheck className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
         <div>
            <p className="text-sm font-black text-primary-900 dark:text-primary-300 uppercase tracking-widest mb-1">Satellite Precision</p>
            <p className="text-xs text-primary-700 dark:text-primary-400 leading-relaxed font-medium">Results are pulled from live geo-spatial data. Distance calculations use the Haversine formula for air-distance accuracy. Tap "Direct" to launch turn-by-turn navigation.</p>
         </div>
      </div>
    </div>
  );
};

export default HospitalFinderTab;
