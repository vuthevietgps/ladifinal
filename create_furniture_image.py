from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('ban-do-noi-that/images', exist_ok=True)

# Create furniture hero image
img = Image.new('RGB', (900, 700), color='#eff6ff')
d = ImageDraw.Draw(img)

# Gradient background
for y in range(700):
    r = int(239 + (219 - 239) * (y / 700))
    g = int(246 + (234 - 246) * (y / 700))
    b = int(255 + (254 - 255) * (y / 700))
    d.line([(0, y), (900, y)], fill=(r, g, b))

try:
    font_title = ImageFont.truetype('arial.ttf', 56)
    font_text = ImageFont.truetype('arial.ttf', 24)
except:
    font_title = ImageFont.load_default()
    font_text = ImageFont.load_default()

# Draw living room scene
# Sofa
d.rectangle([(150, 350), (450, 500)], fill='#2563eb', outline='#1d4ed8', width=3)
d.rectangle([(160, 360), (200, 420)], fill='#1d4ed8')
d.rectangle([(240, 360), (280, 420)], fill='#1d4ed8')
d.rectangle([(320, 360), (360, 420)], fill='#1d4ed8')
d.rectangle([(400, 360), (440, 420)], fill='#1d4ed8')

# Coffee table
d.rectangle([(500, 420), (700, 470)], fill='#92400e', outline='#78350f', width=2)
d.line([(510, 470), (510, 490)], fill='#78350f', width=4)
d.line([(690, 470), (690, 490)], fill='#78350f', width=4)

# TV stand
d.rectangle([(150, 200), (450, 280)], fill='#374151', outline='#1f2937', width=2)
d.rectangle([(170, 220), (230, 260)], fill='#1f2937')
d.rectangle([(250, 220), (310, 260)], fill='#1f2937')
d.rectangle([(330, 220), (390, 260)], fill='#1f2937')

# TV screen
d.rectangle([(500, 150), (750, 350)], fill='#000000', outline='#1f2937', width=4)
d.rectangle([(520, 170), (730, 330)], fill='#1e40af')

# Lamp
d.ellipse([(720, 380), (800, 420)], fill='#fbbf24', outline='#f59e0b', width=2)
d.line([(760, 420), (760, 500)], fill='#78350f', width=3)
d.ellipse([(750, 495), (770, 510)], fill='#78350f')

# Add text
d.text((450, 80), 'HomeStyle Furniture', font=font_title, fill='#2563eb', anchor='mm')
d.text((450, 580), 'Noi That Hien Dai - Sang Trong - Tien Nghi', font=font_text, fill='#1f2937', anchor='mm')
d.text((450, 650), 'Mien Phi Van Chuyen - Bao Hanh 2 Nam', font=font_text, fill='#f59e0b', anchor='mm')

img.save('ban-do-noi-that/images/furniture-hero.jpg', 'JPEG', quality=90)
print('Furniture hero image created!')
