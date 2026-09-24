import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  Wind,
  ShieldCheck,
  Building,
  Phone,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Volume2,
  VolumeX,
  MapPin,
  ChevronRight,
  Activity
} from 'lucide-react';
import { UserProfile, FavoritePerson, RehabCenter, SmartWatchVitals } from '../types';

interface StressCounselingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  favoritePerson: FavoritePerson;
  vitals: SmartWatchVitals;
  rehabCenters: RehabCenter[];
  onOpenVideoCall: () => void;
}

export const StressCounselingModal: React.FC<StressCounselingModalProps> = ({
  isOpen,
  onClose,
  user,
  favoritePerson,
  vitals,
  rehabCenters,
  onOpenVideoCall,
}) => {
  if (!isOpen) return null;

  const callMeAs = favoritePerson.callMeAs || user.name || 'Nanna';
  const isCaseComplicated = user.caseComplexity === 'complicated' || user.hasCase;

  // Counseling State
  const [stressBefore, setStressBefore] = useState(vitals.stressLevel || 78);
  const [stressAfter, setStressAfter] = useState(Math.max(25, (vitals.stressLevel || 78) - 28));
  const [isCounselingLoading, setIsCounselingLoading] = useState(false);
  const [counselingData, setCounselingData] = useState<{
    counselorDialogue: string;
    vagusBreathing: { inhaleSeconds: number; holdSeconds: number; exhaleSeconds: number; cycles: number };
    groundingAffirmation: string;
    estimatedStressReduction: number;
    rehabCenterRecommendation: string;
  } | null>(null);

  // Breathing Pacer state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCounter, setBreathCounter] = useState(4);

  // Trigger counseling fetch on open
  useEffect(() => {
    fetchCounseling();
  }, []);

  const fetchCounseling = async () => {
    setIsCounselingLoading(true);
    try {
      const res = await fetch('/api/gemini/counseling-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stressLevel: stressBefore,
          userConcerns: `Court case (${user.caseTitle || 'CNR Case'}) pressure, fear of hearing outcomes, loneliness`,
          favoritePerson,
          userProfile: user,
        }),
      });

      const data = await res.json();
      setCounselingData(data);
      if (data.estimatedStressReduction) {
        setStressAfter(Math.max(20, stressBefore - data.estimatedStressReduction));
      }
    } catch (err) {
      console.error('Counseling fetch error:', err);
      setCounselingData({
        counselorDialogue: `${callMeAs}, take a slow, gentle breath and let your shoulders drop. Your nervous system has been running in hyper-vigilance because of this complicated court case. Hear me clearly: a legal petition is an administrative process, not a verdict on your soul or your future.\n\nPlace one hand on your chest and feel the warmth. When you feel alone, your body magnifies fear. But right now, in this room, you are physically safe. Let us do the 4-7-8 breathing sequence together.`,
        vagusBreathing: { inhaleSeconds: 4, holdSeconds: 7, exhaleSeconds: 8, cycles: 4 },
        groundingAffirmation: "I release the need to control every court outcome. In this present moment, I am safe, supported, and worthy of peace.",
        estimatedStressReduction: 25,
        rehabCenterRecommendation: "Asha Psychosocial & Trauma Recovery Institute (380m away)"
      });
    } finally {
      setIsCounselingLoading(false);
    }
  };

  // Breathing Pacer timer
  useEffect(() => {
    if (!isBreathingActive) return;

    let phase: 'Inhale' | 'Hold' | 'Exhale' = 'Inhale';
    let count = 4;

    const timer = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        if (phase === 'Inhale') {
          phase = 'Hold';
          count = 7;
        } else if (phase === 'Hold') {
          phase = 'Exhale';
          count = 8;
        } else {
          phase = 'Inhale';
          count = 4;
        }
        setBreathPhase(phase);
      }
      setBreathCounter(count);
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl my-6 overflow-hidden">
        {/* Decent Ambient Background Lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Heart className="w-6 h-6 fill-teal-400/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Stress De-escalation & Mental Wellness Counseling
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Targeted Stress Relief
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Mindful clinical counseling for {user.name} ({callMeAs}) · Calms legal hearing anxiety, loneliness & sympathetic exhaustion.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
          {/* Left Column: Counseling Dialogue & 4-7-8 Breathing Pacer */}
          <div className="lg:col-span-2 space-y-5">
            {/* Counseling Dialogue */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-teal-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  Counseling Words for {callMeAs} from {favoritePerson.name || 'Amma'}
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Clinical Compassion Engine</span>
              </div>

              {isCounselingLoading ? (
                <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                  <div className="w-6 h-6 rounded-full border-2 border-teal-400 border-t-transparent animate-spin mx-auto" />
                  <p>Harmonizing therapeutic words to lower your cortisol and stress...</p>
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2.5 whitespace-pre-line">
                  {counselingData?.counselorDialogue}
                </div>
              )}

              {/* Grounding Affirmation */}
              {counselingData?.groundingAffirmation && (
                <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-200 italic flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold not-italic mb-0.5">Grounding Affirmation:</strong>
                    "{counselingData.groundingAffirmation}"
                  </div>
                </div>
              )}
            </div>

            {/* Interactive 4-7-8 Vagus Nerve Breathing Circle */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                      breathPhase === 'Inhale'
                        ? 'bg-teal-500/20 scale-125 border-2 border-teal-400'
                        : breathPhase === 'Hold'
                        ? 'bg-amber-500/20 scale-110 border-2 border-amber-400'
                        : 'bg-indigo-500/20 scale-90 border-2 border-indigo-400'
                    }`}
                  />
                  <div className="relative text-center">
                    <span className="text-xl font-bold font-mono text-white">{breathCounter}s</span>
                    <span className="text-[10px] block text-slate-300 font-semibold uppercase">{breathPhase}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-teal-400" /> Somatic 4-7-8 Vagal Regulation
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Inhale for 4s, gently hold for 7s, exhale slowly for 8s to calm the heart and lower physical anxiety.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                  isBreathingActive
                    ? 'bg-slate-800 text-teal-300 border border-teal-500/40'
                    : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                }`}
              >
                {isBreathingActive ? 'Pause Breathwork' : 'Start 4-7-8 Breathing'}
              </button>
            </div>
          </div>

          {/* Right Column: Stress Meter & Nearby Rehabilitation Centers */}
          <div className="space-y-4">
            {/* Stress Reduction Progress Card */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Stress Level Reduction
              </span>

              <div className="flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">BEFORE</span>
                  <span className="text-lg font-bold text-rose-400">{stressBefore}/100</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600" />
                <div>
                  <span className="text-slate-400 block text-[10px]">AFTER COUNSELING</span>
                  <span className="text-lg font-bold text-teal-400">{stressAfter}/100</span>
                </div>
              </div>

              {/* Stress Visual Progress Bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 transition-all duration-1000"
                  style={{ width: `${Math.max(15, 100 - stressAfter)}%` }}
                />
              </div>
              <span className="text-[11px] text-teal-300 font-semibold block">
                ✓ Predicted Stress Drop: ~{stressBefore - stressAfter} points
              </span>
            </div>

            {/* Nearby Rehabilitation & Crisis Recovery Centers (Triggered for Complicated Cases) */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-amber-400" /> Nearby Rehabilitation Centers
                </h4>
                {isCaseComplicated && (
                  <span className="text-[9px] font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-600/40">
                    Complicated Case Priority
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Professional recovery sanctuaries within your immediate vicinity offering specialized legal stress and trauma rehabilitation:
              </p>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {rehabCenters.map((center) => (
                  <div
                    key={center.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-semibold text-white line-clamp-1">{center.name}</h5>
                      <span className="text-[10px] font-mono text-teal-400 shrink-0 font-bold">
                        {center.distanceMeters}m away
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{center.address}</p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-amber-400">
                        {center.counselorsAvailable} Counselors Available · {center.rating}★
                      </span>
                      <a
                        href={`tel:${center.phone.replace(/[^0-9+]/g, '')}`}
                        className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3" /> Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenVideoCall();
            }}
            className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" /> Talk with {favoritePerson.name || 'Amma'} on Video Call
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            I Feel Calmer Now
          </button>
        </div>
      </div>
    </div>
  );
};
