// ==========================================
// COUNTDOWN TIMER
// ==========================================
function initCountdown() {
  const minutesEl = document.getElementById('cdMin');
  const secondsEl = document.getElementById('cdSec');
  
  if (!minutesEl || !secondsEl) return;
  
  let totalSeconds = 30 * 60; // 30 minutes
  
  function updateDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    
    if (totalSeconds <= 0) {
      totalSeconds = 30 * 60; // Reset to 30 minutes
    } else {
      totalSeconds--;
    }
  }
  
  updateDisplay();
  setInterval(updateDisplay, 1000);
}

// ==========================================
// ZALO POPUP
// ==========================================
function initZaloPopup() {
  const zaloBtn = document.getElementById('zaloBtn');
  const popup = document.getElementById('zaloPopup');
  const popupClose = document.getElementById('popupClose');
  const popupOverlay = document.getElementById('popupOverlay');
  
  if (!zaloBtn || !popup) return;
  
  // Open popup
  zaloBtn.addEventListener('click', () => {
    popup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
  
  // Close popup
  function closePopup() {
    popup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  
  if (popupClose) {
    popupClose.addEventListener('click', closePopup);
  }
  
  if (popupOverlay) {
    popupOverlay.addEventListener('click', closePopup);
  }
  
  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.getAttribute('aria-hidden') === 'false') {
      closePopup();
    }
  });
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#" or empty
      if (!href || href === '#') return;
      
      e.preventDefault();
      
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ==========================================
// FORM SUBMISSION
// ==========================================
function initForm() {
  const form = document.getElementById('leadForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/><path d="M12 2a10 10 0 0110 10" stroke="currentColor" stroke-width="4"/></svg> Đang gửi...';
    
    // Get form data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      type: formData.get('type'),
      note: formData.get('note'),
      source: 'Landing Page - Thẻ Tập Huấn Vận Tải (AIDA)',
      timestamp: new Date().toISOString()
    };
    
    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/leads', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      alert('✅ Đăng ký thành công!\n\nChúng tôi sẽ liên hệ với bạn trong vòng 5 phút.\n\nHoặc bạn có thể gọi ngay: 0363.614.511');
      
      // Reset form
      form.reset();
      
      // Track conversion (if using analytics)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          'send_to': 'AW-XXXXXXXXX/XXXXX', // Replace with your conversion ID
          'value': 1.0,
          'currency': 'VND'
        });
      }
      
      // Track Facebook Pixel (if using)
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
          content_name: 'Thẻ Tập Huấn Vận Tải',
          content_category: 'Registration'
        });
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('❌ Có lỗi xảy ra. Vui lòng thử lại hoặc gọi trực tiếp: 0363.614.511');
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
  
  // Phone number formatting
  const phoneInput = form.querySelector('input[name="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      // Remove non-numeric characters
      let value = e.target.value.replace(/\D/g, '');
      
      // Limit to 10 digits
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
      
      e.target.value = value;
    });
  }
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Add animation styles to elements
  const animateElements = document.querySelectorAll('.required-card, .solution-card, .benefit-item, .gallery-grid img');
  animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
}

// ==========================================
// STICKY HEADER ON SCROLL
// ==========================================
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
  });
}

// ==========================================
// AUTO SHOW CONTACT POPUP (after 10 seconds)
// ==========================================
function initAutoPopup() {
  // Show popup after 10 seconds if user hasn't interacted
  setTimeout(() => {
    const popup = document.getElementById('zaloPopup');
    if (popup && popup.getAttribute('aria-hidden') === 'true') {
      // Check if user has seen popup before (using localStorage)
      const hasSeenPopup = localStorage.getItem('hasSeenZaloPopup');
      
      if (!hasSeenPopup) {
        popup.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        localStorage.setItem('hasSeenZaloPopup', 'true');
      }
    }
  }, 10000); // 10 seconds
}

// ==========================================
// TRACK OUTBOUND CLICKS
// ==========================================
function initClickTracking() {
  // Track phone calls
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          'event_category': 'Contact',
          'event_label': 'Phone Call',
          'value': link.getAttribute('href')
        });
      }
    });
  });
  
  // Track Zalo links
  document.querySelectorAll('a[href*="zalo.me"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          'event_category': 'Contact',
          'event_label': 'Zalo',
          'value': link.getAttribute('href')
        });
      }
    });
  });
}

// ==========================================
// ADD CSS FOR SPINNING ANIMATION
// ==========================================
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// ==========================================
// INITIALIZE ALL FUNCTIONS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initZaloPopup();
  initSmoothScroll();
  initForm();
  initScrollAnimations();
  initStickyHeader();
  initAutoPopup();
  initClickTracking();
  
  console.log('🚀 Landing page initialized successfully!');
});

// ==========================================
// PREVENT CONTEXT MENU ON IMAGES (optional)
// ==========================================
document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

// ==========================================
// LAZY LOADING FALLBACK
// ==========================================
if ('loading' in HTMLImageElement.prototype) {
  // Browser supports lazy loading
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.loading = 'lazy';
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imageObserver.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
}
