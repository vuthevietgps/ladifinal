document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('consultForm')||document.getElementById('checkForm');
  const ctaButtons=document.querySelectorAll('.btn-cta');
  const phoneLink=document.querySelector('.float-btn.phone');
  const zaloLink=document.querySelector('.float-btn.zalo');

  function addRipple(e){
    const btn=e.currentTarget;
    const circle=document.createElement('span');
    const diameter=Math.max(btn.clientWidth,btn.clientHeight);
    const radius=diameter/2;
    circle.style.width=circle.style.height=`${diameter}px`;
    circle.style.left=`${e.clientX-btn.getBoundingClientRect().left-radius}px`;
    circle.style.top=`${e.clientY-btn.getBoundingClientRect().top-radius}px`;
    circle.classList.add('ripple');
    const ripple=btn.getElementsByClassName('ripple')[0];
    if(ripple){ripple.remove();}
    btn.appendChild(circle);
  }

  ctaButtons.forEach(btn=>{
    btn.addEventListener('click',addRipple);
  });

  if(form){
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const fullname=document.getElementById('fullname').value.trim();
      const phone=document.getElementById('phone').value.trim();
      const vehicleType=document.getElementById('vehicleType').value;
      const area=document.getElementById('area').value.trim();
      if(!fullname||!phone){
        alert('Vui lòng nhập Họ & Tên và Số điện thoại');
        return;
      }
      const message=`[Tư vấn Giấy phép vào phố]\nHọ & Tên: ${fullname}\nSĐT: ${phone}\nLoại xe: ${vehicleType}\nKhu vực xin phép: ${area}`;
      const zaloUrl=`https://zalo.me/0931435252?msg=${encodeURIComponent(message)}`;
      window.open(zaloUrl,'_blank');
    });
  }

  if(phoneLink){
    phoneLink.addEventListener('click',()=>{
      console.log('Click Hotline');
    });
  }
  if(zaloLink){
    zaloLink.addEventListener('click',()=>{
      console.log('Click Zalo');
    });
  }

  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
      }
    });
  },{threshold:0.15});
  document.querySelectorAll('.section,.solution-card,.problem-card,.feedback-card,.contact-box,.warning-card').forEach(el=>observer.observe(el));
});

const style=document.createElement('style');
style.textContent=`
  .ripple{position:absolute;border-radius:50%;transform:scale(0);animation:ripple 600ms linear;background:rgba(255,255,255,0.7);pointer-events:none}
  @keyframes ripple{to{transform:scale(4);opacity:0}}
`;
document.head.appendChild(style);
