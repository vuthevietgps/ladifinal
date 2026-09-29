document.addEventListener("DOMContentLoaded", function () {
    if (window.lucide) {
        window.lucide.createIcons();
    }

    document.querySelectorAll(".faq-item button").forEach(function (button) {
        button.addEventListener("click", function () {
            var item = button.closest(".faq-item");
            var wasOpen = item.classList.contains("active");

            document.querySelectorAll(".faq-item").forEach(function (faq) {
                faq.classList.remove("active");
                var faqButton = faq.querySelector("button");
                if (faqButton) {
                    faqButton.setAttribute("aria-expanded", "false");
                }
            });

            if (!wasOpen) {
                item.classList.add("active");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            var href = link.getAttribute("href");
            var target = href && href.length > 1 ? document.querySelector(href) : null;
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    // Contact conversions are owned by the platform-injected AdvancedTracking.
});
