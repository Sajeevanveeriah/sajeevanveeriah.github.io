(function () {
  'use strict';

  const SPEED_KEY = 'oia-simulation-speed-v3';
  const allowed = new Set([1, 2, 5, 10, 20]);
  const stored = Number(localStorage.getItem(SPEED_KEY));
  const speed = allowed.has(stored) ? stored : 5;
  localStorage.setItem(SPEED_KEY, String(speed));

  // Prevent a stale dark preference from the previous prototype overriding
  // the user-approved light-first product system on first migration.
  if (!localStorage.getItem('oia-suite-theme-migrated-v3')) {
    localStorage.removeItem('oia-suite-theme-v2');
    localStorage.setItem('oia-suite-theme-migrated-v3', 'true');
  }

  const nativeSetInterval = window.setInterval.bind(window);
  window.setInterval = function setOiaInterval(callback, delay, ...args) {
    const callbackName = typeof callback === 'function' ? callback.name : '';
    if (callbackName === 'tickProcess' && Number(delay) === 1000) {
      return nativeSetInterval(callback, Math.max(50, Math.round(1000 / speed)), ...args);
    }
    return nativeSetInterval(callback, delay, ...args);
  };

  window.OIA_RUNTIME = Object.freeze({
    speed,
    setSpeed(next) {
      const value = Number(next);
      if (!allowed.has(value)) throw new TypeError('Unsupported simulation speed');
      localStorage.setItem(SPEED_KEY, String(value));
      location.reload();
    },
  });
})();
