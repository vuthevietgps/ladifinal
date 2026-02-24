function fakeSubmit(){
  const btn=document.querySelector('.form-section button.btn-primary');
  if(btn){btn.disabled=true;btn.textContent='Đã gửi (demo)';setTimeout(()=>{btn.disabled=false;btn.textContent='Gửi thông tin'},2000);} 
}
