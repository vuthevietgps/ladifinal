from PIL import Image, ImageDraw, ImageFont
import os

# Create directory
os.makedirs('phu-hieu-xe-landing/images', exist_ok=True)

# Create image
img = Image.new('RGB', (800, 600), color='#1d4ed8')
draw = ImageDraw.Draw(img)

# Try to load font
try:
    font = ImageFont.truetype('arial.ttf', 80)
except:
    font = ImageFont.load_default()

# Draw text
text = 'PHÙ HIỆU XE'
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
x = (800 - text_width) // 2
y = (600 - text_height) // 2
draw.text((x, y), text, fill='white', font=font)

# Save
img.save('phu-hieu-xe-landing/images/phu-hieu-hero.png')
print('✓ Hình ảnh đã tạo!')
