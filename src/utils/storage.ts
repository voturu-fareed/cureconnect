import {
  UserProfile,
  FavoritePerson,
  HealthRecord,
  SmartWatchVitals,
  EmergencyHospital,
  PoliceStation,
  NeighborUser,
  DayHistoryItem,
  FavoritePersonNotification,
  CaseTrackingDetail,
  RehabCenter,
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'aurasoul_user_profile',
  FAVORITE_PERSON: 'aurasoul_favorite_person',
  HEALTH_RECORDS: 'aurasoul_health_records',
  WATCH_VITALS: 'aurasoul_watch_vitals',
  NEIGHBORS: 'aurasoul_neighbors',
  DAY_HISTORY: 'aurasoul_day_history',
  NOTIFICATIONS: 'aurasoul_notifications',
  CASE_TRACKING: 'aurasoul_case_tracking',
  SETTINGS: 'aurasoul_settings',
  IS_LOGGED_IN: 'aurasoul_is_logged_in',
};

export const defaultFavoritePerson: FavoritePerson = {
  name: 'Amma (Lakshmi)',
  relation: 'Mother',
  nickname: 'Amma',
  callMeAs: 'Nanna',
  photoUrl: '',
  personaTone: 'Warm & Affectionate',
  isAvatarEnabled: true,
};

export const defaultUserProfile: UserProfile = {
  name: 'Fareed Mahammad',
  email: 'voturumahammadfareed@gmail.com',
  password: 'Password@123',
  gender: 'boy',
  age: 24,
  dob: '2002-05-14',
  hasCase: true,
  cnrNumber: 'DLHC010048222025',
  caseTitle: 'Mahammad v. State Property Registry & Civil Relief',
  caseType: 'Civil Writ Petition',
  courtName: 'High Court Judicial Registry, Bench IV',
  caseComplexity: 'complicated',
  avatarId: 'avatar_amma',
  location: {
    lat: 17.385,
    lng: 78.4867,
    address: 'Near Jubilee Hills Metro, Banjara Hills, Hyderabad',
    accuracy: 4.8, // 4.8 meters precision!
  },
  isSafe: true,
  lastActiveDate: new Date().toISOString().split('T')[0],
  language: 'en',
};

export const initialHealthRecords: HealthRecord[] = [
  {
    id: 'rec_1',
    title: 'Cognitive Behavioral Therapy Assessment & Stress Markers',
    date: '2026-09-15',
    category: 'Therapy Notes',
    fileName: 'Clinical_Therapy_Assessment_Sept2026.pdf',
    notes: 'Patient reports sleep disturbance tied to pending CNR legal hearing and social isolation. Recommended somatic breathing.',
    aiAnalysis: {
      summary: 'Clinical consultation noted elevated sympathetic tone in evening hours with situational insomnia related to legal deadlines.',
      keyFindings: [
        'Persistent autonomic arousal during nocturnal hours',
        'Loneliness index elevated during unmonitored weekends',
        'Good response to conversational biofeedback and voice grounding'
      ],
      emotionalAndLifestyleAdvice: [
        'Engage in 10-minute video call check-ins before 10 PM',
        'Maintain daily neighbor check-in to combat feelings of isolation',
        'Keep hydration above 2.5L to mitigate palpitation sensations'
      ],
      riskAlerts: [
        'Elevated cortisol peaks detected before Monday morning hearing schedules.'
      ],
      consultationReminder: 'Follow-up appointment scheduled for next month.'
    }
  },
  {
    id: 'rec_2',
    title: 'Holter Monitor & 24hr ECG Telemetry Summary',
    date: '2026-08-28',
    category: 'ECG / Sleep Study',
    fileName: 'Cardio_Holter_Vitals_Telemetry.pdf',
    notes: 'Normal sinus rhythm with episodic sinus tachycardia during emotional panic bouts (peaked at 118 BPM during panic episodes).',
    aiAnalysis: {
      summary: 'Electrophysiological baseline remains intact. Episodic heart rate accelerations correspond strictly with emotional triggers rather than structural cardiac pathology.',
      keyFindings: [
        'Baseline resting heart rate 68 BPM',
        'No malignant arrhythmias detected',
        'Heart Rate Variability drops during intense emotional rumination'
      ],
      emotionalAndLifestyleAdvice: [
        'Use Bluetooth smart watch sync for instant high-BPM alerts',
        'Execute guided 4-7-8 breathing when BPM crosses 95 during rest'
      ],
      riskAlerts: [
        'Avoid high caffeine after 4 PM.'
      ],
      consultationReminder: 'Routine bi-annual cardiology review.'
    }
  }
];

export const initialDayHistory: DayHistoryItem[] = [
  {
    id: 'hist_1',
    date: '2026-09-23',
    primaryEmotion: 'anxiety',
    emotionalScore: -0.4,
    summary: 'Experienced elevated tension over upcoming CNR hearing date. Bluetooth watch flagged elevated resting pulse at 92 BPM.',
    stressScore: 7,
    vitalsSummary: { avgBpm: 78, sleepHours: 6.2, stressScore: 68 },
    notes: 'Spoke with 3D companion in the evening. Favorite person notification helped restore emotional balance.',
    issuesFaced: ['Court case anxiety', 'Tension headache', 'Shortness of breath'],
    copingActionTaken: '20-minute video call with Maya companion + guided breathwork'
  },
  {
    id: 'hist_2',
    date: '2026-09-22',
    primaryEmotion: 'loneliness',
    emotionalScore: -0.6,
    summary: 'Felt isolated staying indoors all day. Neighbors Sarah and Marcus performed safety check-in.',
    stressScore: 6,
    vitalsSummary: { avgBpm: 72, sleepHours: 7.0, stressScore: 54 },
    notes: 'Neighbor verified safe mark prevented emergency dispatch escalation.',
    issuesFaced: ['Social loneliness', 'Unmotivated feeling'],
    copingActionTaken: 'Neighborhood evening walk + check-in'
  },
  {
    id: 'hist_3',
    date: '2026-09-21',
    primaryEmotion: 'excitement',
    emotionalScore: 0.8,
    summary: 'Received positive update on document submission and had productive day.',
    stressScore: 3,
    vitalsSummary: { avgBpm: 69, sleepHours: 7.8, stressScore: 32 },
    notes: 'Avatar companion celebrated the milestone with joyous affirmations.',
    issuesFaced: [],
    copingActionTaken: 'Shared good news with favorite person'
  }
];

export const mockNearbyHospitals: EmergencyHospital[] = [
  {
    id: 'hosp_1',
    name: 'Apollo Lifeline Emergency & Crisis Trauma Center',
    distanceMeters: 4.8, // 4.8 meters radius (immediate vicinity!)
    phone: '+91 40 2360 7777',
    type: 'Emergency Trauma Center',
    address: 'Road No. 72, Opposite Metro Pillar 104, Jubilee Hills (4.8m away)',
    rating: 4.9,
    emergencyBedsAvailable: 14,
    lat: 17.3852,
    lng: 78.4869,
  },
  {
    id: 'hosp_2',
    name: 'Care Neuro-Psychiatric & General Emergency Hospital',
    distanceMeters: 180,
    phone: '+91 40 3041 8888',
    type: 'Psychiatric & Mental Crisis Care',
    address: 'Road No. 1, Banjara Hills Main Road',
    rating: 4.8,
    emergencyBedsAvailable: 8,
    lat: 17.3861,
    lng: 78.4875,
  },
  {
    id: 'hosp_3',
    name: 'St. Jude Community Lifeline Clinic & Critical ICU',
    distanceMeters: 450,
    phone: '+91 40 2335 9999',
    type: 'General Hospital',
    address: 'Hill View Enclave, 2nd Cross, Jubilee Hills',
    rating: 4.7,
    emergencyBedsAvailable: 22,
    lat: 17.3841,
    lng: 78.4855,
  }
];

export const mockPoliceStations: PoliceStation[] = [
  {
    id: 'police_1',
    name: 'Jubilee Hills Precinct & Emergency Police Dispatch',
    distanceMeters: 4.2, // immediate 4.2 meters radius
    phone: '100 / +91 40 2785 3421',
    jurisdiction: 'Sector 4 Rapid Response & Citizen Safety',
    address: 'Check Post Junction, Jubilee Hills Police Station',
    policeControlRoom: 'Control Room 112 (Direct Dispatch)',
    lat: 17.3851,
    lng: 78.4868,
  },
  {
    id: 'police_2',
    name: 'Banjara Hills Police Division & Cyber / Mental Crisis Unit',
    distanceMeters: 290,
    phone: '+91 40 2785 3445',
    jurisdiction: 'Zone II Central Command',
    address: 'Road No. 12, Banjara Hills Police Station',
    policeControlRoom: 'City Police HQ Dial 100',
    lat: 17.3872,
    lng: 78.4881,
  }
];

export const mockNeighbors: NeighborUser[] = [
  {
    id: 'neigh_1',
    name: 'Aarav Sharma',
    gender: 'boy',
    distanceMeters: 3.5, // 3.5 meters (Apartment next door #402)
    address: 'Flat 402, Green Orchid Residency (Next Door)',
    phone: '+91 98490 12345',
    isSafe: true,
    verifiedSafeByUser: true,
    lastCheckedIn: 'Today at 07:15 AM',
    avatarColor: 'from-emerald-600 to-teal-700',
    status: 'Safe',
  },
  {
    id: 'neigh_2',
    name: 'Priya Narang',
    gender: 'girl',
    distanceMeters: 8.2, // 8 meters across hall
    address: 'Flat 405, Green Orchid Residency (Across Hallway)',
    phone: '+91 99887 65432',
    isSafe: true,
    verifiedSafeByUser: true,
    lastCheckedIn: 'Today at 06:40 AM',
    avatarColor: 'from-sky-600 to-indigo-700',
    status: 'Safe',
  },
  {
    id: 'neigh_3',
    name: 'Vikram Joshi (Elderly Resident)',
    gender: 'boy',
    distanceMeters: 14.0,
    address: 'Flat 302, Green Orchid Residency (Floor Below)',
    phone: '+91 91234 56789',
    isSafe: true,
    verifiedSafeByUser: false,
    lastCheckedIn: 'Yesterday, 09:30 PM',
    avatarColor: 'from-amber-600 to-orange-700',
    status: 'Pending Daily Check-in',
  },
  {
    id: 'neigh_4',
    name: 'Elena Rostova',
    gender: 'girl',
    distanceMeters: 35.0,
    address: 'Villa 12, Pine Crest Avenue',
    phone: '+91 97112 34567',
    isSafe: true,
    verifiedSafeByUser: true,
    lastCheckedIn: 'Today at 08:00 AM',
    avatarColor: 'from-purple-600 to-pink-700',
    status: 'Safe',
  }
];

export const initialVitals: SmartWatchVitals = {
  connected: false,
  deviceName: 'Apple Watch Ultra / Galaxy Watch 6 Pro',
  batteryLevel: 88,
  heartRate: 74,
  hrv: 58,
  spo2: 98,
  stressLevel: 36,
  skinTemp: 36.4,
  sleepHours: 7.2,
  sleepQuality: 84,
  dailySteps: 6420,
  calorieBurn: 480,
  breathRate: 14,
  history: [
    { time: '02:00', bpm: 62, stress: 18 },
    { time: '04:00', bpm: 59, stress: 14 },
    { time: '06:00', bpm: 64, stress: 22 },
    { time: '08:00', bpm: 78, stress: 45 },
    { time: '10:00', bpm: 82, stress: 52 },
    { time: '12:00', bpm: 76, stress: 40 },
    { time: '14:00', bpm: 88, stress: 62 },
    { time: '16:00', bpm: 75, stress: 38 },
  ]
};

export const mockNearbyRehabCenters: RehabCenter[] = [
  {
    id: 'rehab_1',
    name: 'Asha Psychosocial & De-Addiction Rehabilitation Institute',
    type: 'Psychosocial Rehabilitation',
    distanceMeters: 380,
    phone: '+91 40 2337 5566',
    address: 'Road No. 14, Near Lotus Pond, Banjara Hills (380m away)',
    rating: 4.9,
    counselorsAvailable: 12,
    specialties: ['Legal Hearing & Stress Burnout Recovery', 'Severe Anxiety & Depression Counseling', 'Family Mediation'],
    lat: 17.3875,
    lng: 78.4892,
  },
  {
    id: 'rehab_2',
    name: 'MindSpace Trauma & Crisis De-escalation Sanctuary',
    type: 'Trauma Recovery & Crisis Care',
    distanceMeters: 620,
    phone: '+91 40 2355 4411',
    address: 'Plot 42, Jubilee Hills Enclave, Hyderabad',
    rating: 4.8,
    counselorsAvailable: 9,
    specialties: ['Judicial & CNR Case Anxiety Neutralization', 'Somatic Vagus Nerve Regulation', 'Post-Trauma Stabilization'],
    lat: 17.3842,
    lng: 78.4851,
  },
  {
    id: 'rehab_3',
    name: 'Sanjeevani Mental Health Renewal & Holistic Wellness Center',
    type: 'Mental Health Wellness Sanctuary',
    distanceMeters: 950,
    phone: '+91 40 2360 1200',
    address: 'Road No. 36, Beside Metro Station, Jubilee Hills',
    rating: 4.7,
    counselorsAvailable: 16,
    specialties: ['Loneliness Alleviation Therapy', 'Sleep Architecture Restoration', 'Cognitive Restructuring'],
    lat: 17.3891,
    lng: 78.4833,
  }
];

export const initialNotifications: FavoritePersonNotification[] = [
  {
    id: 'notif_1',
    timestamp: '5 minutes ago',
    title: 'Amma (Mother)',
    message: 'Nanna ❤️ How was your day? Did you have lunch properly? Do not take too much stress about the court case today, Amma is always with you. Tell me how you are feeling right now.',
    suggestedReplies: [
      'Nanna is a bit stressed about the case, Amma...',
      'Had lunch, feeling so much better seeing your text ❤️',
      'Can we talk on video call right now, Amma?'
    ],
    status: 'unread',
  }
];

export const initialCaseDetail: CaseTrackingDetail = {
  cnrNumber: 'DLHC010048222025',
  caseStage: 'Evidence Examination & Document Rebuttal',
  statusSummary: 'Case listed on the daily high court roster before Bench IV. Contested issues flagged regarding registry documentation. Recommended mental health and legal de-escalation support.',
  nextHearingDate: '2026-10-16',
  courtRoom: 'Court Room No. 4, Justice B. Mukherjee',
  courtName: 'High Court Judicial Registry',
  anxietyReliefTip: 'Even in complicated contested litigation, judicial processes move strictly by legal merits. Do not let court anxiety compromise your health; professional counseling is accessible nearby.',
  checklist: [
    'Confirm case file index with designated advocate',
    'Keep certified duplicate copy of the registry deed',
    'Access nearby psychosocial rehabilitation center counseling if stress exceeds tolerance',
    'Do 5 minutes of somatic box breathing prior to court call time'
  ],
  complexity: 'complicated'
};

// Storage helper functions
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err);
  }
}

export { STORAGE_KEYS };
