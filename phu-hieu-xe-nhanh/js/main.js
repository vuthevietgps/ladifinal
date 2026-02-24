// Countdown Timer
function startCountdown(){
  const endDate=new Date();
  endDate.setDate(endDate.getDate()+3);
  endDate.setHours(23,59,59,999);
  
  function updateCountdown(){
    const now=new Date().getTime();
    const distance=endDate.getTime()-now;
    
    if(distance<=0){
      document.getElementById('days').textContent='00';
      document.getElementById('hours').textContent='00';
      document.getElementById('minutes').textContent='00';
      document.getElementById('seconds').textContent='00';
      return;
    }
    
    const days=Math.floor(distance/(1000*60*60*24));
    const hours=Math.floor((distance%(1000*60*60*24))/(1000*60*60));
    const minutes=Math.floor((distance%(1000*60*60))/(1000*60));
    const seconds=Math.floor((distance%(1000*60))/1000);
    
    document.getElementById('days').textContent=String(days).padStart(2,'0');
    document.getElementById('hours').textContent=String(hours).padStart(2,'0');
    document.getElementById('minutes').textContent=String(minutes).padStart(2,'0');
    document.getElementById('seconds').textContent=String(seconds).padStart(2,'0');
  }
  
  updateCountdown();
  setInterval(updateCountdown,1000);
}

// CTA Buttons
document.getElementById('zaloBtn')?.addEventListener('click',function(){
  window.open('https://zalo.me/0363614511','_blank');
});

document.querySelectorAll('#ctaHero, #ctaCTA').forEach(btn=>{
  btn?.addEventListener('click',function(){
    window.open('https://zalo.me/0363614511','_blank');
  });
});

// Start countdown on load
document.addEventListener('DOMContentLoaded',function(){
  startCountdown();
  console.log('Phù Hiệu Xe landing page loaded');
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
