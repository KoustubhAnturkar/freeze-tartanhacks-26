// Enhanced WebAudio-based SoundManager with improved SFX and continuous BGM
class SoundManager {
  constructor() {
    this.enabled = typeof CONFIG !== 'undefined' ? !!CONFIG.SOUND_ENABLED : true;
    this.volume = typeof CONFIG !== 'undefined' ? (CONFIG.SOUND_VOLUME || 0.5) : 0.5;
    this.ctx = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.bgmNodes = [];
    this.bgmScheduler = null;
    this.lastStepTime = 0;
    this.nextNoteTime = 0;
    this.currentNote = 0;
    this.tempo = 140; // BPM
    this.scheduleAheadTime = 0.1; // How far ahead to schedule (seconds)
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(this.ctx.destination);
    
    // Resume audio context on first user gesture
    const resumeOnce = () => { 
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); 
      document.removeEventListener('pointerdown', resumeOnce); 
    };
    document.addEventListener('pointerdown', resumeOnce);
  }

  setVolume(v) {
    this.volume = v;
    if (this.masterGain) this.masterGain.gain.value = v;
  }

  // Enhanced sound effect synthesis
  play(type) {
    if (!this.enabled) return;
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    try { if (this.ctx.state === 'suspended') this.ctx.resume(); } catch (e) {}
    
    const now = this.ctx.currentTime;

    // Helper to create oscillator with envelope
    const makeOsc = (type, freq, dur, gainVal, detune = 0) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, now);
      if (detune) o.detune.setValueAtTime(detune, now);
      g.gain.setValueAtTime(gainVal, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      o.connect(g); 
      g.connect(this.masterGain);
      o.start(now); 
      o.stop(now + dur + 0.02);
      return { osc: o, gain: g };
    };

    // Helper to create noise burst
    const makeNoise = (dur, gainVal, filterFreq = 1000) => {
      const bufferSize = this.ctx.sampleRate * dur;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, now);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(gainVal, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      noise.connect(filter);
      filter.connect(g);
      g.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + dur);
    };

    if (type === 'jump') {
      // Upward swoosh with pitch bend
      const { osc, gain } = makeOsc('sine', 300, 0.25, 0.2);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
      // Add harmonics for richness
      makeOsc('sine', 450, 0.2, 0.08);
      
    } else if (type === 'land') {
      // Punchy thud with noise
      makeOsc('triangle', 120, 0.15, 0.25);
      makeNoise(0.08, 0.15, 400);
      
    } else if (type === 'levelComplete') {
      // Triumphant ascending arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        setTimeout(() => {
          makeOsc('sine', freq, 0.4, 0.15);
          makeOsc('triangle', freq * 2, 0.3, 0.06);
        }, i * 80);
      });
      
    } else if (type === 'fall') {
      // Dramatic "fuuuuck" descending wail
      const { osc, gain } = makeOsc('sawtooth', 400, 0.8, 0.28);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.7);
      
      // Add distorted harmonics for more drama
      const { osc: osc2 } = makeOsc('square', 600, 0.7, 0.18);
      osc2.frequency.exponentialRampToValueAtTime(120, now + 0.65);
      
      // Add wobble/vibrato for extra despair
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(8, now);
      lfoGain.gain.setValueAtTime(30, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);
      lfo.stop(now + 0.8);
      
      // Noise burst at the end for impact
      setTimeout(() => {
        makeNoise(0.15, 0.2, 300);
      }, 650);
      
    } else if (type === 'button') {
      // Quick blip
      makeOsc('square', 880, 0.06, 0.08);
      makeOsc('square', 1320, 0.04, 0.04);
      
    } else if (type === 'step') {
      // Throttle steps to avoid spam
      const t = performance.now();
      if (t - this.lastStepTime < 120) return;
      this.lastStepTime = t;
      // Soft tick
      makeOsc('sine', 200, 0.08, 0.07);
      makeNoise(0.04, 0.05, 800);
      
    } else if (type === 'collect') {
      // Sparkly pickup sound
      makeOsc('sine', 800, 0.2, 0.12);
      makeOsc('sine', 1200, 0.18, 0.08);
      makeOsc('triangle', 600, 0.15, 0.06);
    }
  }

  // Continuous looping background music
  startBGM() {
    if (!this.enabled) return;
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    if (this.bgmScheduler) return; // already playing
    
    const ctx = this.ctx;
    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.value = 0.16 * this.volume; // Louder and more prominent
    this.bgmGain.connect(this.masterGain);

    // Musical progression - creates a pleasant ambient loop
    // Using pentatonic scale (A minor pentatonic: A, C, D, E, G)
    const baseNotes = [
      220.00, 261.63, 293.66, 329.63, 392.00, // A3, C4, D4, E4, G4
      440.00, 523.25, 587.33, 659.25, 783.99  // A4, C5, D5, E5, G5
    ];
    
    // Melodic pattern that loops nicely
    const melody = [
      { note: 7, dur: 0.5 },  // D5
      { note: 5, dur: 0.5 },  // A4
      { note: 8, dur: 0.5 },  // E5
      { note: 6, dur: 0.5 },  // C5
      { note: 7, dur: 0.5 },  // D5
      { note: 4, dur: 0.5 },  // G4
      { note: 5, dur: 1.0 },  // A4
      { note: 3, dur: 0.5 },  // E4
      
      { note: 7, dur: 0.5 },  // D5
      { note: 5, dur: 0.5 },  // A4
      { note: 8, dur: 0.5 },  // E5
      { note: 6, dur: 0.5 },  // C5
      { note: 5, dur: 1.0 },  // A4
      { note: 2, dur: 0.5 },  // D4
      { note: 3, dur: 1.0 },  // E4
    ];

    // Bass notes (plays less frequently for depth)
    const bassPattern = [0, -1, 0, -1, 2, -1, 0, -1]; // -1 = rest
    let bassStep = 0;

    const secondsPerBeat = 60.0 / this.tempo;
    this.nextNoteTime = ctx.currentTime;

    const scheduleNote = () => {
      const beatLength = secondsPerBeat * melody[this.currentNote].dur;
      
      // Schedule melody note
      const freq = baseNotes[melody[this.currentNote].note];
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, this.nextNoteTime);
      
      // Envelope for smooth sound
      g.gain.setValueAtTime(0.0001, this.nextNoteTime);
      g.gain.linearRampToValueAtTime(0.25, this.nextNoteTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, this.nextNoteTime + beatLength * 0.9);
      
      o.connect(g);
      g.connect(this.bgmGain);
      o.start(this.nextNoteTime);
      o.stop(this.nextNoteTime + beatLength);

      // Add subtle harmony (octave below)
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.type = 'triangle';
      o2.frequency.setValueAtTime(freq / 2, this.nextNoteTime);
      g2.gain.setValueAtTime(0.0001, this.nextNoteTime);
      g2.gain.linearRampToValueAtTime(0.12, this.nextNoteTime + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.0001, this.nextNoteTime + beatLength * 0.9);
      o2.connect(g2);
      g2.connect(this.bgmGain);
      o2.start(this.nextNoteTime);
      o2.stop(this.nextNoteTime + beatLength);

      // Bass note (every other beat)
      if (bassPattern[bassStep] !== -1) {
        const bassFreq = baseNotes[bassPattern[bassStep]];
        const ob = ctx.createOscillator();
        const gb = ctx.createGain();
        ob.type = 'sawtooth';
        ob.frequency.setValueAtTime(bassFreq / 2, this.nextNoteTime);
        gb.gain.setValueAtTime(0.0001, this.nextNoteTime);
        gb.gain.linearRampToValueAtTime(0.14, this.nextNoteTime + 0.01);
        gb.gain.exponentialRampToValueAtTime(0.0001, this.nextNoteTime + beatLength * 0.8);
        ob.connect(gb);
        gb.connect(this.bgmGain);
        ob.start(this.nextNoteTime);
        ob.stop(this.nextNoteTime + beatLength);
      }

      this.nextNoteTime += beatLength;
      this.currentNote = (this.currentNote + 1) % melody.length;
      bassStep = (bassStep + 1) % bassPattern.length;
    };

    // Scheduler that runs frequently to keep audio buffer filled
    this.bgmScheduler = setInterval(() => {
      // Schedule notes that are coming up within the lookahead window
      while (this.nextNoteTime < ctx.currentTime + this.scheduleAheadTime) {
        scheduleNote();
      }
    }, 25); // Check every 25ms
  }

  // Ensure BGM is started on first user gesture (autoplay policy compliance)
  ensureBGMOnGesture() {
    if (typeof document === 'undefined') return;
    const start = () => {
      try {
        this.init();
        this.startBGM();
      } catch (e) {}
      removeListeners();
    };
    const removeListeners = () => {
      try { document.removeEventListener('pointerdown', start); } catch (e) {}
      try { document.removeEventListener('keydown', start); } catch (e) {}
      try { document.removeEventListener('touchstart', start); } catch (e) {}
    };
    document.addEventListener('pointerdown', start, { once: true, passive: true });
    document.addEventListener('keydown', start, { once: true, passive: true });
    document.addEventListener('touchstart', start, { once: true, passive: true });
  }

  stopBGM() {
    if (this.bgmScheduler) {
      clearInterval(this.bgmScheduler);
      this.bgmScheduler = null;
    }
    if (this.bgmGain) {
      try { this.bgmGain.disconnect(); } catch (e) {}
      this.bgmGain = null;
    }
    this.bgmNodes = [];
  }
}

const SOUNDS = new SoundManager();
window.SOUNDS = SOUNDS;