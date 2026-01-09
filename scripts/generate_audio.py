#!/usr/bin/env python3
"""
Harmonia Audio Generator
Generates 21 professional audio tracks:
- 7 Binaural Beats (2Hz, 3Hz, 4Hz, 6Hz, 8Hz, 10Hz, 14Hz)
- 7 Isochronic Tones (4Hz, 6Hz, 8Hz, 10Hz, 12Hz, 16Hz, 20Hz)
- 7 Ambient/Harmonic Sounds
"""

import numpy as np
import os
from scipy.io import wavfile
from scipy import signal

# Audio parameters
SAMPLE_RATE = 44100  # Hz
DURATION = 300  # 5 minutes per track (300 seconds)
FADE_DURATION = 10  # 10 seconds fade in/out

def apply_fade(audio, sample_rate, fade_duration):
    """Apply fade-in and fade-out to audio"""
    fade_samples = int(sample_rate * fade_duration)
    fade_in = np.linspace(0, 1, fade_samples)
    fade_out = np.linspace(1, 0, fade_samples)
    
    audio[:fade_samples] *= fade_in
    audio[-fade_samples:] *= fade_out
    return audio

def generate_pink_noise(duration, sample_rate, amplitude=0.1):
    """Generate pink noise (1/f noise)"""
    samples = int(duration * sample_rate)
    white = np.random.randn(samples)
    
    # Apply 1/f filter using FFT
    fft = np.fft.rfft(white)
    freqs = np.fft.rfftfreq(samples, 1/sample_rate)
    freqs[0] = 1  # Avoid division by zero
    pink_filter = 1 / np.sqrt(freqs)
    fft *= pink_filter
    pink = np.fft.irfft(fft, n=samples)
    
    # Normalize
    pink = pink / np.max(np.abs(pink)) * amplitude
    return pink

def generate_binaural_beat(frequency, carrier=220, duration=DURATION, sample_rate=SAMPLE_RATE):
    """
    Generate binaural beat
    - Left ear: carrier frequency
    - Right ear: carrier + beat frequency
    - Add pink noise at -25dB for fatigue reduction
    """
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    # Generate carrier tones
    left = np.sin(2 * np.pi * carrier * t)
    right = np.sin(2 * np.pi * (carrier + frequency) * t)
    
    # Add pink noise at -25dB (amplitude ~0.056)
    pink = generate_pink_noise(duration, sample_rate, amplitude=0.056)
    left += pink
    right += pink
    
    # Normalize
    left = left / np.max(np.abs(left)) * 0.8
    right = right / np.max(np.abs(right)) * 0.8
    
    # Apply fade
    left = apply_fade(left, sample_rate, FADE_DURATION)
    right = apply_fade(right, sample_rate, FADE_DURATION)
    
    # Combine to stereo
    stereo = np.column_stack((left, right))
    return stereo

def generate_isochronic_tone(frequency, base_tone=180, duration=DURATION, sample_rate=SAMPLE_RATE):
    """
    Generate isochronic tone
    - Square-wave amplitude modulation
    - 50% duty cycle
    - Smoothed envelope to avoid harsh clicks
    """
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    # Base carrier tone
    carrier = np.sin(2 * np.pi * base_tone * t)
    
    # Generate square wave for amplitude modulation
    modulation = signal.square(2 * np.pi * frequency * t, duty=0.5)
    
    # Smooth the modulation to avoid clicks (low-pass filter)
    b, a = signal.butter(4, frequency * 2, btype='low', fs=sample_rate)
    modulation_smooth = signal.filtfilt(b, a, modulation)
    
    # Normalize modulation to 0-1 range
    modulation_smooth = (modulation_smooth + 1) / 2
    
    # Apply modulation
    audio = carrier * modulation_smooth
    
    # Normalize
    audio = audio / np.max(np.abs(audio)) * 0.8
    
    # Apply fade
    audio = apply_fade(audio, sample_rate, FADE_DURATION)
    
    # Convert to stereo (mono-compatible)
    stereo = np.column_stack((audio, audio))
    return stereo

def generate_brown_noise(duration=DURATION, sample_rate=SAMPLE_RATE):
    """Generate brown noise (red noise, 1/f^2)"""
    samples = int(duration * sample_rate)
    white = np.random.randn(samples)
    
    # Apply 1/f^2 filter
    fft = np.fft.rfft(white)
    freqs = np.fft.rfftfreq(samples, 1/sample_rate)
    freqs[0] = 1
    brown_filter = 1 / freqs
    fft *= brown_filter
    brown = np.fft.irfft(fft, n=samples)
    
    # Normalize
    brown = brown / np.max(np.abs(brown)) * 0.8
    brown = apply_fade(brown, sample_rate, FADE_DURATION)
    
    stereo = np.column_stack((brown, brown))
    return stereo

def generate_ocean_noise(duration=DURATION, sample_rate=SAMPLE_RATE):
    """Generate ocean-style filtered noise"""
    samples = int(duration * sample_rate)
    white = np.random.randn(samples)
    
    # Low-pass filter for ocean-like sound (0.5-2 Hz modulation)
    b, a = signal.butter(4, [0.5, 2], btype='band', fs=sample_rate)
    modulation = signal.filtfilt(b, a, np.random.randn(samples))
    modulation = (modulation / np.max(np.abs(modulation)) * 0.3) + 0.7
    
    # Apply brown noise characteristics
    fft = np.fft.rfft(white)
    freqs = np.fft.rfftfreq(samples, 1/sample_rate)
    freqs[0] = 1
    ocean_filter = 1 / (freqs ** 0.8)  # Between pink and brown
    fft *= ocean_filter
    ocean = np.fft.irfft(fft, n=samples)
    
    # Apply modulation
    ocean = ocean * modulation
    
    # Normalize
    ocean = ocean / np.max(np.abs(ocean)) * 0.8
    ocean = apply_fade(ocean, sample_rate, FADE_DURATION)
    
    stereo = np.column_stack((ocean, ocean))
    return stereo

def generate_rain_noise(duration=DURATION, sample_rate=SAMPLE_RATE):
    """Generate rain-style filtered noise"""
    samples = int(duration * sample_rate)
    white = np.random.randn(samples)
    
    # High-pass filter for rain-like sound
    b, a = signal.butter(4, 2000, btype='high', fs=sample_rate)
    rain = signal.filtfilt(b, a, white)
    
    # Add some low-frequency rumble
    b2, a2 = signal.butter(2, 200, btype='low', fs=sample_rate)
    rumble = signal.filtfilt(b2, a2, np.random.randn(samples)) * 0.3
    
    rain = rain + rumble
    
    # Normalize
    rain = rain / np.max(np.abs(rain)) * 0.8
    rain = apply_fade(rain, sample_rate, FADE_DURATION)
    
    stereo = np.column_stack((rain, rain))
    return stereo

def generate_wind_noise(duration=DURATION, sample_rate=SAMPLE_RATE):
    """Generate wind-style filtered noise"""
    samples = int(duration * sample_rate)
    white = np.random.randn(samples)
    
    # Band-pass filter for wind-like sound (200-2000 Hz)
    b, a = signal.butter(4, [200, 2000], btype='band', fs=sample_rate)
    wind = signal.filtfilt(b, a, white)
    
    # Add slow modulation (gusts)
    t = np.linspace(0, duration, samples)
    modulation = 0.5 + 0.5 * np.sin(2 * np.pi * 0.1 * t)  # 0.1 Hz modulation
    wind = wind * modulation
    
    # Normalize
    wind = wind / np.max(np.abs(wind)) * 0.8
    wind = apply_fade(wind, sample_rate, FADE_DURATION)
    
    stereo = np.column_stack((wind, wind))
    return stereo

def generate_om_drone(duration=DURATION, sample_rate=SAMPLE_RATE):
    """Generate Om-style harmonic drone (136.1 Hz)"""
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    # Fundamental frequency (136.1 Hz - "Om" frequency)
    fundamental = 136.1
    
    # Generate harmonics
    audio = np.sin(2 * np.pi * fundamental * t)  # Fundamental
    audio += 0.5 * np.sin(2 * np.pi * fundamental * 2 * t)  # 2nd harmonic
    audio += 0.3 * np.sin(2 * np.pi * fundamental * 3 * t)  # 3rd harmonic
    audio += 0.2 * np.sin(2 * np.pi * fundamental * 4 * t)  # 4th harmonic
    audio += 0.1 * np.sin(2 * np.pi * fundamental * 5 * t)  # 5th harmonic
    
    # Normalize
    audio = audio / np.max(np.abs(audio)) * 0.8
    audio = apply_fade(audio, sample_rate, FADE_DURATION)
    
    stereo = np.column_stack((audio, audio))
    return stereo

def generate_low_harmonic_pad(duration=DURATION, sample_rate=SAMPLE_RATE):
    """Generate low harmonic pad (multiple frequencies)"""
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    # Multiple low frequencies for rich pad sound
    frequencies = [65.4, 98.0, 130.8, 196.0]  # C2, G2, C3, G3
    audio = np.zeros(len(t))
    
    for i, freq in enumerate(frequencies):
        amplitude = 1.0 / (i + 1)  # Decreasing amplitude
        audio += amplitude * np.sin(2 * np.pi * freq * t)
    
    # Normalize
    audio = audio / np.max(np.abs(audio)) * 0.8
    audio = apply_fade(audio, sample_rate, FADE_DURATION)
    
    stereo = np.column_stack((audio, audio))
    return stereo

def save_audio(audio, filename, sample_rate=SAMPLE_RATE):
    """Save audio to WAV file"""
    # Convert to 16-bit PCM
    audio_int = np.int16(audio * 32767)
    wavfile.write(filename, sample_rate, audio_int)
    print(f"Generated: {filename}")

def main():
    """Generate all 21 audio tracks"""
    output_dir = "../assets/audio"
    os.makedirs(output_dir, exist_ok=True)
    
    print("Generating 21 Harmonia audio tracks...")
    print("=" * 50)
    
    # 1. Binaural Beats (7 tracks)
    print("\n1. Generating Binaural Beats...")
    binaural_freqs = [
        (2, "delta-2hz"),
        (3, "delta-3hz"),
        (4, "theta-4hz"),
        (6, "theta-6hz"),
        (8, "alpha-8hz"),
        (10, "alpha-10hz"),
        (14, "beta-14hz"),
    ]
    
    for freq, name in binaural_freqs:
        audio = generate_binaural_beat(freq)
        save_audio(audio, f"{output_dir}/{name}-binaural.wav", SAMPLE_RATE)
    
    # 2. Isochronic Tones (7 tracks)
    print("\n2. Generating Isochronic Tones...")
    isochronic_freqs = [4, 6, 8, 10, 12, 16, 20]
    
    for freq in isochronic_freqs:
        audio = generate_isochronic_tone(freq)
        save_audio(audio, f"{output_dir}/{freq}hz-isochronic.wav", SAMPLE_RATE)
    
    # 3. Ambient/Harmonic Sounds (7 tracks)
    print("\n3. Generating Ambient/Harmonic Sounds...")
    
    # Om drone
    audio = generate_om_drone()
    save_audio(audio, f"{output_dir}/om-drone.wav", SAMPLE_RATE)
    
    # Low harmonic pad
    audio = generate_low_harmonic_pad()
    save_audio(audio, f"{output_dir}/low-harmonic-pad.wav", SAMPLE_RATE)
    
    # Brown noise
    audio = generate_brown_noise()
    save_audio(audio, f"{output_dir}/brown-noise.wav", SAMPLE_RATE)
    
    # Pink noise
    pink = generate_pink_noise(DURATION, SAMPLE_RATE, amplitude=0.8)
    pink = apply_fade(pink, SAMPLE_RATE, FADE_DURATION)
    stereo = np.column_stack((pink, pink))
    save_audio(stereo, f"{output_dir}/pink-noise.wav", SAMPLE_RATE)
    
    # Ocean noise
    audio = generate_ocean_noise()
    save_audio(audio, f"{output_dir}/ocean-waves.wav", SAMPLE_RATE)
    
    # Rain noise
    audio = generate_rain_noise()
    save_audio(audio, f"{output_dir}/rain.wav", SAMPLE_RATE)
    
    # Wind noise
    audio = generate_wind_noise()
    save_audio(audio, f"{output_dir}/wind.wav", SAMPLE_RATE)
    
    print("\n" + "=" * 50)
    print("✅ All 21 audio tracks generated successfully!")
    print(f"Output directory: {output_dir}")
    print("\nNext step: Convert WAV to MP3 for mobile app")

if __name__ == "__main__":
    main()
