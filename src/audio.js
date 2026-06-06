// Web Audio API Synthesized Sound Effects for "Kraliçeyi Kurtarmak"

let audioCtx = null;
let droneOsc1 = null;
let droneOsc2 = null;
let droneGain = null;
let isDronePlaying = false;

// Initialize and unlock Audio Context on first interaction
export function initAudio() {
  if (audioCtx) return;
  
  // Create audio context
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  
  audioCtx = new AudioContextClass();
  console.log("Audio Context initialized successfully.");
}

// Resume context if suspended (required by browser security policies)
async function ensureAudioCtx() {
  initAudio();
  if (audioCtx && audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }
  return audioCtx;
}

// 1. Play a programmatically synthesized ambient dungeon hum
export async function playDrone() {
  // Disabled background music as requested by user
  return;
}

// Stop the ambient drone with a fade-out
export function stopDrone() {
  // Disabled background music as requested by user
  return;
}

// Toggle drone play state
export function toggleDrone(shouldPlay) {
  // Disabled background music as requested by user
  return;
}

// 2. Short synthetic click for UI buttons
export async function playClick() {
  const ctx = await ensureAudioCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

// 3. Success Chime (Golden Bell Arpeggio)
export async function playSuccess() {
  const ctx = await ensureAudioCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  // C-major 7 chord arpeggio for a bright, magical feeling (C5, E5, G5, B5, C6)
  const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
  const duration = 0.6;

  notes.forEach((freq, idx) => {
    const noteTime = now + idx * 0.08;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Highpass filter for bell shimmer
    filter.type = 'highpass';
    filter.frequency.value = 400;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, noteTime);
    
    // Add sub-frequency or harmonic frequency for metallic warmth
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.5, noteTime);

    gain.gain.setValueAtTime(0, noteTime);
    gain.gain.linearRampToValueAtTime(0.07, noteTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteTime);
    osc2.start(noteTime);
    osc.stop(noteTime + duration);
    osc2.stop(noteTime + duration);
  });
}

// 4. Failure Buzz (Yawning Synth Growl)
export async function playFailure() {
  const ctx = await ensureAudioCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(300, now);
  filter.frequency.exponentialRampToValueAtTime(80, now + 0.35);

  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(140, now);
  osc1.frequency.linearRampToValueAtTime(100, now + 0.35);

  osc2.type = 'square';
  osc2.frequency.setValueAtTime(138, now); // slightly detuned detritus
  osc2.frequency.linearRampToValueAtTime(98, now + 0.35);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.45);
  osc2.stop(now + 0.45);
}

// 5. Magic Swell / Unlock Sound (Frequency Sweep)
export async function playMagic() {
  const ctx = await ensureAudioCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'bandpass';
  filter.Q.value = 3.0;
  filter.frequency.setValueAtTime(200, now);
  filter.frequency.exponentialRampToValueAtTime(3000, now + 0.8);

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.8);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.9);
}
