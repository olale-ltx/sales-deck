/* ============================================================================
   LTX Sales Deck — session tracker
   ----------------------------------------------------------------------------
   Collects ONE session summary per viewer and beacons it to the Apps Script
   endpoint. Nothing is sent per-interaction: everything accumulates in memory
   and flushes on a heartbeat + on pagehide. That is what keeps Apps Script
   from choking and keeps the sheet at ~1 row per session.

   Wire-up (in the deck's index.html, after the deck script):
     <script src="./tracker.js"></script>
     <script>
       LTXTrack.init({
         endpoint: 'https://script.google.com/macros/s/XXXX/exec',
         deckId:   'sales-deck-2026',
         // called by your gate on successful sign-in:
         // LTXTrack.identify({ firstName, lastName, role, code })
       });
     </script>

   IMPORTANT: do not call init() until the viewer has passed the gate AND the
   notice on the gate tells them behavioural data is recorded. See README.
   ========================================================================== */

(function (global) {
  'use strict';

  var CFG = {
    endpoint: null,
    deckId: 'sales-deck-2026',
    slideSelector: '.slide',
    heartbeatMs: 30000,      // flush every 30s so a hard close loses <30s
    idleMs: 60000,           // stop counting active time after 60s of no input
    debug: false
  };

  var S = null;              // session state
  var timers = { heartbeat: null };

  /* ---------- utilities -------------------------------------------------- */

  function now() { return Date.now(); }

  function uid() {
    return 's_' + now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function log() {
    if (CFG.debug) console.log.apply(console, ['[LTXTrack]'].concat([].slice.call(arguments)));
  }

  // Stable-ish device fingerprint. Deliberately coarse: enough to tell
  // "same person came back" from "this link was forwarded to someone else",
  // not enough to be a cross-site identifier.
  function fingerprint() {
    var bits = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
      navigator.maxTouchPoints || 0
    ].join('|');
    var h = 5381;
    for (var i = 0; i < bits.length; i++) h = ((h << 5) + h + bits.charCodeAt(i)) | 0;
    return 'fp_' + (h >>> 0).toString(36);
  }

  function deviceInfo() {
    var ua = navigator.userAgent;
    var browser = /Edg\//.test(ua) ? 'Edge'
      : /OPR\//.test(ua) ? 'Opera'
      : /Chrome\//.test(ua) ? 'Chrome'
      : /Safari\//.test(ua) ? 'Safari'
      : /Firefox\//.test(ua) ? 'Firefox' : 'Other';
    var os = /Windows/.test(ua) ? 'Windows'
      : /Mac OS X/.test(ua) ? 'macOS'
      : /Android/.test(ua) ? 'Android'
      : /iPhone|iPad/.test(ua) ? 'iOS'
      : /Linux/.test(ua) ? 'Linux' : 'Other';
    var type = /iPhone|Android.*Mobile/.test(ua) ? 'mobile'
      : /iPad|Tablet/.test(ua) ? 'tablet' : 'desktop';
    return {
      type: type, os: os, browser: browser,
      viewport: window.innerWidth + 'x' + window.innerHeight
    };
  }

  /* ---------- active-time accounting ------------------------------------ */
  /* Wall-clock time is worthless here — people leave decks open. We only
     accrue time while the tab is visible AND the viewer has interacted in
     the last CFG.idleMs. */

  function isActive() {
    return !document.hidden && (now() - S.lastInput) < CFG.idleMs;
  }

  function accrue() {
    var t = now();
    var slice = t - S.lastTick;
    S.lastTick = t;
    if (slice <= 0 || !S.wasActive) return;
    if (slice > CFG.idleMs) slice = CFG.idleMs; // clamp a sleep/suspend gap

    S.activeMs += slice;
    var rec = S.slides[S.current];
    if (rec) rec.activeMs += slice;
    var seg = S.path[S.path.length - 1];
    if (seg) seg.ms += slice;
  }

  // Call before and after anything that changes active state or slide.
  function tick() {
    accrue();
    S.wasActive = isActive();
  }

  /* ---------- slide model ----------------------------------------------- */

  function slideEls() {
    return Array.prototype.slice.call(document.querySelectorAll(CFG.slideSelector));
  }

  // Slide list for debugging in the console: LTXTrack.manifest()
  function manifest() {
    return slideEls().map(function (el, i) {
      var h = el.querySelector('h1, h2, .divider-title, .eyebrow');
      return {
        i: i,
        section: Number(el.dataset.section || 0),
        label: (el.dataset.label || (h && h.textContent) || '').trim().replace(/\s+/g, ' ').slice(0, 60),
        scrolls: /scroll-page/.test(el.className)
      };
    });
  }

  function ensureSlide(i) {
    if (!S.slides[i]) S.slides[i] = { activeMs: 0, views: 0, maxScroll: 0 };
    return S.slides[i];
  }

  function onSlideChange(index) {
    if (index === S.current) return;
    tick();
    S.current = index;
    var rec = ensureSlide(index);
    rec.views += 1;
    if (index > S.reach) S.reach = index;
    S.path.push({ i: index, t: now() - S.startedAt, ms: 0 });
    log('slide', index);
  }

  // The deck already tracks its own current slide. Rather than guess at its
  // internals we detect the active slide from the DOM. Works with either an
  // .is-active class or inline transform-based paging.
  function detectSlide() {
    var els = slideEls();
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.classList.contains('is-active') || el.classList.contains('active') ||
          el.getAttribute('aria-hidden') === 'false') {
        return i;
      }
    }
    // fallback: whichever slide occupies the most of the viewport
    var best = S.current, bestArea = 0;
    els.forEach(function (el, i) {
      var r = el.getBoundingClientRect();
      var vis = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
      if (vis > bestArea) { bestArea = vis; best = i; }
    });
    return best;
  }

  /* ---------- interaction capture --------------------------------------- */
  /* Generic: anything carrying data-track is recorded, so you never have to
     edit this file again when you add a slide. Tag elements like:
       <button data-track="ctrl:data-ip">Data & IP</button>
       <input type="range" data-track="revshare:commitment">
       <video data-track="cap:lip-dub">
     Highest-value ones for this deck are listed in the README. */

  function pushEvent(kind, target, value) {
    if (S.events.length > 400) return;             // hard cap on payload size
    S.events.push({
      k: kind,
      target: target,
      slide: S.current,
      t: now() - S.startedAt,
      v: value === undefined ? null : String(value).slice(0, 60)
    });
    log('event', kind, target, value);
  }

  function bindInteractions() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-track]');
      if (el) pushEvent('click', el.dataset.track, el.dataset.trackValue);

      var link = e.target.closest('a[href^="http"]');
      if (link && !link.dataset.track) pushEvent('outbound', link.hostname + link.pathname);
    }, true);

    // Sliders: record where they LET GO, not every intermediate value.
    document.addEventListener('change', function (e) {
      var el = e.target.closest('[data-track]');
      if (el && (el.type === 'range' || el.tagName === 'SELECT')) {
        pushEvent('setting', el.dataset.track, el.dataset.trackValue || el.value);
      }
    }, true);

    // Video watch time — only meaningful chunks.
    document.addEventListener('play', function (e) {
      var v = e.target;
      if (v.tagName !== 'VIDEO') return;
      var key = v.dataset.track || 'video:s' + S.current;
      v._ltxStart = v.currentTime;
      var stop = function () {
        var watched = Math.max(0, v.currentTime - (v._ltxStart || 0));
        if (watched > 1.5) pushEvent('video', key, Math.round(watched) + 's');
        v.removeEventListener('pause', stop);
        v.removeEventListener('ended', stop);
      };
      v.addEventListener('pause', stop);
      v.addEventListener('ended', stop);
    }, true);

    // Internal-sharing tells.
    document.addEventListener('copy', function () { pushEvent('copy', 'selection'); });
    window.addEventListener('beforeprint', function () { pushEvent('print', 'deck'); });
    document.addEventListener('fullscreenchange', function () {
      if (document.fullscreenElement) { S.device.fullscreen = true; pushEvent('fullscreen', 'on'); }
    });
  }

  // Scroll depth inside slides that actually scroll (.scroll-page), plus
  // sub-block attention via IntersectionObserver on [data-track-block].
  function bindAttention() {
    slideEls().forEach(function (el, i) {
      if (!/scroll-page/.test(el.className)) return;
      el.addEventListener('scroll', function () {
        var max = el.scrollHeight - el.clientHeight;
        if (max <= 0) return;
        var pct = Math.round((el.scrollTop / max) * 100);
        var rec = ensureSlide(i);
        if (pct > rec.maxScroll) rec.maxScroll = pct;
      }, { passive: true });
    });

    if (!('IntersectionObserver' in window)) return;
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var key = en.target.dataset.trackBlock;
        if (!key) return;
        if (en.isIntersecting && en.intersectionRatio > 0.6) {
          if (!seen[key]) { seen[key] = now(); }
        } else if (seen[key]) {
          var dwell = now() - seen[key];
          seen[key] = 0;
          if (dwell > 2000) pushEvent('block', key, Math.round(dwell / 1000) + 's');
        }
      });
    }, { threshold: [0, 0.6, 1] });

    document.querySelectorAll('[data-track-block]').forEach(function (el) { io.observe(el); });
  }

  /* ---------- payload + transport --------------------------------------- */

  function payload(final) {
    tick();
    return {
      v: 1,
      deckId: CFG.deckId,
      sessionId: S.sessionId,
      final: !!final,
      linkId: S.identity.code || null,
      firstName: S.identity.firstName || null,
      lastName: S.identity.lastName || null,
      role: S.identity.role || null,
      startedAt: new Date(S.startedAt).toISOString(),
      sentAt: new Date().toISOString(),
      activeMs: S.activeMs,
      wallMs: now() - S.startedAt,
      reach: S.reach,
      slideCount: slideEls().length,
      device: S.device,
      tz: (Intl.DateTimeFormat().resolvedOptions() || {}).timeZone || null,
      fp: S.fp,
      referrer: document.referrer || null,
      utm: location.search || null,
      slides: S.slides,
      path: S.path,
      events: S.events
    };
  }

  function flush(final) {
    if (!CFG.endpoint || !S.identity.code) return;   // never send un-gated data
    var body = JSON.stringify(payload(final));

    // sendBeacon survives page unload; text/plain avoids a CORS preflight that
    // Apps Script would reject.
    var blob = new Blob([body], { type: 'text/plain;charset=UTF-8' });
    if (navigator.sendBeacon && navigator.sendBeacon(CFG.endpoint, blob)) {
      log('flushed via beacon', final ? '(final)' : '', body.length + 'b');
      return;
    }
    fetch(CFG.endpoint, {
      method: 'POST', body: body, keepalive: true, mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
    }).catch(function () { /* analytics must never break the deck */ });
  }

  /* ---------- lifecycle ------------------------------------------------- */

  function init(options) {
    if (S) return;
    Object.keys(options || {}).forEach(function (k) { CFG[k] = options[k]; });

    var t = now();
    S = {
      sessionId: uid(),
      startedAt: t,
      lastTick: t,
      lastInput: t,
      wasActive: !document.hidden,
      activeMs: 0,
      current: -1,
      reach: 0,
      slides: {},
      path: [],
      events: [],
      identity: {},
      device: deviceInfo(),
      fp: fingerprint()
    };

    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) {
      window.addEventListener(ev, function () {
        if (!S.wasActive) tick();          // coming back from idle
        S.lastInput = now();
        S.wasActive = isActive();
      }, { passive: true, capture: true });
    });

    document.addEventListener('visibilitychange', function () {
      tick();
      if (document.hidden) flush(false);   // best moment to save data
    });

    onSlideChange(detectSlide());
    // The deck pages via class/transform changes; poll cheaply rather than
    // patching its internals. 250ms is well under any real dwell.
    setInterval(function () { onSlideChange(detectSlide()); }, 250);

    bindInteractions();
    bindAttention();

    timers.heartbeat = setInterval(function () { flush(false); }, CFG.heartbeatMs);
    window.addEventListener('pagehide', function () { flush(true); });

    log('init', CFG.deckId, S.sessionId);
  }

  function identify(who) {
    if (!S) return;
    S.identity = {
      firstName: (who.firstName || '').trim(),
      lastName: (who.lastName || '').trim(),
      role: (who.role || '').trim(),
      code: (who.code || '').trim().toUpperCase()
    };
    flush(false);   // record the open immediately — this is the "they opened it" event
    log('identified', S.identity.code);
  }

  global.LTXTrack = {
    init: init,
    identify: identify,
    manifest: manifest,
    event: pushEvent,
    peek: function () { return payload(false); }   // for debugging in console
  };
})(window);
