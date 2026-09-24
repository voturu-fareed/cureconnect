import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Video, X, Sparkles, Send } from 'lucide-react';
import { FavoritePerson, FavoritePersonNotification, UserProfile } from '../types';

interface FavoritePersonNotifierProps {
  favoritePerson: FavoritePerson;
  user: UserProfile;
  notifications: FavoritePersonNotification[];
  onReplyNotification: (id: string, replyText: string) => void;
  onOpenVideoCall: () => void;
  onAddNotification: (notif: FavoritePersonNotification) => void;
}

export const FavoritePersonNotifier: React.FC<FavoritePersonNotifierProps> = ({
  favoritePerson,
  user,
  notifications,
  onReplyNotification,
  onOpenVideoCall,
  onAddNotification,
}) => {
  const [activeNotification, setActiveNotification] = useState<FavoritePersonNotification | null>(
    notifications[0] || null
  );
  const [isReplying, setIsReplying] = useState(false);
  const [customReply, setCustomReply] = useState('');

  // Auto-generate fresh check-in text from favorite person
  const generateNewCheckin = async () => {
    try {
      const res = await fetch('/api/gemini/favorite-person-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          favoritePerson,
          userProfile: user,
          timeOfDay: new Date().getHours() > 18 ? 'evening' : 'afternoon',
        }),
      });

      const data = await res.json();
      const newNotif: FavoritePersonNotification = {
        id: `notif_${Date.now()}`,
        timestamp: 'Just now',
        title: data.notificationTitle || `${favoritePerson.name} (${favoritePerson.relation})`,
        message: data.message || `Hey ${user.name} ❤️ How was your day? I just wanted to see how you're feeling right now.`,
        suggestedReplies: data.suggestedReplies || [
          'My day was a bit rough...',
          'Feeling much better now that you texted!',
          'Can we hop on a quick video call? ❤️',
        ],
        status: 'unread',
      };

      onAddNotification(newNotif);
      setActiveNotification(newNotif);
    } catch (err) {
      console.error('Checkin notification failed:', err);
    }
  };

  const handleQuickReply = (reply: string) => {
    if (!activeNotification) return;

    onReplyNotification(activeNotification.id, reply);
    if (reply.toLowerCase().includes('video call') || reply.toLowerCase().includes('call')) {
      onOpenVideoCall();
    }
    setActiveNotification(null);
  };

  if (!activeNotification) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={generateNewCheckin}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-rose-300 border border-rose-500/40 text-xs font-semibold shadow-2xl backdrop-blur-md transition-all active:scale-95"
          title="Receive check-in from favorite person"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          <span>Text from {favoritePerson.name}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm sm:max-w-md w-full p-2 animate-slide-up">
      <div className="bg-slate-900 border border-rose-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500" />

        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-rose-400 bg-slate-800 shrink-0">
              {favoritePerson.photoUrl ? (
                <img
                  src={favoritePerson.photoUrl}
                  alt={favoritePerson.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-rose-950 text-rose-300 font-bold text-xs">
                  {favoritePerson.name[0]}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">{activeNotification.title}</span>
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
              </div>
              <span className="text-[10px] text-slate-400">
                {activeNotification.timestamp} · New Message
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveNotification(null)}
            className="text-slate-500 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Text Message Bubble */}
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-3">
          "{activeNotification.message}"
        </p>

        {/* Quick Replies Buttons */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-1.5">
            {activeNotification.suggestedReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickReply(reply)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/30 text-[11px] text-rose-200 transition-colors text-left"
              >
                {reply}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
            <button
              onClick={onOpenVideoCall}
              className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
            >
              <Video className="w-3.5 h-3.5" /> Start Video Call with {favoritePerson.name}
            </button>
            <button
              onClick={generateNewCheckin}
              className="text-slate-400 hover:text-white flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> New check-in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
