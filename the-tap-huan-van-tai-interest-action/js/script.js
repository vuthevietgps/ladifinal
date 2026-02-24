// ========================
// Form Handling
// ========================
document.getElementById('checkForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const fullname = document.getElementById('fullname').value;
  const phone = document.getElementById('phone').value;
  const targetType = document.getElementById('targetType').value;
  const quantity = document.getElementById('quantity').value;
  
  // Prepare message
  const message = `Tôi muốn tư vấn thẻ tập huấn vận tải:
  
Họ tên: ${fullname}
SĐT: ${phone}
Đối tượng: ${targetType}
Số lượng: ${quantity}

Tôi cần được tư vấn và hỗ trợ làm thẻ tập huấn.`;
  
  // Send via Zalo
  const zaloLink = `https://zalo.me/0363614511?text=${encodeURIComponent(message)}`;
  window.open(zaloLink, '_blank');
  
  // Reset form
  this.reset();
});

// ========================
// CTA Button Actions
// ========================
document.querySelectorAll('[id^="cta"]').forEach(btn => {
  btn.addEventListener('click', function() {
    const message = 'Tôi muốn tư vấn thẻ tập huấn nghiệp vụ vận tải. Hãy hỗ trợ tôi.';
    const zaloLink = `https://zalo.me/0363614511?text=${encodeURIComponent(message)}`;
    window.open(zaloLink, '_blank');
  });
});

// ========================
// Smooth Scroll
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
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

// ========================
// Animation on Scroll
// ========================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeIn 0.6s ease-in-out forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.problem-card, .solution-card').forEach(card => {
  observer.observe(card);
});

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// ========================
// Mobile Menu
// ========================
document.addEventListener('DOMContentLoaded', function() {
  // Add ripple effect to buttons
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
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
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
});

// Add ripple styling
const rippleStyle = document.createElement('style');
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

// ========================
// Analytics Tracking (Optional)
// ========================
function trackEvent(eventName, eventData) {
  // This can be connected to Google Analytics or other tracking services
  console.log('Event tracked:', eventName, eventData);
}

// Track CTA clicks
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', () => {
    trackEvent('CTA_Click', { type: 'primary' });
  });
});

// Track form submissions
document.getElementById('checkForm')?.addEventListener('submit', () => {
  trackEvent('Form_Submit', { type: 'training_card_consultation' });
});
