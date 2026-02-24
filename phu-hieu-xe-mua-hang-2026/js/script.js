const revealItems = document.querySelectorAll(".reveal-item");
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 40, 260)}ms`;
    observer.observe(item);
});

const yearNode = document.getElementById("year");
if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
}

const consultForm = document.getElementById("consult-form");
if (consultForm) {
    consultForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(consultForm);
        const customerName = (formData.get("name") || "").toString().trim();
        const phone = (formData.get("phone") || "").toString().trim();
        const vehicle = (formData.get("vehicle") || "").toString().trim();
        const province = (formData.get("province") || "").toString().trim();
        const note = (formData.get("note") || "").toString().trim();

        const message = [
            "[Dang ky tu van phu hieu xe]",
            `Ho ten: ${customerName}`,
            `So dien thoai: ${phone}`,
            `Loai xe: ${vehicle}`,
            `Tinh/Thanh: ${province}`,
            `Ghi chu: ${note || "Khong"}`
        ].join("\n");

        let copied = false;
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(message);
                copied = true;
            } catch (error) {
                copied = false;
            }
        }

        window.open("https://zalo.me/0363614511", "_blank", "noopener");

        if (copied) {
            alert("Da sao chep noi dung tu van. Ban chi can dan vao Zalo va gui di.");
        } else {
            alert(`Noi dung tu van:\n\n${message}\n\nHay copy va gui qua Zalo de duoc xu ly nhanh.`);
        }
    });
}
