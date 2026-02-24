// Button actions
const actionButtons = ['shopNowBtn', 'viewCatalogBtn', 'orderBtn'];
actionButtons.forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener('click', () => {
      alert('Cảm ơn bạn quan tâm! Vui lòng gọi 0363.614.511 để được tư vấn và đặt hàng.');
    });
  }
});

// Zalo button
document.getElementById('zaloBtn').addEventListener('click', () => {
  window.open('https://zalo.me/84363614511', '_blank');
});

// Category buttons
document.querySelectorAll('.category-card .btn-outline').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const category = e.target.parentElement.querySelector('h3').textContent;
    alert('Danh mục: ' + category + '\n\nVui lòng gọi để xem chi tiết sản phẩm.');
  });
});

// Product order buttons
document.querySelectorAll('.product-card .btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const productName = e.target.parentElement.querySelector('h4').textContent;
    alert('Sản phẩm: ' + productName + '\n\nVui lòng gọi 0363.614.511 để đặt hàng.');
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

document.querySelectorAll('.category-card, .product-card, .why-item, .review-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

console.log('Ban Do Noi That - Script loaded');
