import os
import numpy as np
from pydub import AudioSegment
import sys

def analyze_audio(file_path):
    print(f"Analyzing {file_path}...")
    try:
        audio = AudioSegment.from_file(file_path)
        samples = np.array(audio.get_array_of_samples())
        
        # Check for silence/breaks (values near zero for more than 50ms)
        sample_rate = audio.frame_rate
        min_silence_len = int(sample_rate * 0.05) # 50ms
        
        # Simple threshold for silence
        threshold = 10 
        is_silent = np.abs(samples) < threshold
        
        breaks = []
        count = 0
        for i, silent in enumerate(is_silent):
            if silent:
                count += 1
            else:
                if count > min_silence_len:
                    breaks.append((i - count, i))
                count = 0
        
        # Check for feedback/clipping (values at max)
        max_val = 2**(audio.sample_width * 8 - 1) - 1
        clipping = np.sum(np.abs(samples) >= max_val - 100)
        
        print(f"  - Duration: {len(audio)/1000:.2f}s")
        print(f"  - Breaks found: {len(breaks)}")
        print(f"  - Clipping samples: {clipping}")
        
        if len(breaks) > 0:
            for start, end in breaks[:5]:
                print(f"    - Break at {start/sample_rate:.2f}s to {end/sample_rate:.2f}s")
                
    except Exception as e:
        print(f"  - Error: {e}")

if __name__ == "__main__":
    audio_dir = "assets/audio"
    if not os.path.exists(audio_dir):
        print(f"Directory {audio_dir} not found")
        sys.exit(1)
        
    for file in os.listdir(audio_dir):
        if file.endswith(".mp3"):
            analyze_audio(os.path.join(audio_dir, file))
