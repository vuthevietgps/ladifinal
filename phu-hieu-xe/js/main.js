document.addEventListener('DOMContentLoaded', function() {
    // Sử dụng tracking variables từ hệ thống
    if (window.PHONE_TRACKING) {
        // Cập nhật tất cả link gọi điện
        document.querySelectorAll('.phone-link').forEach(el => {
            el.href = 'tel:' + window.PHONE_TRACKING;
            // Cập nhật text hiển thị nếu cần
            const phoneText = el.querySelector('span');
            if (phoneText) {
                phoneText.textContent = window.PHONE_TRACKING;
            }
        });
    }
    
    if (window.ZALO_TRACKING) {
        // Tích hợp Zalo
        document.querySelectorAll('.zalo-link').forEach(el => {
            el.href = 'https://zalo.me/' + window.ZALO_TRACKING;
        });
    }

    // Smooth scrolling cho anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Thu thập dữ liệu form
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                product: formData.get('product'),
                note: formData.get('note') || '',
                timestamp: new Date().toISOString(),
                page: 'Phù Hiệu Xe Landing Page'
            };

            // Validation cơ bản
            if (!data.name || !data.phone || !data.address || !data.product) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
                return;
            }

            // Validate số điện thoại Việt Nam
            const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
            if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
                alert('Số điện thoại không hợp lệ!');
                return;
            }

            // Hiển thị loading
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
            submitBtn.disabled = true;

            // Gửi data (có thể tích hợp với API)
            console.log('Order Data:', data);
            
            // Simulate API call
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Hiển thị thông báo thành công
                alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn trong ít phút.');
                
                // Có thể redirect đến trang thank you
                // window.location.href = '/thank-you';
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Gửi event cho Google Analytics (nếu có)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'conversion', {
                        'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                        'value': 299000,
                        'currency': 'VND'
                    });
                }

                // Track với Facebook Pixel (nếu có)
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        value: 299000,
                        currency: 'VND',
                        content_name: data.product
                    });
                }
            }, 2000);
        });
    }

    // Countdown timer (optional - tạo cảm giác gấp gáp)
    function startCountdown() {
        const countdownElement = document.querySelector('.highlight');
        if (countdownElement) {
            let count = parseInt(countdownElement.textContent);
            if (count > 5) {
                setInterval(() => {
                    if (count > 5) {
                        count -= Math.floor(Math.random() * 2) + 1;
                        countdownElement.textContent = count;
                    }
                }, 30000); // Giảm mỗi 30 giây
            }
        }
    }
    startCountdown();

    // Scroll animations
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function handleScrollAnimations() {
        const animatedElements = document.querySelectorAll('.feature-item, .product-item, .testimonial-item');
        
        animatedElements.forEach(el => {
            if (isElementInViewport(el) && !el.classList.contains('animated')) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    el.classList.add('animated');
                }, 100);
            }
        });
    }

    // Initial load animations
    setTimeout(handleScrollAnimations, 500);
    
    // Scroll event listener
    window.addEventListener('scroll', handleScrollAnimations);

    // Product hover effects
    document.querySelectorAll('.product-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Floating buttons animation
    const floatingButtons = document.querySelector('.floating-buttons');
    if (floatingButtons) {
        let isVisible = false;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled > 500 && !isVisible) {
                floatingButtons.style.opacity = '1';
                floatingButtons.style.transform = 'translateY(0)';
                isVisible = true;
            } else if (scrolled <= 500 && isVisible) {
                floatingButtons.style.opacity = '0';
                floatingButtons.style.transform = 'translateY(100px)';
                isVisible = false;
            }
        });
        
        // Initialize
        floatingButtons.style.opacity = '0';
        floatingButtons.style.transform = 'translateY(100px)';
        floatingButtons.style.transition = 'all 0.3s ease';
    }

    // Click tracking
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a, button');
        if (target) {
            const action = target.textContent.trim();
            const href = target.href || target.getAttribute('href');
            
            // Track clicks với Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Button',
                    'event_label': action,
                    'value': href
                });
            }
            
            console.log('Clicked:', action, href);
        }
    });

    // Phone number formatting
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.startsWith('84')) {
                value = '0' + value.substring(2);
            }
            
            // Format: 0xxx.xxx.xxx
            if (value.length > 0) {
                if (value.length <= 4) {
                    value = value;
                } else if (value.length <= 7) {
                    value = value.substring(0, 4) + '.' + value.substring(4);
                } else {
                    value = value.substring(0, 4) + '.' + value.substring(4, 7) + '.' + value.substring(7, 10);
                }
            }
            
            this.value = value;
        });
    });

    // Lazy loading cho images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Performance tracking
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
            
            // Track load time với Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    'name': 'load',
                    'value': loadTime
                });
            }
        }
    });
});

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    return re.test(phone.replace(/\s/g, ''));
}

// Export functions for external use
window.LandingPageUtils = {
    formatCurrency,
    validateEmail,
    validatePhone
};