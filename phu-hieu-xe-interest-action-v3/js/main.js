// Smooth scrolling for anchor links
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

// Form submission handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const vehicleType = formData.get('vehicle_type');
        const message = formData.get('message') || '';
        
        // Create Zalo message
        const zaloMessage = `Đăng ký tư vấn phù hiệu xe\n\nHọ tên: ${name}\nSố điện thoại: ${phone}\nLoại xe: ${vehicleType}\nGhi chú: ${message}`;
        
        // Redirect to Zalo with message
        const zaloUrl = `https://zalo.me/0363614511?text=${encodeURIComponent(zaloMessage)}`;
        
        // Show success message
        alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ với bạn ngay.');
        
        // Open Zalo in new tab
        window.open(zaloUrl, '_blank');
        
        // Reset form
        this.reset();
    });
}

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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    // Add initial styles for animation
    const animatedElements = document.querySelectorAll('.risk-card, .solution-card, .challenge-item, .step-card, .why-card, .target-card, .benefit-card');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Fixed contact buttons animation
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach((btn, index) => {
        btn.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Track clicks on contact buttons
    contactButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Add ripple effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Add phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove non-numeric characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Limit to 10 digits
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            
            e.target.value = value;
        });
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Show/hide scroll to top button
let scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '⬆️';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 120px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF6B00 0%, #FF8533 100%);
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    transform: scale(0);
    transition: all 0.3s ease;
    z-index: 9998;
    box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.transform = 'scale(1)';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.transform = 'scale(0)';
    }
});

scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Add hover sound effect (optional - can be enabled)
function playHoverSound() {
    // You can add a subtle click sound here if needed
    // const audio = new Audio('/sounds/hover.mp3');
    // audio.volume = 0.2;
    // audio.play();
}

// Track button clicks for analytics (if needed)
function trackEvent(eventName, eventData) {
    // Add your analytics tracking code here
    console.log('Event:', eventName, eventData);
    
    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, eventData);
    // }
}

// Add click tracking to CTA buttons
document.querySelectorAll('.btn, .contact-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const btnText = this.textContent.trim();
        const btnHref = this.getAttribute('href');
        trackEvent('button_click', {
            button_text: btnText,
            button_link: btnHref
        });
    });
});

// Mobile menu toggle (if needed for future expansion)
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Add viewport height fix for mobile
function setVHProperty() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVHProperty();
window.addEventListener('resize', setVHProperty);

// Lazy load images (if any heavy images are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add print styles event
window.addEventListener('beforeprint', function() {
    // Hide fixed contact buttons when printing
    const contactButtons = document.querySelector('.fixed-contact-buttons');
    if (contactButtons) {
        contactButtons.style.display = 'none';
    }
});

window.addEventListener('afterprint', function() {
    // Show fixed contact buttons after printing
    const contactButtons = document.querySelector('.fixed-contact-buttons');
    if (contactButtons) {
        contactButtons.style.display = 'flex';
    }
});

// Console message
console.log('%c🚛 Phù Hiệu Xe Pro', 'font-size: 24px; font-weight: bold; color: #FF6B00;');
console.log('%cHotline: 0363 614 511', 'font-size: 16px; color: #00C853;');
console.log('%cWebsite loaded successfully!', 'font-size: 14px; color: #0068FF;');
