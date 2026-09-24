import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Bell,
  MapPin,
  Clock,
  Send,
  Building,
  UserCheck,
  Ambulance
} from 'lucide-react';
import { NeighborUser, UserProfile } from '../types';

interface NeighborNetworkProps {
  neighbors: NeighborUser[];
  user: UserProfile;
  onVerifyNeighbor: (id: string, isSafe: boolean) => void;
  onUserMarkSelfSafe: () => void;
  onTriggerEmergencyEscalation: () => void;
}

export const NeighborNetwork: React.FC<NeighborNetworkProps> = ({
  neighbors,
  user,
  onVerifyNeighbor,
  onUserMarkSelfSafe,
  onTriggerEmergencyEscalation,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unverified'>('all');
  const [alertSentId, setAlertSentId] = useState<string | null>(null);

  const handleSendPing = (id: string) => {
    setAlertSentId(id);
    setTimeout(() => setAlertSentId(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Network Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-display">Nearby Neighbor Safety Network</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                5m–50m Radius
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mutual care community: Neighbors confirm your well-being with a safe tick mark. Unanswered alerts automatically escalate to emergency hospitals.
            </p>
          </div>
        </div>

        {/* User Self Safety Status Card */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Your Daily Safety Status:</span>
            <strong className={user.isSafe ? 'text-emerald-400 text-xs' : 'text-amber-400 text-xs'}>
              {user.isSafe ? 'Verified Safe Today ✓' : 'Pending Daily Verification'}
            </strong>
          </div>
          <button
            onClick={onUserMarkSelfSafe}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
              user.isSafe
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {user.isSafe ? 'I am Safe ✓' : 'Mark Myself Safe'}
          </button>
        </div>
      </div>

      {/* Safety Protocol Rule Explanation Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-teal-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <strong className="text-white block font-semibold mb-0.5">Automated 1-Day Inactivity Escalation Protocol</strong>
            If a user does not check in for 24 hours, an alert notification is dispatched to verified nearby neighbors to check in person. If neighbors are unreachable, the system automatically redirects immediately to the nearest hospital within 5 meters.
          </div>
        </div>

        <button
          onClick={onTriggerEmergencyEscalation}
          className="shrink-0 px-3.5 py-2 text-xs font-semibold text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Ambulance className="w-3.5 h-3.5 text-rose-400" /> Test Hospital Escalation
        </button>
      </div>

      {/* Neighbor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {neighbors.map((neighbor) => {
          return (
            <div
              key={neighbor.id}
              className={`p-5 rounded-2xl border transition-all ${
                neighbor.status === 'Alert: Needs Assistance'
                  ? 'bg-rose-950/20 border-rose-700/50 shadow-lg'
                  : neighbor.verifiedSafeByUser
                  ? 'bg-slate-900/90 border-slate-800'
                  : 'bg-slate-900/50 border-amber-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${neighbor.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0`}
                  >
                    {neighbor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white font-display">{neighbor.name}</h3>
                      <span className="text-[10px] text-slate-400 capitalize">({neighbor.gender})</span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-teal-400" /> {neighbor.address}
                    </p>
                    <span className="text-[11px] font-mono text-teal-300 font-semibold block mt-1">
                      Distance: {neighbor.distanceMeters}m from you
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    neighbor.status === 'Safe'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : neighbor.status === 'Alert: Needs Assistance'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {neighbor.status}
                </span>
              </div>

              {/* Verification & Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                {/* Safe Tick Mark Toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={neighbor.verifiedSafeByUser}
                    onChange={(e) => onVerifyNeighbor(neighbor.id, e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-teal-400 bg-slate-950"
                  />
                  <span className="text-xs text-slate-300 font-medium">
                    {neighbor.verifiedSafeByUser ? 'Marked Safe by You ✓' : 'Confirm Neighbor is Safe'}
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSendPing(neighbor.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Bell className="w-3 h-3 text-teal-400" />
                    {alertSentId === neighbor.id ? 'Ping Sent!' : 'Safety Ping'}
                  </button>

                  <a
                    href={`tel:${neighbor.phone.replace(/[^0-9+]/g, '')}`}
                    className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 transition-colors"
                    title={`Call ${neighbor.name}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
