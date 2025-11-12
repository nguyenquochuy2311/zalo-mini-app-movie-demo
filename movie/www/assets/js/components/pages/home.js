import { Header, MovieCard, bindHeader } from '../common.js';
import { actions, getState } from '../../store.js';
import { loadMovies } from '../../services/movieService.js';
import { qs, qsa, mount, showToast } from '../../utils/dom.js';
import { escapeHTML } from '../../utils/security.js';
import { navigate } from '../../router.js';

export const HomePage = {
  render: () => {
    const s = getState();
    const list = s.movies || [];
    const items = list.map(MovieCard).join('');
    return `
      ${Header('Movies')}
      <div class="container">
        <div class="search">
          <input id="search" type="text" placeholder="Search movies" aria-label="Search" />
          <button class="btn-primary" id="searchBtn">Search</button>
        </div>
        <div class="grid movies-grid" id="movies">${items}</div>
      </div>
    `;
  },
  afterMount: async () => {
    bindHeader();
    // Load movies if empty
    if (!getState().movies.length) {
      const { ok, data, error } = await loadMovies();
      if (!ok) { showToast(error || 'Failed to load'); return; }
      actions.setMovies(data);
      const grid = qs('#movies');
      mount(grid, data.map(MovieCard).join(''));
    }
    // Click to detail
    qsa('.card').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        actions.selectMovie(id);
        navigate(`/detail?id=${encodeURIComponent(id)}`);
      });
    });
    // Search handler
    const input = qs('#search');
    const btn = qs('#searchBtn');
    btn && btn.addEventListener('click', () => {
      const q = String(input?.value || '').trim().toLowerCase();
      const list = getState().movies.filter((m) => m.title.toLowerCase().includes(q));
      const grid = qs('#movies');
      mount(grid, list.map(MovieCard).join(''));
    });
  },
};