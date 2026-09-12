document.addEventListener('DOMContentLoaded', function () {
    var menuToggle = document.getElementById('menuToggle');
    var mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            var isOpen = mainNav.classList.toggle('open');
            document.body.classList.toggle('nav-open', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });

        mainNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mainNav.classList.remove('open');
                document.body.classList.remove('nav-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
            var target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    document.querySelectorAll('.faq-item').forEach(function (item) {
        var question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', function () {
            var willOpen = !item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(function (other) {
                other.classList.remove('active');
                var otherButton = other.querySelector('.faq-question');
                if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
            });

            if (willOpen) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    var countHours = document.getElementById('countHours');
    var countMinutes = document.getElementById('countMinutes');
    var countSeconds = document.getElementById('countSeconds');

    if (countHours && countMinutes && countSeconds) {
        var offerDuration = (2 * 60 * 60) + (45 * 60);
        var offerEnd = Date.now() + offerDuration * 1000;

        var pad = function (value) {
            return String(value).padStart(2, '0');
        };

        var renderCountdown = function () {
            var remaining = Math.max(0, Math.floor((offerEnd - Date.now()) / 1000));

            if (remaining <= 0) {
                offerEnd = Date.now() + offerDuration * 1000;
                remaining = offerDuration;
            }

            var hours = Math.floor(remaining / 3600);
            var minutes = Math.floor((remaining % 3600) / 60);
            var seconds = remaining % 60;

            countHours.textContent = pad(hours);
            countMinutes.textContent = pad(minutes);
            countSeconds.textContent = pad(seconds);
        };

        renderCountdown();
        window.setInterval(renderCountdown, 1000);
    }

});
