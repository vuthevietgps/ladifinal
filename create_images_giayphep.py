from PIL import Image, ImageDraw, ImageFont
import os

# Create images directory
os.makedirs('giay-phep-kinh-doanh-van-tai/images', exist_ok=True)

# Image 1: Hero image
img1 = Image.new('RGB', (800, 600), color='#dbeafe')
d1 = ImageDraw.Draw(img1)
try:
    font_title = ImageFont.truetype('arial.ttf', 48)
    font_text = ImageFont.truetype('arial.ttf', 32)
except:
    font_title = ImageFont.load_default()
    font_text = ImageFont.load_default()

d1.text((400, 250), 'Giay Phep Van Tai', font=font_title, fill='#1d4ed8', anchor='mm')
d1.text((400, 320), 'Hop Phap - Uy Tin', font=font_text, fill='#1e40af', anchor='mm')
img1.save('giay-phep-kinh-doanh-van-tai/images/giay-phep-hero.jpg', 'JPEG', quality=85)

# Image 2: Các loại giấy phép
img2 = Image.new('RGB', (800, 600), color='#f0f9ff')
d2 = ImageDraw.Draw(img2)
d2.text((400, 250), 'Cac Loai Giay Phep', font=font_title, fill='#1d4ed8', anchor='mm')
d2.text((400, 320), 'Van Tai Hang Hoa', font=font_text, fill='#1e40af', anchor='mm')
d2.text((400, 370), 'Van Tai Hanh Khach', font=font_text, fill='#1e40af', anchor='mm')
img2.save('giay-phep-kinh-doanh-van-tai/images/cac-loai-giay-phep.jpg', 'JPEG', quality=85)

print('Images created successfully!')
