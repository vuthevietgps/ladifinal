// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeIn 0.8s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.problem-card, .reality-card, .solution-card, .testimonial-card').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// Form handling
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      vehicle_type: document.getElementById('vehicle-type').value,
      location: document.getElementById('location').value,
      message: document.getElementById('message').value,
      timestamp: new Date().toISOString()
    };

    // Simulate form submission
    console.log('Form Data:', formData);

    // Show success message
    formMessage.textContent = '✅ Cảm ơn! Chúng tôi sẽ liên hệ với bạn trong vòng 30 phút.';
    formMessage.className = 'form-message success';
    formMessage.style.display = 'block';

    // Reset form
    contactForm.reset();

    // Hide message after 5 seconds
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 5000);

    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Track floating button clicks
const floatButtons = document.querySelectorAll('.float-btn');
floatButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    console.log('Float button clicked:', this.href);
  });
});

// Add animation to section headers on scroll
const sectionHeaders = document.querySelectorAll('.section-header');
sectionHeaders.forEach(header => {
  observer.observe(header);
});
