from PIL import Image
import numpy as np

# Composite on dark #122129 background to check quality
bg_color = (18, 33, 41)
cutout = Image.open('public/images/products/420145-optima-coa-cutout.png')
w, h = cutout.size

test_canvas = Image.new('RGB', (w + 100, h + 100), bg_color)
test_canvas.paste(cutout, (50, 50), cutout)
test_canvas.save('scripts/test_optima_cutout_preview.png')
print("Saved preview to scripts/test_optima_cutout_preview.png")

# Check edge pixels alpha distribution
alpha = np.array(cutout)[:, :, 3]
print("Total transparent pixels:", np.sum(alpha == 0))
print("Total opaque pixels:", np.sum(alpha == 255))
print("Total semi-transparent border pixels:", np.sum((alpha > 0) & (alpha < 255)))
