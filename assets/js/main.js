/* Agni Miftah Fauzi — Portfolio 2026
   Small, dependency-free. Three jobs: reveal on scroll,
   filter the index, keep the Bandung clock honest. */

document.documentElement.classList.add('js');

/* ---------- reveal on scroll ---------- */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

/* ---------- index filters ---------- */
(function () {
  var buttons = document.querySelectorAll('.filter');
  if (!buttons.length) return;

  var items = document.querySelectorAll('#indexRows [data-cat]');

  function matches(el, filter) {
    var cats = (el.getAttribute('data-cat') || '').split(/\s+/);
    return cats.indexOf(filter) !== -1;
  }

  /* counts, shown once at load */
  var counts = { all: 0, ai: 0, web: 0, hw: 0 };
  items.forEach(function (el) {
    if (!el.classList.contains('idx-row') &&
        !el.classList.contains('demo-cell')) return;
    var cats = (el.getAttribute('data-cat') || '').split(/\s+/);
    cats.forEach(function (c) { if (counts[c] !== undefined) counts[c]++; });
    counts.all++;
  });
  Object.keys(counts).forEach(function (key) {
    var sup = document.getElementById('count-' + key);
    if (sup) sup.textContent = counts[key];
  });

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var filter = btn.getAttribute('data-filter');
      items.forEach(function (el) {
        var show = filter === 'all' || matches(el, filter);
        el.classList.toggle('is-hidden', !show);
      });
    });
  });
})();

/* ---------- mobile nav ---------- */
(function () {
  var burger = document.getElementById('navBurger');
  var nav = document.getElementById('nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ---------- Bandung clock (WIB) ---------- */
(function () {
  var clock = document.getElementById('clock');
  if (!clock) return;
  function tick() {
    try {
      var fmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      clock.textContent = fmt.format(new Date()) + ' WIB';
    } catch (e) {
      clock.textContent = 'WIB';
    }
  }
  tick();
  setInterval(tick, 30000);
})();
