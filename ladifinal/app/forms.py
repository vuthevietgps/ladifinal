from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, PasswordField, BooleanField, SubmitField, SelectField, TextAreaField
from wtforms.validators import DataRequired, Length, ValidationError, Optional, Regexp

class LoginForm(FlaskForm):
    username = StringField('Tên đăng nhập', validators=[
        DataRequired(message='Vui lòng nhập tên đăng nhập'),
        Length(min=3, max=20, message='Tên đăng nhập phải từ 3-20 ký tự')
    ])
    password = PasswordField('Mật khẩu', validators=[
        DataRequired(message='Vui lòng nhập mật khẩu'),
        Length(min=6, message='Mật khẩu phải có ít nhất 6 ký tự')
    ])
    remember_me = BooleanField('Ghi nhớ đăng nhập')
    submit = SubmitField('Đăng nhập')

class ChangePasswordForm(FlaskForm):
    current_password = PasswordField('Mật khẩu hiện tại', validators=[
        DataRequired(message='Vui lòng nhập mật khẩu hiện tại')
    ])
    new_password = PasswordField('Mật khẩu mới', validators=[
        DataRequired(message='Vui lòng nhập mật khẩu mới'),
        Length(min=6, message='Mật khẩu mới phải có ít nhất 6 ký tự')
    ])
    confirm_password = PasswordField('Xác nhận mật khẩu', validators=[
        DataRequired(message='Vui lòng xác nhận mật khẩu mới')
    ])
    submit = SubmitField('Đổi mật khẩu')

    def validate_confirm_password(self, field):
        if field.data != self.new_password.data:
            raise ValidationError('Mật khẩu xác nhận không khớp')

class LandingPageForm(FlaskForm):
    """Form for creating/editing landing pages with both single file and folder upload options"""
    subdomain = StringField('Subdomain', validators=[
        DataRequired(message='Vui lòng nhập subdomain'),
        Length(min=3, max=50, message='Subdomain phải từ 3-50 ký tự')
    ])
    agent = StringField('Agent', validators=[Optional()])
    
    # Upload type selection
    upload_type = SelectField('Loại upload', choices=[
        ('single', 'File đơn (index.html + ảnh)'),
        ('folder', 'Folder hoàn chỉnh (.zip)')
    ], default='single', validators=[DataRequired()])
    
    # Single file upload
    html_file = FileField('File HTML', validators=[
        FileAllowed(['html', 'htm'], 'Chỉ chấp nhận file HTML')
    ])
    images = FileField('Ảnh (tối đa 7 file)', render_kw={'multiple': True})
    
    # Folder upload
    folder_zip = FileField('Folder (.zip)', validators=[
        FileAllowed(['zip'], 'Chỉ chấp nhận file ZIP')
    ])
    
    # Tracking fields
    global_site_tag = TextAreaField('Global Site Tag (Legacy)', validators=[Optional()])
    ga_tracking_id = StringField('Google Analytics 4 ID', validators=[
                                    Optional(),
                                    Regexp(r'^G-[A-Za-z0-9]+$', message='GA4 ID phải có định dạng G-XXXXXXXXXX')
                                 ], render_kw={"placeholder": "G-XXXXXXXXXX"})
    fb_pixel_id = StringField('Facebook Pixel ID', validators=[
                                 Optional(),
                                 Regexp(r'^\d{10,20}$', message='Facebook Pixel ID phải là chuỗi số (10-20 chữ số)')
                              ], render_kw={"placeholder": "1234567890123456"})
    tiktok_pixel_id = StringField('TikTok Pixel ID', validators=[
                                     Optional(),
                                     Regexp(r'^[A-Za-z0-9]+$', message='TikTok Pixel ID không hợp lệ')
                                  ], render_kw={"placeholder": "XXXXXXXXXXXXXXXXXX"})
    phone_tracking = TextAreaField('Phone Tracking', validators=[Optional()])
    zalo_tracking = TextAreaField('Zalo/Messenger Tracking', validators=[Optional()])
    form_tracking = TextAreaField('Form Tracking', validators=[Optional()])
    
    # Contact info
    hotline_phone = StringField('Hotline Phone', validators=[Optional()])
    zalo_phone = StringField('Zalo Phone', validators=[Optional()])
    google_form_link = StringField('Google Form Link', validators=[Optional()])
    
    submit = SubmitField('Tạo Landing Page')
    
    def validate(self, extra_validators=None):
        rv = FlaskForm.validate(self, extra_validators)
        if not rv:
            return False
            
        # Custom validation based on upload_type
        if self.upload_type.data == 'single':
            if not self.html_file.data:
                self.html_file.errors.append('Vui lòng chọn file HTML')
                return False
        elif self.upload_type.data == 'folder':
            if not self.folder_zip.data:
                self.folder_zip.errors.append('Vui lòng chọn file ZIP chứa folder')
                return False
                
        return True