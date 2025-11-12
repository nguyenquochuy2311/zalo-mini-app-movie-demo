import { assert, isId } from '../utils/validation.js';

export const loadShowtimes = async () => {
  try {
    const res = await fetch('/assets/mock/showtimes.json');
    if (!res.ok) throw new Error('Failed to load showtimes');
    const data = await res.json();
    assert(Array.isArray(data), 'Invalid showtimes data');
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
};

export const getShowtimesForMovie = (showtimes, movieId) => {
  try {
    assert(isId(movieId), 'Invalid movie id');
    const list = (showtimes || []).filter((s) => String(s.movieId) === String(movieId));
    return { ok: true, data: list };
  } catch (e) { return { ok: false, error: e.message }; }
};

export const getShowtimeById = (showtimes, id) => {
  try {
    assert(isId(id), 'Invalid showtime id');
    const st = (showtimes || []).find((s) => String(s.id) === String(id));
    if (!st) throw new Error('Showtime not found');
    return { ok: true, data: st };
  } catch (e) { return { ok: false, error: e.message }; }
};