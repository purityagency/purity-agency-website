import os
from PIL import Image, ImageDraw, ImageFont

source_path = r"C:\Users\User\.gemini\antigravity-ide\brain\da732822-9699-4cfe-b326-e0a4a93f47cd\media__1786426197692.jpg"
target_dir = r"C:\Users\User\Desktop\Purity ONE\purity-agency-site\assets"

os.makedirs(target_dir, exist_ok=True)

# Load Octomask source image
img = Image.open(source_path).convert("RGBA")
width, height = img.size

# Square crop around center (Octomask)
min_dim = min(width, height)
left = (width - min_dim) // 2
top = (height - min_dim) // 2
right = left + min_dim
bottom = top + min_dim
square_img = img.crop((left, top, right, bottom))

# Remove the near-black background (source photo is shot on black) via
# flood fill from the corners, so exported icons/logos are transparent
# instead of carrying an opaque black square (bug found 2026-08-16: SERP
# favicon and GBP photo tiles rendered as solid black blobs).
ImageDraw.floodfill(square_img, (0, 0), (0, 0, 0, 0), thresh=45)
ImageDraw.floodfill(square_img, (square_img.width - 1, 0), (0, 0, 0, 0), thresh=45)
ImageDraw.floodfill(square_img, (0, square_img.height - 1), (0, 0, 0, 0), thresh=45)
ImageDraw.floodfill(square_img, (square_img.width - 1, square_img.height - 1), (0, 0, 0, 0), thresh=45)

# 1. High-res logo.png (512x512)
logo_512 = square_img.resize((512, 512), Image.Resampling.LANCZOS)
logo_512.save(os.path.join(target_dir, "logo.png"), "PNG")
logo_512.save(os.path.join(target_dir, "logo.webp"), "WEBP")
logo_512.save(os.path.join(target_dir, "octomask-logo.png"), "PNG")

# 2. Apple touch icon (180x180)
apple_icon = square_img.resize((180, 180), Image.Resampling.LANCZOS)
apple_icon.save(os.path.join(target_dir, "apple-touch-icon.png"), "PNG")

# 3. Favicon PNG (192x192) & ICO (48x48)
fav_192 = square_img.resize((192, 192), Image.Resampling.LANCZOS)
fav_192.save(os.path.join(target_dir, "favicon.png"), "PNG")

logo_512.save(os.path.join(target_dir, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (192, 192)])

# 4. OpenGraph share banner og-image.jpg (1200x630)
og_bg = Image.new("RGB", (1200, 630), color=(6, 3, 9)) # #060309 dark background

# Place Octomask mascot on right side of OG banner
mascot_size = 520
mascot_resized = square_img.resize((mascot_size, mascot_size), Image.Resampling.LANCZOS)
og_bg.paste(mascot_resized, (640, 55), mascot_resized)

# Draw text on left side of OG banner
draw = ImageDraw.Draw(og_bg)

try:
    font_title = ImageFont.truetype("arial.ttf", 52)
    font_sub = ImageFont.truetype("arial.ttf", 26)
    font_tag = ImageFont.truetype("arial.ttf", 22)
except Exception:
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_tag = ImageFont.load_default()

# Purple accent bar
draw.rectangle([(80, 120), (140, 126)], fill=(124, 58, 237))

draw.text((80, 150), "PURITY AGENCY", fill=(124, 58, 237), font=font_tag)
draw.text((80, 200), "L'Agence Web & IA\nqui ne dort jamais.", fill=(255, 255, 255), font=font_title)
draw.text((80, 360), "Sites Web · SEO Local · Agents IA Sur-Mesure\nCharleroi · Namur · Liège · Mons · Bruxelles", fill=(180, 180, 190), font=font_sub)

draw.rectangle([(80, 480), (320, 530)], fill=(124, 58, 237))
draw.text((110, 492), "purity-agency.be", fill=(255, 255, 255), font=font_tag)

og_bg.save(os.path.join(target_dir, "og-image.jpg"), "JPEG", quality=92)

print("✅ Octomask logo and social preview assets generated successfully!")
