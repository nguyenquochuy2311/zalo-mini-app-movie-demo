export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const mount = (root, html) => {
  // Avoid XSS by only interpolating sanitized strings from utilities
  root.innerHTML = html;
};

export const on = (el, evt, handler) => el && el.addEventListener(evt, handler);

export const showToast = (msg) => {
  const toast = qs('#toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
};