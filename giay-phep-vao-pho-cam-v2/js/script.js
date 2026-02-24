// Form submission handler
document.getElementById('checkForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const area = document.getElementById('area').value.trim();
    const vehicleChecks = Array.from(document.querySelectorAll('input[name="vehicle"]:checked'))
        .map(el => el.value.replace('xe-', '').replace('-', ' '));
    
    // Validation
    if (!name || !phone) {
        alert('Vui lòng điền đầy đủ Tên và Số điện thoại');
        return;
    }
    
    if (!validatePhone(phone)) {
        alert('Vui lòng nhập số điện thoại hợp lệ (10-11 số)');
        return;
    }
    
    // Build message for Zalo
    const vehicleText = vehicleChecks.length > 0 ? vehicleChecks.join(', ') : 'Chưa chọn';
    const areaText = area || 'Chưa nhập';
    
    const message = `📋 KIỂM TRA VÀO PHỐ CẤM\n\n` +
                    `👤 Tên: ${name}\n` +
                    `📱 SĐT: ${phone}\n` +
                    `🚗 Loại xe: ${vehicleText}\n` +
                    `📍 Khu vực: ${areaText}`;
    
    // Send to Zalo
    const zaloPhone = '0363614511';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://zalo.me/${zaloPhone}?text=${encodedMessage}`, '_blank');
    
    // Reset form
    this.reset();
    
    // Success notification
    setTimeout(() => {
        alert('✅ Thông tin đã được gửi! Chúng tôi sẽ liên hệ tư vấn miễn phí cho bạn sớm nhất.');
    }, 300);
});

// Phone validation function
function validatePhone(phone) {
    const cleaned = phone.replace(/[\s\-\+\(\)]/g, '');
    return /^[0-9]{10,11}$/.test(cleaned);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const fadeInObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to cards
const animatedElements = document.querySelectorAll(
    '.problem-item, .truth-card, .solution-item, .testimonial-card, .commitment-item'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// Track button clicks (optional analytics)
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function() {
        console.log('CTA button clicked:', this.textContent.trim());
    });
});

// Floating buttons hover effect enhancement
const floatingBtns = document.querySelectorAll('.float-btn');
floatingBtns.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    btn.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
});

// Form input tracking for UX
const formInputs = document.querySelectorAll('#checkForm input');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.01)';
        this.parentElement.style.transition = 'transform 0.2s ease';
    });
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});
