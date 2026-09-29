(function(){
    "use strict";
    document.querySelectorAll('a[href^="#"]').forEach(function(link){
        link.addEventListener("click",function(event){
            var target=document.querySelector(link.getAttribute("href"));
            if(!target){return;}
            event.preventDefault();
            target.scrollIntoView({behavior:"smooth",block:"start"});
        });
    });

    var items=document.querySelectorAll(".reveal");
    if(!("IntersectionObserver" in window)||window.matchMedia("(prefers-reduced-motion: reduce)").matches){
        items.forEach(function(item){item.classList.add("is-visible");});
        return;
    }

    var observer=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    },{threshold:.03,rootMargin:"0px 0px 40px 0px"});
    items.forEach(function(item){observer.observe(item);});
}());
