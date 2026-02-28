// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function(item) {
        var question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            var isActive = item.classList.contains('active');
            faqItems.forEach(function(i) { i.classList.remove('active'); });
            if (!isActive) item.classList.add('active');
        });
    });

    // Scroll animation
    var animateElements = document.querySelectorAll(
        '.pain-alert-box, .problem-card, .comparison-col, .feature-card, .step, .reg-step, .audience-card, .pricing-card, .timeline-item, .usp-item, .faq-item'
    );
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animateElements.forEach(function(el) { observer.observe(el); });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            var target = document.querySelector(targetId);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});
