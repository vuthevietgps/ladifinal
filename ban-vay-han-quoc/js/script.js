// Button actions
const actionButtons = ['shopBtn', 'viewBtn', 'orderBtn'];
actionButtons.forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener('click', () => {
      alert('Cảm ơn bạn quan tâm! Vui lòng gọi 0363.614.511 để đặt hàng.');
    });
  }
});

// Zalo button
document.getElementById('zaloBtn').addEventListener('click', () => {
  window.open('https://zalo.me/84363614511', '_blank');
});

// Collection items
document.querySelectorAll('.collection-item .btn-outline').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const collectionName = e.target.parentElement.querySelector('h4').textContent;
    alert('Bạn đã chọn: ' + collectionName + '\n\nVui lòng gọi để biết chi tiết sản phẩm');
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

document.querySelectorAll('.feature-card, .collection-item, .color-box, .testimonial').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

console.log('Ban Vay Han Quoc - Script loaded');
