document.addEventListener('DOMContentLoaded',()=>{
  // Countdown timer
  function updateCountdown(){
    const hoursEl=document.getElementById('hours');
    const minutesEl=document.getElementById('minutes');
    const secondsEl=document.getElementById('seconds');
    const ctaHoursEl=document.getElementById('cta-hours');
    const ctaMinutesEl=document.getElementById('cta-minutes');
    const ctaSecondsEl=document.getElementById('cta-seconds');
    
    let hours=parseInt(hoursEl.textContent);
    let minutes=parseInt(minutesEl.textContent);
    let seconds=parseInt(secondsEl.textContent);
    
    const updateTime=()=>{
      if(seconds>0){
        seconds--;
      }else if(minutes>0){
        minutes--;
        seconds=59;
      }else if(hours>0){
        hours--;
        minutes=59;
        seconds=59;
      }
      
      hoursEl.textContent=String(hours).padStart(2,'0');
      minutesEl.textContent=String(minutes).padStart(2,'0');
      secondsEl.textContent=String(seconds).padStart(2,'0');
      ctaHoursEl.textContent=String(hours).padStart(2,'0');
      ctaMinutesEl.textContent=String(minutes).padStart(2,'0');
      ctaSecondsEl.textContent=String(seconds).padStart(2,'0');
    };
    
    setInterval(updateTime,1000);
  }
  
  updateCountdown();
  
  // Form submission
  const form=document.getElementById('trainingForm');
  if(form){
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const fullname=document.getElementById('fullname').value.trim();
      const phone=document.getElementById('phone').value.trim();
      const targetType=document.getElementById('targetType').value;
      const quantity=document.getElementById('quantity').value;
      
      if(!fullname||!phone){
        alert('Vui lòng nhập Họ & Tên và Số điện thoại');
        return;
      }
      
      const message=`[Tư vấn Thẻ Tập Huấn VT]\nHọ & Tên: ${fullname}\nSĐT: ${phone}\nĐối tượng: ${targetType}\nSố lượng: ${quantity}`;
      const zaloUrl=`https://zalo.me/0363614511?msg=${encodeURIComponent(message)}`;
      window.open(zaloUrl,'_blank');
    });
  }
  
  // CTA buttons ripple effect
  const ctaButtons=document.querySelectorAll('.btn-cta');
  ctaButtons.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
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
    });
  });
  
  // IntersectionObserver for animations
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
      }
    });
  },{threshold:0.15});
  
  document.querySelectorAll('.section,.solution-card,.problem-card,.feedback-card,.contact-box').forEach(el=>observer.observe(el));
});

// Ripple effect styles
const style=document.createElement('style');
style.textContent=`
  .ripple{position:absolute;border-radius:50%;transform:scale(0);animation:ripple 600ms linear;background:rgba(255,255,255,0.7);pointer-events:none}
  @keyframes ripple{to{transform:scale(4);opacity:0}}
`;
document.head.appendChild(style);
