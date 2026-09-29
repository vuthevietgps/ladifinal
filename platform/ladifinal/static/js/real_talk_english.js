// ========== COUNTDOWN TIMER ========== 
function startCountdown() {
    // Thiết lập thời gian kết thúc (ví dụ: 24 giờ từ bây giờ)
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endTime - now;

        // Tính toán thời gian còn lại
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Cập nhật UI
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        const countdownText = document.getElementById('countdown-timer');

        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        if (countdownText) {
            countdownText.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        // Nếu hết thời gian
        if (distance < 0) {
            clearInterval(timerInterval);
            if (countdownText) countdownText.textContent = "00:00:00";
            return;
        }
    }

    // Cập nhật ngay lập tức
    updateCountdown();

    // Cập nhật mỗi 1 giây
    const timerInterval = setInterval(updateCountdown, 1000);
}

// ========== TESTIMONIALS CAROUSEL ========== 
let currentTestimonialIndex = 0;

function showTestimonial(index) {
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;

    if (totalItems === 0) return;

    // Xoay vòng nếu vượt quá
    if (index >= totalItems) {
        currentTestimonialIndex = 0;
    } else if (index < 0) {
        currentTestimonialIndex = totalItems - 1;
    } else {
        currentTestimonialIndex = index;
    }

    // Ẩn tất cả items
    items.forEach(item => item.classList.remove('active'));

    // Hiển thị item hiện tại
    if (items[currentTestimonialIndex]) {
        items[currentTestimonialIndex].classList.add('active');
    }
}

function nextTestimonial() {
    showTestimonial(currentTestimonialIndex + 1);
}

function prevTestimonial() {
    showTestimonial(currentTestimonialIndex - 1);
}

// Auto-play carousel mỗi 8 giây
function autoPlayTestimonials() {
    setInterval(() => {
        nextTestimonial();
    }, 8000);
}

// ========== MODAL FUNCTIONS ========== 
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ========== EVENT LISTENERS ========== 
document.addEventListener('DOMContentLoaded', function () {
    // Khởi động countdown
    startCountdown();

    // Khởi động carousel testimonials
    showTestimonial(0);
    autoPlayTestimonials();

    // CTA buttons
    const ctaButtons = document.querySelectorAll('[data-modal]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modalId = this.dataset.modal + 'Modal';
            openModal(modalId);
        });
    });

    // Đóng modal khi nhấp vào ngoài
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });

    // Form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Lấy dữ liệu form
            const formData = {
                fullname: document.getElementById('fullname').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                package: document.getElementById('package').value
            };

            // Gửi dữ liệu
            console.log('Form submitted:', formData);

            // Hiển thị thông báo thành công
            alert('Đăng ký thành công! Chúng tôi sẽ liên hệ bạn trong 24 giờ.');

            // Reset form
            this.reset();

            // Đóng modal
            closeModal('registerModal');
        });
    }

    // Smooth scroll cho hero scroll
    const heroScroll = document.querySelector('.hero-scroll');
    if (heroScroll) {
        heroScroll.addEventListener('click', function () {
            const interestSection = document.querySelector('.interest-section');
            if (interestSection) {
                interestSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Keyboard events
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.active');
            modals.forEach(modal => closeModal(modal.id));
        }
    });

    // Carousel navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            prevTestimonial();
        } else if (e.key === 'ArrowRight') {
            nextTestimonial();
        }
    });
});

// ========== UTILITY FUNCTIONS ========== 

// Animate counter numbers
function animateCounter(element, target, duration = 1000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Scroll animation for elements
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.feature-card, .pain-point, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Khởi động khi DOM sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeElements);
} else {
    observeElements();
}

// ========== RESPONSIVE CAROUSEL ========== 
function handleResponsiveCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    if (window.innerWidth <= 768) {
        carousel.style.gridTemplateColumns = '1fr';
    } else {
        carousel.style.gridTemplateColumns = '1fr';
    }
}

window.addEventListener('resize', handleResponsiveCarousel);
document.addEventListener('DOMContentLoaded', handleResponsiveCarousel);
