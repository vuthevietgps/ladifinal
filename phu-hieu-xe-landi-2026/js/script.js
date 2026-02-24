// Form submission handler
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        fullname: document.getElementById('fullname').value,
        phone: document.getElementById('phone').value,
        vehicleType: document.getElementById('vehicleType').value,
        licensePlate: document.getElementById('licensePlate').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toLocaleString('vi-VN')
    };
    
    // Log form data (in production, send to backend)
    console.log('Form Data:', formData);
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    this.reset();
    
    // Redirect to Zalo after 2 seconds
    setTimeout(() => {
        window.open('https://zalo.me/0363614511', '_blank');
    }, 2000);
});

function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
            color: white;
            padding: 30px 50px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            animation: slideIn 0.3s ease;
        ">
            <div style="font-size: 40px; margin-bottom: 15px;">✅</div>
            <div>Cảm ơn bạn!</div>
            <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">Chúng tôi sẽ liên hệ sớm nhất</div>
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

function scrollToForm() {
    const formSection = document.getElementById('formSection');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Floating button hover effects
const floatingButtons = document.querySelectorAll('.float-btn');
floatingButtons.forEach((btn, index) => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(-12px) scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0) scale(1)';
    });
});

// Intersection Observer for animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideIn 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    observer.observe(section);
});

// Add number formatting for phone input
document.getElementById('phone')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    e.target.value = value;
});

// Track user interactions for analytics (optional)
window.addEventListener('load', () => {
    console.log('Landing page loaded');
});

// Add click tracking for CTA buttons
document.querySelectorAll('.cta-btn, .cta-btn-large').forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('CTA button clicked');
    });
});
