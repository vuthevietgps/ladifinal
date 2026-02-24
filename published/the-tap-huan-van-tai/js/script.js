// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[type="text"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const type = this.querySelector('select').value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !phone || !type) {
            alert('Vui lòng điền đầy đủ thông tin (Tên, Số điện thoại, Loại khách hàng)');
            return;
        }
        
        // Create WhatsApp message
        const whatsappMessage = `Xin chào, tôi tên ${name}, số điện thoại: ${phone}. Tôi là ${getTypeName(type)}. Tôi muốn đăng ký thẻ tập huấn vận tải.${message ? ' ' + message : ''}`;
        const whatsappURL = `https://wa.me/84372555555?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Reset form
        this.reset();
    });
}

function getTypeName(type) {
    const types = {
        'driver': 'lái xe kinh doanh',
        'owner': 'chủ xe / hộ kinh doanh',
        'company': 'doanh nghiệp vận tải',
        'other': 'khách hàng khác'
    };
    return types[type] || 'khách hàng';
}

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 5px 25px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 2px 15px rgba(0,0,0,0.08)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.problem-card, .benefit-item, .audience-card, .timeline-step, .commitment-card').forEach(el => {
    observer.observe(el);
});

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Mobile menu toggle (if needed)
const navMenu = document.querySelector('.nav-menu');
if (navMenu && window.innerWidth < 768) {
    document.addEventListener('DOMContentLoaded', function() {
        // Mobile menu functionality can be added here if needed
    });
}

// Analytics event tracking
function trackEvent(eventName, eventValue) {
    if (window.gtag) {
        gtag('event', eventName, {
            'value': eventValue
        });
    }
}

// Track CTA clicks
document.querySelectorAll('.btn-primary, .btn-call').forEach(btn => {
    btn.addEventListener('click', function() {
        trackEvent('cta_click', this.textContent);
    });
});
