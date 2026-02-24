from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('giay-phep-kinh-doanh-van-tai/images', exist_ok=True)

# Create vehicle types image
img = Image.new('RGB', (800, 600), color='#f0f9ff')
d = ImageDraw.Draw(img)

# Gradient background
for y in range(600):
    r = int(240 + (219 - 240) * (y / 600))
    g = int(249 + (234 - 249) * (y / 600))
    b = int(255 + (254 - 255) * (y / 600))
    d.line([(0, y), (800, y)], fill=(r, g, b))

try:
    font_title = ImageFont.truetype('arial.ttf', 36)
    font_text = ImageFont.truetype('arial.ttf', 20)
except:
    font_title = ImageFont.load_default()
    font_text = ImageFont.load_default()

# Draw title
d.text((400, 40), 'Cac Loai Phuong Tien Van Tai', font=font_title, fill='#1d4ed8', anchor='mm')

# Draw vehicle icons and labels
vehicles = [
    (150, 150, 'Xe Tai Van Chuyen Hang', '🚚'),
    (650, 150, 'Xe Hop Dong', '🚐'),
    (150, 320, 'Xe Taxi', '🚕'),
    (650, 320, 'Xe Container', '📦'),
    (400, 490, 'Xe Du Lich Kinh Doanh', '🚌')
]

for x, y, label, icon in vehicles:
    # Draw background circle
    d.ellipse([(x-60, y-60), (x+60, y+60)], fill='#ffffff', outline='#1d4ed8', width=3)
    
    # Draw icon (simplified representation)
    if icon == '🚚':
        d.rectangle([(x-30, y-15), (x+30, y+15)], fill='#1d4ed8', outline='#1d4ed8')
        d.ellipse([(x-20, y+10), (x-5, y+25)], fill='#000000')
        d.ellipse([(x+5, y+10), (x+20, y+25)], fill='#000000')
    elif icon == '🚐':
        d.rectangle([(x-25, y-20), (x+25, y+20)], fill='#1d4ed8', outline='#1d4ed8')
        d.rectangle([(x-20, y-15), (x+20, y-5)], fill='#87ceeb')
    elif icon == '🚕':
        d.rectangle([(x-30, y-12), (x+30, y+12)], fill='#fbbf24', outline='#fbbf24')
        d.ellipse([(x-20, y+7), (x-7, y+20)], fill='#000000')
        d.ellipse([(x+7, y+7), (x+20, y+20)], fill='#000000')
    elif icon == '📦':
        d.rectangle([(x-25, y-25), (x+25, y+25)], fill='#d97706', outline='#b45309', width=2)
        d.line([(x-25, y), (x+25, y)], fill='#b45309', width=2)
        d.line([(x, y-25), (x, y+25)], fill='#b45309', width=2)
    elif icon == '🚌':
        d.rectangle([(x-35, y-20), (x+35, y+20)], fill='#059669', outline='#059669')
        for i in range(-20, 21, 10):
            d.rectangle([(x+i-3, y-15), (x+i+3, y-5)], fill='#87ceeb')

    # Draw label
    d.text((x, y+75), label, font=font_text, fill='#1f2937', anchor='mm')

img.save('giay-phep-kinh-doanh-van-tai/images/vehicle-types.jpg', 'JPEG', quality=90)
print('Vehicle types image created!')
