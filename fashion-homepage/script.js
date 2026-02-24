// Fashion Store JavaScript

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Show products section
function showProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

// Show contact section
function showContact() {
    document.getElementById('contact').scrollIntoView({
        behavior: 'smooth'
    });
}

// Call hotline function
function callHotline() {
    const phone = '0901234567';
    if (confirm(`Bạn có muốn gọi đến số ${phone}?`)) {
        window.open(`tel:${phone}`, '_self');
    }
}

// Chat Zalo function
function chatZalo() {
    const zaloNumber = '0901234567';
    const message = 'Xin chào! Tôi quan tâm đến sản phẩm thời trang của shop.';
    const zaloUrl = `https://zalo.me/${zaloNumber}?text=${encodeURIComponent(message)}`;
    window.open(zaloUrl, '_blank');
}

// Order product function
function orderProduct(productName) {
    const phone = '0901234567';
    const message = `Xin chào! Tôi muốn đặt hàng sản phẩm: ${productName}`;
    
    if (confirm(`Đặt hàng sản phẩm: ${productName}\nBạn sẽ được chuyển đến Zalo để liên hệ.`)) {
        const zaloUrl = `https://zalo.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(zaloUrl, '_blank');
    }
}

// Submit contact form
function submitForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const name = formData.get('name') || form.querySelector('input[type="text"]').value;
    const phone = formData.get('phone') || form.querySelector('input[type="tel"]').value;
    const email = formData.get('email') || form.querySelector('input[type="email"]').value;
    const message = formData.get('message') || form.querySelector('textarea').value;
    
    // Validate required fields
    if (!name || !phone) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    // Create message for Zalo
    let zaloMessage = `📝 ĐĂNG KÝ THÔNG TIN MỚI\n`;
    zaloMessage += `👤 Họ tên: ${name}\n`;
    zaloMessage += `📞 Số ĐT: ${phone}\n`;
    if (email) zaloMessage += `📧 Email: ${email}\n`;
    if (message) zaloMessage += `💬 Tin nhắn: ${message}`;
    
    // Show success message
    alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ sớm nhất có thể.');
    
    // Send to Zalo
    const zaloUrl = `https://zalo.me/0901234567?text=${encodeURIComponent(zaloMessage)}`;
    window.open(zaloUrl, '_blank');
    
    // Reset form
    form.reset();
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Animate elements on scroll
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.product-card, .stat, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
}

// Modern click tracking using Advanced Tracking Library
function trackClick(element, action) {
    // Use Advanced Tracking if available
    if (window.tracker) {
        window.tracker.trackClick(element, action);
    } else {
        console.log(`Tracked: ${action} on ${element}`);
    }
}

// Setup product tracking
function setupProductTracking() {
    if (!window.tracker) return;
    
    // Track product views when they come into viewport
    const productObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.tracked) {
                const productName = entry.target.querySelector('h3')?.textContent || 'Unknown Product';
                const priceText = entry.target.querySelector('.price')?.textContent;
                const price = priceText ? parseInt(priceText.replace(/\D/g, '')) : null;
                
                window.tracker.trackProductView(productName, price);
                entry.target.dataset.tracked = 'true';
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.product-card').forEach(card => {
        productObserver.observe(card);
    });
}

// Add event listeners for tracking
document.addEventListener('DOMContentLoaded', function() {
    // Setup product view tracking
    setupProductTracking();
    
    // Track buy button clicks with product info
    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3')?.textContent || 'Unknown';
            const priceText = productCard.querySelector('.price')?.textContent;
            const price = priceText ? parseInt(priceText.replace(/\D/g, '')) : null;
            
            if (window.tracker) {
                window.tracker.trackAddToCart(productName, price);
            }
            trackClick('product_button', `order_${productName}`);
        });
    });
    
    // Track contact actions
    document.querySelector('.btn-contact')?.addEventListener('click', function() {
        trackClick('header_contact', 'click_contact');
    });
    
    // Phone tracking is auto-handled by advanced-tracking.js for tel: links
    document.querySelectorAll('.btn-call').forEach(btn => {
        btn.addEventListener('click', function() {
            trackClick('contact_phone', 'click_call');
        });
    });
    
    // Zalo tracking is auto-handled by advanced-tracking.js for zalo.me links
    document.querySelectorAll('.btn-zalo').forEach(btn => {
        btn.addEventListener('click', function() {
            trackClick('contact_zalo', 'click_zalo');
        });
    });
});

// Preload important images and resources
function preloadResources() {
    const links = [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    ];
    
    links.forEach(link => {
        const linkEl = document.createElement('link');
        linkEl.rel = 'preload';
        linkEl.href = link;
        linkEl.as = 'style';
        document.head.appendChild(linkEl);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    preloadResources();
    console.log('Fashion Store website loaded successfully!');
});