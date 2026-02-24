(()=>{
  const links=[...document.querySelectorAll('a[href^="#"]')];
  links.forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length>1){const el=document.querySelector(id);if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'});}}}));
  // Auto-close other FAQs when one opens
  const faqs=[...document.querySelectorAll('#faq details')];
  faqs.forEach(d=>d.addEventListener('toggle',()=>{if(d.open){faqs.filter(x=>x!==d).forEach(x=>x.open=false)}}));

  // Promo modal + countdown (48h from first visit)
  const modal=document.getElementById('promoModal');
  const closeEls=[...document.querySelectorAll('[data-close="modal"]')];
  function openModal(){ if(modal){ modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); } }
  function closeModal(){ if(modal){ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); } }
  closeEls.forEach(el=>el.addEventListener('click',closeModal));
  const navPromo=document.getElementById('nav-promo');
  const btnPromo=document.getElementById('btn-promo');
  [navPromo, btnPromo].forEach(el=>{ if(el){ el.addEventListener('click',e=>{ e.preventDefault(); openModal(); }); } });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });

  try{
    const LS_KEY='rfid_promo_deadline';
    let deadline=parseInt(localStorage.getItem(LS_KEY)||'0',10);
    const now=Date.now();
    if(!deadline || deadline<now){
      // 48h from now
      deadline=now+48*60*60*1000;
      localStorage.setItem(LS_KEY,String(deadline));
    }
    // Auto open modal shortly after load
    setTimeout(openModal, 600);

    const daysEl=document.getElementById('cd-days');
    const hrsEl=document.getElementById('cd-hours');
    const minsEl=document.getElementById('cd-mins');
    const secsEl=document.getElementById('cd-secs');

    function pad(n){return n<10?('0'+n):String(n)}
    function tick(){
      const t=deadline-Date.now();
      if(t<=0){ daysEl.textContent='00'; hrsEl.textContent='00'; minsEl.textContent='00'; secsEl.textContent='00'; return; }
      const d=Math.floor(t/86400000);
      const h=Math.floor((t%86400000)/3600000);
      const m=Math.floor((t%3600000)/60000);
      const s=Math.floor((t%60000)/1000);
      daysEl.textContent=pad(d); hrsEl.textContent=pad(h); minsEl.textContent=pad(m); secsEl.textContent=pad(s);
      requestAnimationFrame(()=>setTimeout(tick, 250));
    }
    tick();
  }catch(_e){ /* no-op */ }
})();
