// Web Audio API Sound Synthesizer for Retro Pac-Man Arcade Effects

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private vibrationEnabled: boolean = true;
  private wakaToggle: boolean = false;
  private sirenOsc: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private isSirenPlaying: boolean = false;

  constructor() {
    // Lazy init AudioContext on first user interaction
  }

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled && this.isSirenPlaying) {
      this.stopSiren();
    }
  }

  public setVibrationEnabled(enabled: boolean) {
    this.vibrationEnabled = enabled;
  }

  public isMuted(): boolean {
    return !this.soundEnabled;
  }

  public isVibrateOn(): boolean {
    return this.vibrationEnabled;
  }

  // Trigger haptic feedback
  public vibrate(pattern: number | number[]) {
    if (this.vibrationEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore vibration error on unsupported browsers
      }
    }
  }

  // Button Click Feedback
  public playButtonClick() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);

    this.vibrate(15);
  }

  // Classic Pacman "Waka Waka" sound when eating dots
  public playWaka() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const freq = this.wakaToggle ? 440 : 330;
    this.wakaToggle = !this.wakaToggle;

    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);

    this.vibrate(8);
  }

  // Power Pellet Eating
  public playPowerPellet() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);

    this.vibrate([20, 30, 20]);
  }

  // Ghost Eaten Sound
  public playEatGhost() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [300, 400, 500, 700, 900];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.04);

      gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (i + 1) * 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.04);
      osc.stop(ctx.currentTime + (i + 1) * 0.04);
    });

    this.vibrate([40, 20, 40, 20, 60]);
  }

  // Fruit Eaten
  public playEatFruit() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
    osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);

    this.vibrate([30, 30, 50]);
  }

  // Special Boost Skill Sound
  public playBoost() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);

    this.vibrate([50, 20, 50]);
  }

  // Special Freeze Ghosts Skill Sound
  public playFreeze() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);

    this.vibrate([100]);
  }

  // Pacman Death Sound
  public playDeath() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const freqs = [800, 750, 700, 650, 600, 550, 500, 450, 400, 350, 300, 250, 200, 150];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (idx + 1) * 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.05);
      osc.stop(ctx.currentTime + (idx + 1) * 0.05);
    });

    this.vibrate([100, 50, 100, 50, 200]);
  }

  // Start Intro Jingle
  public playIntro() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const melody = [
      { f: 493.88, d: 0.12 }, // B4
      { f: 987.77, d: 0.12 }, // B5
      { f: 739.99, d: 0.12 }, // F#5
      { f: 622.25, d: 0.12 }, // D#5
      { f: 987.77, d: 0.08 }, // B5
      { f: 739.99, d: 0.12 }, // F#5
      { f: 622.25, d: 0.20 }, // D#5
    ];

    let t = ctx.currentTime;
    melody.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + note.d);
      t += note.d;
    });
  }

  // Background Siren Sound Loop during gameplay
  public startSiren() {
    if (!this.soundEnabled || this.isSirenPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      this.sirenOsc = ctx.createOscillator();
      this.sirenGain = ctx.createGain();

      this.sirenOsc.type = 'sine';
      this.sirenOsc.frequency.setValueAtTime(150, ctx.currentTime);

      // Oscillate siren frequency
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 1.5; // 1.5 Hz siren pulse
      lfoGain.gain.value = 50; // Pitch swing +/- 50Hz

      lfo.connect(this.sirenOsc.frequency);
      lfo.start();

      this.sirenGain.gain.setValueAtTime(0.05, ctx.currentTime);

      this.sirenOsc.connect(this.sirenGain);
      this.sirenGain.connect(ctx.destination);

      this.sirenOsc.start();
      this.isSirenPlaying = true;
    } catch {
      // Fallback
    }
  }

  public stopSiren() {
    if (this.sirenOsc) {
      try {
        this.sirenOsc.stop();
        this.sirenOsc.disconnect();
      } catch {
        // Ignore stop error
      }
      this.sirenOsc = null;
    }
    this.isSirenPlaying = false;
  }
}

export const sounds = new SoundManager();
