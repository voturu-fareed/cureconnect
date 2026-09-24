export type Gender = 'boy' | 'girl' | 'other';

export interface UserProfile {
  name: string;
  email: string;
  password?: string;
  gender: Gender;
  age: number;
  dob: string;
  hasCase: boolean;
  cnrNumber?: string;
  caseTitle?: string;
  caseType?: string;
  courtName?: string;
  caseComplexity?: 'normal' | 'moderate' | 'complicated';
  avatarId: string;
  customAvatarUrl?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
    accuracy: number;
  };
  isSafe: boolean;
  lastActiveDate: string;
  language: string;
}

export interface FavoritePerson {
  name: string;
  relation: string;
  nickname: string;
  photoUrl: string;
  personaTone: string;
  isAvatarEnabled: boolean;
  callMeAs: string; // How this favorite person calls the user (e.g., Amma calls son 'Nanna' / 'Kanna' / 'Beta')
}

export interface RehabCenter {
  id: string;
  name: string;
  type: 'Psychosocial Rehabilitation' | 'Trauma Recovery & Crisis Care' | 'Mental Health Wellness Sanctuary' | 'De-Addiction & Renewal Care';
  distanceMeters: number;
  phone: string;
  address: string;
  rating: number;
  counselorsAvailable: number;
  specialties: string[];
  lat: number;
  lng: number;
}

export interface HealthRecord {
  id: string;
  title: string;
  date: string;
  category: 'Prescription' | 'Therapy Notes' | 'Blood Work & Labs' | 'ECG / Sleep Study' | 'Discharge Summary';
  fileName: string;
  notes: string;
  fileData?: string; // base64 or preview
  aiAnalysis?: {
    summary: string;
    keyFindings: string[];
    emotionalAndLifestyleAdvice: string[];
    riskAlerts: string[];
    consultationReminder: string;
  };
}

export interface SmartWatchVitals {
  connected: boolean;
  deviceName: string;
  batteryLevel: number;
  heartRate: number; // BPM
  hrv: number; // ms
  spo2: number; // %
  stressLevel: number; // 1-100
  skinTemp: number; // Celsius
  sleepHours: number;
  sleepQuality: number; // %
  dailySteps: number;
  calorieBurn: number;
  breathRate: number; // Breaths/min
  history: { time: string; bpm: number; stress: number }[];
}

export interface EmergencyHospital {
  id: string;
  name: string;
  distanceMeters: number;
  phone: string;
  type: 'General Hospital' | 'Emergency Trauma Center' | 'Psychiatric & Mental Crisis Care' | 'Community Lifeline Clinic';
  address: string;
  rating: number;
  emergencyBedsAvailable: number;
  lat: number;
  lng: number;
}

export interface PoliceStation {
  id: string;
  name: string;
  distanceMeters: number;
  phone: string;
  jurisdiction: string;
  address: string;
  policeControlRoom: string;
  lat: number;
  lng: number;
}

export interface NeighborUser {
  id: string;
  name: string;
  gender: Gender;
  distanceMeters: number;
  address: string;
  phone: string;
  isSafe: boolean;
  verifiedSafeByUser: boolean;
  lastCheckedIn: string;
  avatarColor: string;
  status: 'Safe' | 'Pending Daily Check-in' | 'Alert: Needs Assistance';
}

export interface DayHistoryItem {
  id: string;
  date: string;
  primaryEmotion: 'sadness' | 'excitement' | 'loneliness' | 'anxiety' | 'joy' | 'peace' | 'neutral';
  emotionalScore: number; // -1 to +1
  summary: string;
  stressScore: number; // 1 to 10
  vitalsSummary: {
    avgBpm: number;
    sleepHours: number;
    stressScore: number;
  };
  notes: string;
  issuesFaced?: string[];
  copingActionTaken?: string;
}

export interface FavoritePersonNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  suggestedReplies: string[];
  status: 'unread' | 'read' | 'replied';
  userReply?: string;
}

export interface CaseTrackingDetail {
  cnrNumber: string;
  caseStage: string;
  statusSummary: string;
  nextHearingDate: string;
  courtRoom: string;
  courtName: string;
  anxietyReliefTip: string;
  checklist: string[];
  complexity: 'normal' | 'moderate' | 'complicated';
}
