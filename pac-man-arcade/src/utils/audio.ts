/**
 * Web Audio API Sound Synthesizer for Pac-Man Arcade
 * Generates classic 8-bit retro sounds procedurally.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private wakaToggle: boolean = false;
  private powerSirenOsc: OscillatorNode | null = null;
  private powerSirenGain: GainNode | null = null;
  private sirenInterval: number | null = null;

  constructor() {
    // Lazy initialization on user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopPowerSiren();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  // Waka Waka sound when eating dots
  public playWaka() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      
      const startFreq = this.wakaToggle ? 440 : 330;
      const endFreq = this.wakaToggle ? 300 : 220;
      this.wakaToggle = !this.wakaToggle;

      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Audio context error handler
    }
  }

  // Power pellet eat sound
  public playPowerPellet() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {
      // Audio fallback
    }
  }

  // Eat ghost sound (200, 400, 800, 1600 points fanfare)
  public playEatGhost() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [200, 400, 600, 800, 1200];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.04);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + (i + 1) * 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.04);
        osc.stop(this.ctx.currentTime + (i + 1) * 0.04);
      });
    } catch {
      // Audio fallback
    }
  }

  // Eat fruit sound
  public playEatFruit() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const arpeggio = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      arpeggio.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.05);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + (i + 1) * 0.05 + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.05);
        osc.stop(this.ctx.currentTime + (i + 1) * 0.05 + 0.05);
      });
    } catch {
      // Audio fallback
    }
  }

  // Death sound - descending frequency
  public playDeathSound() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.9);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.95);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.95);
    } catch {
      // Audio fallback
    }
  }

  // Game Start Intro Tune
  public playStartMelody() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const melody = [
        { f: 493.88, d: 0.12 }, // B4
        { f: 987.77, d: 0.12 }, // B5
        { f: 739.99, d: 0.12 }, // F#5
        { f: 622.25, d: 0.12 }, // D#5
        { f: 987.77, d: 0.12 }, // B5
        { f: 739.99, d: 0.12 }, // F#5
        { f: 622.25, d: 0.24 }, // D#5
        { f: 523.25, d: 0.12 }, // C5
        { f: 1046.5, d: 0.12 }, // C6
        { f: 783.99, d: 0.12 }, // G5
        { f: 659.25, d: 0.12 }, // E5
        { f: 1046.5, d: 0.12 }, // C6
        { f: 783.99, d: 0.12 }, // G5
        { f: 659.25, d: 0.24 }, // E5
      ];

      let now = this.ctx.currentTime;
      melody.forEach(note => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(note.f, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + note.d - 0.02);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + note.d);

        now += note.d;
      });
    } catch {
      // Audio fallback
    }
  }

  // Extra life sound
  public playExtraLife() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + (i + 1) * 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + (i + 1) * 0.08);
      });
    } catch {
      // Audio fallback
    }
  }

  // Victory fanfare sound
  public playVictoryFanfare() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const melody = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.12 }, // G5
        { f: 1046.5, d: 0.28 }, // C6
        { f: 880.00, d: 0.14 }, // A5
        { f: 1046.5, d: 0.45 }, // C6
      ];

      let now = this.ctx.currentTime;
      melody.forEach(note => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + note.d - 0.02);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + note.d);

        now += note.d;
      });
    } catch {
      // Audio fallback
    }
  }

  public stopPowerSiren() {
    if (this.sirenInterval !== null) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    if (this.powerSirenOsc) {
      try {
        this.powerSirenOsc.stop();
        this.powerSirenOsc.disconnect();
      } catch {
        // Safe ignore
      }
      this.powerSirenOsc = null;
    }
  }
}

export const soundEngine = new SoundEngine();
