# Design System — SC-900 Practice Quiz

Based on the actual implementation as of May 2026.

---

## Stack

- **Framework:** Next.js 16 App Router + React 19 + TypeScript 5
- **Styling:** Tailwind CSS v4 via `@import "tailwindcss"` in `app/globals.css`
- **Fonts:** Geist Sans (body) via `next/font`, Geist Mono (code)
- **Icons:** Emoji / Unicode characters (no icon library)
- **Dark mode:** Custom `localStorage("sc900-dark")` + `.dark` class + CSS overrides in `globals.css`
- **State:** All data in `questions.json`, all user state in `localStorage`
- **Export:** Static (`output: "export"`) via `next.config.ts`

---

## Visual Direction

The app is a light-first, clean, utilitarian study tool. The aesthetic is unopinionated — it stays out of the way and prioritizes readability and focus.

- Light background with subtle blue gradient tint
- White card surfaces with soft borders and light shadows
- Blue-600 as the primary action color
- Color-coded feedback (green = correct, red = incorrect, yellow = warning)
- Emoji for status, category, and mood indicators
- Minimal motion — only loading pulses and progress bar transitions

---

## Color Palette

All colors are raw Tailwind v4 utility classes. No custom CSS variables or oklch tokens.

### Semantic Usage

| Role | Light Class | Dark Class | Notes |
|------|-------------|------------|-------|
| Page background | `bg-gradient-to-br from-slate-50 to-blue-50` | `bg-slate-900` via `.dark body` override | Applied per-page, not global |
| Card surface | `bg-white` | `bg-slate-800` (`.dark .bg-white`) | `rounded-xl shadow-sm border border-gray-200` |
| Primary text | `text-gray-900` | `text-slate-100` (`.dark .text-gray-900`) | |
| Secondary text | `text-gray-500` | `text-slate-400` (`.dark .text-gray-500`) | |
| Primary action | `bg-blue-600 text-white` | same (inherited) | Most buttons, links |
| Success | `text-green-600` / `bg-green-50 border-green-200` | muted equivalents in `.dark` overrides | Correct answers, good scores |
| Error/Destructive | `text-red-600` / `bg-red-50 border-red-200` | muted equivalents | Incorrect answers |
| Warning | `text-yellow-600` / `bg-yellow-50` | muted equivalents | Low scores, flagging |
| Info/Explanation | `bg-blue-50 border-blue-200 text-blue-800` | muted equivalents | Explanation panels |
| Accent (neutral) | `text-purple-600` | muted equivalent | Stats counters |

### Topic Badge Colors

| Topic | Class |
|-------|-------|
| security-concepts | `bg-purple-100 text-purple-800` |
| identity | `bg-blue-100 text-blue-800` |
| compliance | `bg-green-100 text-green-800` |
| azure-security | `bg-orange-100 text-orange-800` |

### Dark Mode Overrides

Defined in `app/globals.css` lines 6-83 — manual CSS overrides for:
- Backgrounds (`.dark .bg-white → #1e293b`, etc.)
- Text colors (`.dark .text-gray-900 → #f1f5f9`)
- Borders (`.dark .border-gray-200 → #334155`)
- Colored text on dark (blue/green/red/yellow/purple/orange variants)
- Form elements (`select`, `input[type="text"]`)
- Dividers, shadows, progress bar tracks, SVG fills

---

## Typography

### Font Stack

| Role | Font | Source |
|------|------|--------|
| Body / UI | **Geist Sans** (`--font-geist-sans`) | `next/font/google` (`Geist` w/ variable) |
| Mono / Code | **Geist Mono** (`--font-geist-mono`) | `next/font/google` (`Geist_Mono` w/ variable) |

Applied via `className` on `<html>` and `font-sans` / `font-mono` classes.

### Size Scale (Tailwind utilities, not custom)

| Element | Class | Notes |
|---------|-------|-------|
| Page heading (h1) | `text-2xl font-bold` | Homepage uses `text-3xl` |
| Card heading | `text-lg font-semibold` | Question text, section titles |
| Body | `text-sm` or `text-base` | Varies by context |
| Meta / labels | `text-xs` | Topic badges, stat labels, footers |
| Large numbers | `text-2xl` to `text-5xl` | Stats grid, score display |

No custom font-size tokens exist.

---

## Layout

### Page Shell

Every page follows this pattern:
```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
  <div className="max-w-2xl mx-auto px-4 py-8">
    <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
      ← Home
    </Link>
    {/* page content */}
  </div>
</div>
```

- Single-column, max-width 672px (`max-w-2xl`)
- Centered with auto margins
- 32px horizontal padding (`px-4`)
- 32px vertical padding (`py-8`)
- Back-to-home link in top-left corner of sub-pages

### Homepage Layout

Three zones stacked vertically:
1. **Header** — centered title, subtitle, dark mode toggle (absolute top-right)
2. **Stats grid** — 3-column grid (`grid grid-cols-3 gap-4`) with white cards
3. **Controls** — Start Quiz panel, Topics grid (2 columns), Navigation grid (4 columns)

---

## Components

### Card Pattern

Most content cards use:
```tsx
className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
```
In study/review/flagged/bookmarks pages, padding varies (`p-5`).

### QuestionCard (`components/QuestionCard.tsx`)

The core quiz interaction component.
- **Props:** `question`, `selected`, `onSelect`, `mode` ("quiz" | "review")
- **Quiz mode:** Clickable option buttons with blue selection highlight
- **Review mode:** Disabled buttons with green (correct) / red (incorrect) highlighting + explanation panel
- **Meta row:** Question number + topic badge (left), bookmark/flag buttons (right)
- **Options:** 4 buttons, each with lettered circle prefix (A/B/C/D)

### ProgressBar (`components/ProgressBar.tsx`)

Simple horizontal bar.
- Props: `current`, `total`, `answered`
- Labels: "Question N of M" + "N answered"
- Animated fill via `transition-all duration-500 ease-out`

### TopicBadge (`components/TopicBadge.tsx`)

Small colored pill for topic labels.
- `inline-block px-2.5 py-0.5 rounded-full text-xs font-medium`
- Color sourced from `TOPIC_COLORS` record in `lib/topics.ts`

### Skeleton (`components/Skeleton.tsx`)

Three variants:
- **CardSkeleton** — question card placeholder with 4 option bars + explanation bar
- **ListSkeleton** — configurable count of list item placeholders
- **StatsSkeleton** — 3-column stats grid placeholder
- All use `animate-pulse` with gray background fills

### No shared UI primitives

No button, select, input, dialog, or other component abstractions. Every page builds its own markup using raw Tailwind classes.

---

## Icons

All icons are emoji/unicode characters:

| Context | Glyph | Used In |
|---------|-------|---------|
| Dark mode toggle | ☀️ / 🌙 | Homepage header |
| Daily quiz button | 🏆 | Homepage |
| Navigation links | 🔍 📖 ❌ ★ ❓ 📈 📊 | Homepage grid |
| Back links | ← | All sub-pages |
| Bookmark | ★ / ☆ | QuestionCard |
| Flag | ⚑ / ⚐ | QuestionCard (review mode) |
| Score feedback | 🎉 👍 💪 | Quiz review, Results |
| Score dots | 🟢 🟡 🔴 | Results history |
| Status icons | ⚠ 💡 ✓ ✗ | Analysis page |

---

## States

### Loading

- **Quiz page:** `CardSkeleton` + pulse placeholder for progress bar
- **Other pages:** Spinning circle (`animate-spin` with blue border)
- **App-level:** `loading.tsx` with `StatsSkeleton` + heading placeholders

### Empty

Every list page has centered empty state with:
- Large gray text message
- Smaller explanatory text
- CTA link/button to relevant action (Start Quiz, Home, etc.)

### Error

- **Quiz:** Inline error message with "Back home" link, or "No questions found" fallback
- **App-level:** `error.tsx` boundary with error message display and "Try again" button
- **404:** `not-found.tsx` with 404 display and "Back to Home" link

### Edge Cases

- **Quiz completion:** "Finish Quiz" button disabled until all questions answered; shows remaining count (`"Answer all (N left)"`)
- **Daily quiz:** Uses date-based seed for deterministic shuffle; empty topic param = all topics
- **History:** Capped at 50 records in localStorage; old entries dropped from tail
- **localStorage:** All reads wrapped in try/catch with fallback defaults

---

## Interactions

### Quiz Controls
- **Arrow Left/Right:** Navigate between questions
- **Keys 1-4:** Select answer options
- **Question dots:** Click to jump to any question (bottom of quiz page)
- **"Quit" link:** Returns to homepage (no confirmation dialog)

### Bookmark & Flag
- Bookmark toggle persists immediately to localStorage
- Flag visible only in review mode (after quiz completion)
- Star/fill visual feedback on toggle

### Animations & Motion

| Element | Effect | Duration |
|---------|--------|----------|
| Progress bar fill | `transition-all duration-500 ease-out` | 500ms |
| Option hover | `hover:border-gray-300 hover:bg-gray-50` | 200ms (default) |
| Button/color swatch hover | `transition-colors` | 150ms (default) |
| Skeleton loading | `animate-pulse` | 2s loop |
| Spinner loading | `animate-spin` | 1s linear loop |

No page entrance animations, no staggered reveals, no micro-interactions beyond hover states.

---

## Accessibility

- All interactive elements have `aria-label` where visual label is missing
- Focus rings present on selects, inputs, and keyboard-nav elements (`focus:ring-2 focus:ring-blue-500`)
- Disabled buttons have `disabled:opacity-50`, `disabled:cursor-not-allowed`
- `suppressHydrationWarning` on `<html>` for dark mode inline script
- `viewport` meta configuration with `maximumScale: 1`

### Missing
- No `role` attributes on interactive groups
- No keyboard trap handling in modals (no modals exist)
- No focus management on page navigation
- No `prefers-reduced-motion` handling
- No screen-reader announcements for score changes, quiz completion

---

## Dark Mode

- **Storage key:** `sc900-dark` (boolean string)
- **Toggle:** Homepage top-right button (sun/moon emoji)
- **Init:** Inline `<script>` in `layout.tsx` before hydration reads localStorage and applies `.dark` class
- **Styling:** CSS overrides in `globals.css` targeting `.dark .<utility-class>` selectors
- **No `prefers-color-scheme` media query** — respects user toggle only

---

## File Structure

```
frontend/src/
  app/
    layout.tsx              # Root layout: Geist fonts, dark-mode init script
    page.tsx                # Home: stats, quiz config, topic grid, nav
    globals.css             # Tailwind import + dark mode overrides
    loading.tsx             # App-level loading (StatsSkeleton)
    error.tsx               # App-level error boundary
    not-found.tsx           # 404 page
    quiz/page.tsx           # Quiz session + review
    study/page.tsx          # Browse all questions by topic
    review/page.tsx         # Missed questions review
    bookmarks/page.tsx      # Starred questions
    flagged/page.tsx        # Flagged questions
    search/page.tsx         # Keyword search
    analysis/page.tsx       # Per-topic accuracy + trends
    results/page.tsx        # Past quiz results
  components/
    QuestionCard.tsx        # Quiz/review question display
    ProgressBar.tsx         # Horizontal progress bar
    Skeleton.tsx            # CardSkeleton, ListSkeleton, StatsSkeleton
    TopicBadge.tsx          # Topic label pill
  lib/
    types.ts                # Question, QuizRecord interfaces
    questions.json          # 131 questions (only data source)
    storage.ts              # localStorage CRUD (sc900-* prefix)
    random.ts               # Seeded PRNG + Fisher-Yates shuffle
    topics.ts               # TOPIC_LABELS + TOPIC_COLORS
    helpers.ts              # optionLetter()
    linkify.tsx             # URL-to-anchor converter
    dark.ts                 # Dark mode get/set helpers
```

---

## Deviations from DESIGN1.md

The file `DESIGN1.md` exists in the repo root but describes a design that was never implemented. Key differences:

| DESIGN1.md (spec) | DESIGN.md (reality) |
|---|---|
| Dark-first "war-room" aesthetic | Light-first utilitarian |
| IBM Plex Sans + Fraunces + IBM Plex Mono | Geist Sans + Geist Mono |
| Lucide React icons | Emoji characters |
| shadcn-style `components/ui/` | 4 custom components, no UI library |
| Custom oklch color tokens | Raw Tailwind utility colors |
| Blueprint grid + glass panels | Gradient backgrounds + white cards |
| next-themes for dark mode | Custom localStorage + CSS overrides |
| `cn()` utility + tailwind-merge | No utility functions |
| `animate-fade-up`, `animate-scale-in` | Only `animate-pulse` |

---

## Recommendations for Design Evolution

1. **Replace emoji with an icon library** (Lucide or similar) for consistent visual language
2. **Define semantic color tokens** using Tailwind v4's `@theme inline` rather than raw utilities
3. **Consolidate the card/option/explanation pattern** into a single reusable component (it's copy-pasted across 5 pages)
4. **Add page-transition animations** for perceived performance
5. **Implement responsive breakpoints** beyond the current single-column mobile-first layout
6. **Add keyboard focus management** for quiz navigation (auto-focus first option on question change)
