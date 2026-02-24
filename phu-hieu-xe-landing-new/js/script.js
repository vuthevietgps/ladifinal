document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('consultForm');
    const successMessage = document.getElementById('successMessage');
    
    // Smooth scroll cho các anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Xử lý submit form
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Lấy dữ liệu form
        const formData = {
            fullname: document.getElementById('fullname').value,
            phone: document.getElementById('phone').value,
            vehicle_type: document.getElementById('vehicle_type').value,
            note: document.getElementById('note').value,
            source: 'phu-hieu-xe-landing',
            timestamp: new Date().toISOString()
        };
        
        // Validate số điện thoại
        const phonePattern = /^[0-9]{10,11}$/;
        if (!phonePattern.test(formData.phone)) {
            alert('Vui lòng nhập số điện thoại hợp lệ (10-11 số)');
            return;
        }
        
        // Gửi dữ liệu - có thể tích hợp API backend ở đây
        console.log('Form Data:', formData);
        
        // Giả lập gửi thành công
        submitFormData(formData);
    });
    
    function submitFormData(data) {
        // Có thể thay thế bằng API call thực tế
        // fetch('/api/submit-consult', {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify(data)
        // })
        // .then(response => response.json())
        // .then(result => {
        //     showSuccess();
        // })
        // .catch(error => {
        //     alert('Có lỗi xảy ra. Vui lòng thử lại!');
        // });
        
        // Hiện tại chỉ hiển thị thông báo thành công
        showSuccess();
    }
    
    function showSuccess() {
        // Ẩn form
        form.style.display = 'none';
        
        // Hiện thông báo thành công
        successMessage.style.display = 'block';
        
        // Scroll đến thông báo
        successMessage.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Có thể gửi dữ liệu qua Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'Lead',
                'event_label': 'Phu Hieu Xe Consult'
            });
        }
        
        // Reset form sau 5 giây (tùy chọn)
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            successMessage.style.display = 'none';
        }, 5000);
    }
    
    // Animation khi scroll
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
    
    // Áp dụng animation cho các sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Click to call tracking
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'event_category': 'Contact',
                    'event_label': 'Phone Click'
                });
            }
        });
    });
});
