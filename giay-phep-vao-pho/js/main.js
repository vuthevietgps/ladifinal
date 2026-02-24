// Zalo button
document.getElementById('zaloBtn')?.addEventListener('click',()=>{
  window.open('https://zalo.me/0363614511','_blank');
});

// Application Form
document.getElementById('applicationForm')?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const form = e.target;
  const name = form.name.value;
  const phone = form.phone.value;
  const plate = form.plate.value;
  const ownerType = form['owner-type'].value;
  const weight = form.weight.value;
  const notes = form.notes.value;
  
  const msg = `Kiểm tra giấy phép vào phố:\n- Tên: ${name}\n- Số ĐT: ${phone}\n- Biển số: ${plate}\n- Loại: ${ownerType}\n- Tải: ${weight}\n- Ghi chú: ${notes}`;
  
  window.open(`https://zalo.me/0363614511?text=${encodeURIComponent(msg)}`,'_blank');
  
  alert('✅ Cảm ơn! Chúng tôi sẽ liên hệ bạn sớm nhất.');
  form.reset();
});

// Submit button
document.getElementById('submitBtn')?.addEventListener('click',()=>{
  const msg='Tôi muốn gửi hồ sơ xin giấy phép vào phố. Vui lòng hướng dẫn!';
  window.open(`https://zalo.me/0363614511?text=${encodeURIComponent(msg)}`,'_blank');
});

// Buy button (if exists from other pages)
document.getElementById('buyBtn')?.addEventListener('click',()=>{
  alert('Liên hệ để đặt hàng!');
  window.location.href='tel:0363614511';
});
