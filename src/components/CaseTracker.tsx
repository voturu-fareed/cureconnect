import React, { useState } from 'react';
import {
  Scale,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building2,
  RefreshCw,
  Clock,
  Heart,
  Building,
  Phone,
  Wind
} from 'lucide-react';
import { UserProfile, CaseTrackingDetail, RehabCenter } from '../types';

interface CaseTrackerProps {
  user: UserProfile;
  initialCaseDetail: CaseTrackingDetail;
  onUpdateCase: (detail: CaseTrackingDetail) => void;
  onOpenCompanion: () => void;
  rehabCenters: RehabCenter[];
  onOpenCounseling: () => void;
}

export const CaseTracker: React.FC<CaseTrackerProps> = ({
  user,
  initialCaseDetail,
  onUpdateCase,
  onOpenCompanion,
  rehabCenters,
  onOpenCounseling,
}) => {
  const [cnrInput, setCnrInput] = useState(user.cnrNumber || initialCaseDetail.cnrNumber);
  const [courtName, setCourtName] = useState(user.courtName || initialCaseDetail.courtName);
  const [caseType, setCaseType] = useState(user.caseType || 'Civil Writ Petition');
  const [complexity, setComplexity] = useState<'normal' | 'moderate' | 'complicated'>(
    initialCaseDetail.complexity || user.caseComplexity || 'complicated'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [caseDetail, setCaseDetail] = useState<CaseTrackingDetail>(initialCaseDetail);

  const handleRefreshCase = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cnrInput.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/track-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cnrNumber: cnrInput.trim(),
          courtName,
          caseType,
          complexity,
        }),
      });

      const data = await res.json();
      const updated: CaseTrackingDetail = {
        cnrNumber: cnrInput.trim(),
        caseStage: data.caseStage || 'Evidence & Arguments',
        statusSummary: data.statusSummary || 'Case is listed on standard judicial cause list.',
        nextHearingDate: data.nextHearingDate || '2026-10-18',
        courtRoom: data.courtRoom || 'Court Room No. 4, Bench II',
        courtName,
        anxietyReliefTip: data.anxietyReliefTip || 'Take one document at a time. Judicial procedures are methodical.',
        checklist: data.checklist || [
          'Verify document index with advocate',
          'Practice 5 minutes of grounding before morning',
        ],
        complexity: (data.complexity as any) || complexity,
      };

      setCaseDetail(updated);
      onUpdateCase(updated);
    } catch (err) {
      console.error('Case refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-display">CNR Legal Case Guardian</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Daily Cause Tracker
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tracks day-to-day legal case milestones. If case is complicated, automatically connects to nearby rehabilitation centers & AI stress counseling.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCounseling}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Wind className="w-3.5 h-3.5" /> AI Stress Counseling
          </button>

          <button
            onClick={() => handleRefreshCase()}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Checking Roster...' : 'Sync Today’s Status'}
          </button>
        </div>
      </div>

      {/* CNR Search & Update Form with Complexity Selector */}
      <form
        onSubmit={handleRefreshCase}
        className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
      >
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            CNR Number (16-Digit National Case Record)
          </label>
          <input
            type="text"
            required
            value={cnrInput}
            onChange={(e) => setCnrInput(e.target.value.toUpperCase())}
            placeholder="e.g. DLHC010048222025"
            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-amber-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Court Jurisdiction</label>
          <input
            type="text"
            value={courtName}
            onChange={(e) => setCourtName(e.target.value)}
            placeholder="High Court / District Court"
            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Case Complexity</label>
          <select
            value={complexity}
            onChange={(e) => {
              const val = e.target.value as any;
              setComplexity(val);
              setCaseDetail((prev) => ({ ...prev, complexity: val }));
            }}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-300 focus:outline-none focus:border-amber-500"
          >
            <option value="normal">Normal (Routine Listing)</option>
            <option value="moderate">Moderate (Contested)</option>
            <option value="complicated">Complicated (Needs Rehab Centers)</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            {isLoading ? 'Tracking...' : 'Update & Track'}
          </button>
        </div>
      </form>

      {/* Complicated Case Alert & Nearby Rehabilitation Centers */}
      {complexity === 'complicated' && (
        <div className="p-5 bg-amber-950/25 border border-amber-500/40 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-amber-200">
                Case Complexity Alert: Nearby Psychosocial Rehabilitation Centers
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-900/60 px-2 py-0.5 rounded border border-amber-600/40">
              Immediate Stress De-escalation
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Because this case involves complicated hearings and elevated stress, Cure Connect has mapped nearby certified rehabilitation centers, trauma care centers, and mental health sanctuaries to support you:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {rehabCenters.map((rehab) => (
              <div key={rehab.id} className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{rehab.name}</h4>
                  <span className="text-[10px] font-mono text-teal-400 font-bold shrink-0">{rehab.distanceMeters}m</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{rehab.address}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-amber-400">{rehab.counselorsAvailable} Counselors Available</span>
                  <a
                    href={`tel:${rehab.phone.replace(/[^0-9+]/g, '')}`}
                    className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <Phone className="w-3 h-3" /> Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Case Details Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Status Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-500/30">
                  CNR: {caseDetail.cnrNumber}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1.5 font-display">
                  {user.caseTitle || 'Mahammad v. State Property Registry & Civil Relief'}
                </h3>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Stage: {caseDetail.caseStage}
              </span>
            </div>

            {/* Daily Status Summary */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Day-to-Day Judicial Progress
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                {caseDetail.statusSummary}
              </p>
            </div>

            {/* Hearing & Bench Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Next Scheduled Hearing</span>
                  <span className="text-sm font-bold text-white font-mono">{caseDetail.nextHearingDate}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <Building2 className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Assigned Bench & Room</span>
                  <span className="text-sm font-bold text-white line-clamp-1">{caseDetail.courtRoom}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Anxiety Relief & Grounding Tips */}
          <div className="p-5 bg-gradient-to-r from-teal-950/30 to-slate-900 border border-teal-500/30 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4" /> Legal Stress Neutralizer
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              "{caseDetail.anxietyReliefTip}"
            </p>
            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={onOpenCounseling}
                className="text-xs text-amber-300 hover:underline font-semibold"
              >
                Launch Stress-Decreasing Counseling →
              </button>
              <button
                onClick={onOpenCompanion}
                className="text-xs text-teal-300 hover:underline font-semibold"
              >
                Talk through this case with 3D Companion →
              </button>
            </div>
          </div>
        </div>

        {/* Preparation Checklist Column */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-400" /> Pre-Hearing Checklist
            </h4>
            <p className="text-xs text-slate-400">
              Clear actionable steps to replace uncertainty with calm readiness.
            </p>

            <div className="space-y-2 pt-2">
              {caseDetail.checklist.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

