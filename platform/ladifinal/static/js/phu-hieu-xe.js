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

    var quoteForm = document.getElementById("quoteForm");
    if (quoteForm) {
        quoteForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var vehicleType = document.getElementById("vehicleType").value || "Xe tải";
            var province = document.getElementById("province").value.trim();
            var note = document.getElementById("quoteNote").value.trim();
            var lines = [
                "Tôi cần nhận báo giá làm phù hiệu xe.",
                "Loại xe: " + vehicleType
            ];

            if (province) {
                lines.push("Tỉnh/thành: " + province);
            }

            if (note) {
                lines.push("Thông tin thêm: " + note);
            }

            lines.push("Vui lòng kiểm tra hồ sơ và tư vấn giúp tôi.");
            trackContact("zalo_quote");
            window.open("https://zalo.me/0986284840?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
        });
    }

    document.querySelectorAll("[data-track-contact]").forEach(function (item) {
        item.addEventListener("click", function () {
            trackContact(item.getAttribute("data-track-contact"));
        });
    });
});

function trackContact(type) {
    if (typeof window.gtag === "function") {
        window.gtag("event", "contact_click", {
            event_category: "Lead",
            event_label: type
        });
    }
}
