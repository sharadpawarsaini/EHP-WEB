import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Hospital, 
  Calendar, 
  FileText, 
  ChevronRight, 
  Search, 
  Download, 
  Plus,
  ArrowLeft,
  Clock,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const HospitalVisitsTab = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const { data } = await api.get('/visits');
      setVisits(data.sort((a: any, b: any) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()));
    } catch (err) {
      console.error('Failed to fetch visits');
    } finally {
      setLoading(false);
    }
  };

  const filteredVisits = visits.filter(v => 
    v.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFullFileUrl = (url: string) => {
    if (!url) return '';
    return `${api.defaults.baseURL?.replace('/api', '') || ''}${url}`;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
      <p className="text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase text-[10px]">Retrieving Visit History...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
        <div className="flex items-center gap-5">
           <button 
             onClick={() => navigate('/dashboard')}
             className="p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-400 hover:text-emerald-600 transition-all"
           >
              <ArrowLeft className="h-6 w-6" />
           </button>
           <div className="p-4 bg-emerald-600 rounded-[1.5rem] shadow-lg shadow-emerald-600/20">
              <Hospital className="h-8 w-8 text-white" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Visit History</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Archive of all clinical hospital visits and records</p>
           </div>
        </div>
        <button 
          onClick={() => navigate('/dashboard/medical')}
          className="flex items-center gap-2 px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          <Plus className="h-4 w-4" /> Add New Visit
        </button>
      </div>

      {/* Search & Stats */}
      <div className="grid md:grid-cols-3 gap-6">
         <div className="md:col-span-2 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search by hospital name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white dark:border-slate-700 rounded-[2rem] focus:ring-4 focus:ring-emerald-500/10 outline-none text-gray-900 dark:text-white font-bold transition-all shadow-sm"
            />
         </div>
         <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-[2rem] p-6 flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Total Records</p>
               <p className="text-3xl font-black text-gray-900 dark:text-white">{visits.length}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
               <Clock className="h-6 w-6 text-emerald-600" />
            </div>
         </div>
      </div>

      {/* Visits Cards Grid */}
      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredVisits.map((visit) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={visit._id} 
              className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-slate-700 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden hover:border-emerald-500/30 transition-all"
            >
               <div className="p-8 sm:p-10 flex flex-col lg:flex-row gap-10">
                  {/* Info Sidebar of Card */}
                  <div className="lg:w-1/3 space-y-6">
                     <div className="flex items-start gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700">
                           <Hospital className="h-6 w-6 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                        </div>
                        <div>
                           <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">{visit.hospitalName}</h3>
                           <div className="flex items-center gap-2 mt-1 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(visit.visitDate), 'MMMM dd, yyyy')}
                           </div>
                        </div>
                     </div>
                     <div className="pt-6 border-t border-gray-100 dark:border-slate-700 space-y-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quick Actions</p>
                        <div className="flex flex-wrap gap-2">
                           <button 
                             onClick={() => navigate(`/dashboard/visits/${visit._id}`)}
                             className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-emerald-600 hover:text-white transition-all"
                           >
                              Full View <ExternalLink className="h-3 w-3" />
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Documents Section of Card */}
                  <div className="lg:w-2/3">
                     <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-widest">
                           <FileText className="h-4 w-4 text-emerald-600" />
                           Attached Documents ({visit.documents?.length || 0})
                        </h4>
                     </div>
                     
                     <div className="grid sm:grid-cols-2 gap-4">
                        {visit.documents && visit.documents.length > 0 ? (
                          visit.documents.map((doc: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-700 group/doc hover:bg-white dark:hover:bg-slate-800 transition-all">
                               <div className="flex items-center gap-3 min-w-0">
                                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
                                     <FileText className="h-4 w-4 text-emerald-500" />
                                  </div>
                                  <div className="min-w-0">
                                     <p className="text-xs font-bold text-gray-900 dark:text-white truncate" title={doc.title}>{doc.title}</p>
                                     <p className="text-[10px] text-gray-400 font-bold uppercase">{doc.fileType.split('/')[1]}</p>
                                  </div>
                               </div>
                               <a 
                                 href={getFullFileUrl(doc.fileUrl)} 
                                 target="_blank" 
                                 rel="noreferrer"
                                 className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                               >
                                  <Download className="h-4 w-4" />
                               </a>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-10 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-[2rem] bg-gray-50/30 dark:bg-slate-900/30">
                             <FileText className="h-8 w-8 text-gray-200 mb-2" />
                             <p className="text-xs text-gray-400 font-bold italic">No documents uploaded for this visit.</p>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredVisits.length === 0 && (
          <div className="py-20 text-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-700">
             <Hospital className="h-16 w-16 text-gray-200 mx-auto mb-4" />
             <p className="text-xl font-bold text-gray-400 mb-2">No visits found matching your search.</p>
             <button onClick={() => setSearchTerm('')} className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline">Clear Search</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalVisitsTab;
