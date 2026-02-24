// Zalo Chat Button
document.getElementById('zaloBtn')?.addEventListener('click', function() {
  window.open('https://zalo.me/0363614511', '_blank');
});

// CTA Buttons
const ctaButtons = document.querySelectorAll('#ctaHero, #ctaConsult, #ctaWarning');
ctaButtons.forEach(button => {
  button?.addEventListener('click', function() {
    window.open('https://zalo.me/0363614511', '_blank');
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Add animation on scroll
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

document.querySelectorAll('.req-card, .solution-card, .comparison-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Track user interaction for analytics
document.addEventListener('DOMContentLoaded', function() {
  console.log('Landing page Giấy Phép Vận Tải loaded');
  
  // Track button clicks
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
      console.log('Button clicked:', this.textContent);
    });
  });

  // Track phone clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
      console.log('Phone call initiated');
    });
  });

  // Track Zalo clicks
  document.querySelectorAll('a[href*="zalo.me"]').forEach(link => {
    link.addEventListener('click', function() {
      console.log('Zalo chat opened');
    });
  });
});

// Prevent form submission for demo
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
  });
});
