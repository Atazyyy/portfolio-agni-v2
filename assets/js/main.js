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

/* ---------- count-up numbers when they scroll into view ----------
   Every quantity in the copy counts up once. Deliberately NOT counted:
   years (they're dates, not scores), single digits (P0, P2), decimals
   (0.8 cutoff), and anything in .mono metadata (dates, coordinates). */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var RE = /\d+(?:[.,]\d+)*/g;

  function parseToken(tok) {
    if (tok.indexOf('.') !== -1) return null;                       // decimal — leave alone
    if (tok.indexOf(',') !== -1 && !/^\d{1,3}(,\d{3})+$/.test(tok)) return null;
    var n = parseInt(tok.replace(/,/g, ''), 10);
    if (isNaN(n) || n < 10) return null;                            // single digits: skip
    if (n >= 1900 && n <= 2100) return null;                        // a year: skip
    return n;
  }

  function fmt(n, withCommas) {
    return withCommas ? n.toLocaleString('en-US') : String(n);
  }

  function durationFor(n) {
    if (n <= 99) return 800;
    if (n <= 999) return 1000;
    return 1300;
  }

  /* wrap every countable number in <span class="count"> keeping the final
     value as content, so no-JS renders correctly and layout is stable */
  var walker = document.createTreeWalker(document.querySelector('main') || document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      if (!node.nodeValue || !/\d/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
      var el = node.parentElement;
      if (!el || el.closest('.mono, .site-foot, script, style, noscript')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  var textNodes = [], node;
  while ((node = walker.nextNode())) textNodes.push(node);

  textNodes.forEach(function (tn) {
    var text = tn.nodeValue, m, frag, last = 0, changed = false;
    RE.lastIndex = 0;
    while ((m = RE.exec(text)) !== null) {
      var tok = m[0];
      var before = text.charAt(m.index - 1);
      var after = text.charAt(m.index + tok.length);
      if (/[\w.,]/.test(before) || /[\w]/.test(after)) continue;    // glued to a word (mAP50) or decimal
      var n = parseToken(tok);
      if (n === null) continue;
      if (!frag) frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var span = document.createElement('span');
      span.className = 'count';
      span.textContent = tok;
      span.setAttribute('data-n', n);
      span.setAttribute('data-commas', tok.indexOf(',') !== -1 ? '1' : '0');
      frag.appendChild(span);
      last = m.index + tok.length;
      changed = true;
    }
    if (changed) {
      frag.appendChild(document.createTextNode(text.slice(last)));
      tn.parentNode.replaceChild(frag, tn);
    }
  });

  var counts = document.querySelectorAll('.count');
  if (!counts.length) return;

  function run(span) {
    var final = parseInt(span.getAttribute('data-n'), 10);
    var commas = span.getAttribute('data-commas') === '1';
    var dur = durationFor(final);
    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      span.textContent = fmt(Math.round(final * eased), commas);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        run(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counts.forEach(function (el) { io.observe(el); });
})();
