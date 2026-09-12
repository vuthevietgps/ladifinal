(function(){
    var toggle=document.querySelector('.menu-toggle');
    var nav=document.getElementById('mobileNav');
    if(toggle&&nav){
        toggle.addEventListener('click',function(){
            var isOpen=nav.classList.toggle('active');
            toggle.setAttribute('aria-expanded',String(isOpen));
            var icon=toggle.querySelector('i');
            if(icon){ icon.className=isOpen?'fa-solid fa-xmark':'fa-solid fa-bars'; }
        });
        nav.querySelectorAll('a').forEach(function(link){
            link.addEventListener('click',function(){
                nav.classList.remove('active');
                toggle.setAttribute('aria-expanded','false');
                var icon=toggle.querySelector('i');
                if(icon){ icon.className='fa-solid fa-bars'; }
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
        anchor.addEventListener('click',function(event){
            var target=document.querySelector(anchor.getAttribute('href'));
            if(target){
                event.preventDefault();
                target.scrollIntoView({behavior:'smooth',block:'start'});
            }
        });
    });

    document.querySelectorAll('.faq-item button').forEach(function(button){
        button.addEventListener('click',function(){
            var item=button.closest('.faq-item');
            var willOpen=!item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(function(other){
                other.classList.remove('active');
                var otherButton=other.querySelector('button');
                if(otherButton){ otherButton.setAttribute('aria-expanded','false'); }
            });
            if(willOpen){
                item.classList.add('active');
                button.setAttribute('aria-expanded','true');
            }
        });
    });

    var header=document.querySelector('.site-header');
    if(header){
        window.addEventListener('scroll',function(){
            header.classList.toggle('is-scrolled',window.scrollY>8);
        },{passive:true});
    }
})();
