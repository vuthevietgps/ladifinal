from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('giay-phep-kinh-doanh-van-tai/images', exist_ok=True)

# Create a new hero image with vehicle transport theme
img = Image.new('RGB', (1000, 600), color='#ffffff')
d = ImageDraw.Draw(img)

# Gradient effect (manual)
for y in range(600):
    r = int(29 + (222 - 29) * (y / 600))
    g = int(78 + (232 - 78) * (y / 600))
    b = int(216 + (240 - 216) * (y / 600))
    d.line([(0, y), (1000, y)], fill=(r, g, b))

# Try to use system font
try:
    font_title = ImageFont.truetype('arial.ttf', 56)
    font_subtitle = ImageFont.truetype('arial.ttf', 32)
    font_text = ImageFont.truetype('arial.ttf', 24)
except:
    font_title = ImageFont.load_default()
    font_subtitle = ImageFont.load_default()
    font_text = ImageFont.load_default()

# Draw vehicle icon (truck)
d.polygon([(600, 150), (750, 150), (750, 200), (850, 200), (850, 300), (600, 300)], 
          outline='#ffffff', width=3)
d.ellipse([(620, 280), (670, 330)], fill='#ffffff', outline='#ffffff')
d.ellipse([(820, 280), (870, 330)], fill='#ffffff', outline='#ffffff')

# Draw document/license icon
d.rectangle([(650, 80), (800, 200)], fill='#fbbf24', outline='#d97706', width=2)
d.line([(660, 110), (790, 110)], fill='#d97706', width=2)
d.line([(660, 130), (790, 130)], fill='#d97706', width=2)
d.line([(660, 150), (790, 150)], fill='#d97706', width=2)
d.line([(660, 170), (790, 170)], fill='#d97706', width=2)

# Draw checkmark
d.ellipse([(850, 80), (920, 150)], fill='#059669', outline='#059669', width=2)
d.line([(865, 110), (885, 130)], fill='#ffffff', width=4)
d.line([(885, 130), (910, 100)], fill='#ffffff', width=4)

# Add text
d.text((500, 350), 'Doanh Nghiep Van Tai', font=font_title, fill='#1d4ed8', anchor='mm')
d.text((500, 430), 'Hoan tat Thu Tuc Giay Phep', font=font_subtitle, fill='#059669', anchor='mm')
d.text((500, 490), 'Nhanh - Chinh Xac - Uy Tin', font=font_text, fill='#1f2937', anchor='mm')

img.save('giay-phep-kinh-doanh-van-tai/images/hero-vehicle.jpg', 'JPEG', quality=90)
print('Hero image created: hero-vehicle.jpg')
