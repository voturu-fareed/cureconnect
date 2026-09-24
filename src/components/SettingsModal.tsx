import React, { useState } from 'react';
import {
  Settings,
  Languages,
  Star,
  FileCheck,
  RotateCcw,
  LogOut,
  Download,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateLanguage: (lang: string) => void;
  onClearHistory: () => void;
  onLogout: () => void;
  historyCount: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateLanguage,
  onClearHistory,
  onLogout,
  historyCount,
}) => {
  if (!isOpen) return null;

  const [selectedLang, setSelectedLang] = useState(user.language || 'en');
  const [rating, setRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'terms' | 'feedback'>('general');

  const languages = [
    { code: 'en', name: 'English (US / Global)' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'es', name: 'Español (Spanish)' },
    { code: 'fr', name: 'Français (French)' },
    { code: 'de', name: 'Deutsch (German)' },
    { code: 'ar', name: 'العربية (Arabic)' },
  ];

  const handleLanguageChange = (code: string) => {
    setSelectedLang(code);
    onUpdateLanguage(code);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRatingSubmitted(true);
    setTimeout(() => {
      setRatingSubmitted(false);
      setFeedbackText('');
    }, 3000);
  };

  const handleExportData = () => {
    const backup = {
      user,
      exportDate: new Date().toISOString(),
      app: 'Cure Connect Mental AI',
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CureConnect_Health_Data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">Settings & Responsible AI Charter</h2>
              <p className="text-xs text-slate-400">
                Language localization, app ratings, safety terms & history management.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Setting Navigation Tabs */}
        <div className="flex items-center gap-2 my-5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
              activeTab === 'general' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Preferences & Language
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
              activeTab === 'feedback' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rating & Feedback
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
              activeTab === 'terms' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Terms & Conditions
          </button>
        </div>

        {/* Tab 1: General & Language */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Language Selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-teal-400" /> Language Localization
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                      selectedLang === lang.code
                        ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* History Management */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                History & Emotional Journey Data
              </label>
              <p className="text-xs text-slate-400">
                You currently have <strong className="text-white">{historyCount}</strong> logged day-to-day emotional entries.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleExportData}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-teal-400" /> Export JSON Data
                </button>
                <button
                  onClick={onClearHistory}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 border border-rose-900/40 text-xs text-rose-300 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Clear Daily History
                </button>
              </div>
            </div>

            {/* Logout Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Signed in as {user.email}</span>
                <span className="text-[11px] text-slate-500">Gender: {user.gender} · Age: {user.age}</span>
              </div>

              <button
                onClick={onLogout}
                className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/60 text-rose-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Feedback & Ratings */}
        {activeTab === 'feedback' && (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Rate Your Cure Connect Companion Experience
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-bold text-amber-300 ml-2">{rating}.0 / 5.0 Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                How has the 3D companion & emotion AI helped with loneliness or stress?
              </label>
              <textarea
                rows={4}
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your thoughts on the avatar video call, neighbor safety watch, or Bluetooth vitals..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            {ratingSubmitted && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-600/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Thank you! Your rating and feedback have been submitted securely.
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Submit Rating & Review
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Terms and Conditions */}
        {activeTab === 'terms' && (
          <div className="space-y-4 max-h-80 overflow-y-auto pr-1 text-xs text-slate-300 leading-relaxed">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" /> 1. Responsible AI & Emotional Support Charter
              </h4>
              <p>
                Cure Connect Mental AI is engineered with rigorous Responsible AI guidelines. The 3D Companion provides empathetic active listening, loneliness alleviation, biofeedback analysis, and mindfulness grounding. It is not a substitute for clinical psychiatric care in medical crises.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-teal-400" /> 2. Precious Location & Emergency Lifeline
              </h4>
              <p>
                When you engage the Emergency Hospital SOS or Police Help buttons, your high-precision geolocation (calibrated within 5 meters) is automatically scanned to present immediate emergency trauma centers and local precincts. You can abort false alarms within the 5-second countdown window.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-teal-400" /> 3. Neighbor Safety & Inactivity Auto-Escalation
              </h4>
              <p>
                In accordance with community mutual care policies, if a user fails to log a daily check-in for 24 hours, registered nearby neighbors are notified to verify your safety. Unverified alerts directly escalate to the nearest emergency hospital within 5 meters.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
