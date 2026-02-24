// Scroll to form smoothly
function scrollToForm(){const element=document.getElementById('formSection');if(element){element.scrollIntoView({behavior:'smooth',block:'start'})}}

// Form submission
document.getElementById('checkForm').addEventListener('submit',function(e){e.preventDefault();const formData={name:document.getElementById('name').value,phone:document.getElementById('phone').value,carType:document.querySelector('input[name="carType"]:checked').value,location:document.getElementById('location').value};console.log('Form Data:',formData);document.getElementById('checkForm').reset();showSuccessModal();setTimeout(()=>{const tel='0363614511';const message=`Xin chào, tôi là ${formData.name}, SĐT: ${formData.phone}. Tôi có xe ${formData.carType}, khu vực thường vào: ${formData.location}. Tôi muốn kiểm tra xem xe có được vào phố cấm không?`;const zaloUrl=`https://zalo.me/${tel}`;window.open(zaloUrl,'_blank')},2000)});

// Show success modal
function showSuccessModal(){const modal=document.getElementById('successModal');modal.classList.add('show');setTimeout(()=>{modal.classList.remove('show')},3000);}

// Close modal
function closeModal(){const modal=document.getElementById('successModal');modal.classList.remove('show')}

// Close modal when clicking outside
window.addEventListener('click',function(e){const modal=document.getElementById('successModal');if(e.target===modal){closeModal()}});

// Add entrance animation to elements
window.addEventListener('load',function(){const elements=document.querySelectorAll('.story-card,.risk-item,.benefit-item,.testimonial-card,.commitment-item');elements.forEach((el,index)=>{el.style.animation=`slideIn ${0.5 + index * 0.1}s ease forwards`;el.style.opacity='0'})});

// Smooth scroll for contact buttons
document.querySelectorAll('.contact-icon').forEach(icon=>{icon.addEventListener('click',function(e){const href=this.getAttribute('href');if(href&&href.startsWith('tel:')){e.preventDefault();window.location.href=href}})});

// Add interaction animations
document.querySelectorAll('.cta-btn').forEach(btn=>{btn.addEventListener('mouseenter',function(){this.style.transform='scale(1.05) translateY(-2px)'});btn.addEventListener('mouseleave',function(){this.style.transform='scale(1) translateY(0)'})});
