/* ==========================================================================
   JOB POWER HR — v2 interactions & motion
   ========================================================================== */
(() => {
  'use strict';
  const doc = document;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('jpa-motion');
  const isTouch = window.matchMedia('(hover: none)').matches;
  doc.documentElement.classList.remove('no-js');

  const VIDEO_SRC = 'https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8';

  /* ===============================================================
     1. FIXED VIDEO BACKGROUND (HLS via hls.js; gradient fallback)
     =============================================================== */
  /* hls.js is 296 KB — bigger than every other script on this page combined — and it is
     a polyfill: Safari and iOS play this stream natively and never touch it. It used to
     be a plain <script> tag, so every visitor paid for it before the page could finish
     loading, most of them for nothing. Now it is fetched only by browsers that actually
     cannot play HLS, and only once the page is up, so it never competes with first
     paint. It is a decorative background video — nothing here is worth blocking for. */
  function loadHls() {
    if (window.Hls) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = doc.createElement('script');
      s.src = 'assets/vendor/hls.light.min.js';
      s.onload = resolve;
      s.onerror = reject;
      doc.head.appendChild(s);
    });
  }

  function initVideoBg() {
    const v = doc.getElementById('bgv');
    if (!v || reduceMotion) return;            // gradient tint stays as the bg
    const ready = () => { v.classList.add('ready'); v.play().catch(() => {}); };

    if (v.canPlayType('application/vnd.apple.mpegurl')) {
      /* Native HLS (Safari / iOS). The reveal used to hang off `loadeddata` alone, and
         that is the event iOS is least likely to reach: with autoplay refused — Low Power
         Mode, Low Data Mode — it never buffers a frame, so the video stayed at opacity 0
         indefinitely. Desktop looked fine because the hls.js path reveals on
         MANIFEST_PARSED, which fires whether or not playback is allowed. Reveal on the
         earliest event that means "there is a picture", and retry playback on the first
         touch, which is a gesture iOS will accept. */
      v.src = VIDEO_SRC;
      ['loadedmetadata', 'loadeddata', 'canplay'].forEach((ev) =>
        v.addEventListener(ev, ready, { once: true }));
      v.load();
      const unlock = () => v.play().catch(() => {});
      ['touchstart', 'click'].forEach((ev) =>
        doc.addEventListener(ev, unlock, { once: true, passive: true }));
    } else {
      // idle, so the fetch lands after the page has painted and settled
      const start = () => loadHls().then(() => {
        if (!window.Hls || !window.Hls.isSupported()) return;   // no HLS → keep the gradient
        const hls = new Hls({ capLevelToPlayerSize: true, maxBufferLength: 18, startLevel: -1 });
        hls.loadSource(VIDEO_SRC);
        hls.attachMedia(v);
        hls.on(Hls.Events.MANIFEST_PARSED, ready);
        hls.on(Hls.Events.ERROR, (_e, d) => {   // on fatal error just keep the gradient
          if (d && d.fatal && d.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
        });
      }).catch(() => {});                        // download failed → gradient, no console noise
      if (window.requestIdleCallback) requestIdleCallback(start, { timeout: 2500 });
      else setTimeout(start, 200);
    }
    // save resources when the tab is hidden
    doc.addEventListener('visibilitychange', () => {
      if (doc.hidden) v.pause(); else v.play().catch(() => {});
    });
  }

  /* ===============================================================
     2. CUSTOM CURSOR + MAGNETIC
     =============================================================== */
  function initCursor() {
    if (isTouch || innerWidth <= 768) return;
    const dot = doc.querySelector('.cursor-dot');
    const ring = doc.querySelector('.cursor-ring');
    if (!dot || !ring) return;
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    (function loop() {
      requestAnimationFrame(loop);
      rx += (mx - rx) * .18; ry += (my - ry) * .18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    })();
    addEventListener('mousedown', () => ring.classList.add('down'));
    addEventListener('mouseup', () => ring.classList.remove('down'));
    doc.querySelectorAll('a,button,.btn,.svc,.wcard,.crow,.stat,.nav-cta').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
    doc.querySelectorAll('[data-magnetic]').forEach(el => {
      const s = parseFloat(el.dataset.magnetic) || 0.3;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * s}px,${(e.clientY - r.top - r.height / 2) * s}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ===============================================================
     3. PRELOADER (robust against background-tab hangs)
     =============================================================== */
  function initPreloader(done) {
    const pre = doc.querySelector('.preloader');
    if (!pre) { done(); return; }
    const bar = pre.querySelector('.pre-bar span');
    const count = pre.querySelector('.pre-count');
    const logo = pre.querySelector('.pre-mark img');
    if (window.gsap) gsap.to(logo, { opacity: 1, duration: .8, ease: 'power2.out' });

    let settled = false;
    function reveal() {
      if (settled) return;
      settled = true;
      clearInterval(tick); clearTimeout(failsafe);
      done();
    }
    function close() {
      if (window.gsap && !doc.hidden) {
        gsap.to(pre, { yPercent: -100, duration: .85, ease: 'power4.inOut',
          onComplete: () => { pre.remove(); reveal(); } });
        /* Hand the page over while the curtain is still lifting. Waiting for onComplete
           meant the hero could not begin until the preloader had entirely gone, and the
           two waits stacked: counter, then slide, then a hero intro that had not started.
           Overlapping them turns four seconds of nothing into one continuous movement.
           reveal() is idempotent, so the onComplete above is still the safety net. */
        gsap.delayedCall(.35, reveal);
      } else { pre.remove(); reveal(); }
    }
    let p = 0;
    const tick = setInterval(() => {
      p += Math.random() * 16 + 9;
      if (p >= 100) { p = 100; clearInterval(tick); setTimeout(close, 200); }
      if (bar) bar.style.width = Math.min(p, 100) + '%';
      if (count) count.textContent = String(Math.min(Math.floor(p), 100)).padStart(3, '0');
    }, 95);
    const failsafe = setTimeout(() => { if (pre.isConnected) pre.remove(); reveal(); }, 7000);
  }

  /* ===============================================================
     4. NAV / MENU / TO-TOP
     =============================================================== */
  function initNav() {
    const nav = doc.querySelector('nav');
    const burger = doc.querySelector('.nav-burger');
    const totop = doc.querySelector('.totop');
    const onScroll = () => {
      const y = window.scrollY;
      nav && nav.classList.toggle('scrolled', y > 40);
      totop && totop.classList.toggle('show', y > 720);
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    if (burger) burger.addEventListener('click', () => doc.body.classList.toggle('menu-open'));
    doc.querySelectorAll('.mobile-menu a, .totop').forEach(a =>
      a.addEventListener('click', () => doc.body.classList.remove('menu-open')));

    // active link highlight
    const links = [...doc.querySelectorAll('.nav-links a')];
    const map = links.map(a => ({ a, sec: doc.querySelector(a.getAttribute('href')) })).filter(x => x.sec);
    addEventListener('scroll', () => {
      let cur = null;
      map.forEach(({ sec }) => { if (window.scrollY >= sec.offsetTop - 140) cur = sec.id; });
      map.forEach(({ a, sec }) => a.classList.toggle('active', sec.id === cur));
    }, { passive: true });
  }

  /* ===============================================================
     5. SMOOTH SCROLL (snappier Lenis) + anchors
     =============================================================== */
  let lenis = null;
  function initSmooth() {
    const anchors = () => doc.querySelectorAll('a[href^="#"]');
    if (reduceMotion || typeof Lenis === 'undefined') {
      anchors().forEach(a => a.addEventListener('click', e => {
        const id = a.getAttribute('href'); if (id.length < 2) return;
        const t = doc.querySelector(id); if (!t) return;
        e.preventDefault(); t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }));
      return;
    }
    lenis = new Lenis({
      duration: 0.85,
      easing: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),  // expo-out: quick, settles fast
      smoothWheel: true, wheelMultiplier: 1.05, touchMultiplier: 1.6
    });
    window.lenis = lenis;
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })();
    if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    anchors().forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href'); if (id.length < 2) return;
      const t = doc.querySelector(id); if (!t) return;
      e.preventDefault(); lenis.scrollTo(t, { offset: -64, duration: 1.05 });
    }));
  }

  /* ===============================================================
     6. GSAP MOTION
     =============================================================== */
  /* Wrap each <br>-separated run of a heading in its own overflow-hidden box so the line
     can be slid up out of a mask.

     Splitting on <br> rather than on words is deliberate. Word splitting would break the
     one heading that carries a gradient <em> straddling a prefix ("ל" + "הזדמנויות"),
     and it would put every word in its own inline-block, which is exactly the wrong thing
     to hand a bidi line-breaker in an RTL document. The <br>s already mark every line the
     copy intends; a segment that wraps on a narrow screen just reveals as one taller
     block, which is the harmless failure. */
  function splitTitleLines(el) {
    if (el.dataset.split) return [...el.querySelectorAll('.tl-i')];
    const frag = doc.createDocumentFragment();
    let inner;
    const openLine = () => {
      const line = doc.createElement('span');
      line.className = 'tl';
      inner = doc.createElement('span');
      inner.className = 'tl-i';
      line.appendChild(inner);
      frag.appendChild(line);
    };
    openLine();
    // snapshot first: the loop clones into a subtree that is about to replace this one
    [...el.childNodes].forEach(n => {
      if (n.nodeName === 'BR') openLine();
      else inner.appendChild(n.cloneNode(true));
    });
    el.textContent = '';
    el.appendChild(frag);
    el.dataset.split = '1';
    return [...el.querySelectorAll('.tl-i')];
  }

  function initMotion() {
    if (reduceMotion || !window.gsap) {
      doc.querySelectorAll('[data-reveal],[data-reveal-stagger]>*').forEach(el => {
        el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
      });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    /* The split is the hero, so the intro states the composition: both cuts start folded
       together on the centre line and open outward, the violet growing into the screen
       and pushing the two side fields to the edges. Then the title, then each panel's
       label, the seekers' side first because it is the reading side.

       The cuts are animated through their variables rather than through clip-path itself.
       Writing clip-path directly would leave inline values on the panels that outrank the
       :has() hover rules for the rest of the session, and it would leave the seam lights —
       drawn by pseudo-elements GSAP cannot reach — stranded at the final angle while the
       colour boundaries swept past them. Driving the four variables moves every panel,
       every edge and both glows as one thing. */
    const REST = { '--a-t': '80%', '--a-b': '72%', '--b-t': '28%', '--b-b': '20%' };
    /* The lockup's parts, not .hero-title itself. Touching the h1 makes GSAP normalise its
       transform and write `scale: none` inline, which outranks the stylesheet for the rest
       of the session — and the stylesheet is what scales the brand down when you reach for
       one of the side panels. Animating the children leaves that property free. */
    const LOCKUP = '.ht-mark, .ht-rule, .ht-sub, .ht-more';
    gsap.set(LOCKUP + ', .sh-body', { opacity: 0, y: 18 });
    const hero = doc.querySelector('.hero');
    const split = doc.querySelector('.hero-split');
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (split) {
      hero.classList.add('is-intro');
      tl.fromTo(split,
        { '--a-t': '52%', '--a-b': '52%', '--b-t': '48%', '--b-b': '48%' },
        { ...REST, duration: 1.15, ease: 'power4.inOut',
          onComplete() {
            // hand the geometry back to the stylesheet, or hover has nothing left to move
            Object.keys(REST).forEach((k) => split.style.removeProperty(k));
            hero.classList.remove('is-intro');
          } }, 0);
    }
    /* Absolute positions, not relative ones: '-=' offsets count back from the end of the
       whole timeline, and with the cut still running that end keeps moving, which pushed
       the copy out to nearly five seconds after load. The three overlap on purpose. */
    tl.to(LOCKUP, { opacity: 1, y: 0, duration: .75, stagger: .07 }, .18)
      .to('.sh--seek .sh-body', { opacity: 1, y: 0, duration: .8 }, .48)
      .to('.sh--hire .sh-body', { opacity: 1, y: 0, duration: .8 }, .62);

    // generic reveals (everything outside the hero)
    gsap.utils.toArray('[data-reveal]').forEach(el => {
      if (el.closest('.hero')) return;
      if (el.dataset.reveal === 'mask') {
        /* Headings arrive a line at a time out of their own mask. The old version wiped
           the whole block in .55s starting at 'top 92%' — by the time a heading was far
           enough up the screen to look at, the wipe had already finished off-view, which
           is why it read as no animation at all. Later trigger, longer travel, and a
           stagger so a two-line heading actually resolves in front of you. */
        const lines = splitTitleLines(el);
        el.style.clipPath = 'none';
        gsap.set(lines, { yPercent: 112 });
        gsap.to(lines, { yPercent: 0, duration: .95, ease: 'power4.out', stagger: .085,
          scrollTrigger: { trigger: el, start: 'top 86%' } });
      } else {
        gsap.to(el, { opacity: 1, y: 0, duration: .75, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' } });
      }
    });
    gsap.utils.toArray('[data-reveal-stagger]').forEach(g => {
      gsap.to(g.children, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .07,
        scrollTrigger: { trigger: g, start: 'top 84%' } });
    });

    // cinematic slow zoom on the background video as you scroll
    const bgv = doc.querySelector('.bg-video');
    if (bgv) gsap.to(bgv, { scale: 1.16, ease: 'none',
      scrollTrigger: { trigger: doc.body, start: 'top top', end: 'bottom bottom', scrub: true } });

    /* The hero drifts as you leave it. No opacity here: this tween used to fade to .3,
       and because it was built while the intro's gsap.set still held the title at 0 it
       captured 0 as its start value — so the first scroll of the page handed the title
       straight to the scrub, which drove it to .3 and never gave it back. "ג'וב פאוור"
       simply went out the moment you touched the wheel. Movement alone reads as depth
       and has no state to get stuck in.

       .hero-split alone, too: the title lives inside it now, so naming the h1 here as
       well only handed GSAP another element to normalise — and the `scale: none` it
       writes while doing so outranks the stylesheet rule that shrinks the brand when you
       reach for one of the side panels, which quietly disabled that for good. */
    gsap.to('.hero-split', { yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // process timeline progress + active steps
    const fill = doc.querySelector('.proc-line .fill');
    const steps = gsap.utils.toArray('.proc-step');
    if (fill && steps.length) {
      gsap.to(fill, { height: '100%', ease: 'none',
        scrollTrigger: { trigger: '.proc-wrap', start: 'top 58%', end: 'bottom 72%', scrub: .5 } });
      steps.forEach(step => ScrollTrigger.create({
        trigger: step, start: 'top 64%',
        onEnter: () => step.classList.add('on'),
        onEnterBack: () => step.classList.add('on'),
        // without this the numbered nodes latch on permanently: scrolling back up left
        // every step lit, so the timeline read as finished before you reached it
        onLeaveBack: () => step.classList.remove('on'),
      }));
    }

    initMatchRails();

    ScrollTrigger.refresh();
  }

  /* ===============================================================
     6b. THE MATCH — two streams that never stop
     The rails drift on their own and scrolling accelerates them; whichever pair is
     crossing the centre seam locks.

     This replaces a scrub-driven version that mapped scroll position onto
     `trackWidth - railWidth`. That distance collapses to zero the moment the viewport is
     wider than the track — eight chips is about 1950px, so on any monitor near or above
     1920 the section simply sat still. Looping the content instead removes the viewport
     from the maths entirely: the track is duplicated until it is comfortably wider than
     the rail at any width, and position wraps on one set's width, which is seamless
     because the content repeats exactly.
     =============================================================== */
  function initMatchRails() {
    const section = doc.querySelector('.match');
    const people = doc.getElementById('railPeople');
    const roles = doc.getElementById('railRoles');
    const line = doc.querySelector('.match-line');
    if (!section || !people || !roles) return;

    const BASE = 22;    // px/sec of drift with the page standing still
    const BOOST = 0.32; // how much scroll velocity adds on top
    const CAP = 1100;   // px/sec ceiling, so a flick cannot turn it into a blur
    const NEAR = 0.5;   // highlight the chip in the window
    /* The seam is lit for roughly 2x this fraction of every chip of travel, so it doubles
       as the duty cycle of the pulse. At 0.22 it was lit about two thirds of the time,
       which reads as "always on"; this gives a distinct click each time a pair meets. */
    const LOCK = 0.10;

    /* Repeat the chips until the track spans the rail twice over, so there is always
       content either side of the wrap point. Clones are aria-hidden: they are the same
       items again, and a screen reader should hear the list once. */
    const fill = (track) => {
      const originals = [...track.children];
      const setW = () => originals.reduce((a, n) => a + n.offsetWidth, 0);
      const one = setW();
      if (!one) return 0;
      let guard = 0;
      while (track.scrollWidth < track.parentElement.clientWidth * 2 + one && guard++ < 12) {
        originals.forEach((n) => {
          const c = n.cloneNode(true);
          c.setAttribute('aria-hidden', 'true');
          track.appendChild(c);
        });
      }
      return one;
    };

    /* Both rails run at the same speed in opposite directions, so a pair lands on the
       seam together only when the rail is a whole number of chips wide — otherwise the
       two streams are permanently out of phase and the lock can never fire. Rounding the
       chip width to an exact divisor of the rail makes the meeting structural instead of
       a coincidence of viewport size. */
    const sizeChips = () => {
      section.style.removeProperty('--chip-w');   // read the width the CSS intends first
      section.style.removeProperty('--chip-min');
      const rail = people.parentElement;
      const railW = rail.clientWidth;
      const natural = people.children[0] ? people.children[0].offsetWidth : 0;
      if (!railW || !natural) return;
      const n = Math.max(2, Math.round(railW / natural));
      section.style.setProperty('--chip-min', '0px');
      section.style.setProperty('--chip-w', (railW / n) + 'px');
    };

    // cached geometry: offsets are stable after layout, so the per-frame lock test needs
    // no getBoundingClientRect at all
    let setPeople = 0, setRoles = 0, geo = new Map();
    const measure = () => {
      sizeChips();
      setPeople = fill(people);
      setRoles = fill(roles);
      geo = new Map();
      [people, roles].forEach((track) => {
        geo.set(track, [...track.children].map((c) => ({ el: c, mid: c.offsetLeft + c.offsetWidth / 2, w: c.offsetWidth || 1 })));
      });
    };
    measure();
    if (!setPeople || !setRoles) return;

    let pos = 0, boost = 0, active = false;

    const markRail = (track, x) => {
      const items = geo.get(track) || [];
      const mid = track.parentElement.clientWidth / 2;
      let best = null, bestD = Infinity, bestW = 1;
      for (const it of items) {
        const d = Math.abs(it.mid + x - mid);
        if (d < bestD) { bestD = d; best = it; bestW = it.w; }
      }
      items.forEach((it) => it.el.classList.remove('is-matched'));
      if (!best) return 1;
      const ratio = bestD / bestW;
      if (ratio < NEAR) best.el.classList.add('is-matched');
      return ratio;
    };

    const render = () => {
      const a = -(pos % setPeople);                 // travels one way
      const b = -(setRoles - (pos % setRoles));     // and the other, wrapping identically
      gsap.set(people, { x: a });
      gsap.set(roles, { x: b });
      const ra = markRail(people, a);
      const rb = markRail(roles, b);
      if (line) line.classList.toggle('is-locked', ra < LOCK && rb < LOCK);
    };

    gsap.ticker.add((_t, deltaMs) => {
      if (!active) return;                          // nothing to do while off-screen
      const dt = Math.min(deltaMs, 50) / 1000;      // clamp: a stalled tab must not jump
      pos += (BASE + boost) * dt;
      boost *= 0.92;                                // ease back down to the resting drift
      render();
    });

    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => { active = self.isActive; },
      // magnitude, not direction: scrolling either way speeds the streams up rather than
      // reversing them, so the drift always reads as the page's own pulse
      onUpdate: (self) => { boost = Math.min(Math.abs(self.getVelocity()) * BOOST, CAP); },
    });

    ScrollTrigger.addEventListener('refreshInit', measure);
    render();
  }

  /* ===============================================================
     7. COUNTERS
     =============================================================== */
  function initCounters() {
    doc.querySelectorAll('[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const from = target === 2010 ? 1995 : 0;
      const run = () => {
        const dur = 1700; let t0 = null;
        const step = ts => {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / dur, 1);
          el.textContent = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      const obs = new IntersectionObserver((en, o) => {
        en.forEach(x => { if (x.isIntersecting) { run(); o.disconnect(); } });
      }, { threshold: .4 });
      obs.observe(el);
    });
  }

  /* ===============================================================
     8. GOOGLE REVIEWS — star widget + floating bubble
     =============================================================== */
  const GOOGLE_REVIEW_URL = 'https://g.page/r/CU87GRVEWCRuEBM/review';

  function initReviews() {
    const wrap = doc.getElementById('stars');
    const hint = doc.getElementById('starsHint');
    if (!wrap) return;
    const stars = [...wrap.querySelectorAll('.star')];
    const paint = (n, cls) => stars.forEach((s, i) => s.classList.toggle(cls, i < n));
    let opening = false;
    stars.forEach((s, idx) => {
      const v = idx + 1;
      s.addEventListener('mouseenter', () => paint(v, 'hot'));
      s.addEventListener('focus', () => paint(v, 'hot'));
      s.addEventListener('click', () => {
        if (opening) return;
        opening = true;
        stars.forEach((x, i) => x.classList.toggle('on', i < v));
        paint(0, 'hot');
        // the one string on the page with no element to hang a key on until it is needed
        if (hint) {
          hint.textContent = (window.JPI18N && window.JPI18N.t('reviews.thanks')) ||
            'תודה על הדירוג! מעבירים אתכם ל-Google…';
          hint.classList.add('thanks');
        }
        setTimeout(() => { window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener'); opening = false; }, 650);
      });
    });
    wrap.addEventListener('mouseleave', () => paint(0, 'hot'));
  }

  // duplicate each testimonials column so the vertical marquee loops seamlessly
  function initReviewsWall() {
    if (reduceMotion) return;                       // static; CSS shows one set
    doc.querySelectorAll('.tCol > .tColInner').forEach(inner => {
      const clone = inner.cloneNode(true);
      clone.classList.add('tclone');
      clone.setAttribute('aria-hidden', 'true');
      inner.parentElement.appendChild(clone);
    });
  }

  /* ===============================================================
     BOOT
     =============================================================== */
  /* Touch: drive the hover states from position instead. A thin band a little above the
     middle of the screen (38%-48% of the viewport) acts as the pointer, so cards light
     as they arrive rather than requiring a tap that would otherwise navigate. */
  function initBandStates() {
    if (!window.matchMedia('(hover: none)').matches || !('IntersectionObserver' in window)) return;
    const els = doc.querySelectorAll('.svc, .wcard, .crow, .tcard');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('in-band', e.isIntersecting)),
      { rootMargin: '-38% 0px -52% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
  }

  function boot() {
    initVideoBg();
    initBandStates();
    initCursor();
    initNav();
    initCounters();
    initReviews();
    initReviewsWall();
    initSmooth();
    initPreloader(() => initMotion());
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
