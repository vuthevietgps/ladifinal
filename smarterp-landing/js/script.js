document.addEventListener("DOMContentLoaded", function () {
    var topbar = document.querySelector(".topbar");
    var revealElements = document.querySelectorAll(".reveal");
    var counterElements = document.querySelectorAll("[data-count]");

    function syncTopbar() {
        if (!topbar) {
            return;
        }

        if (window.scrollY > 20) {
            topbar.classList.add("scrolled");
        } else {
            topbar.classList.remove("scrolled");
        }
    }

    syncTopbar();
    window.addEventListener("scroll", syncTopbar, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (event) {
            var target = document.querySelector(this.getAttribute("href"));
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    if ("IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.14,
            rootMargin: "0px 0px -48px 0px"
        });

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });

        var counterObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.35
        });

        counterElements.forEach(function (element) {
            counterObserver.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });
        counterElements.forEach(animateCounter);
    }

    function animateCounter(element) {
        var target = parseInt(element.dataset.count || "0", 10);
        var prefix = element.dataset.prefix || "";
        var suffix = element.dataset.suffix || "";
        var duration = 1300;
        var startTime = null;

        function tick(timestamp) {
            if (!startTime) {
                startTime = timestamp;
            }

            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(target * eased);
            element.textContent = prefix + current + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
    }
});
