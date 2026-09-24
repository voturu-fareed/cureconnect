import React, { useEffect, useRef } from 'react';

export interface RealisticAvatarCanvasProps {
  emotion: 'sadness' | 'excitement' | 'loneliness' | 'anxiety' | 'joy' | 'peace' | 'neutral';
  isSpeaking: boolean;
  intensity: number; // 1 to 10
  customPhotoUrl?: string;
  avatarName: string;
  gender: 'boy' | 'girl' | 'other';
  avatarModelPreset?: 'avaturn_female' | 'avaturn_male' | 'avaturn_guide' | 'user_avatar' | 'custom';
}

// High-fidelity Avaturn & Metahuman style photorealistic 3D digital human renders
export const REALISTIC_3D_AVATAR_PRESETS = {
  avaturn_female: {
    id: 'avaturn_female',
    name: 'Dr. Elena (Avaturn 3D Female)',
    subtitle: 'Photorealistic 3D Clinical Counselor',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=90',
  },
  avaturn_male: {
    id: 'avaturn_male',
    name: 'Dr. Marcus (Avaturn 3D Male)',
    subtitle: 'Photorealistic 3D Empathetic Counselor',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=90',
  },
  avaturn_guide: {
    id: 'avaturn_guide',
    name: 'Aria (Avaturn 3D Serene)',
    subtitle: 'Photorealistic 3D Somatic Guide',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=90',
  },
  user_avatar: {
    id: 'user_avatar',
    name: 'Fareed (My 3D Avatar)',
    subtitle: 'Personalized 3D Digital Human for You',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=90',
  },
};

export const RealisticAvatarCanvas: React.FC<RealisticAvatarCanvasProps> = ({
  emotion,
  isSpeaking,
  intensity,
  customPhotoUrl,
  avatarName,
  gender,
  avatarModelPreset = 'avaturn_female',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number>(0);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 550);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: (e.clientX - rect.left - width / 2) / (width / 2),
        y: (e.clientY - rect.top - height / 2) / (height / 2),
      };
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    // Determine the active realistic 3D human image URL
    // Priority: custom uploaded photo -> user's gender-matched Avaturn model -> selected preset
    let targetImageUrl: string = customPhotoUrl || '';
    if (!targetImageUrl) {
      if (avatarModelPreset && avatarModelPreset !== 'custom' && avatarModelPreset in REALISTIC_3D_AVATAR_PRESETS) {
        targetImageUrl = REALISTIC_3D_AVATAR_PRESETS[avatarModelPreset as keyof typeof REALISTIC_3D_AVATAR_PRESETS].url;
      } else if (gender === 'girl') {
        targetImageUrl = REALISTIC_3D_AVATAR_PRESETS.avaturn_female.url;
      } else {
        targetImageUrl = REALISTIC_3D_AVATAR_PRESETS.avaturn_male.url;
      }
    }

    // Preload Realistic 3D Human Avatar Image
    const avatarImg = new Image();
    avatarImg.crossOrigin = 'anonymous';
    let isLoaded = false;
    avatarImg.onload = () => {
      isLoaded = true;
    };
    avatarImg.src = targetImageUrl;
    if (avatarImg.complete && avatarImg.naturalWidth > 0) {
      isLoaded = true;
    }

    let time = 0;
    let blinkProgress = 0; // 0 (open) to 1 (closed)
    let blinkTimer = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Emotion-responsive lighting palette
      let auraColor1 = 'rgba(20, 184, 166, 0.22)'; // Teal (Calm/Peace)
      let rimGlow = '#14b8a6';
      if (emotion === 'sadness' || emotion === 'loneliness') {
        auraColor1 = 'rgba(129, 140, 248, 0.28)'; // Soothing Lavender/Indigo
        rimGlow = '#818cf8';
      } else if (emotion === 'excitement' || emotion === 'joy') {
        auraColor1 = 'rgba(245, 158, 11, 0.32)'; // Warm Gold / Amber
        rimGlow = '#f59e0b';
      } else if (emotion === 'anxiety') {
        auraColor1 = 'rgba(244, 63, 94, 0.28)'; // Grounding Rose Quartz
        rimGlow = '#f43f5e';
      }

      // 1. Decent, dignified interior ambient studio lighting
      const bgGrad = ctx.createRadialGradient(cx, cy * 0.75, 40, cx, cy, Math.max(width, height) * 0.85);
      bgGrad.addColorStop(0, 'rgba(26, 32, 44, 0.98)');
      bgGrad.addColorStop(0.45, 'rgba(15, 23, 42, 0.99)');
      bgGrad.addColorStop(1, 'rgba(8, 12, 22, 1.0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle dynamic emotional light glow behind the avatar
      const dynamicAura = ctx.createRadialGradient(cx, cy * 0.65, 80, cx, cy, width * 0.7);
      dynamicAura.addColorStop(0, auraColor1);
      dynamicAura.addColorStop(1, 'transparent');
      ctx.fillStyle = dynamicAura;
      ctx.fillRect(0, 0, width, height);

      // 2. Realistic 3D Human Breathing Cycle
      const breathOffsetY = Math.sin(time * 1.6) * 4.5;
      const breathScale = 1 + Math.sin(time * 1.6) * 0.008;

      // 3. 3D Parallax Head Tracking to user's mouse/gaze
      const targetHeadX = mousePosRef.current.x * 12;
      const targetHeadY = mousePosRef.current.y * 7 + breathOffsetY;

      // 4. Natural Human Eyelid Blink Simulation (Every ~3.5 seconds)
      blinkTimer += 0.016;
      if (blinkTimer > 3.4) {
        blinkProgress += 0.24;
        if (blinkProgress >= 1) {
          blinkProgress = 0;
          blinkTimer = 0;
        }
      }

      // 5. Realistic Mouth Speaking / Phoneme Movement
      const mouthOpen = isSpeaking
        ? Math.abs(Math.sin(time * 9)) * 14 + Math.sin(time * 14) * 5
        : 0;

      // 6. Draw the Realistic 3D Human Avatar
      ctx.save();
      ctx.translate(cx + targetHeadX, cy + targetHeadY);
      ctx.scale(breathScale, breathScale);

      // 3D Perspective card size
      const cardWidth = Math.min(width * 0.78, 440);
      const cardHeight = cardWidth * 1.25;
      const rX = cardWidth / 2;
      const rY = cardHeight / 2;

      // Outer soft rim shadow for 3D depth
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 36;
      ctx.shadowOffsetY = 16;

      // Elegant rounded video portrait card
      ctx.beginPath();
      ctx.roundRect(-rX, -rY, cardWidth, cardHeight, 32);
      ctx.fillStyle = '#090d16';
      ctx.fill();
      ctx.restore();

      // Clip image within the rounded card
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-rX, -rY, cardWidth, cardHeight, 32);
      ctx.clip();

      if (avatarImg && (avatarImg.complete || isLoaded) && avatarImg.naturalWidth > 0) {
        // Draw the photorealistic 3D person
        ctx.drawImage(avatarImg, -rX, -rY, cardWidth, cardHeight);

        // Realistic Eye Blinking Layer
        if (blinkProgress > 0.08) {
          const eyeLevelY = -rY * 0.16;
          ctx.fillStyle = 'rgba(20, 16, 25, 0.62)';
          // Left eye blink
          ctx.beginPath();
          ctx.ellipse(-rX * 0.26, eyeLevelY, rX * 0.17, rY * 0.045 * blinkProgress, 0, 0, Math.PI * 2);
          ctx.fill();
          // Right eye blink
          ctx.beginPath();
          ctx.ellipse(rX * 0.26, eyeLevelY, rX * 0.17, rY * 0.045 * blinkProgress, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Realistic Mouth Lip-Sync Movement Layer when AI is speaking
        if (isSpeaking && mouthOpen > 1.2) {
          const mouthY = rY * 0.34;
          ctx.save();
          ctx.fillStyle = 'rgba(120, 15, 45, 0.45)';
          ctx.beginPath();
          ctx.ellipse(0, mouthY, rX * 0.22, mouthOpen * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();

          // Subtle upper/lower lip contour
          ctx.strokeStyle = 'rgba(180, 40, 80, 0.3)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }

        // Soft ambient studio rim light across 3D person's shoulders and hair
        const rimGrad = ctx.createLinearGradient(-rX, -rY, rX, rY);
        rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
        rimGrad.addColorStop(0.4, 'transparent');
        rimGrad.addColorStop(1, auraColor1.replace('0.22', '0.35'));
        ctx.fillStyle = rimGrad;
        ctx.beginPath();
        ctx.roundRect(-rX, -rY, cardWidth, cardHeight, 32);
        ctx.fill();
      } else {
        // Shimmer placeholder while image is caching
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-rX, -rY, cardWidth, cardHeight);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 14px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Loading Realistic 3D Human Avatar...', 0, 0);
      }

      ctx.restore();

      // Outer luminous border highlighting the realistic 3D avatar
      ctx.strokeStyle = auraColor1.replace('0.22', '0.45');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-rX, -rY, cardWidth, cardHeight, 32);
      ctx.stroke();

      // Realistic 3D Model Name Tag HUD
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.beginPath();
      ctx.roundRect(-140, rY - 42, 280, 36, 18);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 12.5px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const displayName = customPhotoUrl ? `❤️ ${avatarName}` : `✨ ${avatarName}`;
      ctx.fillText(displayName, 0, rY - 24);

      ctx.restore();

      // Ambient Audio Spectrum Waves at bottom when speaking
      if (isSpeaking) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = rimGlow;
        ctx.beginPath();
        for (let x = 0; x < width; x += 6) {
          const waveY = height - 25 + Math.sin(x * 0.05 + time * 8) * (8 + intensity * 1.5);
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [emotion, isSpeaking, intensity, customPhotoUrl, avatarName, gender, avatarModelPreset]);

  return (
    <div className="relative w-full h-full min-h-[380px] md:min-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800/80 shadow-2xl">
      <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />
    </div>
  );
};
