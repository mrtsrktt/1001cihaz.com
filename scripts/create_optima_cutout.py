import cv2
import numpy as np
from PIL import Image

# Check img1 vs img2
im1 = Image.open('public/images/products/420145-optima-coa-1.jpg')
im2 = Image.open('public/images/products/420145-optima-coa-2.jpg')

print("im1 size:", im1.size)
print("im2 size:", im2.size)

# Let's create a transparent PNG cutout for img1 (OPTIMA COA Analyzer Device)
# Since the background is pure studio white (255, 255, 255), let's floodfill from the edges
arr = np.array(im1)
h, w, _ = arr.shape

# OpenCV floodfill mask needs to be h+2, w+2
gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
# Background is nearly white (e.g. > 248)
# Let's floodfill from (0,0) and corners with tolerance
mask = np.zeros((h + 2, w + 2), np.uint8)
# Floodfill from four corners
corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w//2, 0), (w//2, h-1), (0, h//2), (w-1, h//2)]
filled = arr.copy()
bg_mask = np.zeros((h, w), dtype=np.uint8)

for cx, cy in corners:
    if gray[cy, cx] > 240:
        cv2.floodFill(gray, mask, (cx, cy), 0, loDiff=5, upDiff=5, flags=4 | (255 << 8) | cv2.FLOODFILL_MASK_ONLY)

# mask has 255 where floodfilled background is
bg = (mask[1:h+1, 1:w+1] == 255)

# Alpha channel: 0 where bg is true, 255 elsewhere
alpha = np.ones((h, w), dtype=np.uint8) * 255
alpha[bg] = 0

# Feather edge slightly to remove white halo
# Smooth alpha with 1px gaussian blur or distance transform on the border
alpha_float = alpha.astype(np.float32) / 255.0
alpha_blurred = cv2.GaussianBlur(alpha_float, (3, 3), 0.5)

# Defringe / decontaminate edges where alpha is between 0 and 1
rgba = np.dstack([arr, (alpha_blurred * 255).astype(np.uint8)])
out_img = Image.fromarray(rgba)
out_img.save('public/images/products/420145-optima-coa-cutout.png')
print("Saved 420145-optima-coa-cutout.png successfully, size:", out_img.size)

# Also let's do the same for img2 to see if img2 is the set
gray2 = cv2.cvtColor(np.array(im2), cv2.COLOR_RGB2GRAY)
h2, w2 = gray2.shape
mask2 = np.zeros((h2 + 2, w2 + 2), np.uint8)
corners2 = [(0, 0), (w2 - 1, 0), (0, h2 - 1), (w2 - 1, h2 - 1), (w2//2, 0), (w2//2, h2-1), (0, h2//2), (w2-1, h2//2)]
for cx, cy in corners2:
    if gray2[cy, cx] > 240:
        cv2.floodFill(gray2, mask2, (cx, cy), 0, loDiff=5, upDiff=5, flags=4 | (255 << 8) | cv2.FLOODFILL_MASK_ONLY)
bg2 = (mask2[1:h2+1, 1:w2+1] == 255)
alpha2 = np.ones((h2, w2), dtype=np.uint8) * 255
alpha2[bg2] = 0
alpha2_blurred = cv2.GaussianBlur(alpha2.astype(np.float32) / 255.0, (3, 3), 0.5)
rgba2 = np.dstack([np.array(im2), (alpha2_blurred * 255).astype(np.uint8)])
out_img2 = Image.fromarray(rgba2)
out_img2.save('public/images/products/420145-optima-coa-set-cutout.png')
print("Saved 420145-optima-coa-set-cutout.png successfully, size:", out_img2.size)
