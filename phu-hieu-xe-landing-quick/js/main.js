// Scroll to form
function scrollToForm() {
    const formSection = document.getElementById('form-section');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Scroll to info section
function scrollToInfo() {
    const problemsSection = document.querySelector('.problems-section');
    if (problemsSection) {
        problemsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        vehicle_type: formData.get('vehicle_type'),
        load_capacity: formData.get('load_capacity'),
        purpose: formData.get('purpose'),
        current_permit: formData.get('current_permit'),
        notes: formData.get('notes'),
        timestamp: new Date().toISOString()
    };
    
    // Log the data (in real scenario, this would be sent to a server)
    console.log('Form Data:', data);
    
    // Store in localStorage
    let submissions = JSON.parse(localStorage.getItem('phu_hieu_submissions') || '[]');
    submissions.push(data);
    localStorage.setItem('phu_hieu_submissions', JSON.stringify(submissions));
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    event.target.reset();
}

// Show success message
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-popup';
    message.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <h3>Gửi Thành Công!</h3>
            <p>Chúng tôi sẽ liên hệ với bạn trong 24 giờ</p>
        </div>
    `;
    
    // Add styles for popup
    const style = document.createElement('style');
    style.innerHTML = `
        .success-popup {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: popupSlide 0.4s ease-out;
            max-width: 400px;
        }
        
        .success-content {
            text-align: center;
        }
        
        .success-icon {
            font-size: 48px;
            margin-bottom: 12px;
        }
        
        .success-popup h3 {
            margin-bottom: 8px;
            font-size: 20px;
        }
        
        .success-popup p {
            opacity: 0.95;
            font-size: 14px;
            margin: 0;
        }
        
        @keyframes popupSlide {
            from {
                opacity: 0;
                transform: translateX(400px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @media (max-width: 600px) {
            .success-popup {
                left: 20px;
                right: 20px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(message);
    
    // Remove after 4 seconds
    setTimeout(() => {
        message.style.animation = 'popupSlide 0.4s ease-out reverse';
        setTimeout(() => message.remove(), 400);
    }, 4000);
}

// Add smooth scroll to page load
document.addEventListener('DOMContentLoaded', function() {
    // Preload images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });
    
    // Add click tracking
    const buttons = document.querySelectorAll('.btn, a[href*="zalo"], a[href^="tel:"]');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Button clicked:', this.textContent);
            // You can add analytics tracking here
        });
    });
});

// Track form interactions
document.addEventListener('input', function(event) {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT' || event.target.tagName === 'TEXTAREA') {
        console.log('Form field changed:', event.target.name, event.target.value);
    }
}, true);
