// Audio Service using Web Audio API to avoid external assets

let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// Play a single tone
const playTone = (ctx: AudioContext, freq: number, type: OscillatorType, startTime: number, duration: number, vol: number = 0.1) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(startTime);
  osc.stop(startTime + duration);
};

export const playSound = (type: 'correct' | 'incorrect' | 'streak', intensity: number = 1) => {
  const ctx = getCtx();
  if (!ctx) return;
  
  // Resume context if suspended (browser policy)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(e => console.error(e));
  }

  const now = ctx.currentTime;

  if (type === 'correct') {
    // Pleasant high chime
    playTone(ctx, 523.25, 'sine', now, 0.3, 0.2); // C5
    playTone(ctx, 1046.50, 'sine', now + 0.05, 0.4, 0.1); // C6
  } 
  else if (type === 'incorrect') {
    // Dissonant low buzz/thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.3); // Pitch drop
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } 
  else if (type === 'streak') {
    // Fanfare - Major Triad Arpeggio (C Major)
    // Intensity affects speed and number of notes
    const speed = 0.08;
    playTone(ctx, 523.25, 'triangle', now, 0.4, 0.2); // C5
    playTone(ctx, 659.25, 'triangle', now + speed, 0.4, 0.2); // E5
    playTone(ctx, 783.99, 'triangle', now + speed * 2, 0.4, 0.2); // G5
    playTone(ctx, 1046.50, 'triangle', now + speed * 3, 0.8, 0.3); // C6
    
    // Harmony for high intensity streaks
    if (intensity > 1) {
      playTone(ctx, 392.00, 'sine', now, 0.8, 0.1); // G4
      playTone(ctx, 1318.51, 'sine', now + speed * 3, 0.8, 0.2); // E6
    }
  }
};