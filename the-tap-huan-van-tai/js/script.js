// Smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id.length>1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});

// Sticky header style on scroll
const header=document.querySelector('.header');
window.addEventListener('scroll',()=>{
  header.style.boxShadow = window.scrollY>10? '0 6px 24px rgba(0,0,0,.08)' : '0 4px 20px rgba(0,0,0,.06)';
});

// Zalo popup logic
const zaloBtn=document.getElementById('zaloBtn');
const zaloPopup=document.getElementById('zaloPopup');
const popupClose=document.getElementById('popupClose');

zaloBtn?.addEventListener('click',()=>{
  zaloPopup?.setAttribute('aria-hidden','false');
});

popupClose?.addEventListener('click',()=>{
  zaloPopup?.setAttribute('aria-hidden','true');
});

zaloPopup?.addEventListener('click',(e)=>{
  if(e.target===zaloPopup){
    zaloPopup.setAttribute('aria-hidden','true');
  }
});

// Lead form basic validation + WhatsApp/Zalo handoff
document.getElementById('leadForm')?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const f=e.target;
  const name=f.name.value.trim();
  const phone=f.phone.value.trim();
  const note=f.note.value.trim();

  if(!name||!phone){
    alert('Vui lòng nhập đủ Họ tên và Số điện thoại.');
    return;
  }

  const msg=`Xin chào! Tôi muốn đăng ký thẻ tập huấn vận tải.\n👤 Họ tên: ${name}\n📱 SĐT: ${phone}\n📝 Ghi chú: ${note||'Không'}\nVui lòng tư vấn giúp tôi!`;

  // Prefer Zalo on mobile, fallback WhatsApp
  const zaloUrl=`https://zalo.me/84363614511`; // 0363 614 511 -> 84 363614511
  const whatsapp=`https://wa.me/84363614511?text=${encodeURIComponent(msg)}`;

  if(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)){
    window.open(zaloUrl,'_blank');
  }else{
    const ok=confirm('Mở WhatsApp để gửi thông tin?\nChọn Cancel để mở Zalo.');
    window.open(ok?whatsapp:zaloUrl,'_blank');
  }

  f.reset();
});

// Promo countdown (30 minutes persistent)
(function(){
  const minEl=document.getElementById('cdMin');
  const secEl=document.getElementById('cdSec');
  if(!minEl||!secEl) return;

  const KEY='promoEndsAt';
  const now=Date.now();
  let ends=Number(localStorage.getItem(KEY)||0);
  if(!ends || ends<now){
    ends=now+30*60*1000; // 30 minutes
    localStorage.setItem(KEY,String(ends));
  }

  const btn=document.getElementById('promoBtn');

  function tick(){
    const t=ends-Date.now();
    if(t<=0){
      minEl.textContent='00';
      secEl.textContent='00';
      if(btn){ btn.textContent='Ưu đãi đã kết thúc'; btn.setAttribute('disabled','true'); btn.classList.remove('btn-primary'); btn.classList.add('btn-outline'); }
      return;
    }
    const m=Math.floor(t/60000);
    const s=Math.floor((t%60000)/1000);
    minEl.textContent=String(m).padStart(2,'0');
    secEl.textContent=String(s).padStart(2,'0');
    requestAnimationFrame(()=>{ setTimeout(tick,250); });
  }
  tick();
})();