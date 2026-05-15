# sc900

Frontend-only Next.js static app — practice quiz for Microsoft SC-900 exam.

RESPONSES
Keep responses concise and to the point - unless the user asks otherwise


## Project structure

```
frontend/
  src/
    app/          # Next.js App Router pages (all "use client")
      layout.tsx  # root layout — Geist fonts, dark-mode init script
      page.tsx    # home / quiz launcher
      quiz/       # quiz-taking page
      study/      # browse all questions
      review/     # review missed questions
      bookmarks/  # starred questions
      flagged/    # flagged questions
      search/     # keyword search
      analysis/   # per-question accuracy & score trends
      results/    # past quiz results
    components/   # 4 shared components (ProgressBar, QuestionCard, Skeleton, TopicBadge)
    lib/
      questions.json   # 131 questions (no other data source)
      types.ts         # Question, QuizRecord interfaces
      storage.ts       # localStorage CRUD (sc900-* prefixed keys)
      random.ts        # seeded PRNG + Fisher-Yates shuffle
      linkify.tsx      # URL linkifier component
```

## Architecture

- **Static export** (`next.config.ts`: `output: "export"`) — output to `out/`
- **Fully client-side** — every page is `"use client"`, no server components
- **No backend, no API** — all data in `questions.json`, all state in `localStorage`
- **Path alias** `@/*` → `src/*`
- **Dark mode** via `localStorage("sc900-dark")` + `.dark` class; CSS overrides in `globals.css`
- **Daily quiz** uses `dateSeed()` for deterministic per-day question shuffle
- **Quiz history** capped at 50 records

## Commands (run from `frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on `0.0.0.0` |
| `npm run build` | Static build → `out/` |
| `npm run lint` | ESLint (core-web-vitals + typescript) |

No test, typecheck, or format scripts exist.

## Conventions

- Import `@/lib/...` and `@/components/...` (not relative paths)
- Topics are slug keys: `security-concepts`, `identity`, `compliance`, `azure-security`
- All localStorage keys prefixed `sc900-`
- Question IDs are numeric, 1-indexed
- COUNT_OPTIONS: `[5, 10, 15, 20, 25, 30, 50, 131]` (131 = all)
- Custom dark overrides in `globals.css` supplement Tailwind `dark:` variant
