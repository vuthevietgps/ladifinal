document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('consultForm');
  const body=document.body;

  const smoothLinks=document.querySelectorAll('a[href^="#"]');
  smoothLinks.forEach(link=>{
    link.addEventListener('click',e=>{
      const targetId=link.getAttribute('href');
      const target=document.querySelector(targetId);
      if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}
    });
  });

  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const name=form.name.value.trim();
      const phone=form.phone.value.trim();
      const type=form.querySelector('input[name="type"]:checked');
      const number=form.number.value.trim();
      if(!name||!phone||!type||!number){toast('Vui lòng điền đủ thông tin.');return;}
      toast('Đã nhận thông tin, chúng tôi sẽ liên hệ sớm!',true);
      form.reset();
    });
  }

  function toast(message,isSuccess=false){
    const note=document.createElement('div');
    note.className='toast';
    note.textContent=message;
    if(isSuccess)note.classList.add('success');
    body.appendChild(note);
    setTimeout(()=>note.classList.add('show'),30);
    setTimeout(()=>{note.classList.remove('show');setTimeout(()=>note.remove(),250);},3200);
  }
});
