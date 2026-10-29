import os
import shutil
from PIL import Image

src_dir = 'output/hero-assets-v1'
dst_dir = 'public/images/hero'

os.makedirs(dst_dir, exist_ok=True)

files = [
    'hero-deltasmart.png',
    'hero-optima.png',
    'hero-400gd.png',
    'hero-dm9600.png'
]

print("Processing hero background assets...")

for f in files:
    src_path = os.path.join(src_dir, f)
    dst_png = os.path.join(dst_dir, f)
    
    # Copy PNG
    shutil.copy2(src_path, dst_png)
    png_size = os.path.getsize(dst_png)
    
    # Create optimized WebP
    base_name = os.path.splitext(f)[0]
    dst_webp = os.path.join(dst_dir, f"{base_name}.webp")
    
    im = Image.open(src_path)
    # Save as WebP with quality 85 and method 6 for high quality & optimization
    im.save(dst_webp, 'WEBP', quality=85, method=6)
    webp_size = os.path.getsize(dst_webp)
    
    print(f"[{base_name}] {im.size}:")
    print(f"  -> PNG:  {png_size / 1024:.1f} KB ({dst_png})")
    print(f"  -> WebP: {webp_size / 1024:.1f} KB ({dst_webp}) [savings: {(1 - webp_size/png_size)*100:.1f}%]")

print("\nHero backgrounds copied and WebP generated successfully!")
