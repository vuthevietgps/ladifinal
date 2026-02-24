// Form submission
document.getElementById('quickCheckForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const vehicleChecks = Array.from(document.querySelectorAll('input[name="vehicle"]:checked')).map(el => el.value);
    const area = document.getElementById('area').value.trim();
    
    if (!name || !phone) {
        alert('Vui lòng điền tên và số điện thoại');
        return;
    }
    
    if (!validatePhone(phone)) {
        alert('Vui lòng nhập số điện thoại hợp lệ');
        return;
    }
    
    // Format data for Zalo message
    const message = `Yêu cầu kiểm tra xe:\n\nTên: ${name}\nSĐT: ${phone}\nLoại xe: ${vehicleChecks.length > 0 ? vehicleChecks.join(', ') : 'Chưa chọn'}\nKhu vực: ${area || 'Không nhập'}`;
    
    // Send to Zalo
    const zaloPhone = '0363614511';
    const encoded = encodeURIComponent(message);
    window.open(`https://zalo.me/${zaloPhone}/?text=${encoded}`, '_blank');
    
    // Reset form
    this.reset();
    alert('Cảm ơn! Tin nhắn sẽ được gửi tới Zalo của chúng tôi.');
});

// Phone validation
function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Smooth scroll enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }
    });
});

// Add animation on scroll
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

document.querySelectorAll('.consequence-card, .solution-item, .testimonial-card, .commitment-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// Mobile menu enhancement
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.body.style.overflow = 'auto';
    }
});

// Track form interactions
document.getElementById('quickCheckForm').addEventListener('input', function() {
    // Form input tracking (optional analytics)
    console.log('Form modified');
});
