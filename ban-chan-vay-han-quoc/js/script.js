document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});
}));

document.querySelector('.contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = e.target.querySelector('input[type="text"]').value;
    const phone = e.target.querySelector('input[type="tel"]').value;
    if(name && phone) {
        window.open(`https://wa.me/84376888888?text=Xin chào, tôi tên ${name}, SĐT: ${phone}. Tôi muốn hỏi về chân váy.`);
        e.target.reset();
    }
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.style.boxShadow = window.scrollY > 50 ? '0 5px 20px rgba(0,0,0,0.1)' : '0 2px 10px rgba(0,0,0,0.08)';
});
