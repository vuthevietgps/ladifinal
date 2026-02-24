// Khởi tạo khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling cho các liên kết anchor
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hiệu ứng xuất hiện khi scroll
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

    // Áp dụng hiệu ứng cho các phần tử
    const animatedElements = document.querySelectorAll('.penalty-card, .benefit-item, .step, .pricing-card, .testimonial-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Counter cho số người bị phạt hôm nay
    let counter = 85;
    const urgencyNumber = document.querySelector('.urgency-message strong');
    
    function updateCounter() {
        counter += Math.floor(Math.random() * 3) + 1; // Tăng 1-3 mỗi lần
        if (counter > 200) counter = Math.floor(Math.random() * 50) + 100; // Reset về 100-150
        urgencyNumber.textContent = counter + ' người';
    }

    // Cập nhật counter mỗi 5 giây
    setInterval(updateCounter, 5000);

    // Hiệu ứng nhấp nháy cho warning banner
    let blinkCount = 0;
    const warningBanner = document.querySelector('.warning-banner');
    
    function blinkWarning() {
        warningBanner.style.backgroundColor = blinkCount % 2 === 0 ? '#dc2626' : '#ea580c';
        blinkCount++;
        if (blinkCount > 6) blinkCount = 0;
    }
    
    setInterval(blinkWarning, 1000);

    // Sticky header effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Popup notifications (giả lập)
    const notifications = [
        'Anh Minh - Hà Nội vừa đặt thẻ VIP',
        'Chị Lan - TP.HCM vừa đặt thẻ Cao Cấp', 
        'Anh Tùng - Đà Nẵng vừa đặt thẻ Cơ Bản',
        'Chị Hoa - Hải Phòng vừa đặt thẻ VIP',
        'Anh Nam - Cần Thơ vừa đặt thẻ Cao Cấp'
    ];

    function showNotification() {
        const notification = notifications[Math.floor(Math.random() * notifications.length)];
        const notifElement = document.createElement('div');
        notifElement.className = 'popup-notification';
        notifElement.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${notification}</span>
                <button class="close-notif">&times;</button>
            </div>
        `;
        
        // Add CSS for notification
        notifElement.style.cssText = `
            position: fixed;
            bottom: 120px;
            left: 20px;
            background: linear-gradient(135deg, #059669, #047857);
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 1001;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-size: 0.9rem;
        `;
        
        document.body.appendChild(notifElement);
        
        // Show notification
        setTimeout(() => {
            notifElement.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide notification after 4 seconds
        setTimeout(() => {
            notifElement.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                if (notifElement.parentNode) {
                    notifElement.parentNode.removeChild(notifElement);
                }
            }, 300);
        }, 4000);
        
        // Close button functionality
        const closeBtn = notifElement.querySelector('.close-notif');
        closeBtn.addEventListener('click', () => {
            notifElement.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                if (notifElement.parentNode) {
                    notifElement.parentNode.removeChild(notifElement);
                }
            }, 300);
        });
    }

    // Show notification every 8-15 seconds
    function scheduleNotification() {
        const delay = Math.random() * 7000 + 8000; // 8-15 seconds
        setTimeout(() => {
            showNotification();
            scheduleNotification();
        }, delay);
    }
    
    // Start notifications after 3 seconds
    setTimeout(scheduleNotification, 3000);

    // Form validation và tracking
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    
    function validatePhone(phone) {
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Tracking clicks
    function trackClick(elementType, elementText) {
        // Gửi dữ liệu tracking (có thể integrate với Google Analytics)
        console.log(`Click tracked: ${elementType} - ${elementText}`);
        
        // Có thể thêm gtag event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'engagement',
                'event_label': elementText,
                'element_type': elementType
            });
        }
    }

    // Add tracking to important buttons
    const trackingButtons = document.querySelectorAll('.btn-primary, .btn-order, .contact-btn, .float-phone, .float-zalo');
    trackingButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackClick('button', this.textContent.trim() || this.getAttribute('href') || 'floating-contact');
        });
    });

    // Urgency timer
    function createUrgencyTimer() {
        const timerElement = document.createElement('div');
        timerElement.className = 'urgency-timer';
        timerElement.innerHTML = `
            <div class="timer-content">
                <i class="fas fa-clock"></i>
                <span>Ưu đãi kết thúc trong: </span>
                <strong id="countdown"></strong>
            </div>
        `;
        
        timerElement.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #ea580c, #c2410c);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 999;
            font-size: 0.9rem;
            animation: pulse 2s infinite;
        `;
        
        document.body.appendChild(timerElement);
        
        // Countdown from 2 hours
        let timeLeft = 2 * 60 * 60; // 2 hours in seconds
        const countdownElement = document.getElementById('countdown');
        
        function updateTimer() {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            
            countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            timeLeft--;
            
            if (timeLeft < 0) {
                timeLeft = 2 * 60 * 60; // Reset to 2 hours
            }
        }
        
        setInterval(updateTimer, 1000);
        updateTimer();
    }

    // Create urgency timer after 2 seconds
    setTimeout(createUrgencyTimer, 2000);

    // Exit intent popup
    let exitIntentShown = false;
    
    function showExitIntent(e) {
        if (e.clientY <= 0 && !exitIntentShown) {
            exitIntentShown = true;
            
            const exitPopup = document.createElement('div');
            exitPopup.className = 'exit-intent-popup';
            exitPopup.innerHTML = `
                <div class="exit-popup-overlay"></div>
                <div class="exit-popup-content">
                    <button class="exit-popup-close">&times;</button>
                    <h3>ĐỪNG ĐỂ MẤT CƠ HỘI!</h3>
                    <p>Bạn có muốn nhận <strong>GIẢM GIÁ 100.000đ</strong> cho đơn hàng đầu tiên?</p>
                    <div class="exit-popup-buttons">
                        <a href="tel:0123456789" class="exit-btn-yes">GỌI NGAY NHẬN ưu ĐÃI</a>
                        <button class="exit-btn-no">Để sau</button>
                    </div>
                </div>
            `;
            
            exitPopup.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            document.body.appendChild(exitPopup);
            document.body.style.overflow = 'hidden';
            
            // Close popup functionality
            function closeExitPopup() {
                document.body.removeChild(exitPopup);
                document.body.style.overflow = 'auto';
            }
            
            exitPopup.querySelector('.exit-popup-close').addEventListener('click', closeExitPopup);
            exitPopup.querySelector('.exit-btn-no').addEventListener('click', closeExitPopup);
            exitPopup.querySelector('.exit-popup-overlay').addEventListener('click', closeExitPopup);
        }
    }
    
    // Add exit intent listener after 10 seconds
    setTimeout(() => {
        document.addEventListener('mouseleave', showExitIntent);
    }, 10000);

    // Scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #dc2626, #ea580c);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);
        
        progressBar.style.width = scrollPercentRounded + '%';
    });
});

// Order card function
function orderCard(type) {
    let message = '';
    let price = '';
    
    switch(type) {
        case 'basic':
            price = '299.000đ';
            message = `Tôi muốn đặt Thẻ Cơ Bản (${price}). Vui lòng liên hệ tư vấn.`;
            break;
        case 'premium':
            price = '399.000đ';
            message = `Tôi muốn đặt Thẻ Cao Cấp (${price}). Vui lòng liên hệ tư vấn.`;
            break;
        case 'vip':
            price = '599.000đ';
            message = `Tôi muốn đặt Thẻ VIP (${price}). Vui lòng liên hệ tư vấn.`;
            break;
    }
    
    // Tracking order attempt
    if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_checkout', {
            'event_category': 'ecommerce',
            'event_label': type,
            'value': parseInt(price.replace(/[^0-9]/g, ''))
        });
    }
    
    // Open Zalo with pre-filled message
    const zaloUrl = `https://zalo.me/0123456789?text=${encodeURIComponent(message)}`;
    window.open(zaloUrl, '_blank');
    
    // Fallback: show phone number if Zalo doesn't work
    setTimeout(() => {
        alert(`Nếu không mở được Zalo, vui lòng gọi trực tiếp: 0123.456.789\n\nNội dung: ${message}`);
    }, 2000);
}

// Add CSS for exit intent popup
const exitIntentCSS = `
.exit-popup-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
}

.exit-popup-content {
    position: relative;
    background: white;
    padding: 40px;
    border-radius: 15px;
    text-align: center;
    max-width: 500px;
    margin: 0 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.exit-popup-close {
    position: absolute;
    top: 15px;
    right: 20px;
    background: none;
    border: none;
    font-size: 2rem;
    color: #999;
    cursor: pointer;
}

.exit-popup-content h3 {
    color: #dc2626;
    font-size: 1.8rem;
    margin-bottom: 15px;
    font-weight: 700;
}

.exit-popup-content p {
    font-size: 1.1rem;
    margin-bottom: 30px;
    color: #374151;
}

.exit-popup-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
}

.exit-btn-yes {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    color: white;
    padding: 15px 25px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: transform 0.3s ease;
}

.exit-btn-yes:hover {
    transform: translateY(-2px);
}

.exit-btn-no {
    background: #f3f4f6;
    color: #6b7280;
    padding: 15px 25px;
    border-radius: 25px;
    border: none;
    cursor: pointer;
    font-weight: 600;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.close-notif {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    margin-left: auto;
}

@media (max-width: 768px) {
    .exit-popup-content {
        padding: 30px 20px;
        margin: 0 15px;
    }
    
    .exit-popup-buttons {
        flex-direction: column;
    }
    
    .urgency-timer {
        position: relative !important;
        top: auto !important;
        right: auto !important;
        margin: 10px;
        display: inline-block;
    }
}
`;

// Inject CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = exitIntentCSS;
document.head.appendChild(styleSheet);