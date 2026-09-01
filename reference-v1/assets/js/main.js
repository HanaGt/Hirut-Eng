/* ============================================================
   HIRUT ENGINEERING  site behavior
   Progressive enhancement only: every feature degrades to a
   fully informative static page with JS disabled.
   ============================================================ */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);

  /* ---------- Header: solid on scroll ---------- */
  var header = document.querySelector('[data-header]');
  function syncHeader() {
    if (header) header.classList.toggle('is-solid', window.scrollY > 24);
  }
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector('[data-nav-toggle]');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveals ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window && !reducedMotion) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealIO.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    if (reducedMotion) { el.textContent = prefix + target + suffix; return; }
    var dur = 1400;
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          countIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countIO.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ============================================================
     Signature interaction (§4.1): scroll-scrubbed time-lapse.
     - Starts in static mode (normal flowing section, steps reveal
       on scroll)  fully informative with the effect off.
     - Upgrades to pinned scrub ONLY when: a <source> exists, enough
       is buffered, and neither reduced-motion nor Save-Data is set.
     - Downgrades live if seeking stalls repeatedly (weak devices).
     ============================================================ */
  (function initScrub() {
    var section = document.querySelector('[data-scrub]');
    if (!section) return;
    section.classList.add('scrub--static');

    var video = section.querySelector('[data-scrub-video]');
    var hasSource = !!(video && video.querySelector('source'));
    if (!hasSource || reducedMotion || saveData) return;

    var track = section.querySelector('.scrub-track');
    var steps = section.querySelectorAll('.scrub-step');
    var ticks = section.querySelectorAll('.gauge-tick');
    var gaugeFill = section.querySelector('[data-gauge]');

    var current = 0;          // lerped playback time
    var target = 0;           // time implied by scroll position
    var rafId = null;
    var stallFrames = 0;      // consecutive frames spent seeking
    var live = false;

    function progress() {
      var rect = track.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      if (total <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / total));
    }

    function setPhase(p) {
      var idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
      steps.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
      ticks.forEach(function (t, i) { t.classList.toggle('is-active', i <= idx); });
      if (gaugeFill) gaugeFill.style.height = (p * 100) + '%';
    }

    function downgrade() {
      live = false;
      if (rafId) cancelAnimationFrame(rafId);
      section.classList.remove('scrub--live');
      section.classList.add('scrub--static');
      steps.forEach(function (s) { s.classList.add('is-active'); });
    }

    function loop() {
      if (!live) return;
      var p = progress();
      target = p * (video.duration || 0);
      // Lerp toward the scroll-implied time  never write raw values.
      current += (target - current) * 0.14;
      if (Math.abs(target - current) > 0.01 && !video.seeking) {
        try { video.currentTime = current; } catch (e) { /* not seekable yet */ }
      }
      // Frame-drop guard: sustained seeking means the device or the
      // encode can't keep up  fall back to the static band.
      stallFrames = video.seeking ? stallFrames + 1 : 0;
      if (stallFrames > 90) { downgrade(); return; }
      setPhase(p);
      rafId = requestAnimationFrame(loop);
    }

    function goLive() {
      if (live) return;
      live = true;
      section.classList.remove('scrub--static');
      section.classList.add('scrub--live');
      current = 0;
      rafId = requestAnimationFrame(loop);
    }

    // Gate on buffering: require ~90% of the file before enabling.
    function checkBuffered() {
      if (!video.duration) return false;
      var b = video.buffered;
      return b.length > 0 && b.end(b.length - 1) >= video.duration * 0.9;
    }
    video.addEventListener('canplaythrough', function () { goLive(); });
    video.addEventListener('progress', function () { if (checkBuffered()) goLive(); });
    video.load();
  })();

  /* ---------- Background videos (§4.2) ----------
     <video data-bg-video data-src="...">  lazy-attached near the
     viewport, paused offscreen, poster-only under RM / Save-Data. */
  var bgVideos = document.querySelectorAll('[data-bg-video]');
  if (bgVideos.length && !reducedMotion && !saveData && 'IntersectionObserver' in window) {
    var bgIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          if (!v.src && v.dataset.src) v.src = v.dataset.src;
          v.play().catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { rootMargin: '200px 0px' });
    bgVideos.forEach(function (v) { bgIO.observe(v); });
  }

  /* ---------- Chip filter (products hub) ----------
     Buttons: [data-filter="tag"] inside [data-filter-group]
     Items:   [data-tags="water ground"] inside [data-filter-items] */
  document.querySelectorAll('[data-filter-group]').forEach(function (group) {
    var scope = document.querySelector(group.getAttribute('data-filter-group'));
    if (!scope) return;
    var chips = group.querySelectorAll('[data-filter]');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
        var tag = chip.getAttribute('data-filter');
        scope.querySelectorAll('[data-tags]').forEach(function (item) {
          var show = tag === 'all' || item.getAttribute('data-tags').split(/\s+/).indexOf(tag) !== -1;
          item.hidden = !show;
        });
      });
    });
  });

  /* ---------- Select filters (projects) ---------- */
  var projFilters = document.querySelector('[data-project-filters]');
  if (projFilters) {
    var selects = projFilters.querySelectorAll('select');
    var projItems = document.querySelectorAll('[data-project]');
    var emptyMsg = document.querySelector('[data-filter-empty]');
    function applyProjectFilters() {
      var active = {};
      selects.forEach(function (s) { if (s.value !== 'all') active[s.name] = s.value; });
      var visible = 0;
      projItems.forEach(function (item) {
        var show = Object.keys(active).every(function (k) {
          return item.getAttribute('data-' + k) === active[k];
        });
        item.hidden = !show;
        if (show) visible++;
      });
      if (emptyMsg) emptyMsg.classList.toggle('is-visible', visible === 0);
    }
    selects.forEach(function (s) { s.addEventListener('change', applyProjectFilters); });
    var clearBtn = projFilters.querySelector('[data-filter-clear]');
    if (clearBtn) clearBtn.addEventListener('click', function () {
      selects.forEach(function (s) { s.value = 'all'; });
      applyProjectFilters();
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    // Pre-select inquiry type from ?type= (category CTAs link here).
    try {
      var wanted = new URLSearchParams(location.search).get('type');
      var typeSelect = form.querySelector('#inquiry-type');
      if (wanted && typeSelect && typeSelect.querySelector('option[value="' + wanted + '"]')) {
        typeSelect.value = wanted;
      }
    } catch (e) { /* older browsers: ignore */ }

    function setError(input, show, msg) {
      var err = form.querySelector('[data-error-for="' + input.id + '"]');
      input.setAttribute('aria-invalid', show ? 'true' : 'false');
      if (err) {
        if (msg) err.textContent = msg;
        err.classList.toggle('is-visible', show);
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var name = form.querySelector('#name');
      var phone = form.querySelector('#phone');
      var email = form.querySelector('#email');
      var type = form.querySelector('#inquiry-type');
      var message = form.querySelector('#message');

      if (!name.value.trim()) { setError(name, true); ok = false; } else setError(name, false);
      if (!phone.value.trim() || !/^[+\d][\d\s\-()]{6,}$/.test(phone.value.trim())) {
        setError(phone, true); ok = false;
      } else setError(phone, false);
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setError(email, true); ok = false;
      } else setError(email, false);
      if (!type.value) { setError(type, true); ok = false; } else setError(type, false);
      if (!message.value.trim()) { setError(message, true); ok = false; } else setError(message, false);

      if (!ok) {
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      /* [PLACEHOLDER: form submission endpoint / destination email]
         When the endpoint is confirmed, POST the FormData here before
         showing the success state. */
      form.hidden = true;
      var success = document.querySelector('[data-form-success]');
      if (success) {
        success.classList.add('is-visible');
        success.setAttribute('tabindex', '-1');
        success.focus();
      }
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
