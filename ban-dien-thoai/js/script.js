// Button actions
document.querySelectorAll('#buyBtn, #buyBtn2').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Cảm ơn bạn quan tâm! Vui lòng gọi 0363.614.511 để mua hàng.');
  });
});

// Zalo button
document.getElementById('zaloBtn').addEventListener('click', () => {
  window.open('https://zalo.me/84363614511', '_blank');
});

// Product selection
document.querySelectorAll('.product button').forEach(btn => {
  btn.addEventListener('click', (e) => {
    alert('Bạn đã chọn: ' + e.target.parentElement.querySelector('h4').textContent);
  });
});

// Scroll animation
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

document.querySelectorAll('.spec-card, .why-box, .product, .review').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

console.log('Ban Dien Thoai - Script loaded');
