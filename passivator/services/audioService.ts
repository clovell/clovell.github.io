export enum SoundType {
  CLICK,
  SUCCESS,
  FAILURE,
  VICTORY
}

// Simple synth using Web Audio API to avoid external dependencies
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

export const playSound = (type: SoundType) => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  switch (type) {
    case SoundType.CLICK:
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;

    case SoundType.SUCCESS:
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, now); // C5
      oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
      oscillator.start(now);
      oscillator.stop(now + 0.3);
      break;

    case SoundType.FAILURE:
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, now);
      oscillator.frequency.linearRampToValueAtTime(100, now + 0.3);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
      oscillator.start(now);
      oscillator.stop(now + 0.3);
      break;

    case SoundType.VICTORY:
      // A quick major arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gn = audioCtx.createGain();
        osc.connect(gn);
        gn.connect(audioCtx.destination);
        
        osc.type = 'triangle';
        osc.frequency.value = freq;
        
        const startTime = now + (i * 0.1);
        gn.gain.setValueAtTime(0, startTime);
        gn.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
        gn.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        
        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
      break;
  }
};