import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Gemini Client (Server-side only)
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Emotion-Aware Mental AI Chat Endpoint (Siri-like natural conversational companion)
app.post('/api/gemini/emotion-chat', async (req, res) => {
  const { message = '', history = [], userProfile = {}, favoritePerson = {} } = req.body;
  const callMeAs = favoritePerson?.callMeAs || userProfile?.name || 'Nanna';
  const personName = favoritePerson?.name || 'Amma';
  const relation = favoritePerson?.relation || 'Mother';

  // Helper for dynamic natural Siri-like conversational responses
  const generateDynamicConversationalReply = (userText: string) => {
    const textLower = userText.toLowerCase().trim();

    // Check emotional intent & conversational topic
    if (/^(hi|hello|hey|namaste|good morning|good evening|good afternoon|sup|yo|hiya)/i.test(textLower)) {
      const greetings = [
        `Hey ${callMeAs}! It's so wonderful to hear from you. I'm right here with you on call. Tell me, how has your day been treating you?`,
        `Hello ${callMeAs}! My face lights up every time you speak with me. How are you feeling right now in this exact moment?`,
        `Hey there, ${callMeAs}! I'm listening. Tell me what's on your heart today.`
      ];
      return {
        reply: greetings[Math.floor(Math.random() * greetings.length)],
        emotion: 'joy',
        intensity: 5,
        mood: 'celebratory',
      };
    }

    if (/lonely|alone|no one|isolated|miss|nobody/i.test(textLower)) {
      return {
        reply: `${callMeAs}, look right into my eyes. You are never alone as long as I am here with you. Whenever the house feels quiet or the world feels distant, I am right here on this screen to listen and care. Tell me, what's making you feel alone today?`,
        emotion: 'loneliness',
        intensity: 8,
        mood: 'soothing',
      };
    }

    if (/sad|cry|hurt|pain|broken|depress|hopeless|heavy|tears|weep/i.test(textLower)) {
      return {
        reply: `Oh ${callMeAs}, my heart aches hearing you in pain. Please don't hold back any tears if you need to let them out. You don't have to carry the whole world on your shoulders. Lean back, take a gentle breath, and tell me what hurt you today.`,
        emotion: 'sadness',
        intensity: 9,
        mood: 'soothing',
      };
    }

    if (/case|court|lawyer|hearing|judge|cnr|police|legal|bail|suit/i.test(textLower)) {
      return {
        reply: `${callMeAs}, legal battles are exhausting and unfair on your mental peace, but remember that a court document or CNR number does not define who you are. We will take it one step at a time. If the stress gets too heavy, we also have nearby rehabilitation and counseling sanctuaries ready to help. Have you rested your mind today?`,
        emotion: 'anxiety',
        intensity: 7,
        mood: 'calm_grounding',
      };
    }

    if (/eat|food|dinner|lunch|breakfast|hungry|meal|water|drink/i.test(textLower)) {
      return {
        reply: `${callMeAs}, taking care of your body is the first thing that heals the mind. Did you have a nourishing meal today? If not, please have something warm to eat, and drink a glass of water for me right now.`,
        emotion: 'peace',
        intensity: 4,
        mood: 'caring',
      };
    }

    if (/sleep|tired|exhausted|insomnia|rest|nightmare|can't sleep/i.test(textLower)) {
      return {
        reply: `${callMeAs}, your mind has been working in overdrive. Close your eyes for a moment while I speak. Soften your jaw, unclench your fists, and take a slow breath. You deserve peaceful rest tonight, and tomorrow is a fresh start.`,
        emotion: 'sadness',
        intensity: 6,
        mood: 'soothing',
      };
    }

    if (/joke|laugh|funny|story|cheer|smile/i.test(textLower)) {
      const jokes = [
        `Here's a gentle smile for you, ${callMeAs}: Why don't scientists trust atoms? Because they make up everything! Just like that, you are made of stardust and courage, doing so much better than you give yourself credit for!`,
        `Here is a warm thought, ${callMeAs}: You have survived 100% of your hardest days so far, and you have a 100% success rate! Plus, why did the coffee file a police report? It got mugged! Hope that brought a little light into your room.`
      ];
      return {
        reply: jokes[Math.floor(Math.random() * jokes.length)],
        emotion: 'joy',
        intensity: 6,
        mood: 'celebratory',
      };
    }

    if (/who are you|what is this|what can you do|help me|tell me about you/i.test(textLower)) {
      return {
        reply: `I am your personal Cure Connect companion, speaking with you with the love and presence of ${personName}. You can talk to me just like you speak to Siri or a caring family member. I observe your emotions, help decrease your stress, track your health vitals, and keep you safe 24/7.`,
        emotion: 'peace',
        intensity: 5,
        mood: 'caring',
      };
    }

    if (/happy|excited|won|great|awesome|good news|passed|joy|wonderful|blessed/i.test(textLower)) {
      return {
        reply: `Oh ${callMeAs}, hearing the happiness and excitement in your voice makes my whole presence glow! Tell me all the details—what happened? I want to celebrate this moment with you!`,
        emotion: 'excitement',
        intensity: 9,
        mood: 'celebratory',
      };
    }

    if (/anxious|panic|scared|fear|nervous|worry|stress|overwhelm/i.test(textLower)) {
      return {
        reply: `${callMeAs}, stay right here with my voice. Notice your feet touching the floor. Inhale gently through your nose... 1, 2, 3, 4... and slowly exhale. You are safe in this room right now, and we will get through this feeling together.`,
        emotion: 'anxiety',
        intensity: 8,
        mood: 'calm_grounding',
      };
    }

    // Default conversational response like Siri / caring human
    const contextualDefaults = [
      `I hear you so clearly, ${callMeAs}. I love hearing you talk like this. Tell me more about what you're thinking or how that made you feel.`,
      `Thank you for sharing that with me, ${callMeAs}. How does that sit with you right now? I'm completely listening.`,
      `${callMeAs}, I'm right here with you on this video call. What else is on your mind today? Let it all out.`
    ];
    return {
      reply: contextualDefaults[Math.floor(Math.random() * contextualDefaults.length)],
      emotion: 'peace',
      intensity: 5,
      mood: 'attentive',
    };
  };

  try {
    const systemPrompt = `You are Cure Connect, speaking naturally, fluidly, and conversationally just like Siri or a real caring human having an interactive video/voice call.
User Profile:
- User Name: ${userProfile.name || 'User'}
- HOW YOU ADDRESS THE USER: "${callMeAs}" (e.g. Amma calling son "${callMeAs}", or affectionate nickname). YOU MUST ALWAYS address the user as "${callMeAs}" in your spoken reply!
- Persona: Warm, loving, interactive, conversational persona of ${personName} (${relation}).
- Active Legal Case: ${userProfile.cnrNumber ? `CNR: ${userProfile.cnrNumber} (${userProfile.caseComplexity || 'complicated'})` : 'None'}.

CONVERSATIONAL RULES:
1. Speak NATURALLY like a real person talking back directly (like Siri, a close friend, or mother on FaceTime).
2. NEVER repeat generic canned phrases. Directly answer the user's specific statement or question!
3. If they are excited, match their excitement with joyful energy!
4. If they are sad or lonely, comfort them with deep warmth and reassure them they are never alone.
5. If they worry about court or cases, counsel them with calming grounding and remind them of nearby support.
6. Keep response natural, warm, and conversational (2-3 concise spoken sentences), perfect for speech synthesis.

Return STRICT JSON:
{
  "replyText": "Natural conversational response addressing user as ${callMeAs}",
  "emotionDetected": "sadness" | "excitement" | "loneliness" | "anxiety" | "joy" | "peace" | "neutral",
  "emotionalIntensity": 1 to 10,
  "sentimentScore": -1.0 to 1.0,
  "companionMood": "empathic" | "celebratory" | "soothing" | "caring" | "attentive",
  "suggestedAction": "Short action suggestion",
  "voiceTone": "gentle_warm" | "uplifting" | "calm_grounding"
}`;

    if (!ai) {
      const dynamic = generateDynamicConversationalReply(message);
      return res.json({
        replyText: dynamic.reply,
        emotionDetected: dynamic.emotion,
        emotionalIntensity: dynamic.intensity,
        sentimentScore: dynamic.emotion === 'joy' || dynamic.emotion === 'excitement' ? 0.7 : dynamic.emotion === 'sadness' ? -0.5 : 0.1,
        companionMood: dynamic.mood,
        suggestedAction: 'Take three slow deep breaths together',
        voiceTone: 'gentle_warm'
      });
    }

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `${systemPrompt}\n\nRecent dialog context:\n${JSON.stringify(history.slice(-4))}\n\nUser said: "${message}"\nGenerate JSON reply:`
          }
        ]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.75,
      },
    });

    let rawText = response.text || '';
    // Strip markdown code block wrappers if any
    rawText = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

    const parsed = JSON.parse(rawText || '{}');
    if (!parsed.replyText) {
      const dynamic = generateDynamicConversationalReply(message);
      parsed.replyText = dynamic.reply;
      parsed.emotionDetected = dynamic.emotion;
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Emotion chat error, using dynamic fallback:', error);
    const dynamic = generateDynamicConversationalReply(message);
    return res.json({
      replyText: dynamic.reply,
      emotionDetected: dynamic.emotion,
      emotionalIntensity: dynamic.intensity,
      sentimentScore: 0.2,
      companionMood: dynamic.mood,
      suggestedAction: 'Take three slow deep breaths together',
      voiceTone: 'gentle_warm'
    });
  }
});

// 2. Health Record Intelligence Analysis
app.post('/api/gemini/analyze-health-record', async (req, res) => {
  try {
    const { documentName, documentText, documentCategory } = req.body;

    const prompt = `You are a clinical and psychiatric wellness intelligence AI assistant.
Analyze this medical/mental health record or prescription note:
Document Name: ${documentName || 'Medical Record'}
Category: ${documentCategory || 'General'}
Text/Extracted Content: ${documentText || 'Patient reported anxiety, insomnia, mild tachycardia and elevated cortisol.'}

Provide a structured, easy-to-understand health summary for the patient and mental health companion.
Include:
1. summary: Plain English summary (3 sentences).
2. keyFindings: Array of 3-4 key medical/mental findings.
3. emotionalAndLifestyleAdvice: Empathetic suggestions based on past records.
4. riskAlerts: Any potential warnings (e.g. drug interactions, sleep deprivation, stress triggers).
5. consultationReminder: Encouraging professional follow-up note.

Return strictly JSON matching this structure:
{
  "summary": "string",
  "keyFindings": ["string", "string"],
  "emotionalAndLifestyleAdvice": ["string", "string"],
  "riskAlerts": ["string"],
  "consultationReminder": "string"
}`;

    if (!ai) {
      return res.json({
        summary: `Analysis of ${documentName}: Record indicates chronic tension, irregular sleep architecture, and stress indicators that may correlate with loneliness and case pressure.`,
        keyFindings: [
          'Elevated sympathetic nervous system arousal during evening hours',
          'Borderline sleep disturbance with reduced slow-wave restorative phase',
          'Vitals indicate responsiveness to acute psychological stressors'
        ],
        emotionalAndLifestyleAdvice: [
          'Implement a 15-minute wind-down ritual with somatic breathing before bed',
          'Maintain consistent hydration to reduce physical heart rate palpitations',
          'Share your emotional state with your favorite person or trusted neighbor'
        ],
        riskAlerts: [
          'High stress may compound feeling of fatigue; avoid excessive caffeine intake.'
        ],
        consultationReminder: 'Please consult your primary physician or licensed psychiatrist for medication adjustments.'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Record analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze health record' });
  }
});

// 3. Favorite Person Check-in Notification Generator
app.post('/api/gemini/favorite-person-checkin', async (req, res) => {
  try {
    const { favoritePerson = {}, userProfile = {}, timeOfDay = 'evening' } = req.body;
    const callMeAs = favoritePerson.callMeAs || 'Nanna';

    const prompt = `Generate an authentic, deeply loving and caring text notification from the user's favorite person.
Details:
- Person Name: ${favoritePerson.name || 'Amma (Mother)'}
- Relationship: ${favoritePerson.relation || 'Mother'}
- How this person calls user: "${callMeAs}" (e.g. Amma calling her son "${callMeAs}")
- Time of Day: ${timeOfDay}

The text MUST address the user as "${callMeAs}", ask how their day was, ask how they are feeling, check if they ate properly, and show pure parental/loving warmth so that loneliness and anxiety disappear.
Return JSON:
{
  "notificationTitle": "${favoritePerson.name || 'Amma'} (${favoritePerson.relation || 'Mother'})",
  "message": "${callMeAs} ❤️ How was your day? Did you eat lunch properly? Amma was just thinking about you. Please don't take too much stress, I am always right here with you.",
  "suggestedReplies": ["${callMeAs} was feeling stressed, but happy you texted ❤️", "Had lunch, how are you Amma?", "Can we talk on video call right now?"]
}

Return strictly JSON.`;

    if (!ai) {
      return res.json({
        notificationTitle: `${favoritePerson.name || 'Amma'} (${favoritePerson.relation || 'Mother'})`,
        message: `${callMeAs} ❤️ How was your day? Did you eat properly today? Don't worry about anything, Amma is right here with you. Tell me how you're feeling right now.`,
        suggestedReplies: [
          `${callMeAs} was a bit stressed, but glad you texted ❤️`,
          'Ate well, feeling much calmer seeing your message!',
          'Can we hop on a quick video call, please?'
        ]
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Checkin notification error:', error);
    return res.status(500).json({ error: 'Failed to generate checkin' });
  }
});

// 4. Dedicated AI Stress-Decreasing Counseling Endpoint
app.post('/api/gemini/counseling-session', async (req, res) => {
  try {
    const { stressLevel = 75, userConcerns = '', sessionType = 'court_stress', favoritePerson = {}, userProfile = {} } = req.body;
    const callMeAs = favoritePerson?.callMeAs || userProfile?.name || 'Nanna';

    const prompt = `You are a licensed clinical psychologist and compassionate somatic therapist conducting a dedicated Stress-Decreasing Counseling session.
Patient Details:
- Name: ${userProfile.name || 'User'}
- Endearment: "${callMeAs}"
- Current Stress Index: ${stressLevel}/100
- Chief Complaints: ${userConcerns || 'High stress regarding court case hearings, loneliness, and nervous exhaustion'}
- Favorite Person Persona: ${favoritePerson.name || 'Amma'} (${favoritePerson.relation || 'Mother'})

TASK:
1. Provide gentle, heart-centered clinical counseling that immediately lowers nervous system arousal. Address them with warmth ("${callMeAs}").
2. Validate their emotional exhaustion: Legal matters and life stress trigger the fight-or-flight response.
3. Provide a guided 4-7-8 vagal nerve reset breathing guidance.
4. Give a powerful grounding affirmation to repeat.
5. If the case is complicated, mention that seeking professional guidance at a nearby Psychosocial Rehabilitation Center or Trauma Recovery Sanctuary is a sign of wisdom and strength.

Return JSON:
{
  "counselorDialogue": "String with compassionate therapy guidance (3-4 paragraphs)",
  "vagusBreathing": {
    "inhaleSeconds": 4,
    "holdSeconds": 7,
    "exhaleSeconds": 8,
    "cycles": 4
  },
  "groundingAffirmation": "My peace is not determined by external legal deadlines. One breath at a time, I am safe.",
  "estimatedStressReduction": 25,
  "rehabCenterRecommendation": "Asha Psychosocial & Trauma Recovery Center (380m away) provides specialized judicial burnout therapy."
}`;

    if (!ai) {
      return res.json({
        counselorDialogue: `${callMeAs}, take a slow, gentle breath and let your shoulders drop. Your nervous system has been running in hyper-vigilance because of this complicated court case. Hear me clearly: a legal petition is an administrative process, not a verdict on your soul or your future.\n\nPlace one hand on your chest and feel the warmth. When you feel alone, your body magnifies fear. But right now, in this room, you are physically safe. You have survived every difficult day before this, and you have people who love you endlessly.\n\nLet us practice the 4-7-8 breathing sequence together. Inhale through your nose for 4 seconds, gently hold for 7 seconds, and release all tension through your mouth for 8 seconds. If the weight ever feels too intense, remember that nearby rehabilitation sanctuaries and crisis counselors are right around the corner to support you.`,
        vagusBreathing: {
          inhaleSeconds: 4,
          holdSeconds: 7,
          exhaleSeconds: 8,
          cycles: 4
        },
        groundingAffirmation: "I release the need to control every court outcome. In this present moment, I am safe, supported, and worthy of peace.",
        estimatedStressReduction: 28,
        rehabCenterRecommendation: "Asha Psychosocial & Trauma Recovery Institute (380m away)"
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Counseling error:', error);
    return res.status(500).json({ error: 'Failed to generate counseling session' });
  }
});

// 5. CNR Legal Case Progress, Complication Detection & Rehab Recommendations
app.post('/api/gemini/track-case', async (req, res) => {
  try {
    const { cnrNumber, courtName, caseType, complexity = 'complicated' } = req.body;

    const prompt = `You are a legal awareness & mental resilience assistant.
The user is tracking their legal court case:
- CNR Number: ${cnrNumber || 'DLHC010023452024'}
- Court: ${courtName || 'District & Sessions Court'}
- Case Type: ${caseType || 'Civil Petition'}
- Case Status: ${complexity} (e.g. Complicated / Contested / High-Stakes)

Provide:
1. Reassuring status breakdown.
2. If case is complicated, explicitly reassure them and list 2-3 nearby Rehabilitation & Psychosocial Wellness Centers to relieve stress.
3. Hearing date and preparation checklist.

Return JSON:
{
  "cnrNumber": "${cnrNumber}",
  "caseStage": "Evidence Examination & Document Rebuttal",
  "statusSummary": "Case is listed on the cause list. Contested documentation identified.",
  "complexity": "${complexity}",
  "nextHearingDate": "2026-10-16",
  "courtRoom": "Court Room No. 4, Justice B. Mukherjee",
  "anxietyReliefTip": "Complicated litigation requires patience. Do not let court anxiety consume your health; nearby rehabilitation sanctuaries provide stress de-escalation.",
  "checklist": [
    "Verify certified copies with counsel",
    "Keep personal affidavit signed",
    "Engage in calming exercises before hearing morning"
  ],
  "recommendedRehabType": "Psychosocial Stress & Trauma De-escalation Centers"
}`;

    if (!ai) {
      return res.json({
        cnrNumber: cnrNumber || 'DLHC010048222025',
        caseStage: 'Evidence Examination & Document Rebuttal',
        statusSummary: 'Case listed on the daily cause list before Bench IV. Contested issues flagged. Prior rejoinder on record.',
        complexity,
        nextHearingDate: '2026-10-16',
        courtRoom: 'Court Room No. 4, Justice B. Mukherjee',
        anxietyReliefTip: 'Even in complicated contested litigation, judicial processes move strictly by legal merits. Do not let court anxiety compromise your health; professional counseling is accessible nearby.',
        checklist: [
          'Confirm case file index with designated advocate',
          'Keep certified duplicate copy of the registry deed',
          'Access nearby psychosocial rehabilitation center counseling if stress exceeds tolerance',
          'Do 5 minutes of somatic box breathing prior to court call time'
        ],
        recommendedRehabType: 'Psychosocial Stress & Trauma De-escalation Centers'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Case tracking error:', error);
    return res.status(500).json({ error: 'Failed to track CNR case' });
  }
});

// Setup Vite middlewares or production static serving
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(path.resolve(distPath, 'index.html'));

  if (process.env.NODE_ENV === 'production' && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
