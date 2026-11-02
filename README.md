# Engineering Portfolio

A responsive personal portfolio built with Node.js, Express and Pug. Portfolio profile, page content and project case studies are stored as JSON in `src/content/` so verified details can be updated without introducing a database.

## Run locally

1. Install Node.js 18 or newer.
2. Install dependencies with `npm install`.
3. Start the server with `npm start` (or `npm run dev` for automatic restart).
4. Open `http://localhost:3000`.

Run the test suite with `npm test`.

## Customize before publishing

- Update `src/content/profile.json` with the verified name, email and public profile URLs.
- Review every statement in `src/content/projects.json` and `src/content/pages.json`; add only verified, publicly shareable details.
- Add a verified resume PDF at `public/resume.pdf`. Until then, the download route intentionally shows a clear unavailable message.
- Keep medical workflow demonstrations synthetic. Do not publish patient or practice data, customer information, credentials, proprietary source code or unauthorized screenshots.

The career timeline is intentionally high-level. Populate employer names, exact titles and dates only from the verified CV. No project metrics or results are invented.

## Features

- Responsive Pug-rendered pages and mobile navigation.
- Dark and light themes with saved preference.
- Category filtering and individual case study pages.
- Full-screen interview presentation at `/interview` (arrow keys navigate slides).
- Resume page and safe placeholder for a not-yet-added PDF.
- SEO descriptions, Open Graph metadata, accessible navigation and reduced-motion support.

## Project structure

- `src/server.js` — Express application and middleware.
- `src/routes.js` — page and project routes.
- `src/content/` — JSON profile, project and page content.
- `src/views/` — Pug templates.
- `public/` — static styles and interactions.
