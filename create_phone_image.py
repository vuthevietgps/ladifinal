from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('ban-dien-thoai/images', exist_ok=True)

# Create iPhone hero image
img = Image.new('RGB', (800, 600), color='#f0f9ff')
d = ImageDraw.Draw(img)

# Gradient background
for y in range(600):
    r = int(240 + (224 - 240) * (y / 600))
    g = int(249 + (242 - 249) * (y / 600))
    b = int(255 + (254 - 255) * (y / 600))
    d.line([(0, y), (800, y)], fill=(r, g, b))

# Draw iPhone frame
d.rectangle([(150, 80), (650, 520)], outline='#000000', width=3)

# Screen
d.rectangle([(160, 100), (640, 500)], fill='#000000', outline='#000000')

# Notch
d.rectangle([(280, 100), (520, 140)], fill='#1f1f1f', outline='#1f1f1f')

# Camera area
d.ellipse([(350, 110), (450, 130)], fill='#333333', outline='#333333')

# Display content
d.text((400, 250), 'iPhone 15 Pro', font=ImageFont.load_default(), fill='#ffffff', anchor='mm')
d.text((400, 290), 'Max', font=ImageFont.load_default(), fill='#00ff00', anchor='mm')

# Home button
d.ellipse([(370, 520), (430, 540)], outline='#333333', width=2)

img.save('ban-dien-thoai/images/iphone-hero.jpg', 'JPEG', quality=90)
print('iPhone hero image created!')
