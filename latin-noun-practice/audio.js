// Web Audio API helper for simple, non-obtrusive sounds

var audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playCorrectSound(soundEnabled) {
  if (!soundEnabled) return;
  var ctx = getAudioContext();

  var osc = ctx.createOscillator();
  var gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

  osc.start();
  osc.stop(ctx.currentTime + 0.5);
}

function playStreakSound(soundEnabled, streak) {
  if (!soundEnabled) return;
  var ctx = getAudioContext();

  // A major arpeggio
  var notes = [440, 554.37, 659.25, 880];
  var numNotes = Math.min(notes.length, Math.max(2, Math.floor(streak / 5)));

  var time = ctx.currentTime;
  for (var i = 0; i < numNotes; i++) {
    var osc = ctx.createOscillator();
    var gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(notes[i], time);

    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.1, time + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

    osc.start(time);
    osc.stop(time + 0.3);

    time += 0.1;
  }
}

function playErrorSound(soundEnabled) {
  if (!soundEnabled) return;
  var ctx = getAudioContext();

  var osc = ctx.createOscillator();
  var gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);

  gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}
