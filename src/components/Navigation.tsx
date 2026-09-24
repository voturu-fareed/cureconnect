import React from 'react';
import { Shield, AlertCircle, Heart, PhoneCall, Radio, FileText, Activity, Users, Settings, User } from 'lucide-react';
import { UserProfile } from '../types';

export type ActiveTab = 'video-call' | 'vitals' | 'records' | 'neighbors' | 'case' | 'history' | 'settings';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenEmergency: (type: 'hospital' | 'police') => void;
  user: UserProfile;
  onOpenProfile: () => void;
  onOpenCounseling: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenEmergency,
  user,
  onOpenProfile,
  onOpenCounseling,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => onSelectTab('video-call')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 transition-colors">
            <Heart className="w-4 h-4 fill-teal-400/20" />
          </div>
          <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-teal-300 transition-colors whitespace-nowrap">
            Cure Connect
          </span>
        </button>

        {/* Zone 2: 4-6 Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => onSelectTab('video-call')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'video-call'
                ? 'text-teal-400 border-b-2 border-teal-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Companion
          </button>
          <button
            onClick={() => onSelectTab('vitals')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'vitals'
                ? 'text-teal-400 border-b-2 border-teal-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vitals & Watch
          </button>
          <button
            onClick={() => onSelectTab('records')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'records'
                ? 'text-teal-400 border-b-2 border-teal-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Health Records
          </button>
          <button
            onClick={() => onSelectTab('neighbors')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'neighbors'
                ? 'text-teal-400 border-b-2 border-teal-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Neighbor Watch
          </button>
          <button
            onClick={() => onSelectTab('case')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'case'
                ? 'text-teal-400 border-b-2 border-teal-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CNR Case
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'history'
                ? 'text-teal-400 border-b-2 border-teal-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Journey Log
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions & Emergency Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Stress Counseling */}
          <button
            onClick={onOpenCounseling}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-300 bg-teal-950/60 hover:bg-teal-900/80 border border-teal-600/40 rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap"
            title="Stress De-escalation & Mental Wellness Counseling"
          >
            <Heart className="w-3.5 h-3.5 text-teal-400" />
            <span>Counseling</span>
          </button>

          {/* Hospital Emergency SOS */}
          <button
            onClick={() => onOpenEmergency('hospital')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/60 rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap"
            title="Hospital Emergency SOS (5m Radius Scan)"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="hidden sm:inline">Hospital</span> SOS
          </button>

          {/* Police Security SOS */}
          <button
            onClick={() => onOpenEmergency('police')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/60 rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap"
            title="Police Security SOS (Immediate Dispatch)"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Police</span> Help
          </button>

          {/* Settings / Profile Trigger */}
          <button
            onClick={onOpenProfile}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors focus:outline-none"
            aria-label="User Profile & Settings"
          >
            <User className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            className={`p-2 rounded-lg transition-colors focus:outline-none ${
              activeTab === 'settings'
                ? 'text-teal-400 bg-slate-800/80'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            aria-label="Application Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Strip */}
      <div className="lg:hidden flex items-center justify-around px-2 py-2 border-t border-slate-800/60 bg-slate-950/90 text-xs overflow-x-auto">
        <button
          onClick={() => onSelectTab('video-call')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            activeTab === 'video-call' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Companion
        </button>
        <button
          onClick={() => onSelectTab('vitals')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            activeTab === 'vitals' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Vitals
        </button>
        <button
          onClick={() => onSelectTab('records')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            activeTab === 'records' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Records
        </button>
        <button
          onClick={() => onSelectTab('neighbors')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            activeTab === 'neighbors' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Neighbors
        </button>
        <button
          onClick={() => onSelectTab('case')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            activeTab === 'case' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Case
        </button>
        <button
          onClick={() => onSelectTab('history')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            activeTab === 'history' ? 'text-teal-400 font-semibold' : 'text-slate-400'
          }`}
        >
          History
        </button>
      </div>
    </header>
  );
};
