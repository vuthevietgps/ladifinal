(function () {
    "use strict";

    var header = document.getElementById("siteHeader");
    var menuToggle = document.getElementById("menuToggle");
    var mainNav = document.getElementById("mainNav");
    var faqItems = document.querySelectorAll(".faq-item");
    var currentYear = document.getElementById("currentYear");

    function closeMenu() {
        if (!menuToggle || !mainNav) return;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Mở menu");
        mainNav.classList.remove("open");
        document.body.classList.remove("menu-open");
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            var willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
            menuToggle.setAttribute("aria-expanded", String(willOpen));
            menuToggle.setAttribute("aria-label", willOpen ? "Đóng menu" : "Mở menu");
            mainNav.classList.toggle("open", willOpen);
            document.body.classList.toggle("menu-open", willOpen);
        });

        mainNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") closeMenu();
        });
    }

    faqItems.forEach(function (item) {
        var button = item.querySelector(".faq-question");
        var symbol = button ? button.querySelector("b") : null;
        if (!button) return;

        button.addEventListener("click", function () {
            var shouldOpen = !item.classList.contains("active");

            faqItems.forEach(function (otherItem) {
                var otherButton = otherItem.querySelector(".faq-question");
                var otherSymbol = otherButton ? otherButton.querySelector("b") : null;
                otherItem.classList.remove("active");
                if (otherButton) otherButton.setAttribute("aria-expanded", "false");
                if (otherSymbol) otherSymbol.textContent = "+";
            });

            if (shouldOpen) {
                item.classList.add("active");
                button.setAttribute("aria-expanded", "true");
                if (symbol) symbol.textContent = "−";
            }
        });
    });

    function updateHeader() {
        if (header) header.classList.toggle("scrolled", window.scrollY > 12);
    }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (currentYear) currentYear.textContent = String(new Date().getFullYear());

    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var revealItems = document.querySelectorAll(".reveal");

    if (reducedMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach(function (item) { item.classList.add("visible"); });
    } else {
        var observer = new IntersectionObserver(function (entries, activeObserver) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    activeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

        revealItems.forEach(function (item) { observer.observe(item); });
    }
})();
