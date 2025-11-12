# Movie Ticket Feature (Isolated)

This folder contains a fully self-contained movie ticket feature designed for the Zalo Mini App ecosystem. It uses mock data only, follows platform guidelines, includes error handling and input validation, and ships with unit tests and documentation. All code, assets, and documentation are isolated within this `movie` directory with strictly relative references.

## Highlights

- Mock-only ticketing flow: browse movies → select showtime → choose seats → review → confirm.
- Responsive UI with mobile-first layout and accessible controls.
- Services with validation, error handling, and safe storage wrappers.
- No references outside this folder; all paths are relative.
- Unit tests and a minimal in-browser test runner.
- Ready-to-deploy build outputs under `www/` aligned to Mini App `app-config.json`.

## Structure

```
movie/
├── README.md
├── www/
│   ├── app-config.json
│   ├── index.html
│   ├── assets/
│   │   ├── reset.css
│   │   ├── styles.css
│   │   ├── tokens.css
│   │   ├── app.js
│   │   ├── js/
│   │   │   ├── router.js
│   │   │   ├── store.js
│   │   │   ├── utils/
│   │   │   │   ├── dom.js
│   │   │   │   ├── validation.js
│   │   │   │   ├── security.js
│   │   │   │   └── format.js
│   │   │   ├── services/
│   │   │   │   ├── movieService.js
│   │   │   │   ├── showtimeService.js
│   │   │   │   ├── seatService.js
│   │   │   │   └── orderService.js
│   │   │   └── components/
│   │   │       ├── common.js
│   │   │       └── pages/
│   │   │           ├── home.js
│   │   │           ├── detail.js
│   │   │           ├── seat.js
│   │   │           ├── checkout.js
│   │   │           └── confirmation.js
│   │   └── mock/
│   │       ├── movies.json
│   │       ├── showtimes.json
│   │       └── seatmaps/
│   │           ├── showtime_101.json
│   │           ├── showtime_102.json
│   │           └── showtime_201.json
│   └── tests/
│       ├── index.html
│       ├── runner.js
│       └── specs/
│           ├── seatService.spec.js
│           ├── validation.spec.js
│           └── orderService.spec.js
```

## How to Preview Locally

- Serve the `movie/www` folder with any static HTTP server (e.g., `python3 -m http.server` in `movie/www`).
- Open the served URL and navigate through the feature.

## Run Locally (npm)

In the `movie` directory, an npm setup is provided to serve the isolated feature.

- Install dependencies: `npm install` (run inside `movie/`)
- Start local server: `npm run dev`
  - Static server at `http://127.0.0.1:5500/`
- Open tests: visit `http://127.0.0.1:5500/tests/`

## Deployment in Mini App

- `www/app-config.json` is aligned to ZMP loader: `listSyncJS` points to `/assets/app.js` and `template.name` is `web`.
- When deploying, use the `www` directory as the app bundle for this feature.

## Security and Privacy

- No PII is collected or persisted; orders store minimal data (movie, showtime, seat IDs, totals).
- `Content-Security-Policy` limits scripts, styles, and connections to `self`.
- All user inputs are sanitized and validated before use.
- SafeStorage wrapper prevents unsafe keys and sanitizes values.

## Tests

- Open `www/tests/index.html` in a browser to run unit tests.
- Tests cover seat selection logic, order totals, and input validation.

## Notes

- This is mock-driven; seat availability and showtimes are synthetic and time-window checked.
- Code is intentionally framework-light to keep isolation and portability.