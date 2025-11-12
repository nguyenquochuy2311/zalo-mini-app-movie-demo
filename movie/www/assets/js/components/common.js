import { navigate } from '../../router.js';
import { escapeHTML } from '../utils/security.js';

export const Header = (title = 'Movie Tickets') => `
  <div class="header">
    <div class="header-title">${escapeHTML(title)}</div>
    <button class="btn-secondary" id="goHome">Home</button>
  </div>
  <div id="toast" class="toast" aria-live="polite" aria-atomic="true"></div>
`;

export const bindHeader = () => {
  const btn = document.getElementById('goHome');
  btn && btn.addEventListener('click', () => navigate('/home'));
};

export const MovieCard = (movie) => `
  <div class="card" data-id="${escapeHTML(movie.id)}">
    <img class="card-img" alt="${escapeHTML(movie.title)}" src="${escapeHTML(movie.poster)}" />
    <div class="card-body">
      <div class="card-title">${escapeHTML(movie.title)}</div>
      <div class="card-subtitle">${escapeHTML(movie.duration)} • ${escapeHTML(movie.rating)}</div>
    </div>
  </div>
`;