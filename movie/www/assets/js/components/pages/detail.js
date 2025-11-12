import { Header, bindHeader } from '../common.js';
import { actions, getState } from '../../store.js';
import { getMovieById } from '../../services/movieService.js';
import { getShowtimesForMovie } from '../../services/showtimeService.js';
import { qs, mount, showToast } from '../../utils/dom.js';
import { currency, fmtTime } from '../../utils/format.js';
import { escapeHTML } from '../../utils/security.js';
import { navigate } from '../../router.js';

export const DetailPage = {
  render: (params) => {
    const { id } = Object.fromEntries(params.entries());
    const s = getState();
    const m = getMovieById(s.movies, id);
    const movie = m.ok ? m.data : { title: 'Unknown', poster: '', duration: '', rating: '' };
    const st = getShowtimesForMovie(s.showtimes, id);
    const list = (st.ok ? st.data : []).map((x) => `
      <button class="showtime" data-id="${escapeHTML(x.id)}" aria-label="Showtime ${escapeHTML(fmtTime(x.time))}">
        ${escapeHTML(fmtTime(x.time))} • ${escapeHTML(x.cinema)} • ${currency(x.basePrice)}
      </button>
    `).join('');
    return `
      ${Header(movie.title)}
      <div class="container">
        <div class="section">
          <img class="card-img" alt="${escapeHTML(movie.title)}" src="${escapeHTML(movie.poster)}" />
          <div class="card-subtitle">${escapeHTML(movie.duration)} • ${escapeHTML(movie.rating)}</div>
        </div>
        <div class="section">
          <div class="section-title">Showtimes</div>
          <div class="showtimes" id="showtimes">${list}</div>
        </div>
      </div>
    `;
  },
  afterMount: async (params) => {
    bindHeader();
    const { id } = Object.fromEntries(params.entries());
    // Load showtimes if empty
    if (!getState().showtimes.length) {
      const { ok, data, error } = await (await import('../../services/showtimeService.js')).loadShowtimes();
      if (!ok) { showToast(error || 'Failed to load showtimes'); return; }
      actions.setShowtimes(data);
      const st = (await import('../../services/showtimeService.js')).getShowtimesForMovie(getState().showtimes, id);
      const list = st.ok ? st.data : [];
      mount(qs('#showtimes'), list.map((x) => `
        <button class="showtime" data-id="${escapeHTML(x.id)}">
          ${escapeHTML(fmtTime(x.time))} • ${escapeHTML(x.cinema)} • ${currency(x.basePrice)}
        </button>`).join(''));
    }
    // Click a showtime
    qs('#showtimes')?.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.matches('.showtime')) {
        const showtimeId = target.getAttribute('data-id');
        actions.selectShowtime(showtimeId);
        navigate(`/seat?showtimeId=${encodeURIComponent(showtimeId)}`);
      }
    });
  },
};