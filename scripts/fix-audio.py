import os
import numpy as np
from pydub import AudioSegment
import sys

def fix_audio(file_path, output_path):
    print(f"Fixing {file_path}...")
    try:
        audio = AudioSegment.from_file(file_path)
        
        # Detect silence
        min_silence_len = 50 # ms
        silence_thresh = -60 # dBFS
        
        # Simple way to remove silence and crossfade
        # We'll split by silence and join with crossfades
        from pydub.silence import split_on_silence
        
        chunks = split_on_silence(
            audio, 
            min_silence_len=min_silence_len,
            silence_thresh=silence_thresh,
            keep_silence=10 # keep a tiny bit
        )
        
        if len(chunks) <= 1:
            print(f"  - No significant breaks found to fix via splitting.")
            # If it's just a start/end silence, trim it
            fixed = audio.strip_silence(silence_thresh=silence_thresh)
            fixed.export(output_path, format="mp3")
            return

        print(f"  - Found {len(chunks)} chunks. Joining with crossfades...")
        
        fixed = chunks[0]
        for chunk in chunks[1:]:
            # Use a crossfade that is at most 1/3 of the chunk length
            cf = min(100, len(chunk) // 3, len(fixed) // 3)
            if cf > 0:
                fixed = fixed.append(chunk, crossfade=cf)
            else:
                fixed = fixed.append(chunk, crossfade=0)
            
        fixed.export(output_path, format="mp3")
        print(f"  - Fixed audio saved to {output_path}")
                
    except Exception as e:
        print(f"  - Error: {e}")

if __name__ == "__main__":
    audio_dir = "assets/audio"
    files_to_fix = ["brown-noise.mp3", "wind.mp3"]
    
    for file_name in files_to_fix:
        input_path = os.path.join(audio_dir, file_name)
        if os.path.exists(input_path):
            fix_audio(input_path, input_path) # Overwrite with fixed version
        else:
            print(f"File {input_path} not found")
