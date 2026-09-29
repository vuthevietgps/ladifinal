(function () {
  'use strict';

  const endpoint = '/api/ad-traffic/event';
  const startedAt = Date.now();
  let maxScroll = 0;
  let lastHeartbeat = 0;
  let lastScrollSent = 0;

  function send(event, value, preferBeacon) {
    const body = JSON.stringify({ event, value: Number(value || 0) });

    if (preferBeacon && navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon(endpoint, blob)) return;
    }

    fetch(endpoint, {
      method: 'POST',
      credentials: 'same-origin',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body
    }).catch(function () {
      // Tracking must never affect the landing-page experience.
    });
  }

  function engagedSeconds() {
    return Math.max(0, Math.round((Date.now() - startedAt) / 1000));
  }

  function updateScroll() {
    const documentHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0
    );
    const scrollable = Math.max(1, documentHeight - window.innerHeight);
    const percent = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
    maxScroll = Math.max(maxScroll, percent);

    if (maxScroll >= lastScrollSent + 25) {
      lastScrollSent = Math.floor(maxScroll / 25) * 25;
      send('scroll', lastScrollSent, false);
    }
  }

  function flush(preferBeacon) {
    const seconds = engagedSeconds();
    if (seconds > lastHeartbeat) {
      lastHeartbeat = seconds;
      send('heartbeat', seconds, preferBeacon);
    }
    if (maxScroll > lastScrollSent) {
      lastScrollSent = maxScroll;
      send('scroll', maxScroll, preferBeacon);
    }
  }

  send('page_view', 1, false);
  window.addEventListener('scroll', updateScroll, { passive: true });

  window.setInterval(function () {
    if (document.visibilityState === 'visible') flush(false);
  }, 15000);

  document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (
      href.startsWith('tel:') ||
      href.startsWith('mailto:') ||
      href.includes('zalo.me') ||
      href.includes('chat.zalo.me') ||
      href.includes('wa.me')
    ) {
      send(href.startsWith('tel:') ? 'phone' : href.includes('zalo.me') ? 'zalo' : 'contact', 1, true);
    } else if (href.includes('m.me/') || href.includes('messenger.com/')) {
      send('inbox', 1, true);
    }
  }, true);

  document.addEventListener('submit', function () {
    send('form_submit', 1, true);
  }, true);

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flush(true);
  });
  window.addEventListener('pagehide', function () {
    flush(true);
  });
})();
