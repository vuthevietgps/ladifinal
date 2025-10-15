// TechStore JavaScript Functions

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = 80;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero buttons smooth scrolling
    const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = 80;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const email = formData.get('email');
            const product = formData.get('product');
            const note = formData.get('note');
            
            if (validateForm(name, phone)) {
                // Create WhatsApp message
                const message = createWhatsAppMessage(name, phone, email, product, note);
                sendWhatsAppMessage(message);
                
                // Show success notification
                showNotification('Cảm ơn bạn! Chúng tôi sẽ liên hệ trong 5 phút.', 'success');
                
                // Reset form
                this.reset();
            }
        });
    }

    // Product animation on scroll
    const observeProducts = () => {
        const productCards = document.querySelectorAll('.product-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = Math.random() * 0.5 + 's';
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        productCards.forEach(card => observer.observe(card));
    };

    observeProducts();
});

// Order product function
function orderProduct(productName, price) {
    // Scroll to contact form
    const contactForm = document.getElementById('contact');
    if (contactForm) {
        const headerHeight = 80;
        const targetPosition = contactForm.offsetTop - headerHeight;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Pre-fill product in form
    setTimeout(() => {
        const productSelect = document.querySelector('select[name="product"]');
        if (productSelect) {
            // Find the option that matches the product name
            const options = productSelect.querySelectorAll('option');
            options.forEach(option => {
                if (option.textContent.includes(productName.split(' ')[0])) {
                    option.selected = true;
                }
            });
        }
        
        // Pre-fill note with product and price
        const noteTextarea = document.querySelector('textarea[name="note"]');
        if (noteTextarea && noteTextarea.value === '') {
            const formattedPrice = parseInt(price).toLocaleString('vi-VN');
            noteTextarea.value = `Tôi quan tâm đến sản phẩm: ${productName} - Giá: ${formattedPrice}đ`;
        }
    }, 500);

    // Show notification
    showNotification(`Đã chọn sản phẩm: ${productName}. Vui lòng điền thông tin bên dưới!`, 'info');
}

// Form validation
function validateForm(name, phone) {
    if (!name || name.trim().length < 2) {
        showNotification('Vui lòng nhập họ tên hợp lệ!', 'error');
        return false;
    }
    
    if (!validatePhone(phone)) {
        showNotification('Vui lòng nhập số điện thoại hợp lệ (10-11 số)!', 'error');
        return false;
    }
    
    return true;
}

// Phone validation
function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return phoneRegex.test(cleanPhone);
}

// Create WhatsApp message
function createWhatsAppMessage(name, phone, email, product, note) {
    let message = `🛒 *ĐƠN HÀNG MỚI - TECHSTORE*\n\n`;
    message += `👤 **Khách hàng:** ${name}\n`;
    message += `📞 **Số điện thoại:** ${phone}\n`;
    
    if (email) {
        message += `📧 **Email:** ${email}\n`;
    }
    
    if (product) {
        const productText = document.querySelector(`option[value="${product}"]`)?.textContent || product;
        message += `💻 **Sản phẩm quan tâm:** ${productText}\n`;
    }
    
    if (note) {
        message += `📝 **Ghi chú:** ${note}\n`;
    }
    
    message += `\n⏰ **Thời gian:** ${new Date().toLocaleString('vi-VN')}`;
    message += `\n\n_Tin nhắn được gửi từ website TechStore_`;
    
    return message;
}

// Send WhatsApp message
function sendWhatsAppMessage(message) {
    const phoneNumber = '84901234567'; // Replace with actual WhatsApp number
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Notification styles
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 350px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Animate out
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Price formatter
function formatPrice(price) {
    return parseInt(price).toLocaleString('vi-VN') + 'đ';
}

// Product search functionality (if needed later)
function searchProducts(query) {
    const productCards = document.querySelectorAll('.product-card');
    const searchTerm = query.toLowerCase();
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productSpecs = Array.from(card.querySelectorAll('.product-specs p'))
            .map(spec => spec.textContent.toLowerCase()).join(' ');
        
        if (productName.includes(searchTerm) || productSpecs.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        opacity: 0;
        transform: scale(0);
        transition: all 0.3s ease;
    `;
    
    scrollButton.addEventListener('click', scrollToTop);
    document.body.appendChild(scrollButton);
    
    // Show/hide scroll button on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.transform = 'scale(1)';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.transform = 'scale(0)';
        }
    });
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // If image is already loaded
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
});