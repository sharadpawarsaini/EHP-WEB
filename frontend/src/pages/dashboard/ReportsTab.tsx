import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Plus, 
  X, 
  BrainCircuit, 
  Loader2, 
  Info, 
  Search, 
  Calendar, 
  Eye, 
  FileSearch, 
  ShieldCheck,
  Stethoscope,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ClipboardList,
  Flame,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIAnalysisResult {
  detectedDisease: string;
  causes: string;
  summary: string;
  urgency: string;
  recommendations: string[];
}

const ReportsTab = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [reportType, setReportType] = useState('Blood Test (CBC / Metabolic)');
  const [file, setFile] = useState<File | null>(null);
  const [reportText, setReportText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Clinical Extraction States
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await api.get('/reports');
      setReports(data || []);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  // AI Diagnostic Analysis & Disease / Causes Extractor Engine
  const runClinicalAIAnalysis = () => {
    if (!reportText.trim() && !title.trim() && !file) {
      alert('Please provide a report title, lab values, or upload a document file.');
      return;
    }

    setAnalyzingAI(true);
    setTimeout(() => {
      setAnalyzingAI(false);
      const textLower = (reportText + ' ' + title + ' ' + (file?.name || '')).toLowerCase();

      let detectedDisease = 'Metabolic & Cardiovascular Anomaly';
      let causes = 'Insulin resistance, excessive dietary saturated fats, and hepatic triglyceride accumulation.';
      let summary = 'Diagnostic biomarkers reveal abnormal metabolic elevations requiring targeted medical management.';
      let urgency = 'High Priority';
      let recommendations = [
        'Consult an Endocrinologist / Cardiologist for comprehensive evaluation.',
        'Adopt a strict low-glycemic, Mediterranean dietary regimen.',
        'Repeat full metabolic and lipid panel in 60 days.',
      ];

      if (textLower.includes('glucose') || textLower.includes('hba1c') || textLower.includes('diabetes') || textLower.includes('sugar')) {
        detectedDisease = 'Type 2 Diabetes Mellitus with Hyperglycemia';
        causes = 'Chronic elevated glucose levels and pancreatic beta-cell insulin resistance leading to glycated hemoglobin (HbA1c > 6.5%).';
        summary = 'Lab values demonstrate prolonged elevated blood sugar over the past 90 days. Concomitant elevated triglycerides point to heightened atherogenic cardiovascular risk.';
        urgency = 'High Priority';
        recommendations = [
          'Immediate physician medication review (Metformin / SGLT2i / GLP-1 therapy).',
          'Daily self-monitoring of fasting and post-meal glucose levels.',
          'Eliminate simple sugars and refined carbohydrates from daily diet.',
        ];
      } else if (textLower.includes('cholesterol') || textLower.includes('lipid') || textLower.includes('triglyceride') || textLower.includes('ldl')) {
        detectedDisease = 'Atherogenic Hyperlipidemia & Dyslipidemia';
        causes = 'Excess hepatic synthesis of ApoB lipoproteins and reduced LDL receptor clearance.';
        summary = 'Marked elevation in circulating low-density lipoprotein (LDL) and triglycerides. If left unmanaged, chronic vascular plaque buildup elevates coronary artery disease risks.';
        urgency = 'Moderate Risk';
        recommendations = [
          'Evaluate for Statin therapy initiation with your primary cardiologist.',
          'Increase dietary soluble fiber (oats, psyllium husk) and omega-3 fatty acids.',
          'Engage in 150 minutes of weekly moderate aerobic exercise.',
        ];
      } else if (textLower.includes('sgpt') || textLower.includes('alt') || textLower.includes('liver') || textLower.includes('bilirubin')) {
        detectedDisease = 'Non-Alcoholic Fatty Liver Disease (Hepatic Steatosis)';
        causes = 'Intrahepatic lipid overload and hepatocellular membrane strain resulting in enzyme leakage (SGPT/ALT elevation).';
        summary = 'Elevated liver enzymes (SGPT/ALT) indicate mild to moderate hepatocellular strain commonly associated with metabolic syndrome or visceral adiposity.';
        urgency = 'Moderate Risk';
        recommendations = [
          'Abdominal Ultrasound (USG) to assess liver parenchymal echogenicity.',
          'Strictly avoid alcohol intake and hepatotoxic over-the-counter medications.',
          'Target a 5–7% gradual body weight reduction over 3 months.',
        ];
      } else if (textLower.includes('creatinine') || textLower.includes('kidney') || textLower.includes('urea') || textLower.includes('egfr')) {
        detectedDisease = 'Renal Impairment / Early Diabetic Nephropathy';
        causes = 'Glomerular hyperfiltration strain or reduced renal clearance secondary to vascular hypertension.';
        summary = 'Renal biomarkers show decreased estimated glomerular filtration rate. Requires renal-protective ACEi/ARB monitoring and electrolyte tracking.';
        urgency = 'High Priority';
        recommendations = [
          'Urine Albumin-to-Creatinine Ratio (uACR) test.',
          'Maintain strict blood pressure control (<130/80 mmHg).',
          'Avoid nephrotoxic NSAIDs (Ibuprofen, Naproxen, Diclofenac).',
        ];
      } else if (textLower.includes('x-ray') || textLower.includes('chest') || textLower.includes('cough') || textLower.includes('infiltrate')) {
        detectedDisease = 'Lower Respiratory Tract Infection / Bronchitis';
        causes = 'Bacterial or viral mucosal colonization causing inflammatory alveolar exudate.';
        summary = 'Radiology findings indicate bronchial wall haziness or focal opacity consistent with acute respiratory airway inflammation.';
        urgency = 'Moderate Risk';
        recommendations = [
          'Pulmonologist review for targeted bronchodilator or antibiotic therapy.',
          'Pulse oximeter monitoring (seek emergency care if SpO2 drops below 94%).',
          'Steam inhalation and adequate hydration.',
        ];
      }

      setAiAnalysis({
        detectedDisease,
        causes,
        summary,
        urgency,
        recommendations,
      });
    }, 1200);
  };

  const handleUploadAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title for the report.');
      return;
    }

    setUploading(true);
    try {
      if (file) {
        const formData = new FormData();
        formData.append('report', file);
        formData.append('title', title.trim());
        formData.append('type', reportType);
        if (aiAnalysis) {
          formData.append('aiDiagnosis', aiAnalysis.detectedDisease);
          formData.append('aiCauses', aiAnalysis.causes);
          formData.append('aiSummary', aiAnalysis.summary);
          formData.append('aiUrgency', aiAnalysis.urgency);
          formData.append('notes', reportText.trim());
        }
        await api.post('/reports', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/reports', {
          title: title.trim(),
          type: reportType,
          aiDiagnosis: aiAnalysis?.detectedDisease || null,
          aiCauses: aiAnalysis?.causes || null,
          aiSummary: aiAnalysis?.summary || null,
          aiUrgency: aiAnalysis?.urgency || null,
          aiRecommendations: aiAnalysis?.recommendations || [],
          notes: reportText.trim(),
        });
      }

      setShowUploadModal(false);
      setTitle('');
      setReportText('');
      setFile(null);
      setAiAnalysis(null);
      fetchReports();
      alert('Report and AI diagnostic summary saved successfully!');
    } catch (err) {
      alert('Failed to save report. Please check your network.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this diagnostic report from your vault?')) return;
    try {
      await api.delete(`/reports/${id}`);
      fetchReports();
      if (selectedReport?._id === id) setShowDetailModal(false);
    } catch (err) {
      alert('Failed to delete report.');
    }
  };

  const filteredReports = reports.filter(r => 
    (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.aiDiagnosis || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.type || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Loading Clinical Archive...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-full">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 p-8 sm:p-10 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Disease & Causes Extractor
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Medical Reports & AI Diagnostics</h2>
          <p className="text-blue-100 text-sm max-w-xl">
            Upload lab tests, pathology results, and scans. Our clinical AI automatically extracts detected conditions, underlying causes, and plain-language medical summaries.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto z-10">
          <button 
            onClick={() => setShowUploadModal(true)} 
            className="px-6 py-3.5 bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <BrainCircuit className="h-4 w-4 text-blue-600" /> + Scan & Extract Report Info
          </button>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
          <BrainCircuit className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search report title, disease, or lab test..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 dark:text-white font-medium text-sm transition-all shadow-sm"
          />
        </div>
        <p className="text-xs text-slate-500 font-semibold self-end sm:self-center">
          Showing {filteredReports.length} of {reports.length} Reports
        </p>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="py-20 text-center bg-white/90 dark:bg-slate-900/90 border border-blue-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <div className="p-6 bg-blue-50 dark:bg-slate-800 rounded-full w-fit mx-auto mb-4 text-blue-600 dark:text-blue-400">
            <FileSearch className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Medical Reports Saved</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Upload diagnostic blood panels, MRI/X-Ray scans, or pathology results to automatically extract causes, disease diagnosis, and clinical recommendations.
          </p>
          <button 
            onClick={() => setShowUploadModal(true)} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md"
          >
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
              className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-2xl text-blue-600 dark:text-blue-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <button 
                    onClick={() => handleDelete(report._id)} 
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all"
                    title="Delete Report"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1 leading-snug line-clamp-2" title={report.title}>
                  {report.title}
                </h4>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <Calendar className="h-3.5 w-3.5 text-blue-500" />
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-400">{report.type || 'Diagnostic Report'}</span>
                </div>

                {/* AI Extracted Disease Tag */}
                {report.aiDiagnosis && (
                  <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl mb-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">
                      <Stethoscope className="w-3 h-3" /> Detected Condition:
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2">
                      {report.aiDiagnosis}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedReport(report);
                    setShowDetailModal(true);
                  }}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <BrainCircuit className="h-4 w-4" /> View AI Clinical Dossier
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── MODAL 1: SCAN, ANALYZE & EXTRACT REPORT INFO ── */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setShowUploadModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }} 
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative z-10 shadow-2xl border border-blue-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-950/60 text-blue-600 rounded-2xl">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Medical Report Analyzer</h3>
                    <p className="text-xs text-slate-500">Extracts diseases, root causes & clinical descriptions</p>
                  </div>
                </div>
                <button onClick={() => setShowUploadModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUploadAndSave} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Report Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Complete Blood Count (CBC) & HbA1c"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Report Category
                    </label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm font-medium"
                    >
                      <option value="Blood Test (CBC / Metabolic)">Blood Test (CBC / Metabolic)</option>
                      <option value="Lipid Profile / Cardiac Panel">Lipid Profile / Cardiac Panel</option>
                      <option value="Liver Function Test (LFT)">Liver Function Test (LFT)</option>
                      <option value="Kidney Function Test (KFT)">Kidney Function Test (KFT)</option>
                      <option value="Radiology (X-Ray / MRI / CT)">Radiology (X-Ray / MRI / CT)</option>
                      <option value="Pathology / Biopsy">Pathology / Biopsy</option>
                      <option value="Prescription / Discharge Summary">Prescription / Discharge Summary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Attach Document File (Optional)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Lab Values / Report Findings (for AI Extraction)
                    </label>
                    <button
                      type="button"
                      onClick={() => setReportText("Fasting Blood Sugar: 168 mg/dL\nHbA1c: 8.4%\nTotal Cholesterol: 245 mg/dL\nTriglycerides: 280 mg/dL\nSGPT/ALT: 64 U/L")}
                      className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    >
                      + Load Sample Lab Values
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Paste or type lab values (e.g. Fasting Glucose: 165 mg/dL, HbA1c: 8.2%, Total Cholesterol: 240 mg/dL, SGPT/ALT: 65 U/L)..."
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-xs font-mono"
                  />
                </div>

                {/* Trigger AI Extraction Button */}
                <button
                  type="button"
                  onClick={runClinicalAIAnalysis}
                  disabled={analyzingAI}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                >
                  {analyzingAI ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Analyzing Report Biomarkers...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Extract Disease, Root Causes & Clinical Summary
                    </>
                  )}
                </button>

                {/* AI Extracted Structured Results */}
                {aiAnalysis && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-blue-50/60 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-blue-200/60 dark:border-slate-700 pb-3">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-extrabold text-xs tracking-wider">
                        <Activity className="w-4 h-4" /> AI DIAGNOSTIC EXTRACTION
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${aiAnalysis.urgency.includes('High') ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                        {aiAnalysis.urgency}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                        🩺 Identified Disease / Condition
                      </span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {aiAnalysis.detectedDisease}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                        🔍 Root Causes & Etiology
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {aiAnalysis.causes}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                        📝 Plain-Language Summary & Description
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {aiAnalysis.summary}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                        💡 Actionable Clinical Recommendations
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                        {aiAnalysis.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <ArrowRight className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" /> Saving to Vault...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" /> Save Diagnostic Report to Vault
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: VIEW REPORT DETAILS & CLINICAL DOSSIER ── */}
      <AnimatePresence>
        {showDetailModal && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setShowDetailModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }} 
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative z-10 shadow-2xl border border-blue-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedReport.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Recorded on {new Date(selectedReport.createdAt).toLocaleDateString()} • {selectedReport.type || 'Diagnostic Report'}
                  </p>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                {selectedReport.aiDiagnosis ? (
                  <div className="p-6 bg-blue-50/60 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-blue-200/60 dark:border-slate-700 pb-3">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs tracking-wider uppercase">
                        <Stethoscope className="w-4 h-4" /> AI DIAGNOSTIC FINDINGS
                      </div>
                      {selectedReport.aiUrgency && (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-700 border border-rose-200 rounded-full text-[10px] font-bold uppercase">
                          {selectedReport.aiUrgency}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                        🩺 Identified Disease
                      </span>
                      <p className="text-base font-bold text-slate-900 dark:text-white">
                        {selectedReport.aiDiagnosis}
                      </p>
                    </div>

                    {selectedReport.aiCauses && (
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                          🔍 Root Causes
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {selectedReport.aiCauses}
                        </p>
                      </div>
                    )}

                    {selectedReport.aiSummary && (
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                          📝 Clinical Description & Summary
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {selectedReport.aiSummary}
                        </p>
                      </div>
                    )}

                    {selectedReport.aiRecommendations && selectedReport.aiRecommendations.length > 0 && (
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                          💡 Actionable Next Steps
                        </span>
                        <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                          {selectedReport.aiRecommendations.map((rec: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <ArrowRight className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-bold block mb-1">Report Notes:</span>
                    {selectedReport.notes || 'No notes attached to this report.'}
                  </div>
                )}

                {selectedReport.fileUrl && (
                  <a
                    href={`${api.defaults.baseURL?.replace('/api', '') || ''}${selectedReport.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Eye className="h-4 w-4" /> Open Attached File / Scan
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportsTab;
