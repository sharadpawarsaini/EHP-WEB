import { useState } from 'react';
import { MapPin, Phone, Navigation, Search, Hospital } from 'lucide-react';

const HospitalFinderTab = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const findNearbyHospitals = async (lat: number, lng: number) => {
    setLoading(true);
    setError('');
    try {
      // Using OpenStreetMap's Overpass API (Free, no key needed)
      const query = `
        [out:json];
        node["amenity"="hospital"](around:5000, ${lat}, ${lng});
        out body;
      `;
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      const results = data.elements.map((el: any) => ({
        id: el.id,
        name: el.tags.name || 'Unnamed Hospital',
        address: el.tags['addr:street'] || 'Address not available',
        phone: el.tags.phone || el.tags['contact:phone'] || 'N/A',
        lat: el.lat,
        lng: el.lon,
        distance: calculateDistance(lat, lng, el.lat, el.lon).toFixed(1)
      })).sort((a: any, b: any) => a.distance - b.distance);

      setHospitals(results);
    } catch (err) {
      setError('Failed to fetch nearby hospitals. Please try again later.');
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

  const getMyLocation = () => {
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
        findNearbyHospitals(latitude, longitude);
      },
      (error) => {
        console.error('Location Error:', error);
        setError('Permission denied. Please enable location access to find hospitals.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hospital Finder</h2>
          <p className="text-gray-600 dark:text-gray-400">Quickly find and navigate to the nearest medical facilities.</p>
        </div>
        <button 
          onClick={getMyLocation}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" /> : <MapPin className="h-5 w-5" />}
          {loading ? 'Searching...' : 'Find Near Me'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 p-4 rounded-xl text-red-700 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      {!location && !loading && (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-12 text-center border border-dashed border-gray-200 dark:border-slate-700">
          <Hospital className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to Search?</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-8">Click the button above to allow location access and find hospitals within 5km of your current position.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                <Hospital className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                {hospital.distance} km away
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">{hospital.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 h-10">{hospital.address}</p>
            
            <div className="space-y-3">
              {hospital.phone !== 'N/A' && (
                <a href={`tel:${hospital.phone}`} className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                  <Phone className="h-4 w-4" /> {hospital.phone}
                </a>
              )}
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-gray-900 dark:bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors"
              >
                <Navigation className="h-4 w-4" /> Get Directions
              </a>
            </div>
          </div>
        ))}
      </div>

      {location && hospitals.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No hospitals found within 5km of your location.</p>
        </div>
      )}
    </div>
  );
};

export default HospitalFinderTab;
