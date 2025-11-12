import { Header, bindHeader } from '../common.js';
import { actions, getState } from '../../store.js';
import { qs, mount, showToast } from '../../utils/dom.js';
import { getShowtimeById } from '../../services/showtimeService.js';
import { loadSeatMap, isSeatReserved, calculateTotal } from '../../services/seatService.js';
import { escapeHTML } from '../../utils/security.js';
import { currency } from '../../utils/format.js';
import { navigate } from '../../router.js';

const seatId = (row, col) => `${String.fromCharCode(65 + row)}${col + 1}`;

export const SeatPage = {
  render: (params) => {
    const { showtimeId } = Object.fromEntries(params.entries());
    const s = getState();
    const st = getShowtimeById(s.showtimes, showtimeId);
    const showtime = st.ok ? st.data : null;
    const map = s.seatMap;
    const seatsHtml = map ? Array.from({ length: map.rows }).map((_, r) => {
      return Array.from({ length: map.cols }).map((_, c) => {
        const id = seatId(r, c);
        const reserved = isSeatReserved(map, id);
        const selected = s.selectedSeats.includes(id);
        const cls = reserved ? 'reserved' : (selected ? 'selected' : 'available');
        return `<div class="seat ${cls}" data-id="${escapeHTML(id)}">${escapeHTML(id)}</div>`;
      }).join('');
    }).join('') : '';
    const totalCalc = calculateTotal(s.selectedSeats, showtime?.basePrice || 0, showtime?.tierMultiplier || 1);
    const total = totalCalc.ok ? totalCalc.data : 0;
    return `
      ${Header('Select Seats')}
      <div class="container">
        <div class="section">
          <div class="seat-grid" id="seatGrid">${seatsHtml}</div>
        </div>
      </div>
      <div class="summary">
        <div>Selected: ${escapeHTML(String(s.selectedSeats.length))}</div>
        <div class="summary-price">${currency(total)}</div>
        <button class="btn-primary" id="proceedCheckout">Continue</button>
      </div>
    `;
  },
  afterMount: async (params) => {
    bindHeader();
    const { showtimeId } = Object.fromEntries(params.entries());
    // Ensure seat map loaded
    if (!getState().seatMap) {
      const { ok, data, error } = await loadSeatMap(showtimeId);
      if (!ok) { showToast(error || 'Failed to load seats'); return; }
      actions.setSeatMap(data);
      // re-render to show seats
      navigate(`/seat?showtimeId=${encodeURIComponent(showtimeId)}`);
      return;
    }
    // Toggle seat selection
    qs('#seatGrid')?.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.matches('.seat')) {
        const id = target.getAttribute('data-id');
        const reserved = isSeatReserved(getState().seatMap, id);
        if (reserved) { showToast('Seat is reserved'); return; }
        actions.toggleSeat(id);
        // re-render local seat class
        target.classList.toggle('selected');
        target.classList.toggle('available');
        // update summary price
        const s = getState();
        const st = getShowtimeById(s.showtimes, showtimeId).data;
        const t = calculateTotal(s.selectedSeats, st.basePrice, st.tierMultiplier);
        qs('.summary-price').textContent = t.ok ? currency(t.data) : currency(0);
        const summaryFirst = qs('.summary')?.children?.[0];
        if (summaryFirst) summaryFirst.textContent = `Selected: ${s.selectedSeats.length}`;
      }
    });
    // Proceed to checkout
    qs('#proceedCheckout')?.addEventListener('click', () => {
      const s = getState();
      if (!s.selectedSeats.length) { showToast('Please select at least one seat'); return; }
      navigate('/checkout');
    });
  },
};