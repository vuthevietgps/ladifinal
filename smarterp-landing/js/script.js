// Scroll animation - fade in elements
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in class to animated elements
    var animatedSelectors = [
        '.pain-card', '.solution-card', '.compare-table',
        '.process-step', '.module-item', '.kpi-card',
        '.audience-card', '.section-header'
    ];

    animatedSelectors.forEach(function(selector) {
        document.querySelectorAll(selector).forEach(function(el) {
            el.classList.add('fade-in');
        });
    });

    // Intersection Observer for scroll animations
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(function(el) {
        observer.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Counter animation for stats
    var statNumbers = document.querySelectorAll('.stat-number, .kpi-number');
    var statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(function(el) {
        statsObserver.observe(el);
    });

    function animateCounter(el) {
        var text = el.textContent.trim();
        var match = text.match(/(\d+)/);
        if (!match) return;

        var target = parseInt(match[1]);
        var prefix = text.substring(0, text.indexOf(match[1]));
        var suffix = text.substring(text.indexOf(match[1]) + match[1].length);
        var current = 0;
        var duration = 1500;
        var step = target / (duration / 16);

        function update() {
            current += step;
            if (current >= target) {
                el.textContent = prefix + target + suffix;
                return;
            }
            el.textContent = prefix + Math.floor(current) + suffix;
            requestAnimationFrame(update);
        }
        update();
    }
});
