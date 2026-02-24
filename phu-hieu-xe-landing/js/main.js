// Zalo
document.getElementById('zaloBtn')?.addEventListener('click',function(){
  window.open('https://zalo.me/0363614511','_blank');
});

// CTA Buttons
document.querySelectorAll('#ctaHero, #ctaFinal').forEach(btn=>{
  btn?.addEventListener('click',function(){
    document.getElementById('form').scrollIntoView({behavior:'smooth'});
  });
});

// Form Submission
document.getElementById('contactForm')?.addEventListener('submit',function(e){
  e.preventDefault();
  const name=this.querySelector('input[type="text"]').value;
  const phone=this.querySelector('input[type="tel"]').value;
  const message=`Khách hàng ${name} - ĐT: ${phone} - Kiểm tra xe miễn phí từ Landing Page`;
  window.open(`https://zalo.me/0363614511?text=${encodeURIComponent(message)}`,'_blank');
  this.reset();
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
  anchor.addEventListener('click',function(e){
    const href=this.getAttribute('href');
    if(href!=='#'){
      e.preventDefault();
      const target=document.querySelector(href);
      if(target)target.scrollIntoView({behavior:'smooth'});
    }
  });
});

document.addEventListener('DOMContentLoaded',function(){
  console.log('Phù Hiệu Xe Landing Page loaded');
});
