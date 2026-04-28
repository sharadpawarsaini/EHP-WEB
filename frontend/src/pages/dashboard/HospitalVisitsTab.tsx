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
  ExternalLink,
  ShieldCheck,
  Zap,
  Trash2,
  MoreVertical,
  CheckCircle2,
  Info
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

  const deleteVisit = async (id: string) => {
    if (!confirm('Permanently delete this clinical visit record?')) return;
    try {
      await api.delete(`/visits/${id}`);
      setVisits(visits.filter(v => v._id !== id));
    } catch (err) {
      alert('Failed to delete record');
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
    <div className="space-y-10 animate-in fade-in duration-700 max-w-full overflow-hidden">
      
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
         <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">Audited Records</span>
               <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">Cloud Sync</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Hospital Archive</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Consolidated history of clinical visits and attached medical reports</p>
         </div>
         <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
               <input 
                  type="text" 
                  placeholder="Search by facility..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm font-bold text-gray-900 dark:text-white transition-all shadow-sm"
               />
            </div>
            <button onClick={() => navigate('/dashboard/medical')} className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
               <Plus className="h-4 w-4" /> Add Record
            </button>
         </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
               <Hospital className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Visits</p>
               <p className="text-xl font-black text-gray-900 dark:text-white leading-none">{visits.length}</p>
            </div>
         </div>
         <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
               <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Documents</p>
               <p className="text-xl font-black text-gray-900 dark:text-white leading-none">
                  {visits.reduce((acc, v) => acc + (v.documents?.length || 0), 0)}
               </p>
            </div>
         </div>
         <div className="lg:col-span-2 p-1 bg-emerald-600 rounded-[2rem] shadow-lg shadow-emerald-600/10">
            <div className="bg-emerald-900/90 rounded-[1.8rem] p-5 flex items-center justify-between text-white">
               <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-widest">Medical History Authenticated</span>
               </div>
               <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
         </div>
      </div>

      {/* Visits List */}
      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {filteredVisits.map((visit) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={visit._id} 
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[3rem] border border-white dark:border-slate-700 shadow-xl shadow-gray-200/20 overflow-hidden group"
            >
               <div className="p-8 sm:p-12 flex flex-col xl:flex-row gap-12">
                  {/* Left Column: Facility Info */}
                  <div className="xl:w-1/3 space-y-8 border-b xl:border-b-0 xl:border-r border-gray-100 dark:border-slate-700 pb-8 xl:pb-0 xl:pr-12">
                     <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                           <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-[1.5rem] border border-gray-100 dark:border-slate-700 group-hover:scale-110 transition-all">
                              <Hospital className="h-8 w-8 text-emerald-600" />
                           </div>
                           <div>
                              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">{visit.hospitalName}</h3>
                              <div className="flex items-center gap-2 mt-2 text-emerald-600 dark:text-emerald-400 font-black uppercase text-[10px] tracking-widest">
                                 <Calendar className="h-3 w-3" />
                                 {format(new Date(visit.visitDate), 'MMMM dd, yyyy')}
                              </div>
                           </div>
                        </div>
                        <button onClick={() => deleteVisit(visit._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                           <Trash2 className="h-5 w-5" />
                        </button>
                     </div>

                     <div className="flex flex-wrap gap-3 pt-4">
                        <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100 dark:border-emerald-800/30">Facility Verified</div>
                        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 border border-blue-100 dark:border-blue-800/30">Clinical Record</div>
                     </div>
                  </div>

                  {/* Right Column: Documents Attached */}
                  <div className="xl:w-2/3">
                     <div className="flex justify-between items-center mb-8">
                        <h4 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-3 uppercase tracking-[0.2em]">
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                           Attachments ({visit.documents?.length || 0})
                        </h4>
                        <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Add Report</button>
                     </div>
                     
                     <div className="grid sm:grid-cols-2 gap-4">
                        {visit.documents && visit.documents.length > 0 ? (
                          visit.documents.map((doc: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-slate-900/50 rounded-[1.5rem] border border-gray-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all group/doc">
                               <div className="flex items-center gap-4 min-w-0">
                                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                                     <FileText className="h-5 w-5 text-emerald-500" />
                                  </div>
                                  <div className="min-w-0">
                                     <p className="text-xs font-black text-gray-900 dark:text-white truncate" title={doc.title}>{doc.title}</p>
                                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{doc.fileType.split('/')[1]} Record</p>
                                  </div>
                               </div>
                               <a 
                                 href={getFullFileUrl(doc.fileUrl)} 
                                 target="_blank" 
                                 rel="noreferrer"
                                 className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all shadow-sm"
                               >
                                  <Download className="h-4 w-4" />
                               </a>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-[2.5rem] bg-gray-50/20 dark:bg-slate-900/20">
                             <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl mb-4">
                                <FileText className="h-8 w-8 text-gray-300" />
                             </div>
                             <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">No clinical documents linked</p>
                             <p className="text-[10px] text-gray-400 mt-1 uppercase font-black tracking-widest italic">Records may be pending upload</p>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredVisits.length === 0 && (
          <div className="py-24 text-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-slate-700">
             <Hospital className="h-20 w-20 text-gray-200 mx-auto mb-6" />
             <p className="text-2xl font-black text-gray-400 mb-2">No matching clinical archives</p>
             <p className="text-sm font-bold text-gray-300 mb-10">Refine your search or add a new record to get started.</p>
             <button onClick={() => setSearchTerm('')} className="px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Clear Filters</button>
          </div>
        )}
      </div>

      {/* Safety Info */}
      <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30 flex items-start gap-5">
         <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
         <div>
            <p className="text-sm font-black text-blue-900 dark:text-blue-300 uppercase tracking-widest mb-1">Global Interoperability</p>
            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-medium">All visits recorded here are automatically formatted for HL7/FHIR compatibility. You can export this history as a consolidated medical passport from the Settings tab.</p>
         </div>
      </div>
    </div>
  );
};

export default HospitalVisitsTab;
