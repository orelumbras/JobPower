/* ==========================================================================
   JOB POWER HR — שפות / языки
   Hebrew is the source of truth: it lives in the HTML, and this file only carries the
   translations away from it. The first pass caches whatever the markup shipped with, so
   switching back to Hebrew restores the real thing rather than a second copy of it that
   could drift.

   Loaded BEFORE a11y.js and main.js on purpose. It sets <html lang/dir> synchronously
   from localStorage, so a returning Russian visitor never sees the page lay itself out
   right-to-left and then flip.
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'jp-lang';
  var DEFAULT = 'he';
  var root = document.documentElement;

  var DICT = {
    ru: {
      /* --- chrome --- */
      'nav.about': 'О нас',
      'nav.services': 'Услуги',
      'nav.process': 'Процесс',
      'nav.why': 'Почему мы',
      'nav.reviews': 'Отзывы',
      'nav.cta': 'Связаться',
      'nav.menuAria': 'Меню',
      'nav.topAria': 'Наверх',
      /* in the language being read, not the one being switched to: the visible "עב" is
         what a Hebrew speaker scans for, but a screen reader here is speaking Russian */
      'nav.langAria': 'Переключить на иврит',
      'menu.about': '<span>01</span> О нас',
      'menu.services': '<span>02</span> Услуги',
      'menu.process': '<span>03</span> Процесс',
      'menu.why': '<span>04</span> Почему мы',
      'menu.reviews': '<span>05</span> Отзывы',
      'menu.contact': '<span>06</span> Связаться',

      /* --- hero --- */
      'hero.mark': 'Джоб Пауэр',
      'hero.sub': 'Подбор и трудоустройство персонала · Хадера · с 2010 года',
      'hero.more': 'Наши преимущества <i aria-hidden="true">←</i>',
      'hero.seek.kicker': 'Ищу работу',
      'hero.seek.head': 'Следующая работа<br>уже в базе',
      'hero.seek.line': 'Пришлите резюме, и мы подберём вакансию, которая действительно вам подходит, с личным сопровождением до первого рабочего дня.',
      'hero.seek.cta': 'Отправить резюме <i aria-hidden="true">←</i>',
      'hero.hire.kicker': 'Ищу сотрудников',
      'hero.hire.head': 'Нужный сотрудник,<br>без месяцев поиска',
      'hero.hire.line': 'База, которая обновляется каждый день, профессиональный отбор и оценка, готовые кандидаты у вас на столе.',
      'hero.hire.cta': 'Подобрать сотрудников <i aria-hidden="true">←</i>',
      'hero.foot.since': 'год основания',
      'hero.foot.fields': 'направлений',
      'hero.foot.addr': 'Хиллель Яффе 20, Хадера',
      'hero.foot.cue': 'ВНИЗ',

      /* --- stats --- */
      'stats.founded': 'Год основания',
      'stats.fields': 'Направлений подбора',
      'stats.personal': 'Личный подход',
      'stats.years': 'Лет опыта',

      /* --- about --- */
      'about.title': 'Соединяем людей<br>с <em>нужными</em> возможностями',
      'about.lead': '<span class="brand">Job Power</span> основана в Хадере в 2010 году и занимается подбором и трудоустройством персонала. Мы ведём все этапы: поиск, привлечение, отбор, оценку и введение в должность, обеспечивая профессиональный сервис высочайшего качества.',
      'about.p1': 'Команда Job Power выстроена под характер её услуг: личное и постоянное внимание к каждому клиенту. Услуги трудоустройства опираются на большую и качественную базу специалистов из всех областей.',
      'about.p2': 'Мы работаем с базой данных, которая обновляется каждый день, и регулярно собираем обратную связь, чтобы наши клиенты оставались довольны на протяжении всего сотрудничества.',
      'about.f1': '<span>01</span> Профессиональный отбор',
      'about.f2': '<span>02</span> Точная оценка',
      'about.f3': '<span>03</span> Ежедневная база',
      'about.f4': '<span>04</span> Личный подход',
      'about.f5': '<span>05</span> Регулярная обратная связь',

      /* --- the match --- */
      'match.title': 'Две стороны.<br><em>Одно</em> совпадение.',
      'match.sub': 'Каждый день через нас проходят кандидаты и вакансии. Вся наша работа — это тот самый момент, когда они встречаются.',
      'match.capPeople': 'Кандидаты',
      'match.capRoles': 'Открытые вакансии',
      'match.badge': 'Совпадение',
      'match.foot': 'База обновляется каждый день, с обеих сторон',
      'match.p1': '<b>Инженер-программист</b><i>7 лет опыта</i>',
      'match.p2': '<b>Главный бухгалтер</b><i>3-я категория</i>',
      'match.p3': '<b>Техник по обслуживанию</b><i>с сертификатом</i>',
      'match.p4': '<b>Специалист по подбору</b><i>высшее образование</i>',
      'match.p5': '<b>QA-инженер</b><i>автоматизация</i>',
      'match.p6': '<b>Электрик</b><i>лицензия техника</i>',
      'match.p7': '<b>Медицинский секретарь</b><i>3 языка</i>',
      'match.p8': '<b>Начальник смены</b><i>20 человек в подчинении</i>',
      'match.r1': '<b>Промышленный завод</b><i>Хадера</i>',
      'match.r2': '<b>Аудиторская фирма</b><i>Пардес-Ханна</i>',
      'match.r3': '<b>Логистический центр</b><i>Кесария</i>',
      'match.r4': '<b>Стартап</b><i>Герцлия</i>',
      'match.r5': '<b>Гостиница</b><i>Нетания</i>',
      'match.r6': '<b>Транспортная компания</b><i>Эмек-Хефер</i>',
      'match.r7': '<b>Частная клиника</b><i>Хадера</i>',
      'match.r8': '<b>Пищевое производство</b><i>Эмек-Хефер</i>',

      /* --- services --- */
      'services.title': 'Подбор в любой профессиональной области',
      'services.sub': 'Профессиональные решения по подбору в шести направлениях, с минимальным временем отклика и максимальной эффективностью.',
      'svc1.h': 'Технические специальности',
      'svc1.l1': 'Инженеры и техники-инженеры',
      'svc1.l2': 'Электронщики и электрики',
      'svc1.l3': 'Контроль качества',
      'svc1.l4': 'Техники и операторы станков',
      'svc1.l5': 'Руководители групп и начальники смен',
      'svc2.h': 'ИТ и разработка',
      'svc2.l1': 'Программисты и тестировщики',
      'svc2.l2': 'Инженеры по программному и аппаратному обеспечению',
      'svc2.l3': 'Техники и руководители проектов',
      'svc2.l4': 'Руководители команд разработки',
      'svc3.h': 'Офис и администрация',
      'svc3.l1': 'Секретари и офис-менеджеры',
      'svc3.l2': 'Бухгалтерия',
      'svc3.l3': 'Операторы ввода данных',
      'svc3.l4': 'Все офисные специальности',
      'svc4.h': 'Продажи и маркетинг',
      'svc4.l1': 'Руководители маркетинга',
      'svc4.l2': 'Агенты и менеджеры по продажам',
      'svc4.l3': 'Телемаркетинг',
      'svc5.h': 'Специалисты с высшим образованием',
      'svc5.l1': 'Экономика, промышленность и управление',
      'svc5.l2': 'Химия и биология',
      'svc5.l3': 'Руководящие должности высшего звена',
      'svc6.h': 'Сервис и обслуживание',
      'svc6.l1': 'Обслуживание зданий и производств',
      'svc6.l2': 'Текущее техническое обслуживание',
      'svc6.l3': 'Персонал для работы на объектах',

      /* --- process --- */
      'process.kicker': 'Как это работает',
      'process.title': 'Наш процесс, шаг за шагом',
      'process.sub': 'От первого обращения до успешного трудоустройства, профессиональное сопровождение на каждом этапе.',
      'proc1.h': 'Поиск',
      'proc1.p': 'Подбор кандидатов из большой и качественной базы данных, которая обновляется каждый день, точно под требования вакансии.',
      'proc2.h': 'Привлечение',
      'proc2.p': 'Профессиональное обращение к подходящим кандидатам, с минимальным временем отклика и максимальной эффективностью.',
      'proc3.h': 'Отбор',
      'proc3.p': 'Тщательная фильтрация кандидатов по опыту, навыкам и соответствию культуре компании.',
      'proc4.h': 'Оценка',
      'proc4.p': 'Глубокая оценка и точное соотнесение кандидата с должностью, чтобы трудоустройство оказалось долгосрочным.',
      'proc5.h': 'Введение в должность',
      'proc5.p': 'Соединяем кандидата с работодателем, сопровождаем адаптацию и обеспечиваем гладкий старт для обеих сторон.',
      'proc6.h': 'Сопровождение и обратная связь',
      'proc6.p': 'Регулярная обратная связь и постоянный контакт, чтобы убедиться, что все довольны в долгосрочной перспективе.',

      /* --- why --- */
      'why.title': 'Преимущество Job Power',
      'why1.h': 'Экономия времени и денег',
      'why1.p': 'Экономия драгоценного времени на подборе и отсеве кандидатов, а также на размещении объявлений о вакансиях.',
      'why2.h': 'Подходящие кандидаты',
      'why2.p': 'Профессиональный поиск с минимальным временем отклика и максимальной эффективностью, вежливостью и пониманием.',
      'why3.h': 'Личный подход',
      'why3.p': 'Плотное сопровождение на всём пути, как для работодателей, так и для кандидатов.',
      'why4.h': 'Ежедневное обновление базы',
      'why4.p': 'Большая и качественная база данных, обновляемая каждый день, под любой запрос и любую область.',
      'why5.h': 'Регулярная обратная связь',
      'why5.p': 'Мы регулярно собираем отзывы, чтобы убедиться в полной удовлетворённости на протяжении всего времени.',
      'why6.h': 'Более 15 лет опыта',
      'why6.p': 'С 2010 года — богатый опыт успешных трудоустройств в самых разных отраслях по всей стране.',
      'hours.weekLbl': 'Воскресенье–четверг',
      'hours.friLbl': 'Пятница',
      'hours.friVal': '09:00 – 12:00 (по договорённости)',
      'hours.addrLbl': 'Адрес',
      'hours.addrVal': 'ул. Гилель Яффе 20, Хадера',
      'hours.langLbl': 'Языки обслуживания',
      'hours.langVal': 'עברית · English · Русский',

      /* --- reviews ---
         Translated from the Hebrew originals. The wording is a faithful rendering, not a
         rewrite, but these are real Google reviews and what is shown here is a
         translation of them — reviews.note says so on the page. */
      'reviews.title': 'Что говорят <em>наши клиенты</em>',
      'reviews.sub': 'Пять звёзд и слова от души, от тех, кто уже нашёл своё место или своих сотрудников через Job Power.',
      'reviews.starsAria': '5 звёзд',
      'reviews.ctaTitle': 'Понравился сервис? Будем рады и вашим звёздам ⭐',
      'reviews.head': 'Отзыв в Google',
      'reviews.pickAria': 'Выбор оценки',
      'reviews.star1': '1 звезда',
      'reviews.star2': '2 звезды',
      'reviews.star3': '3 звезды',
      'reviews.star4': '4 звезды',
      'reviews.star5': '5 звёзд',
      'reviews.hint': 'Выберите оценку, чтобы продолжить',
      'reviews.thanks': 'Спасибо за оценку! Переходим в Google…',
      'reviews.go': 'Написать отзыв в Google',
      't1.text': 'Со мной связались после того, как я оставил резюме на подходящую вакансию, позвонили с несколькими предложениями и перезванивали после каждого собеседования, чтобы узнать, как всё прошло, и продвинуть меня дальше. По-настоящему отличный сервис, какого я не получал ни в одной другой компании.',
      't2.text': 'Хочу от всего сердца поблагодарить компанию Джоб Пауэр за профессиональный, внимательный и быстрый сервис. Я отправил своё резюме и очень скоро получил предложение о работе, которое точно соответствовало тому, что я искал. Личное отношение, доступность, подготовка и сопровождение просто исключительные. Большое спасибо за помощь и поддержку на всём пути — очень рекомендую!',
      't3.text': 'Профессиональное, внимательное и заботливое агентство, которое сопровождало меня на всём пути. Вакансия была подобрана точно, и я чувствовала, что есть человек, которому действительно важны мои интересы. Очень рекомендую.',
      't4.text': 'Хочу поблагодарить и выразить большую признательность агентству, которое сопровождало меня на всём пути профессионально, внимательно и терпеливо. С первой же минуты я чувствовал, что меня по-настоящему слушают, понимают мои потребности и дают честный и точный ответ. Сопровождение было непрерывным, понятным и уважительным, с высокой доступностью и личным отношением — вплоть до того момента, когда нашлось подходящее мне место работы. На протяжении всего процесса я чувствовал, что я не один и что есть кто-то, кто в меня верит и подталкивает вперёд. Без сомнения, это серьёзная, человечная и профессиональная компания, и я горячо рекомендую её всем, кто ищет настоящее сопровождение на пути к работе. Большое спасибо за всё.',
      't4.name': 'Шломо Тшома',
      't5.text': 'Я клиент этого агентства и обращаюсь к ним за подбором сотрудников. Команда работает профессионально, эффективно, быстро и вежливо.',
      't5.name': 'Шауль Пур',
      't5.role': 'Операционный директор · Кислев Тахбура ЛТД',

      /* --- contact --- */
      'contact.title': 'Давайте найдём вам<br><em>нужных людей</em>',
      'contact.sub': 'Ищете работу? Нужно нанять сотрудников? Мы здесь. Свяжитесь с нами сегодня.',
      'contact.phone': 'Телефон',
      'contact.mobile': 'Мобильный',
      'contact.email': 'Эл. почта',
      'contact.address': 'Адрес',
      'contact.addressVal': 'ул. Гилель Яффе 20, Хадера',
      'contact.wa': 'Написать в WhatsApp',

      /* --- footer --- */
      'footer.rights': '© 2026 Job Power HR · Хадера · Все права защищены',
      'footer.made': 'Дизайн и разработка <a href="https://elevatecreative.github.io/Elevate/" target="_blank" rel="noopener" class="elevate"><b>Elevate Creative</b></a>',

      /* --- document --- */
      'doc.title': 'Job Power HR | Джоб Пауэр · подбор и трудоустройство персонала',
      'doc.desc': 'Job Power HR — агентство по подбору и трудоустройству персонала в Хадере, с 2010 года. Соединяем талантливых людей с нужными возможностями. Личный подход, качественная база кандидатов и проверенный результат.',

      /* --- accessibility widget (built by a11y.js) --- */
      'a11y.skip': 'Перейти к содержимому',
      'a11y.btnAria': 'Меню доступности',
      'a11y.panelAria': 'Настройки доступности',
      'a11y.title': 'Доступность',
      'a11y.biggerAria': 'Увеличить текст',
      'a11y.smallerAria': 'Уменьшить текст',
      'a11y.contrast': 'Высокая контрастность',
      'a11y.links': 'Подчеркнуть ссылки',
      'a11y.font': 'Читаемый шрифт',
      'a11y.motion': 'Остановить анимации',
      'a11y.reset': 'Сброс',
      'a11y.statement': 'Заявление о доступности',
      'a11y.stTitle': 'Заявление о доступности',
      'a11y.stP1': 'Сайт Job Power стремится быть доступным для всех посетителей, включая людей с инвалидностью, в соответствии с израильскими правилами равных прав для людей с инвалидностью (2013), израильским стандартом IS 5568 и рекомендациями WCAG 2.1 уровня AA.',
      'a11y.stP2': 'На сайте есть меню доступности (увеличение текста, высокая контрастность, подчёркивание ссылок, читаемый шрифт и остановка анимаций), полная навигация с клавиатуры и поддержка системной настройки уменьшения движения.',
      'a11y.stP3': 'Столкнулись с трудностями? Будем рады узнать и исправить, свяжитесь с нами по контактам, указанным на сайте.',
      'a11y.stP4': 'Последнее обновление: июль 2026',
      'a11y.close': 'Закрыть'
    }
  };

  /* The Hebrew the markup shipped with, keyed the same way. This is the 'he' dictionary,
     built from the DOM rather than duplicated in this file so the two cannot disagree.

     Capture is additive and never overwrites a key it already holds. That matters because
     the accessibility widget builds its markup after this file has run: by then the page
     may already be in Russian, and a capture that re-read everything would file those
     Russian strings away as the Hebrew original and lose the real one for good. Taking
     only keys we have not seen yet means each element is read exactly once — while it is
     still carrying the Hebrew it shipped with. */
  var source = { text: {}, html: {}, attr: {}, title: null, desc: null };

  function capture() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.dataset.i18n;
      if (!(k in source.text)) source.text[k] = el.textContent.trim();
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var k = el.dataset.i18nHtml;
      if (!(k in source.html)) source.html[k] = el.innerHTML.trim();
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.dataset.i18nAttr.split(',').forEach(function (pair) {
        var bits = pair.split(':');
        var k = bits[1].trim();
        if (!(k in source.attr)) source.attr[k] = el.getAttribute(bits[0].trim());
      });
    });
    if (source.title === null) source.title = document.title;
    if (source.desc === null) {
      var d = document.querySelector('meta[name="description"]');
      source.desc = d ? d.getAttribute('content') : '';
    }
  }

  function lookup(lang, key, kind) {
    if (lang === DEFAULT) return source[kind][key];
    return DICT[lang] ? DICT[lang][key] : undefined;
  }

  function apply(lang) {
    capture();
    var rtl = lang === 'he';
    root.setAttribute('lang', lang);
    root.setAttribute('dir', rtl ? 'rtl' : 'ltr');

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = lookup(lang, el.dataset.i18n, 'text');
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = lookup(lang, el.dataset.i18nHtml, 'html');
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.dataset.i18nAttr.split(',').forEach(function (pair) {
        var bits = pair.split(':');
        var v = lookup(lang, bits[1].trim(), 'attr');
        if (v != null) el.setAttribute(bits[0].trim(), v);
      });
    });

    document.title = lang === DEFAULT ? source.title : (DICT[lang]['doc.title'] || source.title);
    var d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute('content', lang === DEFAULT ? source.desc : (DICT[lang]['doc.desc'] || source.desc));

    var btn = document.getElementById('langBtn');
    if (btn) {
      var code = btn.querySelector('.lang-code');
      if (code) code.textContent = rtl ? 'RU' : 'עב';
    }

    window.JPLang = lang;
    document.dispatchEvent(new CustomEvent('jp:lang', { detail: { lang: lang } }));
  }

  /* Read once, synchronously, before the stylesheet has anything to lay out: a returning
     Russian visitor should never watch the page build itself right-to-left and flip. */
  var saved;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var current = saved === 'ru' ? 'ru' : DEFAULT;
  root.setAttribute('lang', current);
  root.setAttribute('dir', current === 'he' ? 'rtl' : 'ltr');
  window.JPLang = current;

  function set(lang) {
    current = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply(lang);
  }

  window.JPI18N = {
    get: function () { return current; },
    set: set,
    t: function (key) {
      if (current === DEFAULT) return source.text[key];
      return DICT[current] ? DICT[current][key] : undefined;
    },
    /* a11y.js builds its widget after this file runs, so it calls back in once its
       markup exists rather than being translated blind */
    refresh: function () { apply(current); }
  };

  document.addEventListener('DOMContentLoaded', function () {
    apply(current);
    var btn = document.getElementById('langBtn');
    if (btn) btn.addEventListener('click', function () { set(current === 'he' ? 'ru' : 'he'); });
  });
})();
