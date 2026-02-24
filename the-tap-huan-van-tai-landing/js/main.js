// Zalo button
document.getElementById('zaloBtn')?.addEventListener('click',()=>{
  window.open('https://zalo.me/0363614511','_blank');
});

// Submit button
document.getElementById('submitBtn')?.addEventListener('click',()=>{
  const msg='Tôi muốn đăng ký tư vấn thẻ tập huấn nghiệp vụ vận tải. Vui lòng hướng dẫn!';
  window.open(`https://zalo.me/0363614511?text=${encodeURIComponent(msg)}`,'_blank');
});
