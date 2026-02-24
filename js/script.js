// Enhanced animations and interactions
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll for all internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

  // Add scroll animation for sections
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

  // Observe all sections for scroll animations
  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // Enhanced float button interactions
  const floatButtons = document.querySelectorAll('.float-btn');
  floatButtons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.15) translateY(-3px)';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1) translateY(0)';
    });

    // Add click tracking
    btn.addEventListener('click', function(e) {
      const action = this.classList.contains('phone') ? 'Phone Call' : 'Zalo Chat';
      console.log('Contact button clicked:', action);
      
      // Add a small feedback animation
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
    });
  });

  // CTA button tracking and animation
  const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      console.log('CTA button clicked:', this.textContent.trim());
    });
  });

  // Contact action cards hover effect
  const contactActions = document.querySelectorAll('.contact-action');
  contactActions.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Problem cards and service cards animation on hover
  const cards = document.querySelectorAll('.problem-card, .service-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) rotate(1deg)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) rotate(0deg)';
    });
  });

  // Add pulse effect to important elements on scroll
  const pulseElements = document.querySelectorAll('.fire-icon, .bulb-icon, .rocket-icon, .target-icon, .warning-icon');
  
  const pulseObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'bounce 2s infinite';
      }
    });
  }, observerOptions);

  pulseElements.forEach(el => {
    pulseObserver.observe(el);
  });

  // Type badges interaction
  const typeBadges = document.querySelectorAll('.type-badge');
  typeBadges.forEach(badge => {
    badge.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.05)';
      this.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
    });
    
    badge.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = 'none';
    });
  });

  // Add stagger animation to checklist items
  const checklistItems = document.querySelectorAll('.checklist-item');
  checklistItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    
    const checklistObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }
      });
    }, observerOptions);
    
    checklistObserver.observe(item);
  });

  // Benefit rows animation
  const benefitRows = document.querySelectorAll('.benefit-row');
  benefitRows.forEach((row, index) => {
    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';
    row.style.transition = `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`;
    
    const benefitObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }
      });
    }, observerOptions);
    
    benefitObserver.observe(row);
  });

  // Requirements animation
  const reqItems = document.querySelectorAll('.req-item');
  reqItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    
    const reqObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }
      });
    }, observerOptions);
    
    reqObserver.observe(item);
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

  // Add click to call/zalo tracking
  const allContactLinks = document.querySelectorAll('a[href^="tel:"], a[href^="https://zalo.me"]');
  allContactLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const type = this.href.includes('tel:') ? 'Phone' : 'Zalo';
      console.log(`Contact initiated via ${type}:`, this.href);
      
      // Optional: Send to analytics
      // gtag('event', 'contact_click', {
      //   'event_category': 'Contact',
      //   'event_label': type,
      //   'value': 1
      // });
    });
  });

  // Console welcome message
  console.log('%c🚗 Phù Hiệu Xe - Landing Page Loaded', 'color: #dc2626; font-size: 16px; font-weight: bold;');
  console.log('%cHotline: 0363 614 511', 'color: #059669; font-size: 14px;');
  console.log('%cZalo: 0363 614 511', 'color: #0084ff; font-size: 14px;');
});

// Enhanced floating button visibility on scroll
let floatContactVisible = true;
window.addEventListener('scroll', function() {
  const floatContact = document.querySelector('.float-contact');
  const footer = document.querySelector('.footer');
  const footerTop = footer.offsetTop;
  const scrollPosition = window.pageYOffset + window.innerHeight;
  
  // Hide float buttons when near footer to avoid overlap
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

// Add extra pulse animation when page loads
setTimeout(function() {
  const floatButtons = document.querySelectorAll('.float-btn');
  floatButtons.forEach(btn => {
    btn.style.animation = 'none';
    setTimeout(() => {
      btn.style.animation = '';
    }, 10);
  });
}, 1000);
