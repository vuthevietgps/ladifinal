// Scroll animation - fade in elements when they enter viewport
document.addEventListener('DOMContentLoaded', function() {
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    var animateElements = document.querySelectorAll(
        '.problem-card, .benefit-card, .feature-card, .kpi-card, ' +
        '.who-card, .pricing-card, .timeline-item, .tech-item'
    );
    animateElements.forEach(function(el, i) {
        el.style.animationDelay = (i % 4) * 0.1 + 's';
        observer.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Counter animation for KPI values
    var kpiCards = document.querySelectorAll('.kpi-value');
    var kpiObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                kpiObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    kpiCards.forEach(function(card) {
        kpiObserver.observe(card);
    });

    function animateCounter(el) {
        var text = el.textContent;
        var match = text.match(/(\d+)/);
        if (!match) return;
        var target = parseInt(match[1]);
        var suffix = text.replace(match[1], '');
        var duration = 1500;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        }
        requestAnimationFrame(step);
    }
});
