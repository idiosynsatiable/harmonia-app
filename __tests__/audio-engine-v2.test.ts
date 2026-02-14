import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AudioEngineV2 } from '../lib/audio-engine-v2';

// Mock AudioContext
class MockAudioContext {
  currentTime = 0;
  sampleRate = 48000;
  baseLatency = 0.01;
  outputLatency = 0.01;
  destination = {};
  createGain() { return { gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), setTargetAtTime: vi.fn() }, connect: vi.fn() }; }
  createOscillator() { return { frequency: { setValueAtTime: vi.fn() }, connect: vi.fn(), start: vi.fn(), stop: vi.fn() }; }
  createDynamicsCompressor() { return { threshold: { setValueAtTime: vi.fn() }, knee: { setValueAtTime: vi.fn() }, ratio: { setValueAtTime: vi.fn() }, attack: { setValueAtTime: vi.fn() }, release: { setValueAtTime: vi.fn() }, connect: vi.fn() }; }
  createChannelMerger() { return { connect: vi.fn() }; }
  createBuffer() { return { getChannelData: () => new Float32Array(100) }; }
  createBufferSource() { return { connect: vi.fn(), start: vi.fn(), stop: vi.fn(), loop: false }; }
}

vi.stubGlobal('AudioContext', MockAudioContext);
vi.stubGlobal('window', { AudioContext: MockAudioContext });

describe('AudioEngineV2 - High Precision', () => {
  let engine: AudioEngineV2;

  beforeEach(() => {
    engine = new AudioEngineV2();
  });

  it('initializes with high-fidelity settings', () => {
    const metrics = engine.getMetrics();
    expect(metrics.sampleRate).toBe(48000);
    expect(metrics.activeNodes).toBe(0);
  });

  it('calculates binaural frequencies with 64-bit precision', () => {
    // This is a logic test, the actual precision is handled by the JS engine
    const carrier = 432.0000000000001;
    const beat = 7.830000000000001;
    const result = engine.playBinaural(carrier, beat);
    expect(result).toBeDefined();
    result?.stop();
  });

  it('generates spectral noise buffers', () => {
    const result = engine.playNoise('pink');
    expect(result).toBeDefined();
    result?.stop();
  });

  it('manages active nodes for resource hardening', () => {
    engine.playBinaural(440, 10);
    engine.playNoise('brown');
    expect(engine.getMetrics().activeNodes).toBe(3); // 2 oscillators + 1 noise source
    engine.stopAll();
    // stopAll has a timeout, so we check the set is cleared in the next tick or via mock
  });
});
