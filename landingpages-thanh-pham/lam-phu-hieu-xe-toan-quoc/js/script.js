(function(){
    "use strict";

    var vehicleCopy={
        "Xe tải":"Gửi đăng ký xe và đăng kiểm để được kiểm tra trước.",
        "Xe hợp đồng":"Gửi đăng ký xe, đăng kiểm và thông tin đơn vị vận tải để được hướng dẫn.",
        "Loại xe khác":"Gửi ảnh giấy tờ đang có và mô tả nhu cầu để được phân loại hồ sơ."
    };

    var vehicleButtons=document.querySelectorAll(".vehicle-option");
    var selectionNote=document.getElementById("selection-note");

    vehicleButtons.forEach(function(button){
        button.addEventListener("click",function(){
            vehicleButtons.forEach(function(item){item.classList.remove("is-active");});
            button.classList.add("is-active");
            var vehicle=button.getAttribute("data-vehicle");
            selectionNote.innerHTML="Đã chọn: <strong>"+vehicle+"</strong>. "+vehicleCopy[vehicle];
        });
    });

    document.querySelectorAll(".faq-item button").forEach(function(button){
        button.addEventListener("click",function(){
            var item=button.closest(".faq-item");
            var wasOpen=item.classList.contains("is-open");
            document.querySelectorAll(".faq-item").forEach(function(faq){
                faq.classList.remove("is-open");
                faq.querySelector("button").setAttribute("aria-expanded","false");
            });
            if(!wasOpen){
                item.classList.add("is-open");
                button.setAttribute("aria-expanded","true");
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function(link){
        link.addEventListener("click",function(event){
            var target=document.querySelector(link.getAttribute("href"));
            if(target){
                event.preventDefault();
                target.scrollIntoView({behavior:"smooth",block:"start"});
            }
        });
    });
})();
