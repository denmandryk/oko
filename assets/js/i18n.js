/* OKO — i18n: EN (default) + UK. Vanilla JS, localStorage persistence. */
(() => {
  'use strict';

  const STORAGE_KEY = 'oko-lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['en', 'uk'];

  const T = {
    en: {
      meta_title: 'OKO — narrates what\'s on screen',
      meta_description: 'For blind and low-vision students, OKO describes formulas, diagrams, and everything shown in video — and answers questions right during the lecture.',
      skip: 'Skip to content',
      logo_aria: 'OKO — back to top',
      nav_aria: 'Main navigation',
      nav_how: 'How it works',
      nav_demo: 'Demo',
      nav_platforms: 'For platforms',
      nav_faq: 'FAQ',
      nav_beta: 'Join the beta',
      nav_menu: 'Menu',
      lang_aria: 'Language',

      hero_title: 'OKO narrates what\'s<br>on screen',
      hero_sub: 'For blind and low-vision students, OKO describes formulas, diagrams, and everything shown in video — and answers questions right during the lecture.',
      hero_beta: 'Join the beta',
      hero_pilot: 'Request a pilot',
      player_title: 'Lecture 12. Newton\'s second law',
      player_hint: 'This is what a lecture looks like for a blind student',
      player_try: 'Tap the button to hear how OKO narrates the lecture',
      cap_1: '«On the board it says: F equals m times a».',
      cap_2: '«The instructor draws a graph — a straight line from the origin».',
      cap_3: '«Want more detail on this formula? Just ask».',
      oko_on: 'Turn on OKO',
      oko_pause: 'Pause',
      oko_resume: 'Resume',

      pain_eyebrow: 'Problem',
      pain_title: 'Half the lecture is what\'s visible on screen',
      pain_p: 'The instructor writes a formula on the board and says "right here" — but nothing makes sense by ear alone. A screen reader will read the platform buttons, not what\'s in the video. So half the lecture simply disappears.',
      pain_chips_aria: 'What stays off-screen without description',
      chip_1: 'formula on the board',
      chip_2: 'on-screen demonstration',
      chip_3: 'graphs and slides',
      quote_p: 'The worst part is when the instructor says: "As you can see on the slide…" I can\'t see. I ask classmates to explain — and get through the lecture twice as slowly as everyone else.',
      quote_name: 'Andriy M.',
      quote_role: 'student',

      how_eyebrow: 'How it works',
      how_title: 'Watches, describes, answers',
      step_1_title: 'Watches with you',
      step_1_p: 'OKO sees the frame just like your sighted classmate does.',
      step_2_title: 'Describes in the pauses',
      step_2_p: 'Formulas, graphs, and actions — spoken aloud while the instructor is silent.',
      step_3_title: 'Answers your questions',
      step_3_p: 'Ask: "What\'s on the graph?", "Repeat the formula" — and OKO responds right during the lecture.',

      demo_eyebrow: 'Demo',
      demo_title: 'Hear the difference',
      demo_without: 'Without OKO',
      demo_with: 'With OKO',
      demo_video_fallback: 'Your browser doesn\'t support video playback.',
      demo_credit: 'Excerpt from <a href="https://www.youtube.com/watch?v=ZK3O402wf1c&amp;t=710s">Lec 1 | MIT 18.06 Linear Algebra, Spring 2005</a> (Gilbert Strang, <a href="https://ocw.mit.edu/">MIT OpenCourseWare</a>). Used for OKO demonstration only. <a href="https://ocw.mit.edu/terms/">CC BY-NC-SA 4.0</a>.',

      aud_eyebrow: 'Who it\'s for',
      aud_title: 'Students — beta.<br>Platforms — pilot',
      aud_students_title: 'Students and instructors',
      aud_students_p: 'Join the beta — and hear lectures in full, not just half. Free and in Ukrainian.',
      aud_students_aria: 'What the beta offers',
      aud_students_1: 'Voice descriptions of formulas, graphs, and slides',
      aud_students_2: 'Answers to questions right during the lecture',
      aud_students_3: 'Your feedback shapes how OKO grows',
      aud_platforms_title: 'Platforms and universities',
      aud_platforms_p: 'Your video library becomes accessible without months of studio narration.',
      aud_platforms_aria: 'Accessibility standards OKO helps meet',
      aud_platforms_1: 'WCAG 2.1 AA — audio description requirement (1.2.5)',
      aud_platforms_2: 'ADA Title II — U.S. deadlines are already here',
      aud_platforms_3: 'EAA / EN 301 549 — in effect in the EU since June 2025',

      stats_title: 'Scale of the problem in numbers',
      stat_1_text: 'of users say there is critically too little described content',
      stat_1_src: 'American Council of the Blind survey',
      stat_2_text: 'only this share of audio-description requests are fulfilled by volunteer models',
      stat_2_src: 'YouDescribe',
      stat_3_text: 'blind people worldwide',
      stat_3_src: 'WHO / IAPB',

      faq_eyebrow: 'FAQ',
      faq_title: 'Frequently asked questions',
      faq_students: 'For students',
      faq_q_cost: 'How much does it cost?',
      faq_a_cost: 'The beta is free for now. We want people to use it and tell us what to improve.',
      faq_q_when: 'When can I try it?',
      faq_a_when: 'We\'re launching the first betas in fall 2026. Leave your email — we\'ll write as soon as access opens.',
      faq_q_video: 'What videos does OKO work with?',
      faq_a_video: 'Lectures, tutorials, webinar recordings — any educational video where seeing the screen matters.',
      faq_q_uk: 'Does it work in Ukrainian?',
      faq_a_uk: 'Yes. We\'re starting with Ukrainian — because tools like this didn\'t exist here yet.',
      faq_q_diff: 'How is this different from regular video description?',
      faq_a_diff: 'Regular description is a recorded track, the same for everyone. OKO watches the video with you: describes in pauses, adapts pace, and answers your questions right while you watch.',
      faq_platforms: 'For platforms and educational institutions',
      faq_q_embed: 'How does OKO integrate?',
      faq_a_embed: 'It\'s a plugin in your video player. No need to rework videos or upload anything upfront — OKO works on top of the library you already have.',
      faq_q_law: 'What about legal accessibility requirements?',
      faq_a_law: 'OKO meets the audio description requirement in WCAG 2.1 (criterion 1.2.5). That directly relates to ADA in the U.S. (deadlines already passed) and the European Accessibility Act in the EU (effective since 2025).',
      faq_q_accuracy: 'What about accuracy? AI makes mistakes.',
      faq_a_accuracy: 'For regular lectures, AI handles it well. For critical content — exams, complex formulas — there\'s a human-reviewed mode.',
      faq_q_privacy: 'What about data privacy?',
      faq_a_privacy: 'Video and student data are processed within your platform. We\'re designing for GDPR and FERPA requirements from day one.',

      join_title: 'Be among the first',
      join_sub: 'Beta for students is free; platform pilots start fall 2026.',
      form_name: 'Name',
      form_email: 'Email',
      form_role: 'I am a',
      form_role_student: 'student',
      form_role_teacher: 'instructor',
      form_role_platform: 'platform or university',
      form_role_other: 'other',
      form_message: 'Comment',
      form_optional: '(optional)',
      form_submit: 'Send',
      form_note: 'We only write about the beta or pilot. No newsletters.',
      form_success: 'Thank you! We\'ll reply within a day.',
      form_error: 'Something went wrong. Please try again in a moment.',
      err_required: 'This field is required.',
      err_email_required: 'Enter your email — we can\'t reply without it.',
      err_email_format: 'Check the email format — e.g. name@university.edu.',
      err_generic: 'Please check this field.',

      footer_slogan: 'So "watching" no longer requires "seeing"',
      footer_meta: 'OKO · 2026 · Made in Ukraine',
    },

    uk: {
      meta_title: 'OKO — озвучує те, що на екрані',
      meta_description: 'Незрячим і слабозорим студентам OKO голосом описує формули, схеми й усе, що показують у відео, — і відповідає на запитання просто під час лекції.',
      skip: 'Перейти до змісту',
      logo_aria: 'OKO — на початок сторінки',
      nav_aria: 'Основна навігація',
      nav_how: 'Як працює',
      nav_demo: 'Демо',
      nav_platforms: 'Платформам',
      nav_faq: 'FAQ',
      nav_beta: 'Хочу в бету',
      nav_menu: 'Меню',
      lang_aria: 'Мова',

      hero_title: 'OKO озвучує те,<br>що на екрані',
      hero_sub: 'Незрячим і слабозорим студентам OKO голосом описує формули, схеми й усе, що показують у відео, — і відповідає на запитання просто під час лекції.',
      hero_beta: 'Хочу в бету',
      hero_pilot: 'Запит на пілот',
      player_title: 'Лекція 12. Другий закон Ньютона',
      player_hint: 'Так виглядає лекція для незрячого студента',
      player_try: 'Натисни кнопку, щоб почути, як OKO описує лекцію',
      cap_1: '«На дошці записано: F дорівнює m на a».',
      cap_2: '«Викладач малює графік — пряма з початку координат».',
      cap_3: '«Хочеш детальніше про цю формулу? Просто спитай».',
      oko_on: 'Увімкнути OKO',
      oko_pause: 'Пауза',
      oko_resume: 'Продовжити',

      pain_eyebrow: 'Проблема',
      pain_title: 'Пів лекції — це те, що видно на екрані',
      pain_p: 'Викладач пише формулу на дошці й каже «ось тут» — а на слух незрозуміло нічого. Скрінрідер прочитає кнопки платформи, але не те, що у відео. Тож ті пів лекції просто зникають.',
      pain_chips_aria: 'Що лишається за кадром без опису',
      chip_1: 'формула на дошці',
      chip_2: 'демонстрація на екрані',
      chip_3: 'графіки і слайди',
      quote_p: 'Найгірше — коли викладач каже: «Як бачите на слайді…». Я не бачу. Прошу одногрупників переказати — і проходжу лекцію вдвічі довше за всіх.',
      quote_name: 'Андрій М.',
      quote_role: 'студент',

      how_eyebrow: 'Як працює',
      how_title: 'Дивиться, описує, відповідає',
      step_1_title: 'Дивиться разом',
      step_1_p: 'OKO бачить кадр так само, як твій зрячий одногрупник.',
      step_2_title: 'Описує в паузах',
      step_2_p: 'Формули, графіки й дії — голосом, поки викладач мовчить.',
      step_3_title: 'Відповідає на запитання',
      step_3_p: 'Спитай: «Що на графіку?», «Повтори формулу» — і OKO відповість просто під час лекції.',

      demo_eyebrow: 'Демо',
      demo_title: 'Послухай різницю',
      demo_without: 'Без OKO',
      demo_with: 'З OKO',
      demo_video_fallback: 'Ваш браузер не відтворює відео.',
      demo_credit: 'Фрагмент <a href="https://www.youtube.com/watch?v=ZK3O402wf1c&amp;t=710s">Lec 1 | MIT 18.06 Linear Algebra, Spring 2005</a> (Gilbert Strang, <a href="https://ocw.mit.edu/">MIT OpenCourseWare</a>). Використано виключно для демонстрації OKO. <a href="https://ocw.mit.edu/terms/">CC BY-NC-SA 4.0</a>.',

      aud_eyebrow: 'Для кого',
      aud_title: 'Студентам — бета.<br>Платформам — пілот',
      aud_students_title: 'Студентам і викладачам',
      aud_students_p: 'Запишись у бету — і слухай лекції повністю, а не половину. Безкоштовно й українською.',
      aud_students_aria: 'Що дає бета',
      aud_students_1: 'Голосовий опис формул, графіків і слайдів',
      aud_students_2: 'Відповіді на запитання просто під час лекції',
      aud_students_3: 'Твій відгук вирішує, яким OKO виросте',
      aud_platforms_title: 'Платформам і вишам',
      aud_platforms_p: 'Ваша бібліотека відео стає доступною без місяців студійного опису.',
      aud_platforms_aria: 'Стандарти доступності, які закриває OKO',
      aud_platforms_1: 'WCAG 2.1 AA — вимога аудіодескрипції (1.2.5)',
      aud_platforms_2: 'ADA Title II — дедлайни у США вже настали',
      aud_platforms_3: 'EAA / EN 301 549 — діє в ЄС з червня 2025',

      stats_title: 'Масштаб проблеми в цифрах',
      stat_1_text: 'користувачів кажуть, що описаного контенту критично мало',
      stat_1_src: 'Опитування American Council of the Blind',
      stat_2_text: 'лише стільки запитів на аудіоопис виконує волонтерська модель',
      stat_2_src: 'YouDescribe',
      stat_3_text: 'незрячих людей у світі',
      stat_3_src: 'ВООЗ / IAPB',

      faq_eyebrow: 'FAQ',
      faq_title: 'Часті запитання',
      faq_students: 'Для студентів',
      faq_q_cost: 'Скільки коштує?',
      faq_a_cost: 'Зараз бета — безкоштовно. Хочемо, щоб нею користувалися й підказували, що покращити.',
      faq_q_when: 'Коли можна спробувати?',
      faq_a_when: 'Запускаємо перші бети восени 2026. Залиш пошту — напишемо, щойно відкриємо доступ.',
      faq_q_video: 'З якими відео працює OKO?',
      faq_a_video: 'З лекціями, туторіалами, записами вебінарів — будь-яким навчальним відео, де важливо бачити екран.',
      faq_q_uk: 'Це працює українською?',
      faq_a_uk: 'Так. Ми починаємо саме з української — бо тут таких інструментів досі не було.',
      faq_q_diff: 'Чим це відрізняється від звичайного опису відео?',
      faq_a_diff: 'Звичайний опис — це записана доріжка, однакова для всіх. OKO дивиться відео разом з тобою: описує в паузах, підлаштовує темп і відповідає на твої запитання прямо під час перегляду.',
      faq_platforms: 'Для платформ і закладів освіти',
      faq_q_embed: 'Як OKO вбудовується?',
      faq_a_embed: 'Це плагін у ваш відеоплеєр. Не треба переробляти відео чи завантажувати щось наперед — OKO працює поверх бібліотеки, яка вже є.',
      faq_q_law: 'Що з доступністю за законом?',
      faq_a_law: 'OKO закриває вимогу аудіодескрипції у WCAG 2.1 (критерій 1.2.5). Це прямо стосується ADA у США (дедлайни вже настали) та European Accessibility Act у ЄС (діє з 2025).',
      faq_q_accuracy: 'А точність? AI же помиляється.',
      faq_a_accuracy: 'Для звичайних лекцій AI справляється. Для критичного контенту — іспитів, складних формул — є режим з перевіркою людиною.',
      faq_q_privacy: 'Що з приватністю даних?',
      faq_a_privacy: 'Відео й дані студентів обробляються в межах вашої платформи. Проєктуємо під вимоги GDPR і FERPA з першого дня.',

      join_title: 'Приєднуйся першим',
      join_sub: 'Бета для студентів безкоштовна, пілоти для платформ — з осені 2026-го.',
      form_name: 'Ім\'я',
      form_email: 'Email',
      form_role: 'Я —',
      form_role_student: 'студент',
      form_role_teacher: 'викладач',
      form_role_platform: 'платформа або виш',
      form_role_other: 'інше',
      form_message: 'Коментар',
      form_optional: '(необов\'язково)',
      form_submit: 'Надіслати',
      form_note: 'Пишемо тільки у справі бети чи пілота. Жодних розсилок.',
      form_success: 'Дякуємо! Відповімо протягом доби.',
      form_error: 'Щось пішло не так. Спробуй ще раз через хвилинку.',
      err_required: 'Це поле обов\'язкове.',
      err_email_required: 'Впиши email — без нього не зможемо відповісти.',
      err_email_format: 'Перевір формат email — наприклад, name@university.edu.',
      err_generic: 'Перевір це поле, будь ласка.',

      footer_slogan: 'Щоб «дивитися» перестало вимагати «бачити»',
      footer_meta: 'OKO · 2026 · Створено в Україні',
    },
  };

  let currentLang = DEFAULT_LANG;

  function normalizeLang(lang) {
    return SUPPORTED.includes(lang) ? lang : DEFAULT_LANG;
  }

  function getLang() {
    return currentLang;
  }

  function t(key) {
    return T[currentLang][key] ?? T[DEFAULT_LANG][key] ?? key;
  }

  function updateMeta() {
    document.title = t('meta_title');
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('meta_description'));
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', t('meta_title'));
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', t('meta_description'));
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', currentLang === 'uk' ? 'uk_UA' : 'en_US');
  }

  function updateLangSwitch() {
    document.querySelectorAll('[data-lang]').forEach((btn) => {
      const active = btn.dataset.lang === currentLang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function applyLang(lang) {
    currentLang = normalizeLang(lang);
    try { localStorage.setItem(STORAGE_KEY, currentLang); } catch (_) { /* private mode */ }

    document.documentElement.lang = currentLang;
    updateMeta();

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
    });

    updateLangSwitch();
    document.dispatchEvent(new CustomEvent('oko:langchange', { detail: { lang: currentLang } }));
  }

  function initLangSwitch() {
    document.querySelectorAll('[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.lang !== currentLang) applyLang(btn.dataset.lang);
      });
    });
  }

  function init() {
    let stored = DEFAULT_LANG;
    try {
      stored = normalizeLang(localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG);
    } catch (_) { /* ignore */ }
    applyLang(stored);
    initLangSwitch();
  }

  window.OKO_I18N = { getLang, t, applyLang, init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
