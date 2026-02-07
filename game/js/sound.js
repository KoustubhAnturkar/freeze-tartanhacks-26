// Enhanced WebAudio-based SoundManager with improved SFX and MODERN BGM
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

  // MODERN BACKGROUND MUSIC - Electronic/Synth Style
  startBGM() {
    if (!this.enabled) return;
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    if (this.bgmScheduler) return; // already playing
    
    const ctx = this.ctx;
    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.value = 0.20 * this.volume; // Modern, fuller mix
    this.bgmGain.connect(this.masterGain);

    // SYNTH PAD - lush, modern atmosphere with detuned sawtooth waves
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 1200;
    padFilter.Q.value = 1.2;
    padFilter.connect(this.bgmGain);

    // Multi-voice pad for richness - Am chord (A, C, E)
    const createPadVoice = (freq, detune) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      osc.detune.value = detune;
      gain.gain.value = 0.04 * this.volume;
      osc.connect(gain);
      gain.connect(padFilter);
      osc.start();
      return osc;
    };

    // Rich detuned pad voices
    createPadVoice(220, 0);    // A3
    createPadVoice(220, 8);    // A3 slightly sharp
    createPadVoice(262, -5);   // C4 slightly flat
    createPadVoice(330, 12);   // E4 slightly sharp

    // Slow filter sweep for movement
    const filterLFO = ctx.createOscillator();
    const filterLFOGain = ctx.createGain();
    filterLFO.frequency.value = 0.08; // Slow sweep
    filterLFOGain.gain.value = 400;
    filterLFO.connect(filterLFOGain);
    filterLFOGain.connect(padFilter.frequency);
    filterLFO.start();

    // SUB BASS - modern sub bass with subtle movement
    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowpass';
    bassFilter.frequency.value = 250;
    bassFilter.connect(this.bgmGain);

    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.value = 55; // A1 - sub bass foundation
    bassGain.gain.value = 0.15 * this.volume;
    bassOsc.connect(bassGain);
    bassGain.connect(bassFilter);
    bassOsc.start();

    // Bass LFO for subtle pulse
    const bassLFO = ctx.createOscillator();
    const bassLFOGain = ctx.createGain();
    bassLFO.frequency.value = 0.12;
    bassLFOGain.gain.value = 3;
    bassLFO.connect(bassLFOGain);
    bassLFOGain.connect(bassOsc.frequency);
    bassLFO.start();

    // DELAY EFFECT - Modern delay with feedback for spaciousness
    const melodyDelay = ctx.createDelay();
    melodyDelay.delayTime.value = 0.375; // Dotted eighth note delay
    const delayFeedback = ctx.createGain();
    delayFeedback.gain.value = 0.35;
    const delayMix = ctx.createGain();
    delayMix.gain.value = 0.4;
    
    melodyDelay.connect(delayFeedback);
    delayFeedback.connect(melodyDelay);
    melodyDelay.connect(delayMix);
    delayMix.connect(this.bgmGain);

    // MELODY - Modern pentatonic lead synth
    const notes = [
      880,   // A5
      1047,  // C6
      1175,  // D6
      1319,  // E6
      1568,  // G6
      1760,  // A6
    ];

    // Modern melodic pattern
    const pattern = [
      { noteIdx: 0, dur: 0.5 },
      { noteIdx: 2, dur: 0.25 },
      { noteIdx: 4, dur: 0.25 },
      { noteIdx: 3, dur: 0.5 },
      { noteIdx: 1, dur: 0.5 },
      { noteIdx: 5, dur: 0.5 },
      { noteIdx: 2, dur: 1.0 },
    ];

    const tempo = 120; // Modern, upbeat tempo
    const secondsPerBeat = 60.0 / tempo;
    this.nextNoteTime = ctx.currentTime + 0.1;
    this.currentNote = 0;
    this.scheduleAheadTime = 0.3;

    const scheduleMelodyNote = (time, freq, dur) => {
      // Main lead synth - bright triangle wave
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      
      // Modern ADSR envelope - punchy attack
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(0.18 * this.volume, time + 0.01);
      gain.gain.linearRampToValueAtTime(0.12 * this.volume, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
      
      osc.connect(gain);
      gain.connect(this.bgmGain);
      gain.connect(melodyDelay); // Send to delay
      osc.start(time);
      osc.stop(time + dur);

      // Bright harmonics for modern sound
      const harm = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harm.type = 'sine';
      harm.frequency.setValueAtTime(freq * 2, time);
      harmGain.gain.setValueAtTime(0.0001, time);
      harmGain.gain.linearRampToValueAtTime(0.04 * this.volume, time + 0.01);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, time + dur * 0.7);
      harm.connect(harmGain);
      harmGain.connect(this.bgmGain);
      harm.start(time);
      harm.stop(time + dur);
    };

    // MODERN HI-HAT - Adds rhythm and energy
    const playHiHat = (time) => {
      const bufferSize = Math.floor(ctx.sampleRate * 0.06);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 8000; // Crispy high frequency
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08 * this.volume, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);
      
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);
      src.start(time);
    };

    // ELECTRONIC KICK - Modern electronic kick drum
    const playKick = (time) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);
      
      gain.gain.setValueAtTime(0.25 * this.volume, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);
      
      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start(time);
      osc.stop(time + 0.21);
    };

    let beatCount = 0;

    // Main scheduler - Coordinates all elements
    this.bgmScheduler = setInterval(() => {
      while (this.nextNoteTime < ctx.currentTime + this.scheduleAheadTime) {
        const p = pattern[this.currentNote % pattern.length];
        const beatLength = secondsPerBeat * p.dur;
        const freq = notes[p.noteIdx];
        
        // Schedule melody
        scheduleMelodyNote(this.nextNoteTime, freq, beatLength);
        
        // Modern drum pattern - kick on beats 1 and 3
        const beatPos = beatCount % 4;
        if (beatPos === 0 || beatPos === 2) {
          playKick(this.nextNoteTime);
        }
        
        // Hi-hats on eighth notes for modern groove
        if (beatCount % 2 === 0) {
          playHiHat(this.nextNoteTime);
          playHiHat(this.nextNoteTime + secondsPerBeat * 0.5);
        }
        
        this.nextNoteTime += beatLength;
        this.currentNote = (this.currentNote + 1) % pattern.length;
        beatCount++;
      }
    }, 80);
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