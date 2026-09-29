(function () {
    "use strict";

    var menuButton = document.querySelector(".menu-toggle");
    var menu = document.querySelector(".main-nav");

    if (menuButton && menu) {
        menuButton.addEventListener("click", function () {
            var isOpen = menu.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        menu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                menu.classList.remove("open");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    var tabButtons = Array.prototype.slice.call(document.querySelectorAll("[data-tab]"));
    var panels = Array.prototype.slice.call(document.querySelectorAll(".doc-panel"));

    function selectTab(button) {
        tabButtons.forEach(function (item) {
            var selected = item === button;
            item.setAttribute("aria-selected", String(selected));
            item.tabIndex = selected ? 0 : -1;
        });

        panels.forEach(function (panel) {
            var selected = panel.id === "panel-" + button.dataset.tab;
            panel.hidden = !selected;
            panel.classList.toggle("active", selected);
        });
    }

    tabButtons.forEach(function (button, index) {
        button.addEventListener("click", function () { selectTab(button); });
        button.addEventListener("keydown", function (event) {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            var direction = event.key === "ArrowRight" ? 1 : -1;
            var next = (index + direction + tabButtons.length) % tabButtons.length;
            tabButtons[next].focus();
            selectTab(tabButtons[next]);
        });
    });

    document.querySelectorAll(".faq-item button").forEach(function (button) {
        button.addEventListener("click", function () {
            var item = button.closest(".faq-item");
            var isOpen = item.classList.contains("active");

            document.querySelectorAll(".faq-item").forEach(function (faq) {
                faq.classList.remove("active");
                faq.querySelector("button").setAttribute("aria-expanded", "false");
            });

            if (!isOpen) {
                item.classList.add("active");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });

    var reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach(function (item) { observer.observe(item); });
    } else {
        reveals.forEach(function (item) { item.classList.add("visible"); });
    }

    var year = document.getElementById("current-year");
    if (year) year.textContent = String(new Date().getFullYear());
}());
