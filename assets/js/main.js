/* OKO — лендинг. Vanilla JS, без бібліотек.
   Модулі: хедер (скрол + мобільне меню з фокус-трапом),
   хіро «Увімкнути OKO», предвибір ролі з хеша, форма лідів. */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Хедер: тонкий бордер при скролі ---------- */

  const header = document.querySelector('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Мобільне меню: бургер + фокус-трап ---------- */

  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.getElementById('site-nav');
  let lastFocused = null;

  const isMenuOpen = () => document.body.classList.contains('menu-open');

  function openMenu() {
    lastFocused = document.activeElement;
    document.body.classList.add('menu-open');
    navToggle.setAttribute('aria-expanded', 'true');
    const first = nav.querySelector('a, button');
    if (first) first.focus();
  }

  function closeMenu(returnFocus = true) {
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
    if (returnFocus && lastFocused) lastFocused.focus();
  }

  if (navToggle && nav && header) {
    navToggle.addEventListener('click', () => (isMenuOpen() ? closeMenu() : openMenu()));

    // клік по лінку меню — закриваємо, фокус лишаємо на цілі переходу
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMenu(false);
    });

    // фокус-трап у межах хедера (лого + лінки + бургер) і Esc
    document.addEventListener('keydown', (e) => {
      if (!isMenuOpen()) return;
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = Array.from(header.querySelectorAll('a, button'));
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ---------- Хіро: «Увімкнути OKO» (§4) ---------- */

  const player = document.querySelector('[data-player]');
  const okoBtn = document.querySelector('[data-oko-btn]');
  const okoLabel = document.querySelector('[data-oko-label]');
  const captions = Array.from(document.querySelectorAll('[data-caption]'));
  const CAPTION_INTERVAL = 2500; // ~2.5с між репліками, як у брифі
  let capTimers = [];

  if (player && okoBtn && captions.length) {
    okoBtn.addEventListener('click', () => {
      // повторний клік — програємо сценарій спочатку
      capTimers.forEach(clearTimeout);
      capTimers = [];
      captions.forEach((line) => { line.hidden = true; });

      player.classList.add('is-on');
      okoBtn.setAttribute('aria-pressed', 'true');
      if (okoLabel) okoLabel.textContent = 'OKO описує лекцію';

      if (reduceMotion.matches) {
        // reduced-motion: без таймерів — усі репліки одразу, хвиля статична (CSS)
        captions.forEach((line) => { line.hidden = false; });
        return;
      }
      captions.forEach((line, i) => {
        capTimers.push(setTimeout(() => { line.hidden = false; }, 500 + i * CAPTION_INTERVAL));
      });
    });
  }

  /* ---------- CTA → форма: роль із хеша (#beta / #pilot) ---------- */

  const roleSelect = document.querySelector('[data-role-select]');
  const ROLE_BY_HASH = { '#beta': 'student', '#pilot': 'platform' };

  function applyRoleFromHash() {
    const role = ROLE_BY_HASH[window.location.hash];
    if (role && roleSelect) roleSelect.value = role;
  }
  applyRoleFromHash();
  window.addEventListener('hashchange', applyRoleFromHash);

  /* ---------- Форма лідів: помилки текстом + fetch-відправка ---------- */

  const form = document.querySelector('[data-lead-form]');
  const status = document.querySelector('[data-form-status]');

  function showStatus(kind) {
    if (!status) return;
    status.classList.add('is-visible');
    status.classList.toggle('is-success', kind === 'success');
    status.classList.toggle('is-error', kind === 'error');
    status.textContent = kind === 'success'
      ? 'Дякуємо! Відповімо протягом 1–2 днів.'
      : 'Щось пішло не так. Спробуй ще раз або напиши нам на email із футера.';
  }

  function errorTextFor(field) {
    if (field.validity.valueMissing) {
      return field.name === 'email'
        ? 'Впиши email — без нього не зможемо відповісти.'
        : 'Це поле обов’язкове.';
    }
    if (field.validity.typeMismatch && field.type === 'email') {
      return 'Перевір формат email — наприклад, name@university.edu.';
    }
    return 'Перевір це поле, будь ласка.';
  }

  function showFieldError(field) {
    const errEl = document.getElementById('err-' + field.id);
    if (!errEl) return;
    errEl.textContent = errorTextFor(field);
    errEl.hidden = false;
    field.setAttribute('aria-invalid', 'true');
  }

  function clearFieldError(field) {
    const errEl = document.getElementById('err-' + field.id);
    if (errEl) {
      errEl.textContent = '';
      errEl.hidden = true;
    }
    field.removeAttribute('aria-invalid');
  }

  if (form) {
    const fields = Array.from(form.querySelectorAll('input, select, textarea'));

    fields.forEach((field) => {
      // нативна валідація лишається, але замість бульбашок — текст помилки
      field.addEventListener('invalid', (e) => {
        e.preventDefault();
        showFieldError(field);
        const firstInvalid = fields.find((f) => !f.validity.valid);
        if (firstInvalid === field) field.focus();
      });
      field.addEventListener('input', () => clearFieldError(field));
    });

    form.addEventListener('submit', (e) => {
      const action = form.getAttribute('action') || '';
      const isConfigured = action.includes('formspree.io');

      e.preventDefault();

      // TODO(Formspree): поки action="#", реальна відправка НЕ відбувається —
      // показуємо стан успіху локально, щоб перевіряти UX. Після підстановки
      // endpoint'а цей блок автоматично перемкнеться на fetch нижче.
      if (!isConfigured) {
        showStatus('success');
        form.reset();
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then((res) => {
          if (res.ok) {
            showStatus('success');
            form.reset();
          } else {
            showStatus('error');
          }
        })
        .catch(() => {
          // фолбек: звичайний POST з перезавантаженням сторінки
          form.submit();
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
})();
