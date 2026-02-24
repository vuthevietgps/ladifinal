// Floating buttons animation
document.addEventListener('DOMContentLoaded', function() {
    const floatingButtons = document.querySelectorAll('.float-btn');
    floatingButtons.forEach((btn, index) => {
        btn.style.animationDelay = (index * 0.2) + 's';
    });

    // Form submission
    const form = document.getElementById('consultation-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value;
            const phone = document.getElementById('phone').value;
            const vehicleType = document.getElementById('vehicle-type').value;
            
            // Prepare message
            const message = `Tôi muốn tư vấn thẻ RFID\n\nHọ & Tên: ${fullname}\nSố Điện Thoại: ${phone}\nLoại Xe: ${vehicleType}`;
            
            // Send via Zalo
            const zaLoLink = `https://zalo.me/0363614511?text=${encodeURIComponent(message)}`;
            window.open(zaLoLink, '_blank');
            
            // Reset form
            form.reset();
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .warning-item, .solution-item, .testimonial-card, .commitment-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Button ripple effect
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Scroll effect for navbar
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Counter animation
    const animateCounters = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('[data-count]');
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.count);
                    let current = 0;
                    const increment = target / 50;
                    
                    const updateCounter = () => {
                        if (current < target) {
                            current += increment;
                            counter.textContent = Math.floor(current) + '+';
                            requestAnimationFrame(updateCounter);
                        }
                    };
                    
                    updateCounter();
                });
            }
        });
    };

    // Open WhatsApp function
    window.openWhatsApp = function() {
        const message = 'Tôi muốn tư vấn về thẻ lái xe RFID';
        const zaLoLink = `https://zalo.me/0363614511?text=${encodeURIComponent(message)}`;
        window.open(zaLoLink, '_blank');
    };

    // Form validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }

    // Add hover effect to cards
    document.querySelectorAll('.feature-card, .testimonial-card, .consequence-item').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
});

// Add ripple styles dynamically
const style = document.createElement('style');
style.textContent = `
.btn .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@media (max-width: 768px) {
    .navbar {
        padding: 10px 0;
    }
    
    .hero {
        padding: 40px 0;
    }
}
`;
document.head.appendChild(style);
