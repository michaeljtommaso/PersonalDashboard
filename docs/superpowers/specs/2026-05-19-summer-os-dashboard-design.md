# Summer OS Dashboard — Design Spec
**Date:** 2026-05-19  
**Project:** Michael's Summer OS 2026  
**Output file:** `summer-os/` (Vite project, opens at localhost:5173)

---

## 1. Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 |
| Build tool | Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Chart.js 4.4.0 |
| Persistence | localStorage (`summer_os_2026` key) |
| Dependencies | `react`, `react-dom`, `chart.js`, `react-chartjs-2`, `tailwindcss` |

No routing library. No backend. Opens as a static file via `vite build` or `vite dev`.

---

## 2. File Structure

```
summer-os/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── src/
│   ├── main.tsx
│   ├── App.tsx                     # Sidebar + active section switcher
│   ├── context/
│   │   ├── AppContext.tsx           # AppProvider, createContext
│   │   ├── reducer.ts               # Single typed reducer
│   │   └── types.ts                 # Full TypeScript state shape
│   ├── hooks/
│   │   ├── useApp.ts                # useContext(AppContext) wrapper
│   │   └── useToast.ts              # Toast notification hook
│   ├── sections/
│   │   ├── Overview/index.tsx
│   │   ├── HealthHub/
│   │   │   ├── index.tsx
│   │   │   ├── GymTracker.tsx
│   │   │   ├── NutritionTracker.tsx
│   │   │   └── NutritionCharts.tsx
│   │   ├── BusinessCommand/
│   │   │   ├── index.tsx
│   │   │   ├── VentureManager.tsx
│   │   │   ├── RevenueLog.tsx
│   │   │   ├── LessonsLearned.tsx
│   │   │   └── BusinessCharts.tsx
│   │   ├── StudyHub/
│   │   │   ├── index.tsx
│   │   │   ├── TopicList.tsx
│   │   │   ├── SessionLogger.tsx
│   │   │   └── StudyCharts.tsx
│   │   ├── AIOperations/
│   │   │   ├── index.tsx
│   │   │   ├── Pipeline.tsx
│   │   │   └── AgentTracker.tsx
│   │   └── SecondBrain/
│   │       ├── index.tsx
│   │       ├── QuickCapture.tsx
│   │       └── Timeline.tsx
│   ├── components/
│   │   ├── StatCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Toast.tsx
│   │   ├── ChartWrapper.tsx
│   │   └── SectionHeader.tsx
│   └── utils/
│       ├── localStorage.ts          # loadState / saveState
│       └── dates.ts                 # getWeekKey, summerCountdown, timeGreeting
```

---

## 3. State & Data Architecture

Single localStorage key: `summer_os_2026`. Full TypeScript type defined in `context/types.ts`:

```ts
interface AppState {
  health: {
    weekLog: Record<string, Record<string, 'done' | 'missed' | null>>;
    nutrition: Record<string, { cal: number; pro: number; carb: number; fat: number }>;
  };
  business: {
    ventures: Venture[];
    lessons: Lesson[];
  };
  academic: {
    examDate: string;
    topics: Topic[];
    sessions: StudySession[];
  };
  ai: {
    agents: Agent[];
    observations: Observation[];
  };
  brain: {
    dailyNotes: Record<string, string>;
    notes: BrainNote[];
  };
}
```

**State flow:**
1. `AppProvider` mounts → calls `loadState()` from localStorage (or seeds defaults)
2. Components call `useApp()` → get `{ state, dispatch }`
3. Every dispatch triggers `useEffect([state], saveState)` → writes full state back to localStorage
4. No debouncing needed — state updates are user-initiated, not continuous

**Default seed data (on first load):**
- Two ventures: Closet Curation Co (Running, $300 revenue) and Degree Planner (Building, $0)
- 12 E&M topics pre-loaded with names and difficulty ratings
- Macro goals pre-set: 2100 cal / 145g protein / 195g carbs / 65g fat
- Gym split hardcoded (not in state — derived from day of week at render time)

---

## 4. Section Designs

### 4.1 Overview
Computed entirely from state — no stored summary data. Renders:
- Time-aware greeting + live date
- Summer countdown (days remaining, weeks, % elapsed) — computed from May 19 / Aug 31 constants
- Today's workout from hardcoded weekly split (derived from `new Date().getDay()`)
- Quick stats: today's calories, workouts done this week, total revenue, total study sessions
- Dynamic "Today's Priorities" — checks: nutrition logged today? Today's workout marked done? Renders outstanding items
- Venture snapshot: each venture name + profit total
- E&M progress: bar + first 6 topics with checkmarks

### 4.2 Health Hub (accent: `#10b981`)
Two tabs: **Gym** and **Nutrition**.

**Gym tab:**
- 7-day week calendar, each day a card with workout name
- Click to cycle: null → done (green) → missed (red) → null
- Streak counter (consecutive days with 'done')
- Weekly completion % (done count / 6 training days)
- All-time log: every week entry in reverse order

**Nutrition tab + Charts tab:**
- Daily form: calories, protein, carbs, fat inputs → Save
- Animated progress bars vs daily goals, color-coded by macro
- Charts tab: 7-day calorie bar chart + 7-day macro line chart via Chart.js

### 4.3 Business Command Center (accent: `#f59e0b`)
Four tabs: **Ventures**, **Revenue**, **Lessons**, **Charts**.

- Large profit counter at top (sum of all revenue entries)
- Ventures tab: cards with name, stage selector (5 stages), category, per-venture total, delete button
- Revenue tab: log form (venture, date, amount, source, notes) + reverse-chronological full log
- Lessons tab: form (category dropdown + text) + live-search filtered list, color-coded by category
- Charts tab: 30-day revenue bar + per-venture donut

### 4.4 Cornell E&M Study Hub (accent: `#3b82f6`)
Three tabs: **Topics**, **Sessions**, **Charts**.

- Exam countdown: set exam date → shows exact days remaining + recommended daily study time
- Topics tab: 12 pre-loaded topics, each with checkbox, difficulty dots, expandable notes field
- Sessions tab: log form (date, topic dropdown, duration, notes) + session history
- Stats: total minutes, average session length, progress bar (% topics complete)
- Charts tab: topic completion donut + time-per-topic horizontal bar

### 4.5 AI Operations Center (accent: `#8b5cf6`)
Three tabs: **Pipeline**, **Agents**, **Observations**.

- Pipeline tab: 5-column kanban (Idea → Building → Testing → Running → Profitable), auto-populated from business ventures. Cards show name, revenue, category.
- Agents tab: add form (name, purpose, venture, status, notes, last run) + agent cards with inline status dropdown
- Observations tab: timestamped freeform log form + reverse-chronological entries

### 4.6 Second Brain (accent: `#06b6d4`)
- Today's Insight: textarea persisted per day (YYYY-MM-DD key)
- Quick Capture: text input + tag picker (lesson / mistake / win / idea / observation) + Capture button
- Timeline: all notes in reverse-chronological order, searchable by text or tag
- Stats: notes this week, total entries, most used tag, daily streak

---

## 5. Shared Components

**`StatCard`** — props: `label`, `value`, `accentColor`. Renders a card with 3px colored top border.

**`ProgressBar`** — props: `value`, `max`, `color`. CSS transition on width change.

**`Toast`** — global singleton rendered in `App.tsx`. `useToast()` returns a `showToast(msg)` function. Auto-dismisses after 2500ms. Fires on every save/log action.

**`SectionHeader`** — props: `title`, `accentColor`. Renders gradient text header.

**`ChartWrapper`** — thin div wrapper ensuring correct canvas sizing for Chart.js.

---

## 6. Design System (Tailwind config)

Custom colors added to `tailwind.config.ts`:

```ts
colors: {
  bg: { primary: '#0f1117', secondary: '#1a1d2e', card: '#1e2235' },
  accent: {
    health: '#10b981',
    business: '#f59e0b',
    academic: '#3b82f6',
    ai: '#8b5cf6',
    brain: '#06b6d4',
  },
  text: { primary: '#f1f5f9', secondary: '#94a3b8' },
}
```

Global styles: `border-radius: 12px` on cards, smooth CSS transitions on all interactive elements, hover lift (`translate-y-[-2px]`) on kanban cards.

---

## 7. Settings

Accessible via a gear icon in the sidebar footer.

- **Export JSON**: `JSON.stringify(state)` → download as `summer_os_backup_YYYY-MM-DD.json`
- **Import JSON**: file input → parse → dispatch `LOAD_STATE` action
- **Reset**: confirmation dialog → dispatch `RESET_STATE` → reseeds defaults

---

## 8. Out of Scope

- Obsidian sync (noted in spec as future)
- Authentication
- Any server-side logic
- Mobile layout below 480px (collapses to icon sidebar at 900px per spec, not full mobile)
- Automated tests (personal tool, visual correctness verified manually)
