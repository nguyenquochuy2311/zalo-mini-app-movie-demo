const resultsEl = document.getElementById('results');

const log = (name, pass, err) => {
  const div = document.createElement('div');
  div.className = 'test ' + (pass ? 'pass' : 'fail');
  div.textContent = `${pass ? '✓' : '✗'} ${name}${pass ? '' : ' — ' + (err?.message || err)}`;
  resultsEl.appendChild(div);
};

const test = async (name, fn) => {
  try { await fn(); log(name, true); } catch (e) { log(name, false, e); }
};

import { isNonEmptyString, isId, validateSeatIds } from '../assets/js/utils/validation.js';
import { currency, fmtTime } from '../assets/js/utils/format.js';
import { loadMovies } from '../assets/js/services/movieService.js';
import { loadShowtimes, getShowtimeById } from '../assets/js/services/showtimeService.js';
import { loadSeatMap, calculateTotal } from '../assets/js/services/seatService.js';

await test('validation: isNonEmptyString', () => {
  if (!isNonEmptyString('abc')) throw new Error('expected true');
  if (isNonEmptyString('')) throw new Error('expected false');
});

await test('validation: isId', () => {
  if (!isId('st1')) throw new Error('expected true');
  if (isId('bad id')) throw new Error('expected false');
});

await test('validation: validateSeatIds', () => {
  if (!validateSeatIds(['A1', 'B10'])) throw new Error('expected valid');
  if (validateSeatIds(['AA1'])) throw new Error('expected invalid');
});

await test('format: currency', () => {
  const s = currency(90000);
  if (!String(s).includes('₫')) throw new Error('should include currency');
});

await test('format: fmtTime', () => {
  const s = fmtTime('2025-01-01T10:00:00.000Z');
  if (!isNonEmptyString(s)) throw new Error('should format');
});

await test('service: loadMovies', async () => {
  const res = await loadMovies();
  if (!res.ok || !Array.isArray(res.data) || res.data.length < 1) throw new Error('movies not loaded');
});

await test('service: loadShowtimes and getShowtimeById', async () => {
  const res = await loadShowtimes();
  if (!res.ok || !Array.isArray(res.data)) throw new Error('showtimes not loaded');
  const st = getShowtimeById(res.data, res.data[0].id);
  if (!st.ok || !st.data) throw new Error('getShowtimeById failed');
});

await test('service: loadSeatMap and calculateTotal', async () => {
  const res = await loadSeatMap('st1');
  if (!res.ok || !res.data || !Number.isInteger(res.data.rows)) throw new Error('seatmap failed');
  const total = calculateTotal(['A3', 'B4'], 90000, 1.2);
  if (!total.ok || total.data <= 0) throw new Error('calculateTotal failed');
});