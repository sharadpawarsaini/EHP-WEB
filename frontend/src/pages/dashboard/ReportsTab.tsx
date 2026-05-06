import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Download, 
  Plus, 
  X, 
  BrainCircuit, 
  Loader2, 
  Info, 
  Search, 
  Filter, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Calendar,
  Lock,
  Eye,
  FileSearch,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReportsTab = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Analysis States
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ id: string, text: string } | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await api.get('/reports');
      setReports(data);
    } catch (err) {
      console.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('report', file);
    formData.append('title', title);

    try {
      await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowUploadModal(false);
      setTitle('');
      setFile(null);
      fetchReports();
    } catch (err) {
      alert('Failed to upload report');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this clinical record?')) return;
    try {
      await api.delete(`/reports/${id}`);
      fetchReports();
    } catch (err) {
      alert('Failed to delete report');
    }
  };

  const analyzeReport = async (id: string) => {
    setAnalyzingId(id);
    try {
      const { data } = await api.post(`/reports/${id}/analyze`);
      setAnalysisResult({ id, text: data.analysis });
      setShowAnalysisModal(true);
    } catch (err: any) {
      alert(err.response?.data?.message || 'AI engine is currently busy. Please try again later.');
    } finally {
      setAnalyzingId(null);
    }
  };

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Loading Records...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-full">
      
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-12">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.1)]">Nexus Vault</span>
               <span className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.1)]">Neural Engine Enabled</span>
            </div>
            <h2 className="text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none">Clinical Reports</h2>
            <p className="text-sm text-zinc-500 font-medium italic">Manage lab results, imaging telemetry, and medical certificates via the Nexus Archive.</p>
         </div>
         <div className="flex gap-4 w-full sm:w-auto relative z-10">
            <div className="relative flex-1 sm:w-80 group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-700 group-focus-within:text-cyan-500 transition-colors" />
               <input 
                  type="text" 
                  placeholder="Filter Clinical Streams..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/50 text-white font-bold transition-all shadow-inner placeholder:text-zinc-700"
               />
               <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity rounded-[2rem] pointer-events-none"></div>
            </div>
            <button onClick={() => setShowUploadModal(true)} className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
               <Plus className="h-5 w-5" /> Deploy Report
            </button>
         </div>
      </div>

      {loading ? (
        <div className="py-24 text-center bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/5 rounded-[3.5rem] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-white/5 shadow-2xl mx-auto w-fit mb-8 group-hover:scale-110 transition-transform">
             <FileSearch className="h-12 w-12 text-zinc-700 group-hover:text-cyan-500 transition-colors" />
          </div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">No Reports Found</h3>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em] italic max-w-sm mx-auto mb-10">Upload your first lab result or medical certificate to start building your clinical history.</p>
          <button onClick={() => setShowUploadModal(true)} className="px-10 py-5 bg-white text-zinc-950 hover:bg-zinc-100 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-2xl relative z-10">
             Initialize Archive
          </button>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="py-24 text-center bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/5 rounded-[3.5rem] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-white/5 shadow-2xl mx-auto w-fit mb-8 group-hover:scale-110 transition-transform">
             <FileSearch className="h-12 w-12 text-zinc-700 group-hover:text-cyan-500 transition-colors" />
          </div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">No Reports Found</h3>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em] italic max-w-sm mx-auto mb-10">Upload your first lab result or medical certificate to start building your clinical history.</p>
          <button onClick={() => setShowUploadModal(true)} className="px-10 py-5 bg-white text-zinc-950 hover:bg-zinc-100 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-2xl relative z-10">
             Initialize Archive
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredReports.map((report) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={report._id} 
              className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="flex justify-between items-start mb-10 relative z-10">
                 <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 glow-border">
                    <FileText className="h-7 w-7 text-emerald-500" />
                 </div>
                 <button onClick={() => handleDelete(report._id)} className="p-3 bg-white/5 border border-white/5 rounded-2xl text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="h-5 w-5" />
                 </button>
              </div>
 
              <div className="space-y-2 mb-10 relative z-10">
                 <h4 className="font-black text-2xl text-white uppercase tracking-tighter leading-none truncate" title={report.title}>{report.title}</h4>
                 <div className="flex items-center gap-3 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-cyan-500" /> {new Date(report.createdAt).toLocaleDateString()}</span>
                    <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></span>
                    <span>{(report.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                 </div>
              </div>
 
              <div className="space-y-4 relative z-10">
                  <a
                   href={`${api.defaults.baseURL?.replace('/api', '') || ''}${report.fileUrl}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group/btn shadow-inner"
                 >
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">View Artifact</span>
                    <Eye className="h-5 w-5 text-zinc-500 group-hover/btn:text-white transition-colors" />
                  </a>
                 <button
                   onClick={() => analyzeReport(report._id)}
                   disabled={analyzingId === report._id}
                   className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all shadow-2xl ${analyzingId === report._id ? 'bg-cyan-600 text-white' : 'bg-white text-zinc-950 hover:scale-105 active:scale-95'}`}
                 >
                    <span className="text-[11px] font-black uppercase tracking-[0.4em]">
                       {analyzingId === report._id ? 'Analyzing...' : 'Neural Insight'}
                    </span>
                    {analyzingId === report._id ? <Loader2 className="h-5 w-5 animate-spin" /> : <BrainCircuit className="h-5 w-5" />}
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* AI Analysis Modal */}
      <AnimatePresence mode="wait">
        {showAnalysisModal && analysisResult && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-950/95 backdrop-blur-2xl" onClick={() => setShowAnalysisModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white/10 dark:bg-zinc-950/80 backdrop-blur-2xl rounded-[3.5rem] p-12 max-w-3xl w-full relative z-10 shadow-2xl border border-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
                 <BrainCircuit className="h-64 w-64 text-cyan-500" />
              </div>

              <div className="flex justify-between items-start mb-12 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 glow-border">
                    <BrainCircuit className="h-8 w-8 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Clinical Insight</h3>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Neural Telemetry Analysis</p>
                  </div>
                </div>
                <button onClick={() => setShowAnalysisModal(false)} className="p-4 bg-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all border border-white/5">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="bg-zinc-950/60 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 mb-10 max-h-[50vh] overflow-y-auto custom-scrollbar relative z-10 shadow-inner">
                <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed font-medium italic whitespace-pre-wrap text-sm">
                  {analysisResult.text}
                </div>
              </div>

              <div className="flex items-start gap-5 bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/10 mb-10 relative z-10">
                <Info className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-500/80 font-black uppercase tracking-[0.2em] leading-relaxed">
                  PROTOCOL DISCLAIMER: This insight is synthesized via neural-net processing and serves as a clinical reference node only. Cross-validate with a certified protocol specialist.
                </p>
              </div>

              <button
                onClick={() => setShowAnalysisModal(false)}
                className="w-full bg-white hover:bg-zinc-100 text-zinc-950 font-black py-7 rounded-2xl text-[11px] uppercase tracking-[0.4em] transition-all shadow-2xl relative z-10"
              >
                Terminate Session
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
         {showUploadModal && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-950/95 backdrop-blur-2xl" onClick={() => setShowUploadModal(false)} />
             <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white/10 dark:bg-zinc-950/80 backdrop-blur-2xl rounded-[3.5rem] p-12 max-w-lg w-full relative z-10 shadow-2xl border border-white/10">
               <div className="flex justify-between items-center mb-12">
                 <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Deploy Artifact</h3>
                 <button onClick={() => setShowUploadModal(false)} className="p-4 bg-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all border border-white/5">
                   <X className="h-6 w-6" />
                 </button>
               </div>
               
               <form onSubmit={handleUpload} className="space-y-10">
                 <div className="space-y-3">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Artifact Designation</label>
                   <input
                     type="text"
                     required
                     placeholder="e.g. Blood Telemetry - Node 01"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 text-white font-bold transition-all shadow-inner placeholder:text-zinc-700"
                   />
                 </div>
 
                 <div className="space-y-3">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Digital Payload</label>
                   <div className="relative group">
                     <input
                       type="file"
                       required
                       accept=".pdf,image/*"
                       onChange={(e) => setFile(e.target.files?.[0] || null)}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                     />
                     <div className="p-10 border-2 border-dashed border-white/5 bg-zinc-950/60 rounded-[2.5rem] flex flex-col items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-white/5 transition-all shadow-inner">
                        <div className="p-5 bg-zinc-900 rounded-2xl border border-white/5 shadow-2xl mb-6 group-hover:scale-110 transition-transform">
                           <Upload className="h-8 w-8 text-emerald-500" />
                        </div>
                        <p className="text-[11px] font-black text-white text-center uppercase tracking-[0.2em] mb-2 px-6">
                           {file ? file.name : 'Select Clinical Payload'}
                        </p>
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">PDF, JPG, PNG // MAX 10MB</p>
                     </div>
                   </div>
                 </div>
 
                 <button
                   type="submit"
                   disabled={uploading || !file}
                   className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-7 rounded-2xl text-[11px] uppercase tracking-[0.4em] transition-all shadow-2xl shadow-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-6"
                 >
                   {uploading ? (
                     <>
                       <Loader2 className="animate-spin h-5 w-5" /> Syncing...
                     </>
                   ) : <>Upload to Vault <ShieldCheck className="h-5 w-5" /></>}
                 </button>
               </form>
             </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default ReportsTab;
