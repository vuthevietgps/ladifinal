// Smooth scroll cho navigation
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll cho các link anchor
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
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

    // Auto show popup sau 10 giây
    setTimeout(showZaloPopup, 10000);

    // Show popup khi scroll xuống 50%
    let popupShown = false;
    window.addEventListener('scroll', function() {
        if (!popupShown) {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > 50) {
                showZaloPopup();
                popupShown = true;
            }
        }
    });

    // Form submission
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lấy dữ liệu form
            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const phone = form.querySelector('input[type="tel"]').value;
            const vehicleType = form.querySelector('select').value;
            const note = form.querySelector('textarea').value;

            // Tạo message cho Zalo
            const message = `🚗 ĐĂNG KÝ THẺ TẬP HUẤN VẬN TẢI
            
👤 Họ tên: ${name}
📱 SĐT: ${phone}
🚙 Loại xe: ${getVehicleTypeText(vehicleType)}
📝 Ghi chú: ${note || 'Không có'}

💰 Giá ưu đãi: 350K (thay vì 550K)
⏰ Thời gian: Nộp sáng - Nhận chiều`;

            // Chuyển hướng đến Zalo với message
            const zaloUrl = `https://zalo.me/0974584332?message=${encodeURIComponent(message)}`;
            window.open(zaloUrl, '_blank');

            // Reset form
            form.reset();
            
            // Hiển thị thông báo thành công
            showSuccessMessage();
        });
    }

    // Close popup
    const closeBtn = document.querySelector('.close-popup');
    const popup = document.getElementById('zaloPopup');
    
    if (closeBtn && popup) {
        closeBtn.addEventListener('click', function() {
            popup.style.display = 'none';
        });

        // Close popup when click outside
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                popup.style.display = 'none';
            }
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    });

    // Animate sections on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Counter animation for pricing
    animateCounter();

    // Add click tracking
    addClickTracking();
});

// Show Zalo popup
function showZaloPopup() {
    const popup = document.getElementById('zaloPopup');
    if (popup) {
        popup.style.display = 'flex';
        
        // Auto close after 30 seconds
        setTimeout(() => {
            popup.style.display = 'none';
        }, 30000);
    }
}

// Get vehicle type text in Vietnamese
function getVehicleTypeText(value) {
    const types = {
        'xe-may': 'Xe máy (Grab bike, Be om)',
        'xe-tai': 'Xe tải',
        'xe-khach': 'Xe khách', 
        'taxi': 'Taxi',
        'khac': 'Khác'
    };
    return types[value] || 'Chưa chọn';
}

// Show success message
function showSuccessMessage() {
    // Tạo và hiển thị toast message
    const toast = document.createElement('div');
    toast.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 20px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 3000;
            font-weight: bold;
            animation: slideIn 0.3s ease;
        ">
            ✅ Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Counter animation
function animateCounter() {
    const priceElement = document.querySelector('.new-price .amount');
    if (priceElement) {
        let start = 550;
        let end = 350;
        let duration = 2000;
        let startTime = null;

        function animate(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const currentValue = Math.floor(start - (start - end) * progress);
            priceElement.textContent = `${currentValue}.000đ`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        // Start animation when element is visible
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(animate);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(priceElement);
    }
}

// Add click tracking
function addClickTracking() {
    // Track phone clicks
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Phone clicked:', this.href);
            // Add analytics tracking here if needed
        });
    });

    // Track Zalo clicks
    const zaloLinks = document.querySelectorAll('a[href*="zalo.me"]');
    zaloLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Zalo clicked:', this.href);
            // Add analytics tracking here if needed
        });
    });

    // Track button clicks
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Button clicked:', this.textContent);
            // Add analytics tracking here if needed
        });
    });
}

// Utility function to format phone number
function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as Vietnamese phone number
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
    return phone;
}

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .pulse {
        animation: pulse 2s infinite;
    }
`;
document.head.appendChild(style);

// Add pulse animation to important buttons
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const ctaButtons = document.querySelectorAll('.cta-buttons .btn, .float-btn');
        ctaButtons.forEach(btn => {
            btn.classList.add('pulse');
        });
        
        // Remove pulse after 10 seconds
        setTimeout(() => {
            ctaButtons.forEach(btn => {
                btn.classList.remove('pulse');
            });
        }, 10000);
    }, 3000);
});

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Lazy loading for images (if added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}