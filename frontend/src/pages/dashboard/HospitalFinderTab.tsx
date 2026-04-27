import { useState } from 'react';
import api from '../../services/api';
import { MapPin, Phone, Navigation, Search, Hospital, Pill, TestTube, Clock } from 'lucide-react';

const HospitalFinderTab = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeType, setActiveType] = useState('hospital');

  const finderTypes = [
    { id: 'hospital', label: 'Hospitals', icon: Hospital, color: 'text-blue-600 bg-blue-50' },
    { id: 'pharmacy', label: 'Pharmacies', icon: Pill, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'lab', label: 'Diagnostic Labs', icon: TestTube, color: 'text-purple-600 bg-purple-50' },
  ];

  const findNearby = async (lat: number, lng: number, type: string) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/hospitals/nearby?lat=${lat}&lng=${lng}&type=${type}`);
      
      const results = data.map((facility: any) => ({
        ...facility,
        distance: calculateDistance(lat, lng, facility.lat, facility.lng).toFixed(1)
      })).sort((a: any, b: any) => a.distance - b.distance);

      setFacilities(results);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Failed to fetch nearby facilities. Please try again later.');
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
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        findNearby(latitude, longitude, typeToSearch);
      },
      (error) => {
        console.error('Location Error:', error);
        setError('Permission denied. Please enable location access.');
        setLoading(false);
      }
    );
  };

  const handleTypeChange = (typeId: string) => {
    setActiveType(typeId);
    if (location) {
      findNearby(location.lat, location.lng, typeId);
    } else {
      getMyLocation(typeId);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Facility Finder</h2>
          <p className="text-gray-600 dark:text-gray-400">Locate essential health services within 10km of you.</p>
        </div>
        <button 
          onClick={() => getMyLocation()}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" /> : <MapPin className="h-5 w-5" />}
          {loading ? 'Searching...' : 'Refresh Location'}
        </button>
      </div>

      {/* Type Selector */}
      <div className="flex flex-wrap gap-4">
        {finderTypes.map((type) => {
          const Icon = type.icon;
          const isActive = activeType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => handleTypeChange(type.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all border-2 ${
                isActive 
                ? `${type.color} border-blue-600 dark:border-blue-400 scale-105 shadow-md` 
                : 'bg-white dark:bg-slate-800 border-transparent text-gray-500 hover:border-gray-200 dark:hover:border-slate-700'
              }`}
            >
              <Icon className="h-6 w-6" />
              {type.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 p-4 rounded-xl text-red-700 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      {!location && !loading && (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-12 text-center border border-dashed border-gray-200 dark:border-slate-700">
          <MapPin className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to Search?</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-8">Click a facility type above to allow location access and find medical services near you.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => {
          const ActiveIcon = finderTypes.find(t => t.id === activeType)?.icon || Hospital;
          return (
            <div key={facility.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${finderTypes.find(t => t.id === activeType)?.color}`}>
                  <ActiveIcon className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700/50 px-3 py-1 rounded-full">
                    {facility.distance} km
                  </span>
                  {facility.isOpen24 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">
                      <Clock className="h-3 w-3" /> 24/7 Open
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">{facility.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 h-10">{facility.address}</p>
              
              <div className="space-y-3">
                {facility.phone !== 'N/A' && (
                  <a href={`tel:${facility.phone}`} className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30 transition-colors hover:bg-blue-100">
                    <Phone className="h-4 w-4" /> {facility.phone}
                  </a>
                )}
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-gray-900 dark:bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors shadow-lg shadow-black/10"
                >
                  <Navigation className="h-4 w-4" /> Get Directions
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {location && facilities.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No {activeType}s found within 10km of your location.</p>
        </div>
      )}
    </div>
  );
};

export default HospitalFinderTab;
