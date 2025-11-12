import { assert, isId } from '../utils/validation.js';

export const loadMovies = async () => {
  try {
    const res = await fetch('/assets/mock/movies.json');
    if (!res.ok) throw new Error('Failed to load movies');
    const data = await res.json();
    assert(Array.isArray(data), 'Invalid movies data');
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
};

export const getMovieById = (movies, id) => {
  try {
    assert(isId(id), 'Invalid movie id');
    const movie = (movies || []).find((m) => String(m.id) === String(id));
    if (!movie) throw new Error('Movie not found');
    return { ok: true, data: movie };
  } catch (e) {
    return { ok: false, error: e.message };
  }
};