document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.main-menu');
    const modal = document.getElementById('order-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    let lastFocusedElement = null;

    menuToggle?.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
    });

    menu?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            menuToggle?.setAttribute('aria-expanded', 'false');
        });
    });

    const openModal = (button) => {
        lastFocusedElement = button;
        modalTitle.textContent = button.dataset.product || 'Mẫu váy nàng chọn';
        modalPrice.textContent = button.dataset.price || '';
        modal.querySelectorAll('.size-options button').forEach((size) => size.classList.remove('active'));
        modal.hidden = false;
        document.body.classList.add('modal-open');
        modal.querySelector('.modal-close').focus();
    };

    const closeModal = () => {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
        lastFocusedElement?.focus();
    };

    document.querySelectorAll('.quick-view').forEach((button) => {
        button.addEventListener('click', () => openModal(button));
    });

    modal.querySelectorAll('[data-close-modal]').forEach((element) => {
        element.addEventListener('click', closeModal);
    });

    modal.querySelectorAll('.size-options button').forEach((button) => {
        button.addEventListener('click', () => {
            modal.querySelectorAll('.size-options button').forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.hidden) closeModal();
    });

    const offerEnd = Date.now() + (2 * 24 * 60 * 60 * 1000) + (12 * 60 * 60 * 1000) + (45 * 60 * 1000);
    const updateCountdown = () => {
        const remaining = Math.max(0, offerEnd - Date.now());
        const days = Math.floor(remaining / 86400000);
        const hours = Math.floor((remaining % 86400000) / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    };

    updateCountdown();
    window.setInterval(updateCountdown, 60000);
});
