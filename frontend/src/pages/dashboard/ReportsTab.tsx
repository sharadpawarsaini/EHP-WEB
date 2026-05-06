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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
         <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider rounded-lg">Secure Vault</span>
               <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider rounded-lg">AI Ready</span>
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Medical Reports</h2>
            <p className="text-zinc-500 font-medium">Manage lab results, imaging reports, and medical certificates</p>
         </div>
         <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
               <input 
                  type="text" 
                  placeholder="Filter reports..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-semibold text-zinc-900 dark:text-white transition-all shadow-sm"
               />
            </div>
            <button onClick={() => setShowUploadModal(true)} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-sm">
               <Plus className="h-4 w-4" /> Upload
            </button>
         </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
             <FileSearch className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No Reports Found</h3>
          <p className="text-zinc-500 font-medium max-w-sm mx-auto mb-8">Upload your first lab result or medical certificate to start building your clinical history.</p>
          <button onClick={() => setShowUploadModal(true)} className="px-6 py-3 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold text-sm transition-all shadow-sm">
             Upload First Report
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={report._id} 
              className="health-card p-6 group hover:border-primary-200 dark:hover:border-primary-800/30 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                 <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-600">
                    <FileText className="h-6 w-6" />
                 </div>
                 <button onClick={() => handleDelete(report._id)} className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="h-4 w-4" />
                 </button>
              </div>

              <div className="space-y-1 mb-6">
                 <h4 className="font-bold text-base text-zinc-900 dark:text-white truncate" title={report.title}>{report.title}</h4>
                 <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(report.createdAt).toLocaleDateString()}</span>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                    <span>{(report.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                 </div>
              </div>

              <div className="space-y-2">
                  <a
                   href={`${api.defaults.baseURL?.replace('/api', '') || ''}${report.fileUrl}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-full flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                 >
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">View Document</span>
                    <Eye className="h-4 w-4 text-zinc-400" />
                 </a>
                 <button
                   onClick={() => analyzeReport(report._id)}
                   disabled={analyzingId === report._id}
                   className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${analyzingId === report._id ? 'bg-primary-600 text-white' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40'}`}
                 >
                    <span className="text-xs font-bold">
                       {analyzingId === report._id ? 'Analyzing...' : 'Explain with AI'}
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setShowAnalysisModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 max-w-2xl w-full relative z-10 shadow-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                    <BrainCircuit className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">AI Clinical Insight</h3>
                    <p className="text-sm font-medium text-zinc-500">Medical report explanation</p>
                  </div>
                </div>
                <button onClick={() => setShowAnalysisModal(false)} className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-500 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800 mb-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium whitespace-pre-wrap">
                  {analysisResult.text}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 mb-6">
                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-400 font-semibold leading-relaxed">
                  DISCLAIMER: This analysis is generated via AI and is for educational reference only. It does not replace professional medical advice.
                </p>
              </div>

              <button
                onClick={() => setShowAnalysisModal(false)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold py-3 rounded-xl text-sm transition-colors shadow-sm"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
         {showUploadModal && (
           <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
             <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-md w-full relative z-10 shadow-xl border border-zinc-200 dark:border-zinc-800">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Upload Report</h3>
                 <button onClick={() => setShowUploadModal(false)} className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-500 transition-colors">
                   <X className="h-5 w-5" />
                 </button>
               </div>
               
               <form onSubmit={handleUpload} className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Document Title</label>
                   <input
                     type="text"
                     required
                     placeholder="e.g. Blood Test - March 2024"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-zinc-900 dark:text-white font-medium transition-colors"
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Attachment</label>
                   <div className="relative group">
                     <input
                       type="file"
                       required
                       accept=".pdf,image/*"
                       onChange={(e) => setFile(e.target.files?.[0] || null)}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                     />
                     <div className="p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center group-hover:border-primary-500 group-hover:bg-primary-50/50 dark:group-hover:bg-primary-900/10 transition-colors bg-zinc-50 dark:bg-zinc-800/50">
                        <div className="p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-700 mb-3 group-hover:border-primary-200 transition-colors">
                           <Upload className="h-6 w-6 text-primary-600" />
                        </div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white text-center px-4 mb-1">
                           {file ? file.name : 'Select or Drag Document'}
                        </p>
                        <p className="text-xs text-zinc-500 font-medium">PDF, JPG, PNG (Max 10MB)</p>
                     </div>
                   </div>
                 </div>

                 <button
                   type="submit"
                   disabled={uploading || !file}
                   className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                 >
                   {uploading ? (
                     <>
                       <Loader2 className="animate-spin h-4 w-4 mr-2" /> Uploading...
                     </>
                   ) : 'Upload Report'}
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
