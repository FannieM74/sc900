# SC-900 Quiz

Practice quiz for Microsoft SC-900 Security, Compliance & Identity Fundamentals exam.

91 questions bundled directly in the frontend — no backend needed. Fully offline after first load.

## Pages

- **Quiz** — topic + count selector, randomized questions, no feedback until all answered
- **Study** — browse all questions with answers visible
- **Review** — mistakes saved automatically after each quiz
- **Bookmarks** — save questions with the star button
- **Flagged** — flag questionable answers during review
- **Search** — keyword search across questions and explanations
- **Analysis** — per-question accuracy, score trends over time, topic breakdown
- **History** — all past quiz results

## Develop

```bash
npm install
npm run dev
```

## Build for static deploy

```bash
npm run build
```

Output is in `out/` — pure HTML/CSS/JS, serve with any static server.

## Deploy

Push to GitHub, import into Vercel — Vercel auto-detects Next.js. The `output: "export"` config generates a fully static site.
# sc900
