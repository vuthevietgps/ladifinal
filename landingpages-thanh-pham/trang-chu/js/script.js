/* Mobile Menu Toggle */
(function(){
    var toggle=document.querySelector('.menu-toggle');
    var nav=document.getElementById('mobileNav');
    if(!toggle||!nav)return;
    toggle.addEventListener('click',function(){
        nav.classList.toggle('active');
        var icon=toggle.querySelector('i');
        if(nav.classList.contains('active')){
            icon.className='fas fa-times';
        }else{
            icon.className='fas fa-bars';
        }
    });
    /* Close mobile nav on link click */
    nav.querySelectorAll('a').forEach(function(link){
        link.addEventListener('click',function(){
            nav.classList.remove('active');
            toggle.querySelector('i').className='fas fa-bars';
        });
    });
})();

/* Smooth scroll for anchor links */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
        var target=document.querySelector(this.getAttribute('href'));
        if(target){
            e.preventDefault();
            target.scrollIntoView({behavior:'smooth'});
        }
    });
});

/* Header shadow on scroll */
(function(){
    var header=document.querySelector('.header');
    if(!header)return;
    window.addEventListener('scroll',function(){
        if(window.scrollY>10){
            header.style.boxShadow='0 2px 16px rgba(0,0,0,.1)';
        }else{
            header.style.boxShadow='0 1px 8px rgba(0,0,0,.06)';
        }
    });
})();

/* Simple scroll animation */
(function(){
    var elements=document.querySelectorAll('.product-card,.why-card,.pricing-card,.step,.pain-card,.contact-item,.pain-group,.pain-cta');
    if(!elements.length)return;
    var observer=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                entry.target.style.opacity='1';
                entry.target.style.transform='translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    },{threshold:0.1});
    elements.forEach(function(el){
        el.style.opacity='0';
        el.style.transform='translateY(24px)';
        el.style.transition='opacity .5s ease, transform .5s ease';
        observer.observe(el);
    });
})();

/* Contact form handler */
(function(){
    var form=document.getElementById('contactForm');
    if(!form)return;
    form.addEventListener('submit',function(e){
        e.preventDefault();
        var btn=form.querySelector('button[type="submit"]');
        var originalText=btn.innerHTML;
        btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        btn.disabled=true;
        setTimeout(function(){
            btn.innerHTML='<i class="fas fa-check"></i> Đã gửi thành công!';
            btn.style.background='#27ae60';
            setTimeout(function(){
                btn.innerHTML=originalText;
                btn.style.background='';
                btn.disabled=false;
                form.reset();
            },2500);
        },1200);
    });
})();
