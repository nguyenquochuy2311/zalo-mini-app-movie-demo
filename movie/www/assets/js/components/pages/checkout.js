import { Header, bindHeader } from '../common.js';
import { actions, getState } from '../../store.js';
import { getShowtimeById } from '../../services/showtimeService.js';
import { createOrder, persistOrder } from '../../services/orderService.js';
import { currency } from '../../utils/format.js';
import { calculateTotal } from '../../services/seatService.js';
import { navigate } from '../../router.js';
import { escapeHTML } from '../../utils/security.js';
import { qs, mount, showToast } from '../../utils/dom.js';

export const CheckoutPage = {
  render: () => {
    const s = getState();
    const st = getShowtimeById(s.showtimes, s.selectedShowtimeId);
    const showtime = st.ok ? st.data : null;
    const totalCalc = calculateTotal(s.selectedSeats, showtime?.basePrice || 0, showtime?.tierMultiplier || 1);
    const total = totalCalc.ok ? totalCalc.data : 0;
    return `
      ${Header('Checkout')}
      <div class="container">
        <div class="section">
          <div><strong>Cinema:</strong> ${escapeHTML(showtime?.cinema || '')}</div>
          <div><strong>Showtime:</strong> ${escapeHTML(new Date(showtime?.time || Date.now()).toLocaleString())}</div>
          <div><strong>Seats:</strong> ${escapeHTML(getState().selectedSeats.join(', '))}</div>
          <div><strong>Total:</strong> ${currency(total)}</div>
        </div>
        <div class="section">
          <button class="btn-primary" id="confirmBtn">Confirm Order</button>
          <button class="btn-secondary" id="backBtn">Back</button>
        </div>
      </div>
    `;
  },
  afterMount: () => {
    bindHeader();
    qs('#backBtn')?.addEventListener('click', () => navigate('/seat?showtimeId=' + encodeURIComponent(getState().selectedShowtimeId)));
    qs('#confirmBtn')?.addEventListener('click', () => {
      const s = getState();
      const st = getShowtimeById(s.showtimes, s.selectedShowtimeId).data;
      const total = calculateTotal(s.selectedSeats, st.basePrice, st.tierMultiplier).data;
      const orderRes = createOrder({ movie: s.movies.find(m => String(m.id) === String(s.selectedMovieId)), showtime: st, seats: s.selectedSeats, total });
      if (!orderRes.ok) { showToast(orderRes.error || 'Order failed'); return; }
      const saved = persistOrder(orderRes.data);
      if (!saved) { showToast('Could not save order'); return; }
      actions.setOrder(orderRes.data);
      navigate('/confirm');
    });
  },
};