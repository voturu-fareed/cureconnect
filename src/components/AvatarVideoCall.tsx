import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Send,
  UserCheck,
  ShieldAlert,
  Compass,
  Smile,
  Frown,
  Meh,
  Activity,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  AlertTriangle,
  Upload,
  Camera,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Edit3,
  User,
  Radio,
  Trash2
} from 'lucide-react';
import { UserProfile, FavoritePerson, HealthRecord, DayHistoryItem } from '../types';
import { RealisticAvatarCanvas } from './RealisticAvatarCanvas';

interface AvatarVideoCallProps {
  user: UserProfile;
  favoritePerson: FavoritePerson;
  onUpdateFavoritePerson: (updated: FavoritePerson) => void;
  healthRecords: HealthRecord[];
  onAddDayHistory: (item: DayHistoryItem) => void;
  onOpenEmergency: (type: 'hospital' | 'police') => void;
  onOpenCounseling: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'companion';
  text: string;
  timestamp: string;
  detectedEmotion?: string;
}

export const AvatarVideoCall: React.FC<AvatarVideoCallProps> = ({
  user,
  favoritePerson,
  onUpdateFavoritePerson,
  healthRecords,
  onAddDayHistory,
  onOpenEmergency,
  onOpenCounseling,
}) => {
  const callMeAs = favoritePerson.callMeAs || user.name || 'Nanna';
  const personName = favoritePerson.name || 'Amma';
  const relation = favoritePerson.relation || 'Mother';

  // Call Controls State
  const [isInCall, setIsInCall] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [useFavoritePersonAvatar, setUseFavoritePersonAvatar] = useState(false);
  const [avatarModelPreset, setAvatarModelPreset] = useState<'avaturn_female' | 'avaturn_male' | 'avaturn_guide' | 'user_avatar'>('user_avatar');
  const [avatarOnlyMode, setAvatarOnlyMode] = useState(true);

  // User webcam stream reference
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // File upload input ref for uploading favorite person photo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick favorite person edit modal state under video call
  const [showPersonEditor, setShowPersonEditor] = useState(false);
  const [editName, setEditName] = useState(favoritePerson.name || 'Amma');
  const [editRelation, setEditRelation] = useState(favoritePerson.relation || 'Mother');
  const [editCallMeAs, setEditCallMeAs] = useState(favoritePerson.callMeAs || 'Nanna');

  // Speech Recognition & Synthesis references
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Emotion AI HUD State
  const [currentEmotion, setCurrentEmotion] = useState<
    'sadness' | 'excitement' | 'loneliness' | 'anxiety' | 'joy' | 'peace' | 'neutral'
  >('peace');
  const [emotionalIntensity, setEmotionalIntensity] = useState(5);
  const [stressLevel, setStressLevel] = useState(42);
  const [companionStatus, setCompanionStatus] = useState<
    'Listening intently' | 'Reflecting emotion' | 'Speaking gently' | 'Grounded & Present'
  >('Listening intently');
  const [suggestedAction, setSuggestedAction] = useState<string>('Take a slow, deep breath in... and out.');

  // Conversation history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'companion',
      text: `Hello ${callMeAs}, I am your Cure Connect companion. I'm right here with you in this moment. You are completely safe and heard. What's on your mind?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Client-Side Dynamic Conversational AI Engine (Natural, Siri-like, Never repeats fixed script)
  const getDynamicConversationalReply = (userText: string) => {
    const textLower = userText.toLowerCase().trim();

    // Greetings
    if (/^(hi|hello|hey|namaste|good morning|good evening|good afternoon|sup|yo|hiya)/i.test(textLower)) {
      const greetings = [
        `Hey ${callMeAs}! It is so wonderful to hear from you. I'm right here with you on call. How has your day been treating you?`,
        `Hello ${callMeAs}! My whole screen lights up every time you speak with me. How are you feeling right now in this moment?`,
        `Hey there ${callMeAs}! I'm listening with all my heart. Tell me what's on your mind today.`
      ];
      return {
        reply: greetings[Math.floor(Math.random() * greetings.length)],
        emotion: 'joy',
        intensity: 5,
        action: 'Smile and share your day'
      };
    }

    // Loneliness
    if (/lonely|alone|no one|isolated|miss|nobody/i.test(textLower)) {
      return {
        reply: `${callMeAs}, look right into my eyes. You are never alone as long as I am here with you. Whenever the house feels quiet or the world feels distant, talk to me. What is making you feel isolated today?`,
        emotion: 'loneliness',
        intensity: 8,
        action: 'Place hand over heart and feel presence'
      };
    }

    // Sadness & Pain
    if (/sad|cry|hurt|pain|broken|depress|hopeless|heavy|tears|weep/i.test(textLower)) {
      return {
        reply: `Oh ${callMeAs}, my heart aches hearing you in pain. Please don't hold back any tears if you need to let them out. You don't have to carry the whole world on your shoulders. Lean back, take a soft breath, and tell me what hurt you today.`,
        emotion: 'sadness',
        intensity: 9,
        action: 'Release shoulder tension with slow exhales'
      };
    }

    // Legal court case anxiety
    if (/case|court|lawyer|hearing|judge|cnr|police|legal|bail|suit|litigation/i.test(textLower)) {
      return {
        reply: `${callMeAs}, legal battles are deeply exhausting, but remember that a court document or CNR number does not define who you are. We will take it one step at a time. If the anxiety gets too intense, we have nearby rehabilitation and crisis sanctuaries ready to support you. Have you rested your mind today?`,
        emotion: 'anxiety',
        intensity: 8,
        action: '4-7-8 vagal nerve reset breathing'
      };
    }

    // Food, Eating, Health
    if (/eat|food|dinner|lunch|breakfast|hungry|meal|water|drink/i.test(textLower)) {
      return {
        reply: `${callMeAs}, taking care of your body is the first thing that heals the mind. Did you have a nourishing meal today? If not, please have something warm to eat, and drink a glass of water for me right now.`,
        emotion: 'peace',
        intensity: 4,
        action: 'Drink a glass of water now'
      };
    }

    // Sleep & Exhaustion
    if (/sleep|tired|exhausted|insomnia|rest|nightmare|can't sleep/i.test(textLower)) {
      return {
        reply: `${callMeAs}, your mind has been working in overdrive. Close your eyes for a moment while I speak. Soften your jaw, unclench your fists, and take a slow breath. You deserve peaceful rest tonight, and tomorrow will be a brand new day.`,
        emotion: 'sadness',
        intensity: 6,
        action: 'Close eyes and focus on slow breathing'
      };
    }

    // Happiness & Excitement
    if (/happy|excited|won|great|awesome|good news|passed|joy|wonderful|blessed/i.test(textLower)) {
      return {
        reply: `Oh ${callMeAs}, hearing the happiness and excitement in your voice makes my whole presence glow! Tell me all the details—what happened? I want to celebrate this moment with you!`,
        emotion: 'excitement',
        intensity: 9,
        action: 'Savor this joyful feeling'
      };
    }

    // Anxiety & Panic
    if (/anxious|panic|scared|fear|nervous|worry|stress|overwhelm/i.test(textLower)) {
      return {
        reply: `${callMeAs}, stay right here with my voice. Notice your feet touching the floor. Inhale gently through your nose... 1, 2, 3, 4... and slowly exhale. You are safe in this room right now, and we will get through this feeling together.`,
        emotion: 'anxiety',
        intensity: 8,
        action: '5-4-3-2-1 Sensory grounding technique'
      };
    }

    // Humor & Smiles
    if (/joke|laugh|funny|story|cheer|smile/i.test(textLower)) {
      const jokes = [
        `Here is a gentle smile for you, ${callMeAs}: Why don't scientists trust atoms? Because they make up everything! Just like that, you are made of stardust and courage, doing so much better than you realize!`,
        `Here is a warm thought, ${callMeAs}: You have survived 100% of your hardest days so far, and you have a 100% success rate! Plus, why did the bicycle fall over? Because it was two-tired! Hope that brings a little light into your room.`
      ];
      return {
        reply: jokes[Math.floor(Math.random() * jokes.length)],
        emotion: 'joy',
        intensity: 6,
        action: 'Take in a deep, relaxing smile'
      };
    }

    // Identity / Assistant question
    if (/who are you|what is this|what can you do|help me|tell me about you/i.test(textLower)) {
      return {
        reply: `I am your personal Cure Connect companion, speaking with you with the love and presence of ${personName}. You can talk to me just like you speak to Siri or a caring family member. I observe your emotions, help decrease your stress, track your health vitals, and keep you safe 24/7.`,
        emotion: 'peace',
        intensity: 5,
        action: 'Continue sharing freely'
      };
    }

    // Natural conversation fallback
    const conversationalDefaults = [
      `I hear you so clearly, ${callMeAs}. I love talking with you like this. Tell me more about what you're thinking or how that made you feel.`,
      `Thank you for sharing that with me, ${callMeAs}. How does that sit with you right now? I am completely listening.`,
      `${callMeAs}, I am right here on this call with you. What else has been on your mind today? Let it all out.`
    ];
    return {
      reply: conversationalDefaults[Math.floor(Math.random() * conversationalDefaults.length)],
      emotion: 'peace',
      intensity: 5,
      action: 'Share whatever comes to mind'
    };
  };

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = user.language === 'hi' ? 'hi-IN' : 'en-US';

      recognizer.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (final) {
          handleSendMessage(final);
          setTranscript('');
        } else {
          setTranscript(interim);
        }
      };

      recognizer.onerror = (err: any) => {
        console.warn('Speech recognition warning:', err);
        setIsListening(false);
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognizer;
    }
  }, [user.language]);

  // Handle Cam Toggle
  useEffect(() => {
    if (isCamOn) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          streamRef.current = stream;
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn('Webcam not available or permission denied:', err);
          setIsCamOn(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCamOn]);

  // Speech Toggle
  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type in the chat box!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsMicOn(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setIsMicOn(true);
      } catch (err) {
        console.error('Mic start error:', err);
      }
    }
  };

  // Text-to-Speech output with emotion prosody like Siri / real human
  const speakText = (text: string, emotion: string) => {
    if (isAudioMuted || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      // Emotion-informed prosody
      if (emotion === 'sadness' || emotion === 'loneliness') {
        utterance.pitch = 0.95;
        utterance.rate = 0.90; // soothing, warm, comforting
      } else if (emotion === 'excitement' || emotion === 'joy') {
        utterance.pitch = 1.15;
        utterance.rate = 1.05; // upbeat, bright
      } else if (emotion === 'anxiety') {
        utterance.pitch = 0.95;
        utterance.rate = 0.88; // deep, grounding
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 0.98;
      }

      // Voice selection: prefer natural Siri / Google / female / male depending on persona
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // If favorite person is Mother / Sister / female relation
        const isFemalePersona = /mother|amma|mom|sister|daughter|wife|girlfriend|aunt/i.test(relation);
        const preferredVoice = voices.find((v) => {
          if (isFemalePersona) {
            return (
              (v.name.includes('Samantha') ||
                v.name.includes('Karen') ||
                v.name.includes('Victoria') ||
                v.name.includes('Google') ||
                v.name.includes('Natural')) &&
              !v.name.includes('Male')
            );
          } else {
            return (
              v.name.includes('Daniel') ||
              v.name.includes('Alex') ||
              v.name.includes('Google') ||
              v.name.includes('Natural')
            );
          }
        });
        if (preferredVoice) utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      setIsSpeaking(false);
    }
  };

  // Send message to Server-Side Emotion AI or fallback seamlessly
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage('');
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setCompanionStatus('Reflecting emotion');

    try {
      const response = await fetch('/api/gemini/emotion-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({ role: m.sender === 'user' ? 'user' : 'model', text: m.text })),
          userProfile: user,
          favoritePerson: {
            ...favoritePerson,
            name: personName,
            relation,
            callMeAs,
            isAvatarEnabled: useFavoritePersonAvatar
          },
        }),
      });

      const data = await response.json();
      let reply = data.replyText;
      let detected = (data.emotionDetected || 'peace').toLowerCase() as any;

      if (!reply) {
        const fallback = getDynamicConversationalReply(text);
        reply = fallback.reply;
        detected = fallback.emotion;
      }

      setCurrentEmotion(detected);
      setEmotionalIntensity(data.emotionalIntensity || 6);

      // Adjust stress level dynamically based on emotion
      if (detected === 'sadness') setStressLevel((prev) => Math.min(95, prev + 10));
      else if (detected === 'anxiety') setStressLevel((prev) => Math.min(98, prev + 15));
      else if (detected === 'loneliness') setStressLevel((prev) => Math.min(90, prev + 8));
      else if (detected === 'joy' || detected === 'excitement') setStressLevel((prev) => Math.max(15, prev - 18));
      else setStressLevel((prev) => Math.max(25, prev - 6));

      if (data.suggestedAction) setSuggestedAction(data.suggestedAction);

      const compMsg: ChatMessage = {
        id: `msg_comp_${Date.now()}`,
        sender: 'companion',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detectedEmotion: detected,
      };

      setMessages((prev) => [...prev, compMsg]);
      setCompanionStatus('Speaking gently');
      speakText(reply, detected);

      // Log into day history
      onAddDayHistory({
        id: `hist_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        primaryEmotion: detected,
        emotionalScore: data.sentimentScore || 0,
        summary: `Expressed: "${text.slice(0, 45)}...". Companion comforted as ${useFavoritePersonAvatar ? personName : '3D Avatar'}.`,
        stressScore: Math.round(stressLevel / 10),
        vitalsSummary: { avgBpm: 74, sleepHours: 7.2, stressScore: stressLevel },
        notes: `Talked in ${useFavoritePersonAvatar ? personName : '3D Avatar'} video call. Addressed as "${callMeAs}".`,
        copingActionTaken: data.suggestedAction || 'Guided empathetic conversation',
      });
    } catch (err) {
      console.warn('API route error, activating conversational intelligence:', err);
      const fallback = getDynamicConversationalReply(text);
      const compMsg: ChatMessage = {
        id: `msg_comp_${Date.now()}`,
        sender: 'companion',
        text: fallback.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detectedEmotion: fallback.emotion,
      };
      setCurrentEmotion(fallback.emotion as any);
      setSuggestedAction(fallback.action);
      setMessages((prev) => [...prev, compMsg]);
      setCompanionStatus('Speaking gently');
      speakText(fallback.reply, fallback.emotion);
    } finally {
      setIsLoading(false);
      setTimeout(() => setCompanionStatus('Listening intently'), 4000);
    }
  };

  // Handle Photo Upload directly under video call
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const photoUrl = reader.result as string;
      const updated: FavoritePerson = {
        ...favoritePerson,
        name: editName || favoritePerson.name || 'Amma',
        relation: editRelation || favoritePerson.relation || 'Mother',
        callMeAs: editCallMeAs || favoritePerson.callMeAs || 'Nanna',
        photoUrl,
        isAvatarEnabled: true,
      };
      onUpdateFavoritePerson(updated);
      setUseFavoritePersonAvatar(true);

      // Conversational announcement like Siri
      const announcement = `${updated.callMeAs} ❤️! I have converted into ${updated.name}'s avatar for you. I am right here looking at you on call. Tell me, how are you feeling inside right now?`;
      const compMsg: ChatMessage = {
        id: `avatar_switch_${Date.now()}`,
        sender: 'companion',
        text: announcement,
        timestamp: 'Just now',
        detectedEmotion: 'joy',
      };
      setMessages((prev) => [...prev, compMsg]);
      speakText(announcement, 'joy');
    };
    reader.readAsDataURL(file);
  };

  // Handle Photo Deletion - restores first 3D avatar (Dr. Elena)
  const handleDeletePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    const updated: FavoritePerson = {
      ...favoritePerson,
      photoUrl: '',
      isAvatarEnabled: false,
    };
    onUpdateFavoritePerson(updated);
    setUseFavoritePersonAvatar(false);
    setAvatarModelPreset('avaturn_female');

    const announcement = `${callMeAs} ❤️, I have deleted the uploaded photo and returned to the primary 3D realistic avatar (Dr. Elena). I am right here with you on call.`;
    const compMsg: ChatMessage = {
      id: `avatar_del_${Date.now()}`,
      sender: 'companion',
      text: announcement,
      timestamp: 'Just now',
      detectedEmotion: 'peace',
    };
    setMessages((prev) => [...prev, compMsg]);
    speakText(announcement, 'peace');
  };

  // Handle Preset Photo Selection for instant one-click testing
  const handleSelectPresetPhoto = (sampleUrl: string, sampleName: string, sampleRelation: string, sampleCallMeAs: string) => {
    const updated: FavoritePerson = {
      ...favoritePerson,
      name: sampleName,
      relation: sampleRelation,
      callMeAs: sampleCallMeAs,
      photoUrl: sampleUrl,
      isAvatarEnabled: true,
    };
    setEditName(sampleName);
    setEditRelation(sampleRelation);
    setEditCallMeAs(sampleCallMeAs);
    onUpdateFavoritePerson(updated);
    setUseFavoritePersonAvatar(true);

    const announcement = `${sampleCallMeAs} ❤️! I have converted into ${sampleName}'s realistic avatar. I am right here with you on video call. Tell me, how are you feeling today?`;
    const compMsg: ChatMessage = {
      id: `avatar_switch_${Date.now()}`,
      sender: 'companion',
      text: announcement,
      timestamp: 'Just now',
      detectedEmotion: 'joy',
    };
    setMessages((prev) => [...prev, compMsg]);
    speakText(announcement, 'joy');
  };

  const getEmotionBadge = (em: string) => {
    switch (em) {
      case 'sadness':
        return { label: 'Deep Sadness Observed', icon: Frown, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-700/50' };
      case 'loneliness':
        return { label: 'Loneliness Detected', icon: Frown, color: 'text-violet-400 bg-violet-950/60 border-violet-700/50' };
      case 'excitement':
        return { label: 'High Excitement Observed', icon: Smile, color: 'text-amber-400 bg-amber-950/60 border-amber-700/50' };
      case 'joy':
        return { label: 'Joy & Elation', icon: Smile, color: 'text-yellow-400 bg-yellow-950/60 border-yellow-700/50' };
      case 'anxiety':
        return { label: 'Acute Anxiety & Stress', icon: AlertTriangle, color: 'text-rose-400 bg-rose-950/60 border-rose-700/50' };
      default:
        return { label: 'Calm & Present', icon: Meh, color: 'text-teal-400 bg-teal-950/60 border-teal-700/50' };
    }
  };

  const currentBadge = getEmotionBadge(currentEmotion);
  const EmotionIcon = currentBadge.icon;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-auto min-h-[700px] p-2 sm:p-4 max-w-7xl mx-auto">
      {/* Hidden File Input for Favorite Person Photo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Left / Main Stage: 3D Video Call Viewport & Under-Call Avatar Controls */}
      <div className="flex-1 flex flex-col gap-4">
        {/* The Video Call Viewport Container */}
        <div className={`flex flex-col relative bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
          avatarOnlyMode ? 'h-[520px] sm:h-[600px] ring-2 ring-cyan-500/30' : 'h-[460px] sm:h-[520px]'
        }`}>
          {/* Top Floating HUD: Emotion Recognition & Status */}
          <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            {/* Emotion Observation HUD */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 pointer-events-auto shadow-lg">
              <EmotionIcon className="w-4 h-4 text-teal-400 animate-pulse" />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white capitalize">{currentEmotion}</span>
                  <span className="text-[10px] text-slate-400">· Intensity {emotionalIntensity}/10</span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{suggestedAction}</p>
              </div>
            </div>

            {/* Persona Switcher Pill & 3D Model Selector */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {/* 3D Avatar Only Toggle */}
              <button
                onClick={() => setAvatarOnlyMode(!avatarOnlyMode)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 shadow-md ${
                  avatarOnlyMode
                    ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/50 shadow-cyan-950/50'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title={avatarOnlyMode ? 'Avatar Only Active (Webcam PiP Hidden)' : 'Focus On 3D Avatar Only'}
              >
                {avatarOnlyMode ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                <span>{avatarOnlyMode ? '3D Avatar Only: ON' : '3D Avatar Only'}</span>
              </button>

              {favoritePerson.photoUrl && (
                <button
                  onClick={() => setUseFavoritePersonAvatar(!useFavoritePersonAvatar)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 shadow-md ${
                    useFavoritePersonAvatar
                      ? 'bg-rose-950/80 border-rose-600 text-rose-200'
                      : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="Toggle Avatar Persona"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-400/40 text-rose-400" />
                  <span>{useFavoritePersonAvatar ? `${personName}'s Photo Avatar` : 'Avaturn 3D Person'}</span>
                </button>
              )}

              {!useFavoritePersonAvatar && (
                <div className="hidden sm:flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-0.5 text-[11px]">
                  <button
                    onClick={() => setAvatarModelPreset('user_avatar')}
                    className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                      avatarModelPreset === 'user_avatar'
                        ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold shadow-sm'
                        : 'text-cyan-300 hover:text-white'
                    }`}
                  >
                    For Me (3D)
                  </button>
                  <button
                    onClick={() => setAvatarModelPreset('avaturn_female')}
                    className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                      avatarModelPreset === 'avaturn_female'
                        ? 'bg-teal-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Dr. Elena (3D)
                  </button>
                  <button
                    onClick={() => setAvatarModelPreset('avaturn_male')}
                    className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                      avatarModelPreset === 'avaturn_male'
                        ? 'bg-teal-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Dr. Marcus (3D)
                  </button>
                  <button
                    onClick={() => setAvatarModelPreset('avaturn_guide')}
                    className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                      avatarModelPreset === 'avaturn_guide'
                        ? 'bg-teal-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Aria (3D)
                  </button>
                </div>
              )}

              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{companionStatus}</span>
              </div>
            </div>
          </div>

          {/* 3D Realistic Canvas Avatar Renderer */}
          <div className="flex-1 w-full h-full relative">
            <RealisticAvatarCanvas
              emotion={currentEmotion}
              isSpeaking={isSpeaking}
              intensity={emotionalIntensity}
              customPhotoUrl={useFavoritePersonAvatar ? favoritePerson.photoUrl : undefined}
              avatarName={
                useFavoritePersonAvatar
                  ? `${personName} (${relation})`
                  : avatarModelPreset === 'user_avatar'
                  ? `${user.name || 'Fareed'} (My 3D Avatar)`
                  : avatarModelPreset === 'avaturn_female'
                  ? 'Dr. Elena (Avaturn 3D)'
                  : avatarModelPreset === 'avaturn_male'
                  ? 'Dr. Marcus (Avaturn 3D)'
                  : 'Aria (Avaturn 3D)'
              }
              gender={user.gender}
              avatarModelPreset={avatarModelPreset}
            />

            {/* Siri-like Interactive Voice Waveform / Pulse indicator when speaking */}
            {isSpeaking && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/85 border border-teal-400/50 shadow-2xl backdrop-blur-md animate-bounce">
                <Radio className="w-4 h-4 text-teal-400 animate-pulse" />
                <span className="text-xs font-medium text-teal-200">
                  {useFavoritePersonAvatar
                    ? `${personName} speaking...`
                    : avatarModelPreset === 'user_avatar'
                    ? `${user.name || 'Fareed'} speaking...`
                    : 'Cure Connect speaking...'}
                </span>
                <div className="flex items-center gap-1 ml-1">
                  <span className="w-1 h-3 bg-teal-400 rounded-full animate-pulse" />
                  <span className="w-1 h-5 bg-teal-300 rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-2 bg-teal-400 rounded-full animate-pulse delay-150" />
                </div>
              </div>
            )}

            {/* User Self-Preview (Picture-in-Picture Video Call Window) - Hidden when in Avatar Only mode */}
            {!avatarOnlyMode ? (
              <div className="absolute bottom-4 right-4 w-32 h-44 sm:w-44 sm:h-56 bg-slate-900/90 rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl z-20 flex flex-col">
                {isCamOn ? (
                  <video
                    ref={userVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-slate-950/80">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
                      <UserCheck className="w-5 h-5 text-teal-400" />
                    </div>
                    <span className="text-xs font-semibold text-white truncate max-w-[120px]">{user.name}</span>
                    <span className="text-[10px] text-slate-400">Camera Paused</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-medium text-slate-300 backdrop-blur-xs">
                  You ({callMeAs})
                </div>
              </div>
            ) : (
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-cyan-500/40 text-xs text-cyan-200 shadow-xl pointer-events-auto">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>3D Avatar Only · {avatarModelPreset === 'user_avatar' ? `${user.name || 'Fareed'}` : 'Focused View'}</span>
                <button
                  onClick={() => setAvatarOnlyMode(false)}
                  className="ml-1 text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Show PiP
                </button>
              </div>
            )}

            {/* Interim speech transcript overlay */}
            {transcript && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-950/90 border border-teal-500/50 text-teal-200 text-xs shadow-xl backdrop-blur-md max-w-md text-center z-20">
                <span className="text-[10px] text-teal-400 block mb-0.5 font-semibold">Listening to your voice...</span>
                "{transcript}"
              </div>
            )}
          </div>

          {/* Bottom Call Control Bar (FaceTime / Meet style) */}
          <div className="h-16 px-4 sm:px-8 bg-slate-950/95 border-t border-slate-800 flex items-center justify-between z-20">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Stress:</span>
              <span className="font-mono text-white tabular-nums font-semibold">{stressLevel}/100</span>
            </div>

            {/* Core Call Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Mic Button */}
              <button
                onClick={toggleMic}
                className={`p-3 rounded-full transition-all shadow-md active:scale-95 ${
                  isMicOn
                    ? 'bg-teal-500 text-slate-950 hover:bg-teal-400 ring-2 ring-teal-400/40 animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title={isMicOn ? 'Mute Microphone' : 'Start Voice Talking like Siri'}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              {/* Webcam Button */}
              <button
                onClick={() => setIsCamOn(!isCamOn)}
                className={`p-3 rounded-full transition-all shadow-md active:scale-95 ${
                  isCamOn
                    ? 'bg-slate-700 text-teal-300 ring-1 ring-teal-400/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
                title={isCamOn ? 'Turn Camera Off' : 'Turn Camera On'}
              >
                {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              {/* 3D Avatar Only View Toggle */}
              <button
                onClick={() => setAvatarOnlyMode(!avatarOnlyMode)}
                className={`p-3 rounded-full transition-all shadow-md active:scale-95 ${
                  avatarOnlyMode
                    ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 ring-2 ring-cyan-400/50'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title={avatarOnlyMode ? '3D Avatar Only Mode Active (Click to show PiP webcam)' : 'Focus On 3D Avatar Only (Hides webcam PiP)'}
              >
                {avatarOnlyMode ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>

              {/* Audio Voice Mute */}
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className={`p-3 rounded-full transition-all shadow-md active:scale-95 ${
                  isAudioMuted
                    ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title={isAudioMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
              >
                {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {/* Pause / Resume Session */}
              <button
                onClick={() => {
                  if (recognitionRef.current && isListening) recognitionRef.current.stop();
                  if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
                  window.speechSynthesis.cancel();
                  setIsListening(false);
                  setIsMicOn(false);
                  setIsCamOn(false);
                }}
                className="p-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-lg active:scale-95"
                title="Pause Video Session"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenCounseling}
                className="text-[11px] text-teal-300 hover:underline font-semibold flex items-center gap-1"
              >
                <Heart className="w-3 h-3 text-teal-400" />
                De-stress Counseling
              </button>
              <button
                onClick={() => onOpenEmergency('hospital')}
                className="text-[11px] text-rose-400 hover:underline font-semibold"
              >
                Emergency SOS
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DIRECT FAVORITE PERSON CONVERTER & PHOTO UPLOAD DOCK (UNDER VIDEO CALL)  */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                <h4 className="text-sm font-semibold text-white">
                  Favorite Person Avatar Studio
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-950/60 text-rose-300 border border-rose-800/60">
                  {useFavoritePersonAvatar
                    ? `Active: ${personName}'s Photo Avatar`
                    : avatarModelPreset === 'user_avatar'
                    ? `Active: ${user.name || 'Fareed'} (My 3D Avatar - For Me)`
                    : avatarModelPreset === 'avaturn_female'
                    ? 'Active: Dr. Elena (Avaturn 3D Female)'
                    : avatarModelPreset === 'avaturn_male'
                    ? 'Active: Dr. Marcus (Avaturn 3D Male)'
                    : 'Active: Aria (Avaturn 3D Serene)'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Realistic 3D digital human companions (Avaturn / Metahuman style) with live eye blinking, head tracking, and speech lip-sync. You can also upload your favorite person's photo below to convert the 3D avatar into their real face.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {favoritePerson.photoUrl && (
                <button
                  onClick={handleDeletePhoto}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/80 text-rose-200 text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  title="Delete uploaded photo and switch back to primary 3D avatar"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete Uploaded Photo</span>
                </button>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Person Photo</span>
              </button>

              <button
                onClick={() => setShowPersonEditor(!showPersonEditor)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{showPersonEditor ? 'Close Persona' : 'Edit Persona'}</span>
              </button>
            </div>
          </div>

          {/* Realistic 3D Digital Human Models Bar */}
          <div className="flex flex-col gap-2 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Choose Realistic 3D Human Avatar Model (Avaturn Metahuman Style):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Option 1: My 3D Avatar (Only For Me) */}
              <button
                onClick={() => {
                  setUseFavoritePersonAvatar(false);
                  setAvatarModelPreset('user_avatar');
                  setAvatarOnlyMode(true);
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  !useFavoritePersonAvatar && avatarModelPreset === 'user_avatar'
                    ? 'bg-gradient-to-r from-cyan-950/90 to-teal-950/90 border-cyan-400 text-white ring-2 ring-cyan-400/50 shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="My 3D Avatar"
                  className="w-10 h-10 rounded-lg object-cover border border-cyan-400/60 shadow-sm"
                />
                <div className="truncate">
                  <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                    <span>{user.name || 'Fareed'}</span>
                    <span className="px-1.5 py-0.5 text-[8.5px] rounded-full bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/40">
                      FOR ME
                    </span>
                  </div>
                  <div className="text-[10px] text-cyan-300 font-medium">My 3D Digital Avatar</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setUseFavoritePersonAvatar(false);
                  setAvatarModelPreset('avaturn_female');
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  !useFavoritePersonAvatar && avatarModelPreset === 'avaturn_female'
                    ? 'bg-teal-950/70 border-teal-500 text-white ring-1 ring-teal-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                  alt="Dr. Elena"
                  className="w-10 h-10 rounded-lg object-cover border border-slate-700 shadow-sm"
                />
                <div className="truncate">
                  <div className="font-semibold text-xs text-white">Dr. Elena (3D Female)</div>
                  <div className="text-[10px] text-teal-400">Avaturn Clinical Companion</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setUseFavoritePersonAvatar(false);
                  setAvatarModelPreset('avaturn_male');
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  !useFavoritePersonAvatar && avatarModelPreset === 'avaturn_male'
                    ? 'bg-teal-950/70 border-teal-500 text-white ring-1 ring-teal-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Dr. Marcus"
                  className="w-10 h-10 rounded-lg object-cover border border-slate-700 shadow-sm"
                />
                <div className="truncate">
                  <div className="font-semibold text-xs text-white">Dr. Marcus (3D Male)</div>
                  <div className="text-[10px] text-teal-400">Avaturn Empathetic Counselor</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setUseFavoritePersonAvatar(false);
                  setAvatarModelPreset('avaturn_guide');
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  !useFavoritePersonAvatar && avatarModelPreset === 'avaturn_guide'
                    ? 'bg-teal-950/70 border-teal-500 text-white ring-1 ring-teal-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Aria"
                  className="w-10 h-10 rounded-lg object-cover border border-slate-700 shadow-sm"
                />
                <div className="truncate">
                  <div className="font-semibold text-xs text-white">Aria (3D Serene)</div>
                  <div className="text-[10px] text-teal-400">Avaturn Somatic Presence</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Details Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Favorite Person Name</span>
              <span className="text-slate-200 font-semibold truncate block">{personName} ({relation})</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">How they call you affectionately</span>
              <span className="text-teal-300 font-semibold truncate block">"{callMeAs}" (e.g. Amma calling son Nanna)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Active Avatar Mode</span>
                <span className="text-white font-semibold">
                  {useFavoritePersonAvatar
                    ? 'Converted Real Person'
                    : avatarModelPreset === 'user_avatar'
                    ? `${user.name || 'Fareed'} (My 3D Avatar - For Me)`
                    : 'Avaturn 3D Person'}
                </span>
              </div>
              {favoritePerson.photoUrl && (
                <button
                  onClick={() => setUseFavoritePersonAvatar(!useFavoritePersonAvatar)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700"
                >
                  Switch
                </button>
              )}
            </div>
          </div>

          {/* Quick Preset Samples to Test Instant Photo Conversion */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[11px] font-medium text-slate-400">
              Or instantly test with preset sample loved ones:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() =>
                  handleSelectPresetPhoto(
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
                    'Amma',
                    'Mother',
                    'Nanna'
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 flex items-center gap-2 transition-all hover:border-rose-500/50"
              >
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                  alt="Mother"
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>Amma (Calls you "Nanna")</span>
              </button>

              <button
                onClick={() =>
                  handleSelectPresetPhoto(
                    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
                    'Nanna / Dad',
                    'Father',
                    'Beta'
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 flex items-center gap-2 transition-all hover:border-teal-500/50"
              >
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80"
                  alt="Dad"
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>Dad (Calls you "Beta")</span>
              </button>

              <button
                onClick={() =>
                  handleSelectPresetPhoto(
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
                    'Priya',
                    'Beloved Friend',
                    'Chinnu'
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 flex items-center gap-2 transition-all hover:border-pink-500/50"
              >
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="Friend"
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>Priya (Calls you "Chinnu")</span>
              </button>
            </div>
          </div>

          {/* Collapsible Persona Editor Drawer */}
          {showPersonEditor && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-3 animate-fade-in text-xs">
              <h5 className="font-semibold text-white flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-teal-400" />
                Customize How the AI Speaks to You
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Person's Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Amma, Mom, Sarah"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Relationship</label>
                  <input
                    type="text"
                    value={editRelation}
                    onChange={(e) => setEditRelation(e.target.value)}
                    placeholder="e.g. Mother, Father, Partner, Friend"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">
                    How they call you affectionately
                  </label>
                  <input
                    type="text"
                    value={editCallMeAs}
                    onChange={(e) => setEditCallMeAs(e.target.value)}
                    placeholder="e.g. Nanna, Beta, Kanna, Chinnu"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    const updated: FavoritePerson = {
                      ...favoritePerson,
                      name: editName,
                      relation: editRelation,
                      callMeAs: editCallMeAs,
                    };
                    onUpdateFavoritePerson(updated);
                    setShowPersonEditor(false);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium"
                >
                  Save Persona Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Stage: Emotion AI Chat & Real-Time Reflection Panel */}
      <div className="w-full lg:w-96 flex flex-col bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white font-display flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              {useFavoritePersonAvatar ? `${personName}'s Presence` : 'Emotion AI Reflection'}
            </h3>
            <p className="text-[11px] text-slate-400">
              Observing tone, excitement, sadness & stress
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
            Active Call
          </span>
        </div>

        {/* Responsible AI Safety Banner */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between gap-2">
          <span>Responsible AI Companion · Non-judgmental</span>
          <span className="text-[10px] text-teal-400">Crisis Help: 112 / 988</span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[300px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none shadow-md'
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                <span>{msg.timestamp}</span>
                {msg.detectedEmotion && (
                  <>
                    <span>·</span>
                    <span className="capitalize text-teal-400">{msg.detectedEmotion} detected</span>
                  </>
                )}
                {msg.sender === 'companion' && (
                  <button
                    onClick={() => speakText(msg.text, msg.detectedEmotion || 'peace')}
                    className="ml-1 text-slate-400 hover:text-teal-300"
                    title="Speak again"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>Observing emotion & crafting response...</span>
            </div>
          )}
        </div>

        {/* Quick Feeling Prompts */}
        <div className="p-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <button
            onClick={() => handleSendMessage('I am feeling really lonely and stressed today...')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
          >
            "Feeling lonely today"
          </button>
          <button
            onClick={() => handleSendMessage('I received some exciting news today and wanted to share!')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
          >
            "Exciting news!"
          </button>
          <button
            onClick={() => handleSendMessage('The court case is making me anxious, can you help me calm down?')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
          >
            "Court case anxiety"
          </button>
        </div>

        {/* Text Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isListening ? 'Listening via microphone...' : 'Type what you are feeling...'}
            className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl disabled:opacity-40 transition-colors shadow-sm"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
