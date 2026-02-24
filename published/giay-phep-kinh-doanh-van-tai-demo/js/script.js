// Modal functionality
const modal = document.getElementById('modal');
const registerBtn = document.getElementById('registerBtn');
const zaloBtn = document.getElementById('zaloBtn');
const closeModal = document.getElementById('closeModal');
const regForm = document.getElementById('regForm');

// Open modal
registerBtn.addEventListener('click', () => {
  modal.classList.add('active');
});

// Close modal
closeModal.addEventListener('click', () => {
  modal.classList.remove('active');
});

// Close on backdrop click
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    modal.classList.remove('active');
  }
});

// Zalo button
zaloBtn.addEventListener('click', () => {
  window.open('https://zalo.me/84363614511', '_blank');
});

// Form submission
regForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(regForm);
  const data = Object.fromEntries(formData);
  
  console.log('Form data:', data);
  
  // Show success message
  alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.');
  
  // Close modal and reset form
  modal.classList.remove('active');
  regForm.reset();
  
  // In production, you would send this data to your server
  // Example:
  // fetch('/api/register', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // }).then(response => response.json()).then(result => {
  //   console.log('Success:', result);
  // });
});

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

// Intersection Observer for animations
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

// Observe elements for animation
const animateElements = document.querySelectorAll('.benefit-box, .req-card, .step, .target-box, .testimonial, .faq-item, .license-item, .challenge-box');

animateElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Active header on scroll
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  } else {
    header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
  }
  
  lastScroll = currentScroll;
});

// Phone number formatting
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    e.target.value = value;
  });
});

// Lazy loading images
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src || img.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// Scroll to top button (optional enhancement)
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Add click tracking for analytics (placeholder)
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const btnText = btn.textContent.trim();
    console.log('Button clicked:', btnText);
    // In production, send to analytics:
    // gtag('event', 'click', { 'button_name': btnText });
  });
});

console.log('Giay Phep Kinh Doanh Van Tai - Script loaded successfully');
