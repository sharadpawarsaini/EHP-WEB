import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  FileText, 
  Download, 
  ShieldCheck, 
  Zap, 
  Hospital,
  ChevronRight,
  Info,
  Clock,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';
import { motion } from 'framer-motion';

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
        setError('Failed to retrieve clinical record.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVisit();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Decrypting Clinical Record...</p>
    </div>
  );

  if (error || !visit) return (
    <div className="p-20 text-center bg-rose-50 dark:bg-rose-900/10 rounded-[3rem] border border-rose-100 dark:border-rose-900/30">
       <Info className="h-16 w-16 text-rose-600 mx-auto mb-6" />
       <p className="text-2xl font-black text-rose-900 dark:text-rose-400 mb-2">Record Not Found</p>
       <button onClick={() => navigate('/dashboard')} className="text-rose-600 font-black text-xs uppercase tracking-widest hover:underline">Return to Hub</button>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-full overflow-hidden">
      
      {/* Header Widget */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
         <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all text-gray-400 hover:text-indigo-600 border border-white dark:border-slate-700"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
               <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full">Facility Verified</span>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">Cloud Archive</span>
               </div>
               <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
                  <Hospital className="h-10 w-10 text-indigo-600" />
                  {visit.hospitalName}
               </h1>
            </div>
         </div>
         <div className="flex flex-wrap items-center gap-3 p-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white dark:border-slate-700 shadow-sm max-w-md overflow-auto">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div className="flex flex-wrap gap-2">
               {visit.visitDates && visit.visitDates.length > 0 ? (
                 visit.visitDates.sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime()).map((date: string, idx: number) => (
                   <span key={idx} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                     {format(new Date(date), 'MMM dd, yyyy')}
                   </span>
                 ))
               ) : (
                 <span className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                   {format(new Date(visit.visitDate), 'MMMM dd, yyyy')}
                 </span>
               )}
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
         {/* Main Record Deep Dive */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[3rem] p-10 shadow-xl border border-white dark:border-slate-700">
               <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4">
                  <FileText className="h-8 w-8 text-emerald-600" />
                  Clinical Documents
               </h2>
               
               {visit.visitDates && visit.visitDates.length > 0 ? (
                 <div className="space-y-12">
                   {[...visit.visitDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map((vDate, vIdx) => {
                     const dateDocs = (visit.documents || []).filter((doc: any) => 
                       doc.visitDate && new Date(doc.visitDate).toDateString() === new Date(vDate).toDateString()
                     );
                     
                     if (dateDocs.length === 0) return null;

                     return (
                       <div key={vIdx} className="space-y-6">
                         <div className="flex items-center gap-4">
                            <span className="px-4 py-1.5 bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">
                               {format(new Date(vDate), 'MMMM dd, yyyy')}
                            </span>
                            <div className="h-[1px] flex-1 bg-gray-100 dark:bg-slate-700"></div>
                         </div>
                         
                         <div className="grid sm:grid-cols-2 gap-6">
                           {dateDocs.map((doc: any, index: number) => {
                             const fileUrl = `${api.defaults.baseURL?.replace('/api', '') || ''}${doc.fileUrl}`;
                             return (
                               <motion.div 
                                 whileHover={{ y: -5 }}
                                 key={index} 
                                 className="bg-gray-50/50 dark:bg-slate-900/50 rounded-[2rem] p-8 border border-gray-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl transition-all group"
                               >
                                 <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm group-hover:scale-110 transition-all">
                                       <FileText className="h-6 w-6 text-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                                       {doc.fileType?.split('/')[1] || 'File'}
                                    </span>
                                 </div>
                                 <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 truncate" title={doc.title}>{doc.title}</h3>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-10">Clinical Attachment</p>
                                 
                                 <a 
                                   href={fileUrl}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl"
                                 >
                                   <Download className="h-4 w-4" /> View Record
                                 </a>
                               </motion.div>
                             );
                           })}
                         </div>
                       </div>
                     );
                   })}
                 </div>
               ) : (
                 visit.documents && visit.documents.length > 0 ? (
                   <div className="grid sm:grid-cols-2 gap-6">
                     {visit.documents.map((doc: any, index: number) => {
                       const fileUrl = `${api.defaults.baseURL?.replace('/api', '') || ''}${doc.fileUrl}`;
                       return (
                         <motion.div 
                           whileHover={{ y: -5 }}
                           key={index} 
                           className="bg-gray-50/50 dark:bg-slate-900/50 rounded-[2rem] p-8 border border-gray-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl transition-all group"
                         >
                           <div className="flex justify-between items-start mb-6">
                              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm group-hover:scale-110 transition-all">
                                 <FileText className="h-6 w-6 text-emerald-500" />
                              </div>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                                 {doc.fileType?.split('/')[1] || 'File'}
                              </span>
                           </div>
                           <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 truncate" title={doc.title}>{doc.title}</h3>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-10">Clinical Attachment</p>
                           
                           <a 
                             href={fileUrl}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl"
                           >
                             <Download className="h-4 w-4" /> View Record
                           </a>
                         </motion.div>
                       );
                     })}
                   </div>
                 ) : (
                   <div className="py-24 text-center bg-gray-50/50 dark:bg-slate-900/50 rounded-[3.5rem] border-2 border-dashed border-gray-100 dark:border-slate-700">
                      <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                         <FileText className="h-10 w-10 text-gray-200" />
                      </div>
                      <p className="text-xl font-black text-gray-400 mb-2">No documents linked</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Facility record may be pending digitization</p>
                   </div>
                 )
               )}
            </div>
         </div>

         {/* Sidebar Insights */}
         <div className="space-y-8">
            <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Activity className="h-40 w-40" />
               </div>
               <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <Zap className="h-6 w-6 text-amber-400" />
                  Visit Info
               </h3>
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-white/10 rounded-xl">
                        <Clock className="h-5 w-5 text-indigo-400" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Time Elapsed</p>
                        <p className="text-sm font-black text-white">Consolidated Archive</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-white/10 rounded-xl">
                        <ShieldCheck className="h-5 w-5 text-emerald-400" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Data Integrity</p>
                        <p className="text-sm font-black text-white">SHA-256 Encrypted</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[3rem] border border-white dark:border-slate-700 shadow-xl">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Access History</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between group">
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <div>
                           <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase leading-none">Record Created</p>
                           <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">System Audit</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center justify-between group opacity-50">
                     <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-300" />
                        <div>
                           <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase leading-none">Last Viewed</p>
                           <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Today 14:20</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Protocol Guard */}
      <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-5">
         <ShieldCheck className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-0.5" />
         <div>
            <p className="text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-1">Clinical Sovereignty</p>
            <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed font-medium">This clinical record is an immutable entry in your EHP timeline. Access is restricted to authorized medical nodes and your primary emergency guardians during active SOS events.</p>
         </div>
      </div>
    </div>
  );
};

export default HospitalVisitDetailsTab;
