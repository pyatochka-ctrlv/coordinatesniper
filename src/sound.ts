/**
 * Web Audio API synthesizer for Minecraft-inspired sound effects.
 * 100% self-contained, no external audio files required.
 */

let audioCtx: AudioContext | null = null;
let isAudioMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuted(muted: boolean) {
  isAudioMuted = muted;
}

export function getMuted(): boolean {
  return isAudioMuted;
}

// Minecraft UI button click
export function playClickSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Ignore audio errors
  }
}

// Minecraft XP orb pickup "Pling"
export function playXpPlingSound(pitchMultiplier = 1.0) {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const baseFreq = 850 * pitchMultiplier;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Ignore audio errors
  }
}

// Minecraft Bow shoot / Snowball throw
export function playBowShootSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // Ignore audio errors
  }
}

// Miss / Block bonk
export function playMissBlockSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Ignore audio errors
  }
}

// Compass / Radar sonar ping
export function playCompassPingSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(740, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(980, ctx.currentTime + 0.09);

    gain.gain.setValueAtTime(0.16, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch {
    // Ignore audio errors
  }
}

// Harmless Creeper Sssss... pop for timeout
export function playCreeperHissSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Noise buffer for "ssss"
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3500, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch {
    // Ignore audio errors
  }
}

// Level-up victory fanfare
export function playLevelUpSound() {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [
      { f: 523.25, t: 0 },
      { f: 659.25, t: 0.09 },
      { f: 783.99, t: 0.18 },
      { f: 1046.5, t: 0.28 },
      { f: 1318.51, t: 0.42 },
    ];

    notes.forEach(({ f, t }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const st = ctx.currentTime + t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, st);

      gain.gain.setValueAtTime(0.2, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(st);
      osc.stop(st + 0.38);
    });
  } catch {
    // Ignore audio errors
  }
}
