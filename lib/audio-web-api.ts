/**
 * Web Audio API Implementation for Harmonia
 * Generates healing frequencies: binaural beats, isochronic tones, noise, and OM chanting
 */

export class HarmoniaAudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private noiseBuffer: AudioBuffer | null = null;
  private isPlaying = false;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    if (typeof window !== 'undefined' && !this.audioContext) {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass() as AudioContext;
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3; // Safe default volume
    }
  }

  /**
   * Generate Binaural Beats
   * Left ear: carrier frequency
   * Right ear: carrier frequency + beat frequency
   * Brain perceives beat frequency (difference tone)
   */
  generateBinauralBeats(
    carrierFreq: number,
    beatFreq: number,
    duration: number,
    volume: number = 0.3
  ) {
    if (!this.audioContext || !this.masterGain) return;
    const ctx = this.audioContext;
    const masterGain = this.masterGain;

    const now = ctx.currentTime;
    const endTime = now + duration;

    // Left channel oscillator (carrier frequency)
    const leftOsc = ctx.createOscillator();
    leftOsc.frequency.value = carrierFreq;
    leftOsc.type = 'sine';

    // Right channel oscillator (carrier + beat frequency)
    const rightOsc = ctx.createOscillator();
    rightOsc.frequency.value = carrierFreq + beatFreq;
    rightOsc.type = 'sine';

    // Gain nodes for each channel
    const leftGain = ctx.createGain();
    const rightGain = ctx.createGain();
    leftGain.gain.value = volume;
    rightGain.gain.value = volume;

    // Stereo splitter (simulated with separate gains)
    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    leftGain.connect(masterGain);
    rightGain.connect(masterGain);

    // Fade in
    leftGain.gain.setValueAtTime(0, now);
    rightGain.gain.setValueAtTime(0, now);
    leftGain.gain.linearRampToValueAtTime(volume, now + 2);
    rightGain.gain.linearRampToValueAtTime(volume, now + 2);

    // Fade out
    leftGain.gain.linearRampToValueAtTime(0, endTime - 2);
    rightGain.gain.linearRampToValueAtTime(0, endTime - 2);

    leftOsc.start(now);
    rightOsc.start(now);
    leftOsc.stop(endTime);
    rightOsc.stop(endTime);

    this.oscillators.push(leftOsc, rightOsc);
    this.gainNodes.push(leftGain, rightGain);
  }

  /**
   * Generate Isochronic Tones
   * Rapidly pulsing tones at the target frequency
   * More effective than binaural beats for some users
   */
  generateIsochronicTones(
    frequency: number,
    pulseRate: number, // Hz (pulses per second)
    duration: number,
    volume: number = 0.3
  ) {
    if (!this.audioContext || !this.masterGain) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const endTime = now + duration;
    const pulseDuration = 1 / pulseRate; // Duration of each pulse

    const osc = ctx.createOscillator();
    osc.frequency.value = frequency;
    osc.type = 'sine';

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(this.masterGain);
    osc.connect(gain);

    // Create pulsing effect
    let pulseTime = now;
    while (pulseTime < endTime) {
      const pulseStart = pulseTime;
      const pulseEnd = Math.min(pulseTime + pulseDuration * 0.5, endTime); // 50% duty cycle

      gain.gain.setValueAtTime(0, pulseStart);
      gain.gain.linearRampToValueAtTime(volume, pulseStart + 0.01);
      gain.gain.setValueAtTime(volume, pulseEnd - 0.01);
      gain.gain.linearRampToValueAtTime(0, pulseEnd);

      pulseTime += pulseDuration;
    }

    osc.start(now);
    osc.stop(endTime);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  /**
   * Generate Noise Colors
   * White, Pink, Brown, Purple, Blue noise
   */
  generateNoise(
    color: 'white' | 'pink' | 'brown' | 'purple' | 'blue',
    duration: number,
    volume: number = 0.3
  ) {
    if (!this.audioContext || !this.masterGain) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const endTime = now + duration;
    const sampleRate = ctx.sampleRate;
    const bufferLength = sampleRate * duration;

    // Create noise buffer
    const buffer = ctx.createBuffer(1, bufferLength, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferLength; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    // Apply color filtering
    this.applyNoiseColor(data, color);

    // Create source and play
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 1);
    gain.gain.setValueAtTime(volume, endTime - 1);
    gain.gain.linearRampToValueAtTime(0, endTime);

    source.connect(gain);
    gain.connect(this.masterGain);

    source.loop = true;
    source.start(now);
    source.stop(endTime);

    this.gainNodes.push(gain);
  }

  /**
   * Apply frequency filtering to create different noise colors
   */
  private applyNoiseColor(data: Float32Array, color: string) {
    if (color === 'white') return; // Already white noise

    // Simple IIR filter implementation
    let lastOut = 0;
    const filterCoefficient = this.getNoiseFilterCoefficient(color);

    for (let i = 0; i < data.length; i++) {
      lastOut = data[i] * filterCoefficient + lastOut * (1 - filterCoefficient);
      data[i] = lastOut;
    }
  }

  private getNoiseFilterCoefficient(color: string): number {
    // Coefficients for different noise colors
    switch (color) {
      case 'pink':
        return 0.5; // -3dB/octave
      case 'brown':
        return 0.7; // -6dB/octave
      case 'purple':
        return 0.3; // +3dB/octave
      case 'blue':
        return 0.2; // +6dB/octave
      default:
        return 0.5;
    }
  }

  /**
   * Generate Sacred OM Chanting
   * 136.1 Hz (Cosmic OM) with harmonics
   */
  generateOMChanting(
    duration: number,
    volume: number = 0.3,
    includeHarmonics: boolean = true
  ) {
    if (!this.audioContext || !this.masterGain) return;

    const ctx = this.audioContext;
    const masterGain = this.masterGain;
    const now = ctx.currentTime;
    const endTime = now + duration;

    const fundamentalFreq = 136.1; // Cosmic OM frequency

    // Create fundamental
    const fundamental = ctx.createOscillator();
    fundamental.frequency.value = fundamentalFreq;
    fundamental.type = 'sine';

    const fundamentalGain = ctx.createGain();
    fundamentalGain.gain.value = volume * 0.6;
    fundamental.connect(fundamentalGain);
    fundamentalGain.connect(masterGain);

    // Add harmonics for richness
    if (includeHarmonics) {
      const harmonics = [2, 3, 5, 8]; // Harmonic series
      harmonics.forEach((harmonic, index) => {
        const harmOsc = ctx.createOscillator();
        harmOsc.frequency.value = fundamentalFreq * harmonic;
        harmOsc.type = 'sine';

        const harmGain = ctx.createGain();
        harmGain.gain.value = volume * (0.3 / (index + 1)); // Decreasing amplitude
        harmOsc.connect(harmGain);
        harmGain.connect(masterGain);

        harmOsc.start(now);
        harmOsc.stop(endTime);
        this.oscillators.push(harmOsc);
        this.gainNodes.push(harmGain);
      });
    }

    // Add subtle vibrato
    const vibrato = ctx.createOscillator();
    vibrato.frequency.value = 5; // 5 Hz vibrato
    const vibratoGain = ctx.createGain();
    vibratoGain.gain.value = 2; // Cents

    vibrato.connect(vibratoGain);
    vibratoGain.connect(fundamental.frequency as unknown as AudioNode);

    // Fade in and out
    fundamentalGain.gain.setValueAtTime(0, now);
    fundamentalGain.gain.linearRampToValueAtTime(volume * 0.6, now + 2);
    fundamentalGain.gain.setValueAtTime(volume * 0.6, endTime - 2);
    fundamentalGain.gain.linearRampToValueAtTime(0, endTime);

    fundamental.start(now);
    vibrato.start(now);
    fundamental.stop(endTime);
    vibrato.stop(endTime);

    this.oscillators.push(fundamental, vibrato);
    this.gainNodes.push(fundamentalGain, vibratoGain);
  }

  /**
   * Add Convolution Reverb (Cave Effect)
   */
  addCaveReverb(dryGain: GainNode, wetAmount: number = 0.3) {
    if (!this.audioContext || !this.masterGain) return;

    const ctx = this.audioContext;
    const masterGain = this.masterGain;

    // Create impulse response for cave-like reverb
    const convolver = ctx.createConvolver();
    const dryNode = ctx.createGain();
    const wetNode = ctx.createGain();

    dryNode.gain.value = 1 - wetAmount;
    wetNode.gain.value = wetAmount;

    dryGain.connect(dryNode);
    dryGain.connect(convolver);
    convolver.connect(wetNode);

    dryNode.connect(masterGain);
    wetNode.connect(masterGain);

    // Generate impulse response (simplified cave reverb)
    const impulseLength = ctx.sampleRate * 2; // 2 seconds
    const impulse = ctx.createBuffer(1, impulseLength, ctx.sampleRate);
    const impulseData = impulse.getChannelData(0);

    // Create decaying noise for cave effect
    for (let i = 0; i < impulseLength; i++) {
      impulseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (impulseLength * 0.3));
    }

    convolver.buffer = impulse;
  }

  /**
   * Set Master Volume
   */
  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Stop All Sound
   */
  stopAll() {
    const now = this.audioContext?.currentTime || 0;
    this.oscillators.forEach(osc => {
      try {
        osc.stop(now);
      } catch (e) {
        // Already stopped
      }
    });
    this.gainNodes.forEach(gain => {
      gain.gain.setValueAtTime(0, now);
    });
    this.oscillators = [];
    this.gainNodes = [];
    this.isPlaying = false;
  }

  /**
   * Resume Audio Context (required for user interaction)
   */
  async resumeContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Get Audio Context State
   */
  getContextState(): string {
    return this.audioContext?.state || 'not-initialized';
  }
}

export default HarmoniaAudioEngine;
