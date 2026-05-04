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
      <div className="w-10 h-10 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accessing Document Vault...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-full">
      
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
         <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-widest rounded-full">Encrypted Storage</span>
               <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full">AI Ready</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Clinical Archive</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Manage lab results, imaging reports, and medical certificates</p>
         </div>
         <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
               <input 
                  type="text" 
                  placeholder="Filter reports..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 text-sm font-bold text-gray-900 dark:text-white transition-all"
               />
            </div>
            <button onClick={() => setShowUploadModal(true)} className="px-8 py-4 bg-primary-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-2xl shadow-primary-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
               <Plus className="h-4 w-4" /> Upload
            </button>
         </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[3rem] p-16 text-center border-2 border-dashed border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
             <FileSearch className="h-10 w-10 text-gray-300 dark:text-slate-600" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Archive is Empty</h3>
          <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10">Upload your first lab result or medical certificate to start building your clinical history.</p>
          <button onClick={() => setShowUploadModal(true)} className="px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">
             Initialize First Upload
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReports.map((report) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={report._id} 
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white dark:border-slate-700 shadow-xl shadow-gray-200/20 group hover:shadow-2xl transition-all"
            >
              <div className="flex justify-between items-start mb-8">
                 <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-2xl group-hover:scale-110 transition-all">
                    <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                 </div>
                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleDelete(report._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                       <Trash2 className="h-5 w-5" />
                    </button>
                 </div>
              </div>

              <div className="space-y-1 mb-8">
                 <h4 className="font-black text-lg text-gray-900 dark:text-white truncate" title={report.title}>{report.title}</h4>
                 <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(report.createdAt).toLocaleDateString()}</span>
                    <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                    <span>{(report.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                 </div>
              </div>

              <div className="space-y-3">
                  <a
                   href={`${api.defaults.baseURL?.replace('/api', '') || ''}${report.fileUrl}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl hover:bg-gray-100 transition-all group/btn"
                 >
                    <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">View Document</span>
                    <Eye className="h-4 w-4 text-gray-400 group-hover/btn:text-primary-600 transition-all" />
                 </a>
                 <button
                   onClick={() => analyzeReport(report._id)}
                   disabled={analyzingId === report._id}
                   className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${analyzingId === report._id ? 'bg-primary-600 text-white animate-pulse' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 hover:bg-primary-100'}`}
                 >
                    <span className={`text-xs font-black uppercase tracking-widest ${analyzingId === report._id ? 'text-white' : 'text-primary-600'}`}>
                       {analyzingId === report._id ? 'Analyzing Bio-Data' : 'Explain with AI'}
                    </span>
                    {analyzingId === report._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* AI Analysis Modal */}
      <AnimatePresence>
        {showAnalysisModal && analysisResult && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowAnalysisModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 sm:p-12 max-w-2xl w-full relative z-10 shadow-2xl border border-white dark:border-slate-700">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary-600 rounded-[1.5rem] shadow-xl shadow-primary-600/20">
                    <BrainCircuit className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">AI Clinical Insight</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Medical Language Decryption</p>
                  </div>
                </div>
                <button onClick={() => setShowAnalysisModal(false)} className="p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl text-gray-400 hover:text-gray-900 transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-primary-50/50 dark:bg-primary-900/10 rounded-[2rem] p-8 border border-primary-100 dark:border-primary-800/30 mb-8 max-h-96 overflow-y-auto custom-scrollbar">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-800 dark:text-primary-100 leading-relaxed font-medium whitespace-pre-wrap">
                    {analysisResult.text}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                <Info className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-400 font-bold leading-relaxed">
                  DISCLAIMER: This analysis is generated via Gemini AI and is for educational reference only. It does not replace professional medical advice. Please review this with your doctor.
                </p>
              </div>

              <button
                onClick={() => setShowAnalysisModal(false)}
                className="w-full mt-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-5 rounded-2xl text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
              >
                Exit Analysis
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
         {showUploadModal && (
           <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowUploadModal(false)} />
             <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 max-w-lg w-full relative z-10 shadow-2xl border border-white dark:border-slate-700">
               <div className="flex justify-between items-center mb-10">
                 <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Archive Record</h3>
                 <button onClick={() => setShowUploadModal(false)} className="p-3 bg-gray-50 dark:bg-slate-900 rounded-2xl text-gray-400 hover:text-gray-900 transition-all">
                   <X className="h-5 w-5" />
                 </button>
               </div>
               
               <form onSubmit={handleUpload} className="space-y-8">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Document Title</label>
                   <input
                     type="text"
                     required
                     placeholder="e.g. Lab Report March 2024"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className="w-full px-6 py-5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 text-gray-900 dark:text-white font-bold"
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Attachment</label>
                   <div className="relative group">
                     <input
                       type="file"
                       required
                       accept=".pdf,image/*"
                       onChange={(e) => setFile(e.target.files?.[0] || null)}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                     />
                     <div className="p-12 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-[2.5rem] flex flex-col items-center justify-center group-hover:border-primary-500 group-hover:bg-primary-50/30 transition-all bg-gray-50/30 dark:bg-slate-900/30">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm mb-4">
                           <Upload className="h-8 w-8 text-primary-600" />
                        </div>
                        <p className="text-sm font-black text-gray-900 dark:text-white text-center px-4">
                           {file ? file.name : 'Select or Drag Document'}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-black tracking-widest">PDF, JPG, PNG (Max 10MB)</p>
                     </div>
                   </div>
                 </div>

                 <button
                   type="submit"
                   disabled={uploading || !file}
                   className="w-full bg-primary-600 text-white font-black py-6 rounded-[1.5rem] text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary-600/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                 >
                   {uploading ? 'Encrypting & Syncing...' : 'Complete Archive'}
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
