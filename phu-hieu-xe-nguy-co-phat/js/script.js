// Enhanced interactions for landing page
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Scroll animations
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

  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // Float button interactions
  const floatButtons = document.querySelectorAll('.float-btn');
  floatButtons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.15) translateY(-3px)';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1) translateY(0)';
    });

    btn.addEventListener('click', function(e) {
      const action = this.classList.contains('phone') ? 'Phone Call' : 'Zalo Chat';
      console.log('Contact button clicked:', action);
      this.style.transform = 'scale(0.95)';
      setTimeout(() => { this.style.transform = 'scale(1)'; }, 150);
    });
  });

  // CTA buttons tracking
  const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-danger, .btn-outline');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      console.log('CTA button clicked:', this.textContent.trim());
    });
  });

  // Discovery cards animation
  const discoveryCards = document.querySelectorAll('.discovery-card');
  discoveryCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) rotate(1deg)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) rotate(0deg)';
    });
  });

  // Risk cards animation
  const riskCards = document.querySelectorAll('.risk-card');
  riskCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(10px)';
      this.style.background = '#fee2e2';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
      this.style.background = '#fef2f2';
    });
  });

  // Testimonial cards animation
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Solution items stagger animation
  const solutionItems = document.querySelectorAll('.solution-item');
  solutionItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    
    const solutionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }
      });
    }, observerOptions);
    
    solutionObserver.observe(item);
  });

  // Header scroll effect
  let lastScroll = 0;
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      header.style.background = 'rgba(255, 255, 255, 0.98)';
      header.style.backdropFilter = 'blur(10px)';
    } else {
      header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      header.style.background = '#fff';
      header.style.backdropFilter = 'none';
    }
    
    lastScroll = currentScroll;
  });

  // Hide float buttons near footer
  let floatContactVisible = true;
  window.addEventListener('scroll', function() {
    const floatContact = document.querySelector('.float-contact');
    const footer = document.querySelector('.footer');
    const footerTop = footer.offsetTop;
    const scrollPosition = window.pageYOffset + window.innerHeight;
    
    if (scrollPosition > footerTop - 100) {
      if (floatContactVisible) {
        floatContact.style.opacity = '0';
        floatContact.style.pointerEvents = 'none';
        floatContactVisible = false;
      }
    } else {
      if (!floatContactVisible) {
        floatContact.style.opacity = '1';
        floatContact.style.pointerEvents = 'auto';
        floatContactVisible = true;
      }
    }
  });

  // Track all contact links
  const allContactLinks = document.querySelectorAll('a[href^="tel:"], a[href^="https://zalo.me"]');
  allContactLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const type = this.href.includes('tel:') ? 'Phone' : 'Zalo';
      console.log(`Contact initiated via ${type}:`, this.href);
    });
  });

  // Realization list items animation
  const realizationItems = document.querySelectorAll('.realization-list li');
  realizationItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`;
    
    const realizationObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }
      });
    }, observerOptions);
    
    realizationObserver.observe(item);
  });

  // Badges hover effect
  const badges = document.querySelectorAll('.badge');
  badges.forEach(badge => {
    badge.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.05)';
      this.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
    });
    
    badge.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = 'none';
    });
  });

  // Extra pulse animation on load
  setTimeout(function() {
    const floatButtons = document.querySelectorAll('.float-btn');
    floatButtons.forEach(btn => {
      btn.style.animation = 'none';
      setTimeout(() => { btn.style.animation = ''; }, 10);
    });
  }, 1000);

  // Console log
  console.log('%c🚗 Phù Hiệu Xe - Landing Page Loaded', 'color: #dc2626; font-size: 16px; font-weight: bold;');
  console.log('%cHotline: 0363 614 511', 'color: #059669; font-size: 14px;');
  console.log('%cZalo: 0363 614 511', 'color: #0084ff; font-size: 14px;');
});
