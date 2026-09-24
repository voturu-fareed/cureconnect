import React, { useState } from 'react';
import {
  Calendar,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  Plus,
  BookOpen,
  Activity,
  Heart,
  TrendingUp,
  Tag
} from 'lucide-react';
import { DayHistoryItem } from '../types';

interface DayHistoryTimelineProps {
  historyItems: DayHistoryItem[];
  onAddHistoryItem: (item: DayHistoryItem) => void;
  onOpenCompanion: () => void;
}

export const DayHistoryTimeline: React.FC<DayHistoryTimelineProps> = ({
  historyItems,
  onAddHistoryItem,
  onOpenCompanion,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSummary, setNewSummary] = useState('');
  const [newEmotion, setNewEmotion] = useState<DayHistoryItem['primaryEmotion']>('loneliness');
  const [newStress, setNewStress] = useState<number>(6);
  const [newIssues, setNewIssues] = useState('');
  const [newCoping, setNewCoping] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSummary.trim()) return;

    const issuesArray = newIssues
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const item: DayHistoryItem = {
      id: `hist_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      primaryEmotion: newEmotion,
      emotionalScore: newEmotion === 'joy' || newEmotion === 'excitement' ? 0.8 : -0.5,
      summary: newSummary.trim(),
      stressScore: Number(newStress),
      vitalsSummary: { avgBpm: 75, sleepHours: 7.0, stressScore: Number(newStress) * 10 },
      notes: 'Self-reported daily log entry.',
      issuesFaced: issuesArray,
      copingActionTaken: newCoping.trim() || 'Talked with Cure Connect AI companion',
    };

    onAddHistoryItem(item);
    setNewSummary('');
    setNewIssues('');
    setNewCoping('');
    setIsAdding(false);
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'excitement':
      case 'joy':
        return <Smile className="w-4 h-4 text-amber-400" />;
      case 'sadness':
      case 'loneliness':
        return <Frown className="w-4 h-4 text-indigo-400" />;
      case 'anxiety':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      default:
        return <Meh className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">Day-to-Day Emotional & Wellness History</h2>
            <p className="text-xs text-slate-400 mt-1">
              Tracks day-to-day emotional states, issues faced, vitals correlations, and coping milestones over time.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> {isAdding ? 'Cancel' : 'Log Today’s Reflection'}
        </button>
      </div>

      {/* New Entry Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-6 bg-slate-900/90 border border-teal-500/30 rounded-2xl space-y-4 shadow-2xl animate-fade-in"
        >
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-400" /> New Day Reflection Entry
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Primary Observed Emotion</label>
              <select
                value={newEmotion}
                onChange={(e) => setNewEmotion(e.target.value as any)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
              >
                <option value="loneliness">Loneliness</option>
                <option value="sadness">Sadness</option>
                <option value="anxiety">Anxiety / Overwhelm</option>
                <option value="excitement">Excitement</option>
                <option value="joy">Joy & Relief</option>
                <option value="peace">Peace & Calm</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Stress Level: {newStress}/10
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={newStress}
                onChange={(e) => setNewStress(Number(e.target.value))}
                className="w-full mt-2 accent-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Daily Summary</label>
            <textarea
              rows={2}
              required
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              placeholder="e.g. Felt heavy loneliness in the morning, but doing video call with Maya eased my chest tightness."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Issues Faced Today (comma separated)
              </label>
              <input
                type="text"
                value={newIssues}
                onChange={(e) => setNewIssues(e.target.value)}
                placeholder="e.g. Court case anxiety, headache, insomnia"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Coping Action Taken</label>
              <input
                type="text"
                value={newCoping}
                onChange={(e) => setNewCoping(e.target.value)}
                placeholder="e.g. 15min 3D avatar video call + neighbor walk"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Save Daily Record
            </button>
          </div>
        </form>
      )}

      {/* Timeline List */}
      <div className="space-y-4">
        {historyItems.map((item) => {
          return (
            <div
              key={item.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950 text-xs font-semibold border border-slate-800">
                    {getEmotionIcon(item.primaryEmotion)}
                    <span className="capitalize text-white">{item.primaryEmotion}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{item.date}</span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs font-mono text-amber-400 font-semibold">
                    Stress {item.stressScore}/10
                  </span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed">{item.summary}</p>

                {/* Issues Tags */}
                {item.issuesFaced && item.issuesFaced.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400">Issues:</span>
                    {item.issuesFaced.map((issue, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                )}

                {item.copingActionTaken && (
                  <div className="text-xs text-teal-300/90 pt-1">
                    <strong className="text-teal-400">Coping Action:</strong> {item.copingActionTaken}
                  </div>
                )}
              </div>

              {/* Vitals Snapshot */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 shrink-0 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500">Vitals Snapshot</div>
                <div>Avg Pulse: <span className="text-teal-400">{item.vitalsSummary.avgBpm} BPM</span></div>
                <div>Rest Sleep: <span className="text-indigo-400">{item.vitalsSummary.sleepHours} hrs</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
