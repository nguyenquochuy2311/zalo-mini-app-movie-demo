// Simple sanitization and safe storage wrappers

export const escapeHTML = (str) => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const SAFE_KEYS = new Set(['order', 'selectedSeats']);

export const SafeStorage = {
  set(key, value) {
    if (!SAFE_KEYS.has(String(key))) return false;
    try {
      const payload = JSON.stringify(value);
      localStorage.setItem(String(key), payload);
      return true;
    } catch (e) {
      return false;
    }
  },
  get(key) {
    try {
      const raw = localStorage.getItem(String(key));
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },
  remove(key) { try { localStorage.removeItem(String(key)); } catch {} }
};