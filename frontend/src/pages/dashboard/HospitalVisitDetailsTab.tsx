import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';

const HospitalVisitDetailsTab = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [visit, setVisit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const { data } = await api.get(`/visits/${id}`);
        setVisit(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load visit details.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVisit();
  }, [id]);

  if (loading) return <div className="text-gray-500 dark:text-gray-400">Loading visit details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!visit) return <div className="text-gray-500">Visit not found.</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-3 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="h-8 w-8 text-indigo-600" />
              {visit.hospitalName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4" />
              {format(new Date(visit.visitDate), 'MMMM dd, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-emerald-600" />
          Medical Documents
        </h2>
        
        {visit.documents && visit.documents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visit.documents.map((doc: any, index: number) => {
              const fileUrl = `${api.defaults.baseURL?.replace('/api', '') || ''}${doc.fileUrl}`;
              return (
                <div key={index} className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all group flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white truncate mb-2" title={doc.title}>
                      {doc.title}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-6">
                      {doc.fileType.includes('pdf') ? 'PDF Document' : 'Image File'}
                    </p>
                  </div>
                  <a 
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <Download className="h-4 w-4" /> View / Download
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 italic bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-slate-700">
            No medical documents were uploaded for this visit.
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalVisitDetailsTab;
