/* OKO — лендинг. Vanilla JS, без бібліотек.
   Модулі: i18n-хелпери, хедер (скрол + мобільне меню з фокус-трапом),
   хіро «Увімкнути OKO», предвибір ролі з хеша, форма лідів. */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const t = (key) => (window.OKO_I18N ? window.OKO_I18N.t(key) : key);

  function updateOkoLabel() {
    const okoBtn = document.querySelector('[data-oko-btn]');
    const okoLabel = document.querySelector('[data-oko-label]');
    const playIcon = document.querySelector('[data-oko-icon-play]');
    const pauseIcon = document.querySelector('[data-oko-icon-pause]');
    const audio = document.querySelector('[data-hero-audio]');
    if (!okoBtn || !okoLabel) return;

    let key = 'oko_on';
    if (audio?.src && !audio.ended) {
      if (!audio.paused) key = 'oko_pause';
      else if (audio.currentTime > 0) key = 'oko_resume';
    }
    okoLabel.textContent = t(key);

    const showPlay = key === 'oko_resume';
    const showPause = key === 'oko_pause';
    if (playIcon) playIcon.classList.toggle('is-shown', showPlay);
    if (pauseIcon) pauseIcon.classList.toggle('is-shown', showPause);
  }

  document.addEventListener('oko:langchange', updateOkoLabel);

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
  const heroAudio = document.querySelector('[data-hero-audio]');
  const timelineFill = document.querySelector('[data-timeline-fill]');
  const playerTime = document.querySelector('[data-player-time]');

  const HERO_AUDIO = {
    en: 'assets/audio/newton_eng.mp3',
    uk: 'assets/audio/newton_ukr.mp3',
  };
  const LECTURE_TOTAL_SEC = 36 * 60 + 40;
  const LECTURE_START_SEC = 12 * 60 + 26;
  const START_PERCENT = (LECTURE_START_SEC / LECTURE_TOTAL_SEC) * 100;

  let progressAnim = null;
  let demoDurationSec = 0;

  function getLang() {
    return window.OKO_I18N?.getLang() || 'en';
  }

  function heroAudioSrc() {
    return HERO_AUDIO[getLang()] || HERO_AUDIO.en;
  }

  function formatPlayerTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function setTimeline(percent, elapsedSec) {
    if (timelineFill) timelineFill.style.width = `${percent}%`;
    if (playerTime) {
      playerTime.textContent = `${formatPlayerTime(elapsedSec)} / ${formatPlayerTime(LECTURE_TOTAL_SEC)}`;
    }
  }

  function stopProgressAnim() {
    if (progressAnim) {
      cancelAnimationFrame(progressAnim);
      progressAnim = null;
    }
  }

  function setHeroActive(active) {
    if (player) {
      player.classList.toggle('is-on', active);
      if (!active) player.classList.remove('is-playing');
    }
    if (okoBtn) okoBtn.setAttribute('aria-pressed', String(active));
    updateOkoLabel();
  }

  function setHeroPlaying(playing) {
    if (player) player.classList.toggle('is-playing', playing);
  }

  function resetHeroDemo() {
    stopProgressAnim();
    if (heroAudio) {
      heroAudio.pause();
      heroAudio.currentTime = 0;
      heroAudio.removeAttribute('src');
      heroAudio.load();
    }
    demoDurationSec = 0;
    setHeroActive(false);
    setTimeline(START_PERCENT, LECTURE_START_SEC);
  }

  function startTimelineSync() {
    if (!heroAudio || !demoDurationSec) return;
    const endPercent = ((LECTURE_START_SEC + demoDurationSec) / LECTURE_TOTAL_SEC) * 100;

    function tick() {
      if (!heroAudio || heroAudio.paused) return;
      const elapsed = Math.min(heroAudio.currentTime, demoDurationSec);
      const percent = START_PERCENT + (endPercent - START_PERCENT) * (elapsed / demoDurationSec);
      setTimeline(percent, LECTURE_START_SEC + elapsed);
      if (!heroAudio.ended) progressAnim = requestAnimationFrame(tick);
    }

    stopProgressAnim();
    progressAnim = requestAnimationFrame(tick);
  }

  function playHeroDemo() {
    if (!player || !okoBtn || !heroAudio) return;

    stopProgressAnim();
    heroAudio.pause();
    heroAudio.src = heroAudioSrc();
    setHeroActive(true);

    let started = false;
    const beginPlayback = () => {
      if (started) return;
      started = true;
      demoDurationSec = heroAudio.duration || 30;
      startTimelineSync();
      heroAudio.play().then(updateOkoLabel).catch(() => {});
    };

    heroAudio.addEventListener('ended', () => resetHeroDemo(), { once: true });

    heroAudio.addEventListener('loadedmetadata', beginPlayback, { once: true });
    heroAudio.load();
  }

  function pauseHeroDemo() {
    if (!heroAudio) return;
    heroAudio.pause();
    stopProgressAnim();
    updateOkoLabel();
  }

  function resumeHeroDemo() {
    if (!heroAudio || !heroAudio.src) return;
    heroAudio.play().catch(() => {});
  }

  function handleOkoClick() {
    if (!heroAudio?.src || heroAudio.ended) {
      playHeroDemo();
      return;
    }
    if (!heroAudio.paused) {
      pauseHeroDemo();
      return;
    }
    if (heroAudio.currentTime > 0) {
      resumeHeroDemo();
    }
  }

  if (player && okoBtn && heroAudio) {
    setTimeline(START_PERCENT, LECTURE_START_SEC);
    updateOkoLabel();
    okoBtn.addEventListener('click', handleOkoClick);
    heroAudio.addEventListener('pause', () => {
      setHeroPlaying(false);
      updateOkoLabel();
    });
    heroAudio.addEventListener('play', () => {
      setHeroPlaying(true);
      updateOkoLabel();
      startTimelineSync();
    });
    document.addEventListener('oko:langchange', resetHeroDemo);
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
      ? t('form_success')
      : t('form_error');
  }

  function errorTextFor(field) {
    if (field.validity.valueMissing) {
      return field.name === 'email'
        ? t('err_email_required')
        : t('err_required');
    }
    if (field.validity.typeMismatch && field.type === 'email') {
      return t('err_email_format');
    }
    return t('err_generic');
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
