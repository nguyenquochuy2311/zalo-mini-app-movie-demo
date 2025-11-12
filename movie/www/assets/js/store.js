// Lightweight global store for the feature

const state = {
  movies: [],
  showtimes: [],
  selectedMovieId: null,
  selectedShowtimeId: null,
  selectedSeats: [],
  seatMap: null, // { rows: number, cols: number, reserved: Set<string> }
  order: null,
};

const listeners = new Set();

export const getState = () => ({ ...state, selectedSeats: [...state.selectedSeats] });
export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
const notify = () => listeners.forEach((fn) => fn(getState()));

export const actions = {
  setMovies(movies) { state.movies = movies || []; notify(); },
  setShowtimes(st) { state.showtimes = st || []; notify(); },
  selectMovie(id) { state.selectedMovieId = id; state.selectedShowtimeId = null; state.selectedSeats = []; notify(); },
  selectShowtime(id) { state.selectedShowtimeId = id; state.selectedSeats = []; notify(); },
  setSeatMap(map) { state.seatMap = map || null; notify(); },
  toggleSeat(seatId) {
    const idx = state.selectedSeats.indexOf(seatId);
    if (idx >= 0) state.selectedSeats.splice(idx, 1); else state.selectedSeats.push(seatId);
    notify();
  },
  clearSelection() { state.selectedSeats = []; notify(); },
  setOrder(order) { state.order = order || null; notify(); },
};