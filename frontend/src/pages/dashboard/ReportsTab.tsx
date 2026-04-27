import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Upload, FileText, Trash2, Download, Plus, X } from 'lucide-react';

const ReportsTab = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await api.delete(`/reports/${id}`);
      fetchReports();
    } catch (err) {
      alert('Failed to delete report');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Reports</h2>
          <p className="text-gray-600 dark:text-gray-400">Upload and manage your clinical records and lab results.</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Plus className="h-5 w-5" /> Upload New
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-12 text-center border border-dashed border-gray-300 dark:border-slate-700">
          <FileText className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Reports Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-8">Keep all your important medical documents in one secure place.</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            Upload your first report
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report._id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-white dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <button
                  onClick={() => handleDelete(report._id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1 truncate">{report.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {new Date(report.createdAt).toLocaleDateString()} • {(report.fileSize / 1024 / 1024).toFixed(2)} MB
              </p>
              <a
                href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${report.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold transition-colors"
              >
                <Download className="h-4 w-4" /> View / Download
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 max-w-md w-full relative z-10 shadow-2xl border border-white dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Report</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Blood Test Feb 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select File (PDF or Image)</label>
                <div className="relative group">
                  <input
                    type="file"
                    required
                    accept=".pdf,image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="p-8 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center group-hover:border-blue-500 transition-colors bg-gray-50/50 dark:bg-slate-900/30">
                    <Upload className="h-10 w-10 text-gray-400 group-hover:text-blue-500 mb-4 transition-colors" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {file ? file.name : 'Click to browse or drag and drop'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Start Upload'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTab;
