from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('ban-vay-han-quoc/images', exist_ok=True)

# Create elegant dress hero image
img = Image.new('RGB', (900, 700), color='#ffffff')
d = ImageDraw.Draw(img)

# Gradient background
for y in range(700):
    r = int(255 + (245 - 255) * (y / 700))
    g = int(245 + (225 - 245) * (y / 700))
    b = int(247 + (220 - 247) * (y / 700))
    d.line([(0, y), (900, y)], fill=(r, g, b))

# Draw elegant dress silhouette
# Dress body
d.polygon([(300, 150), (600, 150), (620, 400), (280, 400)], 
          fill='#FFB6C1', outline='#E91E63', width=2)

# Neckline
d.ellipse([(420, 140), (480, 170)], outline='#E91E63', width=2)

# Sleeves
d.polygon([(280, 170), (300, 150), (280, 250)], fill='#FFB6C1', outline='#E91E63', width=2)
d.polygon([(620, 170), (600, 150), (620, 250)], fill='#FFB6C1', outline='#E91E63', width=2)

# Dress details
d.line([(450, 160), (450, 380)], fill='#E91E63', width=1)
d.line([(420, 250), (480, 250)], fill='#E91E63', width=2)

# Legs
d.line([(400, 400), (350, 600)], fill='#E91E63', width=4)
d.line([(500, 400), (550, 600)], fill='#E91E63', width=4)

# Shoes
d.ellipse([(340, 595), (360, 620)], fill='#E91E63', outline='#E91E63', width=2)
d.ellipse([(540, 595), (560, 620)], fill='#E91E63', outline='#E91E63', width=2)

# Add text
try:
    font_title = ImageFont.truetype('arial.ttf', 64)
    font_text = ImageFont.truetype('arial.ttf', 28)
except:
    font_title = ImageFont.load_default()
    font_text = ImageFont.load_default()

d.text((450, 50), 'K-Fashion Dress', font=font_title, fill='#E91E63', anchor='mm')
d.text((450, 680), 'Style Han Quoc - Nhan tay va Thanh Lich', font=font_text, fill='#9C27B0', anchor='mm')

img.save('ban-vay-han-quoc/images/dress-hero.jpg', 'JPEG', quality=90)
print('Dress hero image created!')
