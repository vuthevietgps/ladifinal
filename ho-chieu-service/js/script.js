// Smooth scrolling for navigation links
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

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Form submission
document.getElementById('consultationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const phone = this.querySelector('input[type="tel"]').value;
    const service = this.querySelector('select').value;
    const note = this.querySelector('textarea').value;
    
    // Validate required fields
    if (!name || !phone || !service) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    // Phone validation (Vietnamese format)
    const phoneRegex = /^(0|\+84)[1-9]\d{8,9}$/;
    if (!phoneRegex.test(phone)) {
        alert('Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại Việt Nam.');
        return;
    }
    
    // Create WhatsApp message
    const serviceNames = {
        'thuong': 'Hộ chiếu thường (5-7 ngày)',
        'gap': 'Hộ chiếu gấp (2-3 ngày)',
        'sieutoc': 'Hộ chiếu siêu tốc (trong ngày)'
    };
    
    const message = `Xin chào! Tôi muốn đăng ký tư vấn dịch vụ làm hộ chiếu:
📞 Họ tên: ${name}
📱 Số điện thoại: ${phone}
🎯 Dịch vụ: ${serviceNames[service]}
📝 Ghi chú: ${note || 'Không có'}

Vui lòng liên hệ tư vấn chi tiết. Cảm ơn!`;
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/84363614511?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    this.reset();
    
    // Show success message
    showNotification('Đã gửi yêu cầu tư vấn! Chúng tôi sẽ liên hệ với bạn sớm nhất.', 'success');
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#059669' : '#2563eb'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add slide-in animation
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
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add click tracking for service cards
document.querySelectorAll('.btn-service').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const serviceCard = this.closest('.service-card');
        const serviceName = serviceCard.querySelector('h3').textContent;
        
        // Create phone call with service context
        const message = `Xin chào! Tôi quan tâm đến dịch vụ "${serviceName}". Vui lòng tư vấn chi tiết cho tôi.`;
        
        // For mobile devices, try to open phone app with context
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            window.location.href = 'tel:0363614511';
        } else {
            // For desktop, show WhatsApp option
            const whatsappUrl = `https://wa.me/84363614511?text=${encodeURIComponent(message)}`;
            const choice = confirm(`Liên hệ qua:\n- OK: WhatsApp\n- Hủy: Gọi điện trực tiếp`);
            if (choice) {
                window.open(whatsappUrl, '_blank');
            } else {
                window.location.href = 'tel:0363614511';
            }
        }
    });
});

// Add hover effect for service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        if (this.classList.contains('featured')) {
            this.style.transform = 'scale(1.05)';
        } else {
            this.style.transform = 'translateY(0)';
        }
    });
});

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .step, .feature-card');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animation styles
document.querySelectorAll('.service-card, .step, .feature-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Run animation on scroll
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Add mobile menu toggle (if needed)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Add mobile styles for navigation
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 1rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .nav-menu.active {
            display: flex;
        }
        
        .mobile-menu-toggle {
            display: block;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
        }
    }
    
    .mobile-menu-toggle {
        display: none;
    }
`;
document.head.appendChild(style);

// Price animation on scroll
function animatePrices() {
    const priceElements = document.querySelectorAll('.price-amount');
    
    priceElements.forEach(element => {
        const finalPrice = parseInt(element.textContent.replace(/\./g, ''));
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100 && !element.dataset.animated) {
            element.dataset.animated = 'true';
            
            let currentPrice = 0;
            const increment = finalPrice / 50;
            const timer = setInterval(() => {
                currentPrice += increment;
                if (currentPrice >= finalPrice) {
                    currentPrice = finalPrice;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(currentPrice).toLocaleString('vi-VN');
            }, 30);
        }
    });
}

window.addEventListener('scroll', animatePrices);
window.addEventListener('load', animatePrices);

// Add loading spinner for form submission
function showLoadingSpinner() {
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}