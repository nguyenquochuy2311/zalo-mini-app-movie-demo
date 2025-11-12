import { Header, bindHeader } from '../common.js';
import { getState } from '../../store.js';
import { currency } from '../../utils/format.js';
import { qs } from '../../utils/dom.js';
import { navigate } from '../../router.js';
import { escapeHTML } from '../../utils/security.js';
import { getMovieById } from '../../services/movieService.js';
import { getShowtimeById } from '../../services/showtimeService.js';

export const ConfirmPage = {
  render: () => {
    const s = getState();
    const o = s.order;
    const movieRes = o ? getMovieById(s.movies, o.movieId) : { ok: false };
    const showtimeRes = o ? getShowtimeById(s.showtimes, o.showtimeId) : { ok: false };
    const movie = movieRes.ok ? movieRes.data : null;
    const showtime = showtimeRes.ok ? showtimeRes.data : null;
    return `
      ${Header('Success')}
      <div class="container">
        <div class="section">
          <div>Order ID: ${escapeHTML(String(o?.id || ''))}</div>
          <div>Movie: ${escapeHTML(movie?.title || '')}</div>
          <div>Showtime: ${escapeHTML(new Date(showtime?.time || Date.now()).toLocaleString())}</div>
          <div>Seats: ${escapeHTML((o?.seats || []).join(', '))}</div>
          <div>Total: ${currency(o?.total || 0)}</div>
        </div>
        <div class="section">
          <button class="btn-primary" id="homeBtn">Back to Home</button>
        </div>
      </div>
    `;
  },
  afterMount: () => {
    bindHeader();
    qs('#homeBtn')?.addEventListener('click', () => navigate('/'));
  },
};