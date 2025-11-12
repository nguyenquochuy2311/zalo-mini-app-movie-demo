import { qs, mount } from './utils/dom.js';
import { HomePage } from './components/pages/home.js';
import { DetailPage } from './components/pages/detail.js';
import { SeatPage } from './components/pages/seat.js';
import { CheckoutPage } from './components/pages/checkout.js';
import { ConfirmationPage } from './components/pages/confirmation.js';

const routes = {
  '/': HomePage,
  '/home': HomePage,
  '/detail': DetailPage, // expects ?id=<movieId>
  '/seat': SeatPage,     // expects ?showtimeId=<id>
  '/checkout': CheckoutPage,
  '/confirm': ConfirmationPage,
};

export const navigate = (path) => { location.hash = path; };

const parseHash = () => {
  const raw = location.hash.replace('#', '') || '/';
  const [path, query] = raw.split('?');
  const params = new URLSearchParams(query || '');
  return { path, params };
};

export const routerInit = () => {
  const root = qs('#app');
  const renderRoute = () => {
    const { path, params } = parseHash();
    const Page = routes[path] || HomePage;
    mount(root, Page.render(params));
    Page.afterMount?.(params);
  };
  window.addEventListener('hashchange', renderRoute);
  window.addEventListener('load', renderRoute);
  renderRoute();
};