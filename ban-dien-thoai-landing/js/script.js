const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const target = button.getAttribute('data-target');
        tabButtons.forEach((btn) => btn.classList.remove('active'));
        tabPanels.forEach((panel) => panel.classList.remove('active'));
        button.classList.add('active');
        const activePanel = document.getElementById(target);
        if (activePanel) {
            activePanel.classList.add('active');
        }
    });
});

const totalSeconds = 48 * 60 * 60;
let remainSeconds = totalSeconds;

const hourEl = document.getElementById('cd-hour');
const minEl = document.getElementById('cd-min');
const secEl = document.getElementById('cd-sec');

function renderCountdown() {
    const hours = Math.floor(remainSeconds / 3600);
    const minutes = Math.floor((remainSeconds % 3600) / 60);
    const seconds = remainSeconds % 60;

    if (hourEl) hourEl.textContent = String(hours).padStart(2, '0');
    if (minEl) minEl.textContent = String(minutes).padStart(2, '0');
    if (secEl) secEl.textContent = String(seconds).padStart(2, '0');
}

renderCountdown();
setInterval(() => {
    remainSeconds = remainSeconds <= 0 ? totalSeconds : remainSeconds - 1;
    renderCountdown();
}, 1000);

const quickForm = document.getElementById('quick-form');
if (quickForm) {
    quickForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Đã nhận yêu cầu. Tư vấn viên sẽ liên hệ qua số bạn cung cấp.');
        quickForm.reset();
    });
}
