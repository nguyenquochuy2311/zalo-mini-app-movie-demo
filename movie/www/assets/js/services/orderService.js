import { assert, isId } from '../utils/validation.js';
import { SafeStorage } from '../utils/security.js';

export const createOrder = ({ movie, showtime, seats, total }) => {
  try {
    assert(movie && isId(movie.id), 'Invalid movie');
    assert(showtime && isId(showtime.id), 'Invalid showtime');
    assert(Array.isArray(seats) && seats.length > 0, 'No seats selected');
    assert(Number.isFinite(total) && total > 0, 'Invalid total');
    const orderId = `${showtime.id}-${Date.now()}`;
    const order = { id: orderId, movieId: movie.id, showtimeId: showtime.id, seats: [...seats], total };
    return { ok: true, data: order };
  } catch (e) { return { ok: false, error: e.message }; }
};

export const persistOrder = (order) => {
  try { return SafeStorage.set('order', order); } catch { return false; }
};

export const getLastOrder = () => SafeStorage.get('order');