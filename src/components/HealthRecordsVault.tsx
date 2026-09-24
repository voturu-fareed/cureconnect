import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Calendar,
  Tag,
  ShieldCheck,
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import { HealthRecord } from '../types';

interface HealthRecordsVaultProps {
  records: HealthRecord[];
  onAddRecord: (record: HealthRecord) => void;
  onDeleteRecord: (id: string) => void;
  onOpenVideoCall: () => void;
}

export const HealthRecordsVault: React.FC<HealthRecordsVaultProps> = ({
  records,
  onAddRecord,
  onDeleteRecord,
  onOpenVideoCall,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(records[0] || null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HealthRecord['category']>('Prescription');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/gemini/analyze-health-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: title,
          documentCategory: category,
          documentText: notes || 'Patient provided record for wellness history review.',
        }),
      });

      const analysis = await response.json();

      const newRec: HealthRecord = {
        id: `rec_${Date.now()}`,
        title: title.trim(),
        date: new Date().toISOString().split('T')[0],
        category,
        fileName: fileName || 'Uploaded_Medical_Record.pdf',
        notes: notes.trim(),
        aiAnalysis: analysis,
      };

      onAddRecord(newRec);
      setSelectedRecord(newRec);
      setTitle('');
      setNotes('');
      setFileName('');
      setIsUploading(false);
    } catch (err) {
      console.error('Error analyzing medical record:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Vault Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-bold text-white font-display">Previous Health Records Vault</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Securely upload past medical documents, prescriptions, and psychiatric records so the AI companion can give the best personalized advice.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploading(!isUploading)}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'Cancel Upload' : 'Upload Health Record'}
          </button>
        </div>
      </div>

      {/* Upload Drawer / Modal */}
      {isUploading && (
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-slate-900/90 border border-teal-500/40 rounded-2xl space-y-4 shadow-2xl animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" /> Upload & Run AI Clinical Intelligence
            </h3>
            <span className="text-[11px] text-slate-400">HIPAA & Responsible AI Protected</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Record Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Holter ECG Telemetry or Therapy Prescription"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Record Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Prescription">Prescription</option>
                <option value="Therapy Notes">Therapy Notes & Psych Evaluation</option>
                <option value="Blood Work & Labs">Blood Work & Labs</option>
                <option value="ECG / Sleep Study">ECG / Sleep Study</option>
                <option value="Discharge Summary">Discharge Summary</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Select Document File (PDF, Image, or Clinical Scan)
            </label>
            <div className="relative border-2 border-dashed border-slate-800 hover:border-teal-500/50 rounded-xl p-4 bg-slate-950/60 text-center cursor-pointer group">
              <Upload className="w-6 h-6 text-slate-500 group-hover:text-teal-400 mx-auto mb-1 transition-colors" />
              <span className="text-xs text-slate-300 block">
                {fileName ? fileName : 'Click or drop medical file here (PDF, JPG, PNG)'}
              </span>
              <input
                type="file"
                accept=".pdf,image/*,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Doctor's Remarks or Symptoms (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Experienced elevated resting pulse when stressed by CNR legal hearing. Recommended beta-blockers or somatic breathing."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  Analyzing Record with Gemini AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Save & Generate Medical AI Insights
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Main Vault Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Document List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Archived Documents ({records.length})</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </h3>

          {records.map((rec) => {
            const isSelected = selectedRecord?.id === rec.id;
            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-800/90 border-teal-500 shadow-md ring-1 ring-teal-500/20'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white line-clamp-1">{rec.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span>{rec.category}</span>
                      <span>·</span>
                      <span>{rec.date}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRecord(rec.id);
                  }}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {records.length === 0 && (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
              No previous health records uploaded yet. Upload a prescription or therapy record to enable cross-referencing.
            </div>
          )}
        </div>

        {/* Right: Detailed AI Analysis Card */}
        <div className="lg:col-span-2">
          {selectedRecord ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {selectedRecord.category}
                    </span>
                    <span className="text-xs text-slate-400">{selectedRecord.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1 font-display">{selectedRecord.title}</h3>
                </div>

                <button
                  onClick={onOpenVideoCall}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Discuss with 3D Companion
                </button>
              </div>

              {selectedRecord.notes && (
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Extracted Document Notes</span>
                  {selectedRecord.notes}
                </div>
              )}

              {/* AI Clinical Intelligence Output */}
              {selectedRecord.aiAnalysis && (
                <div className="space-y-4">
                  {/* Summary */}
                  <div>
                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Medical History AI Synthesis
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                      {selectedRecord.aiAnalysis.summary}
                    </p>
                  </div>

                  {/* Key Findings */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Key Clinical Findings</h4>
                    <div className="space-y-1.5">
                      {selectedRecord.aiAnalysis.keyFindings.map((finding, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                          <span>{finding}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tailored Emotional & Lifestyle Advice */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Companion Tailored Recommendations
                    </h4>
                    <div className="space-y-1.5">
                      {selectedRecord.aiAnalysis.emotionalAndLifestyleAdvice.map((advice, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-teal-950/30 border border-teal-500/20 text-xs text-teal-200 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                          <span>{advice}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Alerts */}
                  {selectedRecord.aiAnalysis.riskAlerts && selectedRecord.aiAnalysis.riskAlerts.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold block mb-0.5">Potential Sensitivity Flags:</strong>
                        {selectedRecord.aiAnalysis.riskAlerts.join(' ')}
                      </div>
                    </div>
                  )}

                  {/* Professional consultation disclaimer */}
                  <div className="text-[11px] text-slate-500 italic pt-2">
                    Note: Cure Connect AI assists with emotional grounding and tracking; always consult your certified physician or psychiatrist for diagnosis.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-sm">
              <FileText className="w-8 h-8 text-slate-600 mb-2" />
              Select a health record on the left to view clinical insights.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
