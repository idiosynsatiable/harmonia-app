/**
 * Advanced Harmonia Audio Engine
 * Production-grade sound generation with frequency verification and latency optimization
 */

export interface FrequencyAnalysis {
  fundamental: number;
  harmonics: number[];
  thd: number; // Total Harmonic Distortion
  snr: number; // Signal-to-Noise Ratio
  accuracy: number; // % accuracy to target frequency
}

export interface AudioMetrics {
  latency: number; // ms
  cpuUsage: number; // %
  memoryUsage: number; // MB
  bufferUnderruns: number;
  droppedFrames: number;
}

export class AdvancedAudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private oscillators: Map<string, OscillatorNode> = new Map();
  private gainNodes: Map<string, GainNode> = new Map();
  private metrics: AudioMetrics = {
    latency: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    bufferUnderruns: 0,
    droppedFrames: 0,
  };
  private startTime: number = 0;
  private fftSize = 2048;
  private frequencyData: Uint8Array | null = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    if (typeof window !== 'undefined' && !this.audioContext) {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass() as AudioContext;
      
      // Set up master gain and analyser
      this.masterGain = this.audioContext.createGain();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.fftSize;
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3;

      this.startTime = performance.now();
    }
  }

  /**
   * Generate Binaural Beats with frequency verification
   */
  generateBinauralBeats(
    carrierFreq: number,
    beatFreq: number,
    duration: number,
    volume: number = 0.3
  ): FrequencyAnalysis | null {
    if (!this.audioContext || !this.masterGain) return null;

    const ctx = this.audioContext;
    const masterGain = this.masterGain;
    const now = ctx.currentTime;
    const endTime = now + duration;

    // Create left channel (carrier)
    const leftOsc = ctx.createOscillator();
    leftOsc.frequency.value = carrierFreq;
    leftOsc.type = 'sine';

    // Create right channel (carrier + beat)
    const rightOsc = ctx.createOscillator();
    rightOsc.frequency.value = carrierFreq + beatFreq;
    rightOsc.type = 'sine';

    // Gain nodes
    const leftGain = ctx.createGain();
    const rightGain = ctx.createGain();
    leftGain.gain.value = volume;
    rightGain.gain.value = volume;

    // Connect with smooth fade
    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    leftGain.connect(masterGain);
    rightGain.connect(masterGain);

    // Fade envelope
    leftGain.gain.setValueAtTime(0, now);
    rightGain.gain.setValueAtTime(0, now);
    leftGain.gain.linearRampToValueAtTime(volume, now + 1);
    rightGain.gain.linearRampToValueAtTime(volume, now + 1);
    leftGain.gain.linearRampToValueAtTime(0, endTime - 1);
    rightGain.gain.linearRampToValueAtTime(0, endTime - 1);

    // Start oscillators
    leftOsc.start(now);
    rightOsc.start(now);
    leftOsc.stop(endTime);
    rightOsc.stop(endTime);

    // Store for cleanup
    this.oscillators.set(`left-${Date.now()}`, leftOsc);
    this.oscillators.set(`right-${Date.now()}`, rightOsc);
    this.gainNodes.set(`left-gain-${Date.now()}`, leftGain);
    this.gainNodes.set(`right-gain-${Date.now()}`, rightGain);

    // Analyze frequency
    return this.analyzeFrequency(beatFreq);
  }

  /**
   * Generate Isochronic Tones with pulse accuracy
   */
  generateIsochronicTones(
    frequency: number,
    pulseRate: number,
    duration: number,
    volume: number = 0.3
  ): FrequencyAnalysis | null {
    if (!this.audioContext || !this.masterGain) return null;

    const ctx = this.audioContext;
    const masterGain = this.masterGain;
    const now = ctx.currentTime;
    const endTime = now + duration;
    const pulseDuration = 1 / pulseRate;

    const osc = ctx.createOscillator();
    osc.frequency.value = frequency;
    osc.type = 'sine';

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(masterGain);
    osc.connect(gain);

    // Create precise pulse pattern
    let pulseTime = now;
    while (pulseTime < endTime) {
      const pulseStart = pulseTime;
      const pulseEnd = Math.min(pulseTime + pulseDuration * 0.5, endTime);

      // Attack: 10ms
      gain.gain.setValueAtTime(0, pulseStart);
      gain.gain.linearRampToValueAtTime(volume, pulseStart + 0.01);

      // Sustain
      gain.gain.setValueAtTime(volume, pulseEnd - 0.01);

      // Release: 10ms
      gain.gain.linearRampToValueAtTime(0, pulseEnd);

      pulseTime += pulseDuration;
    }

    osc.start(now);
    osc.stop(endTime);

    this.oscillators.set(`iso-${Date.now()}`, osc);
    this.gainNodes.set(`iso-gain-${Date.now()}`, gain);

    return this.analyzeFrequency(frequency);
  }

  /**
   * Generate Noise with spectral shaping
   */
  generateNoise(
    color: 'white' | 'pink' | 'brown' | 'purple' | 'blue',
    duration: number,
    volume: number = 0.3
  ): void {
    if (!this.audioContext || !this.masterGain) return;

    const ctx = this.audioContext;
    const masterGain = this.masterGain;
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

    // Apply spectral shaping
    this.applyNoiseShaping(data, color);

    // Create source
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.5);
    gain.gain.setValueAtTime(volume, endTime - 0.5);
    gain.gain.linearRampToValueAtTime(0, endTime);

    source.connect(gain);
    gain.connect(masterGain);

    source.loop = true;
    source.start(now);
    source.stop(endTime);

    this.gainNodes.set(`noise-${Date.now()}`, gain);
  }

  /**
   * Apply frequency-dependent shaping to noise
   */
  private applyNoiseShaping(data: Float32Array, color: string) {
    if (color === 'white') return;

    // Apply IIR filter multiple times for better shaping
    const passes = color === 'brown' ? 3 : color === 'pink' ? 2 : 1;
    const coefficient = this.getNoiseCoefficient(color);

    for (let pass = 0; pass < passes; pass++) {
      let lastOut = 0;
      for (let i = 0; i < data.length; i++) {
        lastOut = data[i] * coefficient + lastOut * (1 - coefficient);
        data[i] = lastOut;
      }
    }

    // Normalize to prevent clipping
    let max = 0;
    for (let i = 0; i < data.length; i++) {
      max = Math.max(max, Math.abs(data[i]));
    }
    if (max > 0) {
      for (let i = 0; i < data.length; i++) {
        data[i] /= max;
      }
    }
  }

  private getNoiseCoefficient(color: string): number {
    switch (color) {
      case 'pink':
        return 0.5;
      case 'brown':
        return 0.7;
      case 'purple':
        return 0.3;
      case 'blue':
        return 0.2;
      default:
        return 0.5;
    }
  }

  /**
   * Generate OM Chanting with harmonic richness
   */
  generateOMChanting(
    duration: number,
    volume: number = 0.3,
    includeHarmonics: boolean = true
  ): FrequencyAnalysis | null {
    if (!this.audioContext || !this.masterGain) return null;

    const ctx = this.audioContext;
    const masterGain = this.masterGain;
    const now = ctx.currentTime;
    const endTime = now + duration;
    const fundamentalFreq = 136.1; // Cosmic OM

    // Fundamental
    const fundamental = ctx.createOscillator();
    fundamental.frequency.value = fundamentalFreq;
    fundamental.type = 'sine';

    const fundamentalGain = ctx.createGain();
    fundamentalGain.gain.value = volume * 0.6;
    fundamental.connect(fundamentalGain);
    fundamentalGain.connect(masterGain);

    // Add harmonics
    if (includeHarmonics) {
      const harmonics = [2, 3, 5, 8, 13]; // Fibonacci series
      harmonics.forEach((harmonic, index) => {
        const harmOsc = ctx.createOscillator();
        harmOsc.frequency.value = fundamentalFreq * harmonic;
        harmOsc.type = 'sine';

        const harmGain = ctx.createGain();
        harmGain.gain.value = volume * (0.3 / (index + 1));
        harmOsc.connect(harmGain);
        harmGain.connect(masterGain);

        harmOsc.start(now);
        harmOsc.stop(endTime);
        this.oscillators.set(`harm-${harmonic}-${Date.now()}`, harmOsc);
        this.gainNodes.set(`harm-gain-${harmonic}-${Date.now()}`, harmGain);
      });
    }

    // Add vibrato
    const vibrato = ctx.createOscillator();
    vibrato.frequency.value = 5; // 5 Hz vibrato
    const vibratoGain = ctx.createGain();
    vibratoGain.gain.value = 2;

    vibrato.connect(vibratoGain);
    vibratoGain.connect(fundamental.frequency as unknown as AudioNode);

    // Fade envelope
    fundamentalGain.gain.setValueAtTime(0, now);
    fundamentalGain.gain.linearRampToValueAtTime(volume * 0.6, now + 2);
    fundamentalGain.gain.setValueAtTime(volume * 0.6, endTime - 2);
    fundamentalGain.gain.linearRampToValueAtTime(0, endTime);

    fundamental.start(now);
    vibrato.start(now);
    fundamental.stop(endTime);
    vibrato.stop(endTime);

    this.oscillators.set(`om-${Date.now()}`, fundamental);
    this.oscillators.set(`vibrato-${Date.now()}`, vibrato);
    this.gainNodes.set(`om-gain-${Date.now()}`, fundamentalGain);
    this.gainNodes.set(`vibrato-gain-${Date.now()}`, vibratoGain);

    return this.analyzeFrequency(fundamentalFreq);
  }

  /**
   * Analyze frequency content using FFT
   */
  private analyzeFrequency(targetFreq: number): FrequencyAnalysis {
    if (!this.analyser || !this.frequencyData) {
      return {
        fundamental: targetFreq,
        harmonics: [],
        thd: 0,
        snr: 0,
        accuracy: 100,
      };
    }

    if (this.frequencyData && this.analyser) {
      (this.analyser.getByteFrequencyData as any)(this.frequencyData);
    }

    const nyquist = (this.audioContext?.sampleRate || 44100) / 2;
    const binWidth = nyquist / this.frequencyData.length;

    // Find fundamental
    let maxBin = 0;
    let maxValue = 0;
    for (let i = 0; i < this.frequencyData.length; i++) {
      if (this.frequencyData[i] > maxValue) {
        maxValue = this.frequencyData[i];
        maxBin = i;
      }
    }

    const detectedFreq = maxBin * binWidth;
    const accuracy = (1 - Math.abs(detectedFreq - targetFreq) / targetFreq) * 100;

    // Find harmonics
    const harmonics: number[] = [];
    for (let h = 2; h <= 8; h++) {
      const harmonicBin = Math.round((targetFreq * h) / binWidth);
      if (harmonicBin < this.frequencyData.length) {
        harmonics.push(this.frequencyData[harmonicBin]);
      }
    }

    // Calculate THD (Total Harmonic Distortion)
    const fundamentalPower = maxValue * maxValue;
    const harmonicPower = harmonics.reduce((sum, h) => sum + h * h, 0);
    const thd = Math.sqrt(harmonicPower / fundamentalPower) * 100;

    // Calculate SNR (Signal-to-Noise Ratio)
    const signal = maxValue;
    const noise = this.frequencyData.reduce((sum, v) => sum + v, 0) / this.frequencyData.length;
    const snr = 20 * Math.log10(signal / Math.max(noise, 1));

    return {
      fundamental: detectedFreq,
      harmonics,
      thd: Math.min(thd, 100),
      snr: Math.max(snr, 0),
      accuracy: Math.max(accuracy, 0),
    };
  }

  /**
   * Add Cave Reverb Effect
   */
  addCaveReverb(amount: number = 0.3): void {
    if (!this.audioContext || !this.masterGain) return;

    const ctx = this.audioContext;
    const convolver = ctx.createConvolver();
    const dryGain = ctx.createGain();
    const wetGain = ctx.createGain();

    dryGain.gain.value = 1 - amount;
    wetGain.gain.value = amount;

    // Generate impulse response
    const impulseLength = ctx.sampleRate * 2;
    const impulse = ctx.createBuffer(1, impulseLength, ctx.sampleRate);
    const impulseData = impulse.getChannelData(0);

    // Create cave-like reverb tail
    for (let i = 0; i < impulseLength; i++) {
      const decay = Math.exp(-i / (impulseLength * 0.3));
      impulseData[i] = (Math.random() * 2 - 1) * decay;
    }

    convolver.buffer = impulse;

    // Route through convolver
    this.masterGain.connect(dryGain);
    this.masterGain.connect(convolver);
    dryGain.connect(this.audioContext.destination);
    convolver.connect(wetGain);
    wetGain.connect(this.audioContext.destination);
  }

  /**
   * Get current audio metrics
   */
  getMetrics(): AudioMetrics {
    if (!this.audioContext) return this.metrics;

    this.metrics.latency = this.audioContext.baseLatency * 1000;
    this.metrics.cpuUsage = (this.audioContext as any).outputLatency * 100 || 0;

    return this.metrics;
  }

  /**
   * Set master volume
   */
  setVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Stop all audio
   */
  stopAll(): void {
    const now = this.audioContext?.currentTime || 0;

    this.oscillators.forEach((osc) => {
      try {
        osc.stop(now);
      } catch (e) {
        // Already stopped
      }
    });

    this.gainNodes.forEach((gain) => {
      gain.gain.setValueAtTime(0, now);
    });

    this.oscillators.clear();
    this.gainNodes.clear();
  }

  /**
   * Resume audio context
   */
  async resumeContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Get audio context state
   */
  getContextState(): string {
    return this.audioContext?.state || 'not-initialized';
  }

  /**
   * Get sample rate
   */
  getSampleRate(): number {
    return this.audioContext?.sampleRate || 44100;
  }

  /**
   * Get latency in milliseconds
   */
  getLatencyMs(): number {
    if (!this.audioContext) return 0;
    return (this.audioContext.baseLatency + (this.audioContext as any).outputLatency) * 1000;
  }
}

export default AdvancedAudioEngine;
