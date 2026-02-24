// Smooth scroll for navbar links
const links = document.querySelectorAll('a[href^="#"]');
links.forEach(a=>{
  a.addEventListener('click',e=>{
    const href = a.getAttribute('href');
    if (href.length > 1){
      const el = document.querySelector(href);
      if (el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
    }
  });
});

// Zalo popup
const zaloBtn = document.getElementById('zaloBtn');
const zaloPopup = document.getElementById('zaloPopup');
const popupClose = document.getElementById('popupClose');
if (zaloBtn && zaloPopup){
  zaloBtn.addEventListener('click',()=>{
    zaloPopup.classList.add('show');
    zaloPopup.setAttribute('aria-hidden','false');
  });
}
if (popupClose && zaloPopup){
  popupClose.addEventListener('click',()=>{
    zaloPopup.classList.remove('show');
    zaloPopup.setAttribute('aria-hidden','true');
  });
}

// Countdown: 30 minutes persistent
(function(){
  const KEY = 'tpvt_mau2_cd_end';
  const btn = document.getElementById('promoBtn');
  const elMin = document.getElementById('cdMin');
  const elSec = document.getElementById('cdSec');
  if(!elMin || !elSec) return;
  const now = Date.now();
  let end = localStorage.getItem(KEY);
  if(!end){
    end = now + 30*60*1000;
    localStorage.setItem(KEY, String(end));
  } else {
    end = parseInt(end,10);
    if (isNaN(end) || end < now){
      end = now + 30*60*1000;
      localStorage.setItem(KEY, String(end));
    }
  }
  const tick = () => {
    const t = end - Date.now();
    if (t <= 0){
      elMin.textContent = '00';
      elSec.textContent = '00';
      if (btn){ btn.setAttribute('disabled','true'); btn.classList.add('disabled'); btn.textContent = 'Ưu đãi đã kết thúc'; }
      return;
    }
    const m = Math.floor(t/60000);
    const s = Math.floor((t%60000)/1000);
    elMin.textContent = String(m).padStart(2,'0');
    elSec.textContent = String(s).padStart(2,'0');
    requestAnimationFrame(()=>setTimeout(tick, 250));
  };
  tick();
})();

// Form submission (basic guard only)
const form = document.getElementById('leadForm');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get('name');
    const phone = fd.get('phone');
    const note = fd.get('note') || '';
    if(!name || !phone){
      alert('Vui lòng nhập đủ Họ tên và Số điện thoại.');
      return;
    }
    const msg = `[THẺ TẬP HUẤN - MẪU 2]\nHọ tên: ${name}\nSĐT: ${phone}\nNội dung: ${note}`;
    const zaloUrl = 'https://zalo.me/84363614511';
    // For now, just open Zalo chat (or call fallback)
    window.open(zaloUrl, '_blank');
  });
}
