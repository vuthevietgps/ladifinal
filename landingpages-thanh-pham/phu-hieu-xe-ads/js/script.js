document.addEventListener("DOMContentLoaded", function () {
    var faqButtons = document.querySelectorAll(".faq-question");

    faqButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var item = button.closest(".faq-item");
            var isOpen = item.classList.contains("active");

            document.querySelectorAll(".faq-item").forEach(function (other) {
                other.classList.remove("active");
                var otherButton = other.querySelector(".faq-question");
                if (otherButton) {
                    otherButton.setAttribute("aria-expanded", "false");
                }
            });

            if (!isOpen) {
                item.classList.add("active");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (event) {
            var selector = anchor.getAttribute("href");
            var target = selector && selector.length > 1 ? document.querySelector(selector) : null;
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
});
