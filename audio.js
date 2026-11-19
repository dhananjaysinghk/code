/**
 * Squid Game: Audio Synthesizer Engine (Web Audio API)
 * Procedural generative soundscape:
 * - "Mugunghwa kkochi pieot seumnida" celesta / music box melody
 * - Atmospheric dark dystopian sub-bass drone
 * - Biometric heartbeat pulse generator
 * - Red Light / Green Light state transition alarms
 * - Golden Won cascade particle chimes
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.isMuted = true;
    this.isPlayingMelody = false;
    this.melodyTimer = null;
    this.heartbeatTimer = null;
    this.droneOsc = null;
    this.droneGain = null;

    // Melody notes (Korean Red Light Green Light chant pitch intervals)
    // "Mu - gung - hwa - kko - chi - pi - eot - seum - ni - da"
    // G4 - G4 - E4 - G4 - A4 - G4 - E4 - D4 - D4 - E4 - D4
    this.chantFrequencies = [
      392.00, // Mu (G4)
      392.00, // gung (G4)
      329.63, // hwa (E4)
      392.00, // kko (G4)
      440.00, // chi (A4)
      392.00, // pi (G4)
      329.63, // eot (E4)
      293.66, // seum (D4)
      293.66, // ni (D4)
      329.63, // da (E4)
    ];
    this.chantDurations = [
      0.35, 0.35, 0.5, 0.35, 0.45, 0.4, 0.4, 0.35, 0.35, 0.8
    ];
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    this.startAtmosphericDrone();
    this.startHeartbeat(75);
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    if (!this.ctx) {
      this.init();
    }
    this.resume();

    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.28, this.ctx.currentTime, 0.1);
    }
    return !this.isMuted;
  }

  startAtmosphericDrone() {
    if (!this.ctx) return;

    // Low sub oscillator
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const droneFilter = this.ctx.createBiquadFilter();
    this.droneGain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(54.2, this.ctx.currentTime); // slight detune beat

    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(120, this.ctx.currentTime);
    droneFilter.Q.setValueAtTime(4, this.ctx.currentTime);

    this.droneGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    osc1.connect(droneFilter);
    osc2.connect(droneFilter);
    droneFilter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    osc1.start();
    osc2.start();
  }

  playChantMelody(onComplete) {
    if (!this.ctx || this.isMuted) {
      if (onComplete) setTimeout(onComplete, 3500);
      return;
    }
    this.resume();

    let currentTime = this.ctx.currentTime + 0.05;
    const notes = this.chantFrequencies;
    const durs = this.chantDurations;

    for (let i = 0; i < notes.length; i++) {
      this.playMusicBoxNote(notes[i], currentTime, durs[i]);
      currentTime += durs[i] * 0.9;
    }

    const totalDuration = (currentTime - this.ctx.currentTime) * 1000;
    setTimeout(() => {
      if (onComplete) onComplete();
    }, totalDuration);
  }

  playMusicBoxNote(freq, startTime, duration) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Add bright chime overtone
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.01, startTime);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, startTime);
    filter.Q.setValueAtTime(2.5, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.18, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 1.4);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(filter);
    filter.connect(this.masterGain);

    osc.start(startTime);
    osc2.start(startTime);
    osc.stop(startTime + duration * 1.5);
    osc2.stop(startTime + duration * 1.5);
  }

  playRedLightAlarm() {
    if (!this.ctx || this.isMuted) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.6);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.7);

    // Mechanical snap click
    this.playClick(t);
  }

  playClick(time) {
    const t = time || this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
  }

  startHeartbeat(bpm = 75) {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    const interval = (60 / bpm) * 1000;

    this.heartbeatTimer = setInterval(() => {
      this.playHeartbeatThump();
    }, interval);
  }

  setHeartbeatBpm(bpm) {
    this.startHeartbeat(bpm);
  }

  playHeartbeatThump() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    // First thump (Lub)
    this.synthThump(t, 55, 0.22);
    // Second thump (Dub)
    this.synthThump(t + 0.16, 48, 0.16);
  }

  synthThump(time, freq, vol) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(25, time + 0.12);

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.16);
  }

  playCoinChime() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const frequencies = [1318.51, 1567.98, 1760.00, 2093.00, 2637.02];
    const freq = frequencies[Math.floor(Math.random() * frequencies.length)];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.38);
  }

  getFrequencyData() {
    if (!this.analyser) return new Uint8Array(32);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

window.soundEngine = new SoundEngine();
