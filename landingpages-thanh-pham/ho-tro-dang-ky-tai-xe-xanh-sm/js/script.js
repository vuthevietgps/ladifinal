(function () {
    "use strict";

    var form = document.getElementById("lead-form");
    var status = document.getElementById("form-status");
    var year = document.getElementById("current-year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    if (!form || !status) {
        return;
    }

    function setError(input, message) {
        if (!input) {
            return;
        }

        input.classList.toggle("invalid", Boolean(message));
        input.setAttribute("aria-invalid", message ? "true" : "false");

        var field = input.closest(".field");
        var error = field ? field.querySelector(".field-error") : null;
        if (error) {
            error.textContent = message;
        }
    }

    function normalizePhone(value) {
        return value.replace(/[^0-9+]/g, "");
    }

    function validateForm() {
        var valid = true;
        var fullname = form.elements.fullname;
        var phone = form.elements.phone;
        var province = form.elements.province;
        var vehicleStatus = form.elements.vehicle_status;
        var license = form.elements.license;
        var workTime = form.elements.work_time;
        var vehicle = form.querySelector('input[name="vehicle_type"]:checked');
        var consent = form.elements.consent;

        setError(fullname, fullname.value.trim().length >= 2 ? "" : "Vui lòng nhập họ và tên.");
        setError(phone, /^(\+?84|0)[0-9]{9}$/.test(normalizePhone(phone.value)) ? "" : "Vui lòng nhập số điện thoại hợp lệ.");
        setError(province, province.value.trim().length >= 2 ? "" : "Vui lòng nhập tỉnh/thành.");
        setError(vehicleStatus, vehicleStatus.value ? "" : "Vui lòng chọn tình trạng phương tiện.");
        setError(license, license.value ? "" : "Vui lòng chọn loại bằng lái.");
        setError(workTime, workTime.value ? "" : "Vui lòng chọn thời gian dự kiến.");

        if (fullname.value.trim().length < 2 ||
            !/^(\+?84|0)[0-9]{9}$/.test(normalizePhone(phone.value)) ||
            province.value.trim().length < 2 ||
            !vehicleStatus.value ||
            !license.value ||
            !workTime.value) {
            valid = false;
        }

        var groupError = form.querySelector(".group-error");
        if (groupError) {
            groupError.textContent = vehicle ? "" : "Vui lòng chọn loại xe bạn quan tâm.";
        }
        if (!vehicle) {
            valid = false;
        }

        var consentError = form.querySelector(".consent-error");
        if (consentError) {
            consentError.textContent = consent.checked ? "" : "Bạn cần đồng ý để được liên hệ tư vấn.";
        }
        if (!consent.checked) {
            valid = false;
        }

        return valid;
    }

    function buildMessage() {
        var data = new FormData(form);
        return [
            "ĐĂNG KÝ TƯ VẤN TÀI XẾ XANH SM",
            "Họ tên: " + data.get("fullname"),
            "Điện thoại: " + data.get("phone"),
            "Tỉnh/thành: " + data.get("province"),
            "Loại xe quan tâm: " + data.get("vehicle_type"),
            "Tình trạng phương tiện: " + data.get("vehicle_status"),
            "Bằng lái: " + data.get("license"),
            "Thời gian làm việc: " + data.get("work_time")
        ].join("\n");
    }

    form.addEventListener("input", function (event) {
        if (event.target.matches("input[type='text'], input[type='tel']")) {
            setError(event.target, "");
        }
    });

    form.addEventListener("change", function (event) {
        if (event.target.matches("select")) {
            setError(event.target, "");
        }
        if (event.target.matches('input[name="vehicle_type"]')) {
            form.querySelector(".group-error").textContent = "";
        }
        if (event.target.matches('input[name="consent"]')) {
            form.querySelector(".consent-error").textContent = "";
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        status.className = "form-status";
        status.textContent = "";

        if (!validateForm()) {
            status.className = "form-status error";
            status.textContent = "Vui lòng kiểm tra lại các thông tin bắt buộc.";
            var firstInvalid = form.querySelector(".invalid, input:invalid");
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;
        }

        var message = buildMessage();
        var zaloUrl = "https://zalo.me/0986284840";
        var opened = window.open(zaloUrl, "_blank");
        if (opened) {
            opened.opener = null;
        }

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(message).then(function () {
                status.className = "form-status success";
                status.textContent = "Đã sao chép thông tin. Hãy dán nội dung vào cửa sổ Zalo vừa mở để gửi tư vấn viên.";
            }).catch(function () {
                status.className = "form-status success";
                status.textContent = "Zalo đã được mở. Vui lòng gửi thông tin vừa điền cho tư vấn viên.";
            });
        } else {
            status.className = "form-status success";
            status.textContent = "Zalo đã được mở. Vui lòng gửi thông tin vừa điền cho tư vấn viên.";
        }

        if (!opened) {
            window.location.href = zaloUrl;
        }
    });
})();
