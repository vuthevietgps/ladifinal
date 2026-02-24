/* ===================================
   SMOOTH SCROLL & INTERACTIONS
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
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

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.problem-card, .risk-item, .solution-card, .service-item, .why-card, .process-step').forEach(el => {
        observer.observe(el);
    });

    // Floating buttons animation
    const floatingBtns = document.querySelectorAll('.float-btn');
    floatingBtns.forEach((btn, index) => {
        btn.style.animationDelay = (index * 0.2) + 's';
    });

    // Add scroll animation CSS
    const style = document.createElement('style');
    style.textContent = `
        .problem-card,
        .risk-item,
        .solution-card,
        .service-item,
        .why-card,
        .process-step {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Phone number formatting (optional)
    const phoneLinks = document.querySelectorAll('a[href^="tel:"], a[href^="https://zalo.me"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Log for analytics if needed
            console.log('Contact method clicked:', this.href);
        });
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripples = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripples.style.width = ripples.style.height = size + 'px';
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple');

            // Add ripple styles if not exists
            if (!document.querySelector('style[data-ripple]')) {
                const rippleStyle = document.createElement('style');
                rippleStyle.setAttribute('data-ripple', 'true');
                rippleStyle.textContent = `
                    .btn {
                        position: relative;
                        overflow: hidden;
                    }
                    .ripple {
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
                `;
                document.head.appendChild(rippleStyle);
            }

            this.appendChild(ripples);
        });
    });

    // Mobile menu toggle simulation
    const handleMobileOptimization = () => {
        const buttons = document.querySelectorAll('.float-btn');
        if (window.innerWidth < 768) {
            buttons.forEach(btn => btn.style.width = '50px');
        }
    };

    handleMobileOptimization();
    window.addEventListener('resize', handleMobileOptimization);
});

// Scroll-to-top functionality
window.addEventListener('scroll', function() {
    const floatingButtons = document.querySelector('.floating-buttons');
    if (window.scrollY > 300) {
        floatingButtons.style.opacity = '1';
    } else {
        floatingButtons.style.opacity = '0.7';
    }
});

// Add style for floating buttons opacity transition
const style = document.createElement('style');
style.textContent = `
    .floating-buttons {
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);
