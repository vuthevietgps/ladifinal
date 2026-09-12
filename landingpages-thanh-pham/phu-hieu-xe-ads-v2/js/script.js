document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".faq button").forEach(function (button) {
        button.addEventListener("click", function () {
            var item = button.closest(".faq");
            var open = item.classList.contains("active");

            document.querySelectorAll(".faq").forEach(function (faq) {
                faq.classList.remove("active");
                var faqButton = faq.querySelector("button");
                if (faqButton) {
                    faqButton.setAttribute("aria-expanded", "false");
                }
            });

            if (!open) {
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
});
