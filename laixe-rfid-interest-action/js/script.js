// CTA helper
function openZalo(message){
  const url=`https://zalo.me/0363614511?text=${encodeURIComponent(message)}`;
  window.open(url,'_blank');
}

// CTA buttons
['ctaHero','ctaPanel','ctaPrice'].forEach(id=>{
  const el=document.getElementById(id);
  if(el){
    el.addEventListener('click',()=>openZalo('Tôi muốn làm thẻ quẹt lái xe RFID. Hãy báo giá và hướng dẫn hồ sơ.'));
  }
});

// Form submit
const form=document.getElementById('ctaForm');
if(form){
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=form.name.value.trim();
    const phone=form.phone.value.trim();
    const vehicle=form.vehicle.value;
    const need=form.need.value.trim();
    const message=`Tôi muốn làm thẻ quẹt lái xe RFID:\n- Họ tên: ${name}\n- SĐT: ${phone}\n- Loại xe: ${vehicle}\n- Nhu cầu: ${need}\nVui lòng tư vấn và báo giá nhanh.\n`;
    openZalo(message);
    form.reset();
  });
}

// Smooth scroll for in-page anchors
for(const link of document.querySelectorAll('a[href^="#"]')){
  link.addEventListener('click',e=>{
    const target=document.querySelector(link.getAttribute('href'));
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});}
  });
}

// Simple fade-in on scroll
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('fade-in');observer.unobserve(entry.target);}
  });
},{threshold:0.12});

for(const el of document.querySelectorAll('.card,.pricing-box,.panel-card,.proof-card,.final-card')){
  observer.observe(el);
}

// Fade-in style injection
const style=document.createElement('style');
style.textContent=`.fade-in{animation:fadeIn .6s ease forwards}@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`;
document.head.appendChild(style);
