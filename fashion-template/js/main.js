// Fashion Store JavaScript

// Smooth scrolling for navigation links
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

// Scroll to products section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

// Order product function
function orderProduct(productName) {
    // Track product interest
    if (typeof gtag !== 'undefined') {
        gtag('event', 'add_to_cart', {
            'event_category': 'ecommerce',
            'event_label': productName
        });
    }
    
    // Show interest via phone tracking
    if (window.PHONE_TRACKING) {
        console.log('Phone tracking:', window.PHONE_TRACKING);
    }
    
    // Open order form or redirect
    const orderText = `Chào shop, tôi muốn đặt sản phẩm: ${productName}`;
    const phoneNumber = '0123456789'; // This will be replaced by tracking injection
    
    // Multiple order options
    const orderModal = confirm(`Bạn muốn đặt: ${productName}\n\nChọn OK để gọi điện\nChọn Cancel để nhắn Zalo`);
    
    if (orderModal) {
        window.open(`tel:${phoneNumber}`, '_self');
    } else {
        window.open(`https://zalo.me/${phoneNumber}?text=${encodeURIComponent(orderText)}`, '_blank');
    }
}

// General order now function
function orderNow() {
    // Track general order intent
    if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_checkout', {
            'event_category': 'ecommerce'
        });
    }
    
    // Show order options
    const orderMethod = confirm('Chọn cách đặt hàng:\n\nOK - Điền form đặt hàng\nCancel - Gọi điện tư vấn');
    
    if (orderMethod) {
        // Scroll to order form
        document.querySelector('#contact .order-form').scrollIntoView({
            behavior: 'smooth'
        });
        // Focus first input
        setTimeout(() => {
            document.querySelector('#orderForm input').focus();
        }, 500);
    } else {
        callNow();
    }
}

// Call now function
function callNow() {
    const phoneNumber = '0123456789'; // This will be replaced by tracking injection
    
    // Track call intent
    if (window.PHONE_TRACKING) {
        console.log('Phone tracking - call:', window.PHONE_TRACKING);
    }
    
    window.open(`tel:${phoneNumber}`, '_self');
}

// Order form submission
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = formData.get('name') || this.elements[0].value;
    const phone = formData.get('phone') || this.elements[1].value;
    const address = formData.get('address') || this.elements[2].value;
    const note = formData.get('note') || this.elements[3].value;
    
    // Validate required fields
    if (!name || !phone || !address) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    // Track form submission
    if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
            'event_category': 'ecommerce',
            'event_label': 'order_form'
        });
    }
    
    if (window.FORM_TRACKING) {
        console.log('Form tracking:', window.FORM_TRACKING);
    }
    
    // Create order message
    const orderMessage = `📦 ĐƠN HÀNG MỚI\n\n` +
        `👤 Tên: ${name}\n` +
        `📱 SĐT: ${phone}\n` +
        `📍 Địa chỉ: ${address}\n` +
        `📝 Ghi chú: ${note || 'Không có'}\n\n` +
        `Vui lòng liên hệ xác nhận đơn hàng!`;
    
    const phoneNumber = '0123456789'; // This will be replaced
    
    // Show success message
    alert('Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ xác nhận trong 15 phút.');
    
    // Send to Zalo or call
    const sendMethod = confirm('Gửi đơn hàng qua:\n\nOK - Zalo\nCancel - Gọi điện');
    
    if (sendMethod) {
        window.open(`https://zalo.me/${phoneNumber}?text=${encodeURIComponent(orderMessage)}`, '_blank');
    } else {
        window.open(`tel:${phoneNumber}`, '_self');
    }
    
    // Reset form
    this.reset();
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        navbar.style.background = 'rgba(255,255,255,0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.background = 'white';
        navbar.style.backdropFilter = 'none';
    }
});

// Product card hover effects
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add to cart animation
function addToCartAnimation(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
    button.classList.add('btn-success');
    button.classList.remove('btn-primary');
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
    }, 2000);
}

// Phone number click tracking
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        if (window.PHONE_TRACKING) {
            console.log('Phone click tracked:', this.href);
        }
    });
});

// Zalo link click tracking  
document.querySelectorAll('a[href*="zalo.me"]').forEach(link => {
    link.addEventListener('click', function() {
        if (window.ZALO_TRACKING) {
            console.log('Zalo click tracked:', this.href);
        }
    });
});

// Page visibility tracking for engagement
let startTime = Date.now();
let isVisible = true;

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        isVisible = false;
        const timeSpent = Date.now() - startTime;
        console.log('Page hidden after:', Math.round(timeSpent / 1000), 'seconds');
    } else {
        isVisible = true;
        startTime = Date.now();
    }
});

// Scroll depth tracking
let maxScroll = 0;
window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track scroll milestones
        if (maxScroll >= 25 && maxScroll < 50) {
            console.log('Scrolled 25%');
        } else if (maxScroll >= 50 && maxScroll < 75) {
            console.log('Scrolled 50%');
        } else if (maxScroll >= 75 && maxScroll < 90) {
            console.log('Scrolled 75%');
        } else if (maxScroll >= 90) {
            console.log('Scrolled 90%');
        }
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Fashion Store loaded successfully!');
    
    // Add entrance animations
    const animatedElements = document.querySelectorAll('.product-card, .feature-item, .review-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Error handling for external resources
window.addEventListener('error', function(e) {
    console.log('Resource failed to load:', e.target.src || e.target.href);
}, true);

// Simple cart functionality (optional)
let cart = [];

function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    updateCartCount();
    console.log('Added to cart:', productName, price);
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'block' : 'none';
    }
}

// Export functions for global use
window.orderProduct = orderProduct;
window.orderNow = orderNow;
window.callNow = callNow;
window.scrollToProducts = scrollToProducts;