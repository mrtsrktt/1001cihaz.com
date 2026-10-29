import os
import glob
from PIL import Image

ARTIFACT_DIR = r'C:\Users\murat\.gemini\antigravity\brain\e771f600-92d1-4d9e-b3b6-8d887f9a2384'
frames_dir = os.path.join(ARTIFACT_DIR, 'recording_frames')

frame_files = sorted(glob.glob(os.path.join(frames_dir, '*.png')))
print(f"Compiling {len(frame_files)} frames into animated recording...")

if not frame_files:
    print("No frames found!")
    exit(0)

images = []
for f in frame_files:
    im = Image.open(f)
    # Resize slightly to 960x453 for compact, high-fps smooth recording preview
    im_resized = im.resize((960, int(im.height * 960 / im.width)), Image.Resampling.LANCZOS)
    images.append(im_resized)

# Save as animated WebP
out_webp = os.path.join(ARTIFACT_DIR, 'hero-slider-interaction.webp')
images[0].save(
    out_webp,
    'WEBP',
    save_all=True,
    append_images=images[1:],
    duration=[400, 300, 300, 300, 150, 150, 200, 700, 150, 150, 200, 700, 250, 900],
    loop=0,
    quality=85
)
print(f"Saved animated recording: {out_webp} ({os.path.getsize(out_webp)/1024:.1f} KB)")

# Also save as animated GIF for universal markdown viewer support
out_gif = os.path.join(ARTIFACT_DIR, 'hero-slider-interaction.gif')
images[0].save(
    out_gif,
    'GIF',
    save_all=True,
    append_images=images[1:],
    duration=[400, 300, 300, 300, 150, 150, 200, 700, 150, 150, 200, 700, 250, 900],
    loop=0,
    optimize=True
)
print(f"Saved animated GIF: {out_gif} ({os.path.getsize(out_gif)/1024:.1f} KB)")
