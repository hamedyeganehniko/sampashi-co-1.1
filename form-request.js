// ===== فرم درخواست خدمات =====
(function() {
  'use strict';

  const form = document.getElementById('pestRequestForm');
  const successMessage = document.getElementById('formSuccess');
  const submitBtn = form.querySelector('.btn-form-submit');

  // اعتبارسنجی هر فیلد
  function validateField(field) {
    const group = field.closest('.pest-form-group') || field.closest('.pest-form-checkbox-group');
    if (!group) return true;

    let isValid = true;

    // چک‌باکس
    if (field.type === 'checkbox') {
      isValid = field.checked;
    }
    // فیلدهای متنی
    else if (field.hasAttribute('required')) {
      const value = field.value.trim();
      if (field.type === 'email') {
        isValid = value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      } else if (field.type === 'tel') {
        isValid = value === '' || /^[\d\s\-+]{7,15}$/.test(value);
      } else if (field.type === 'number') {
        isValid = value === '' || !isNaN(value);
      } else {
        isValid = value.length > 0;
      }
    }

    group.classList.toggle('error', !isValid);
    return isValid;
  }

  // اعتبارسنجی کل فرم
  function validateForm() {
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let allValid = true;

    fields.forEach(field => {
      const isValid = validateField(field);
      if (!isValid) allValid = false;
    });

    // چک‌باکس موافقت
    const agree = document.getElementById('formAgree');
    const agreeGroup = agree.closest('.pest-form-checkbox-group');
    if (!agree.checked) {
      agreeGroup.classList.add('error');
      allValid = false;
    } else {
      agreeGroup.classList.remove('error');
    }

    return allValid;
  }

  // رویدادهای اعتبارسنجی زنده
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', function() {
      if (this.hasAttribute('required') || this.type === 'email' || this.type === 'tel' || this.type === 'number') {
        validateField(this);
      }
    });

    field.addEventListener('input', function() {
      const group = this.closest('.pest-form-group');
      if (group && group.classList.contains('error')) {
        validateField(this);
      }
    });

    field.addEventListener('change', function() {
      if (this.type === 'checkbox') {
        const group = this.closest('.pest-form-checkbox-group');
        if (group && group.classList.contains('error')) {
          validateField(this);
        }
      }
    });
  });

  // ارسال فرم
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // اعتبارسنجی نهایی
    if (!validateForm()) {
      // اسکرول به اولین خطا
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = firstError.querySelector('input, select, textarea');
        if (input) input.focus();
      }
      return;
    }

    // غیرفعال کردن دکمه
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';

    // شبیه‌سازی ارسال (در واقعیت fetch به سرور)
    setTimeout(function() {
      // نمایش پیام موفقیت
      successMessage.classList.add('show');

      // ریست فرم
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-chevron-left"></i> ارسال درخواست';

      // پاک کردن خطاها
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

      // اسکرول به پیام موفقیت
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // مخفی کردن پیام موفقیت بعد از ۶ ثانیه (اختیاری)
      // setTimeout(() => {
      //   successMessage.classList.remove('show');
      // }, 6000);
    }, 1500);
  });

})();