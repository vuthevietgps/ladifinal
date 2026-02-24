// main.js - hiệu ứng form, tuân thủ QUYTAC.md
window.addEventListener('DOMContentLoaded',function(){
  var f=document.getElementById('advice-form');
  if(f)f.onsubmit=function(e){e.preventDefault();alert('Cảm ơn bạn đã gửi thông tin! Chúng tôi sẽ liên hệ tư vấn sớm nhất.');this.reset();};
});
