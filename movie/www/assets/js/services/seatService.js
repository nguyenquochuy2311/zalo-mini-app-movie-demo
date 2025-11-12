import { assert, isId, validateSeatIds } from '../utils/validation.js';

export const loadSeatMap = async (showtimeId) => {
  try {
    assert(isId(showtimeId), 'Invalid showtime id');
    const res = await fetch(`/assets/mock/seatmaps/showtime_${showtimeId}.json`);
    if (!res.ok) throw new Error('Failed to load seat map');
    const data = await res.json();
    assert(Number.isInteger(data.rows) && Number.isInteger(data.cols), 'Invalid seat map shape');
    assert(Array.isArray(data.reserved), 'Invalid reserved list');
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
};

export const isSeatReserved = (map, seatId) => {
  try { assert(map && map.reserved, 'Seat map not loaded'); return map.reserved.includes(seatId); }
  catch { return false; }
};

export const calculateTotal = (selectedSeats, basePrice, tierMultiplier = 1) => {
  try {
    assert(validateSeatIds(selectedSeats), 'Invalid seat ids');
    const seatCount = selectedSeats.length;
    const total = Math.round(seatCount * basePrice * tierMultiplier);
    return { ok: true, data: total };
  } catch (e) { return { ok: false, error: e.message }; }
};