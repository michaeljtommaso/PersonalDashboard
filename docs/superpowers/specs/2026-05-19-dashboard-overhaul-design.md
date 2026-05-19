# Summer OS 2026: Dashboard Overhaul Design

**Date:** 2026-05-19
**Approach:** A — Global system + targeted rebuilds
**Status:** Approved, pending implementation

---

## 1. Problem Statement

The dashboard suffers from four compounding issues:
- **Layout constraint**: `max-w-5xl mx-auto` means the app never fills the monitor. On a wide screen, large dead margins flank a narrow column.
- **No motion**: Nothing moves. The UI feels static and abandoned even when data is present.
- **Color starvation**: Accent colors appear only as 3px top borders. Cards are barely distinguishable from their backgrounds. The five section colors have no presence.
- **Empty sections**: Most pages have sparse content grids that feel like placeholders. The agent tracker in particular is a list of static cards with no life.

---

## 2. Goals

1. Fill the full viewport — no global max-width cap.
2. Make the dashboard feel alive through motion: particle field, animated entries, count-up numbers, animated agent rings.
3. Use the five section accent colors boldly at three intensities per surface.
4. Transform the Agent Tracker into a live command center with real task tracking and visual theater.
5. Eliminate the "empty page" feeling across all six sections.

---

## 3. Animation Library

**Anime.js v4** replaces the originally planned pure-CSS + custom hook approach.

- Count-up numbers: `animate()` on a plain JS object, `onUpdate` callback feeds the display value. Spring easing for snap-to-final feel.
- SVG stroke animation (agent rings): `createDrawable()` on SVG circle elements.
- Card entry stagger: `stagger()` function — 60ms between cards, ease-out-quart.
- Scramble-text reveals: `scrambleText` on section titles and agent names on mount.
- Section entry timelines: `timeline()` for coordinated entrance sequences.
- WAAPI hardware acceleration: enabled by default in v4, ensures 60fps on ring animations.

**Particle field** remains a standalone `requestAnimationFrame` canvas loop — not a DOM animation, so Anime.js does not apply. CSS `@keyframes` retained only for `pulse-ring` and `glow-breathe` (trivially simple, no orchestration needed).

---

## 4. Layout & Shell

### Full-bleed

Remove `max-w-5xl mx-auto px-6 py-8` from `<main>`. Each section owns its own internal layout — `px-6 py-6` padding with no centering wrapper. Sections use CSS Grid at full available width (viewport minus sidebar).

### Section transitions

`key={activeSection}` on the content wrapper triggers a CSS animation class swap:
- Outgoing: fade to `opacity: 0` over 150ms.
- Incoming: slide up from `translateY(16px)` + fade in over 250ms ease-out-quart.
- No external dependency — pure CSS + React key prop.

### Sidebar

Active item: remove `borderLeft: 3px solid` (side-stripe, banned pattern). Replace with:
- Full `rgba(accent, 0.25)` background fill.
- Icon and label rendered in full solid accent color.
- `filter: drop-shadow(0 0 6px accent)` on the icon.

---

## 5. Particle Field

**File:** `src/components/ParticleField.tsx`

- Canvas element, `position: fixed`, `inset: 0`, `z-index: 0`, `pointer-events: none`.
- 90 particles on screens ≥1200px, 50 below.
- Drift speed: 0.3–0.6px/frame, random direction per particle.
- Particle radius: 1.5px.
- Colors: 60% AI purple `rgba(139, 92, 246, 0.4)`, 40% brain cyan `rgba(6, 182, 212, 0.3)`.
- Connection lines: drawn between any two particles within 130px. Line opacity = `(1 - distance/130) * 0.15`. Lines brighten slightly when both connected particles are near each other.
- Pauses entirely when `prefers-reduced-motion: reduce` is set.
- Mounted once in `App.tsx`, beneath the flex layout wrapper.

---

## 6. Color Strategy

**Moving from Restrained to Full Palette.**

Each section accent is used at three intensities on surfaces it owns:

| Tier | Value | Usage |
|---|---|---|
| Dim | `rgba(accent, 0.14)` | Card background tint (base state) |
| Mid | `rgba(accent, 0.25)` | Hover state, active sidebar fill, focused input highlight |
| Full | Solid accent | Key metric numbers, progress fills, agent rings, active icons |

**Specific changes:**
- StatCards in every section get the `0.14` background tint in their section color.
- Overview stat grid: health cards emerald-tinted, business amber-tinted, study blue-tinted, brain cyan-tinted. Color attribution is immediate.
- Key metric numbers rendered in full solid accent color with `text-shadow: 0 0 20px accent`.
- Section header icons: `filter: drop-shadow(0 0 12px accent)`.
- Particle field: purple at `0.4`, cyan at `0.3` (increased from previous plan).
- Card top borders: 3px solid full-opacity accent (unchanged).
- No gradients on card backgrounds — solid low-opacity tints only.

---

## 7. Agent Tracker Overhaul

### State additions

Each agent gains two new arrays in the existing `Agent` type:

```ts
tasks: { id: string; text: string; done: boolean }[];
logs: { id: string; ts: string; text: string }[];
```

Migration: existing agents get `tasks: []` and `logs: []` on load (handled in the context reducer with a safe default).

### New reducer actions

- `ADD_AGENT_TASK` — `{ agentId, task }`
- `TOGGLE_AGENT_TASK` — `{ agentId, taskId }`
- `DELETE_AGENT_TASK` — `{ agentId, taskId }`
- `ADD_AGENT_LOG` — `{ agentId, entry }`
- `DELETE_AGENT_LOG` — `{ agentId, entryId }`

### Agent card layout

Three-column layout within each card:

**Left — Status ring (120px SVG):**
- Circle drawn via `createDrawable()`. Stroke progress = task completion %.
- Active: ring pulses via `glow-breathe` keyframe, purple glow.
- Paused: ring at 30% opacity, static.
- Testing: amber ring, slower pulse (3s instead of 2s).
- Deployed: blue ring, solid, no pulse. "LIVE" badge in blue below it.

**Center — Content:**
- Agent name: scramble-reveals via `scrambleText` on card mount.
- Purpose text + linked venture name in accent color.
- Task list: checkboxes, each task toggleable. Completed tasks render with `line-through` in dim color. Task count shown as `3/7 complete` in full accent.
- "Add task" inline input — enter to commit.

**Right — Activity log:**
- Dark terminal feed: `bg-deep`, label-weight font (not monospace-as-personality).
- Timestamped entries, newest at bottom. Scrollable, max 200px height.
- New entries slide in from bottom via Anime.js timeline.
- When status is Active: blinking cursor at end of last entry.
- "Log entry" input at bottom — enter to commit.
- Entry deletion via hover trash icon.

### Status-based card states

| Status | Ring | Background tint | Cursor | Pulse |
|---|---|---|---|---|
| Active | Purple, animated | `rgba(139,92,246,0.25)` | Blinking | 2s |
| Paused | Dim gray, static | `rgba(148,163,184,0.08)` | None | None |
| Testing | Amber, slow pulse | `rgba(245,158,11,0.14)` | None | 3s |
| Deployed | Blue, solid | `rgba(59,130,246,0.14)` | None | None |

### Agent mini-widget on Overview

A compact widget in the Overview layout: a row per active agent showing a 48px ring, agent name, and task count (`3/7`). Clicking navigates to the AI Operations section. Only Active and Testing agents shown (Paused and Deployed omitted to reduce noise).

---

## 8. Per-Section Enrichment

### Overview
- Full-bleed two-column grid on wide screens. Left: stat grid + priorities + agent mini-widget. Right: ventures + E&M progress.
- Greeting (`Good morning, Michael.`) scramble-reveals on load.
- All stat numbers count up via Anime.js on mount.

### Health Hub
- Weekly workout grid (7 days): done = solid emerald fill, missed = `rgba(239,68,68,0.3)` red tint, pending = empty surface.
- Circular ring chart for "workouts this week / goal" replaces flat stat card.
- Nutrition macro progress bars animate in with 60ms stagger.

### Business Command
- Revenue total counts up in large amber type on section entry (display scale, 700 weight, amber color, glow text-shadow).
- Venture cards get amber tint + a mini horizontal bar showing that venture's revenue as a proportion of total revenue across all ventures.
- Lessons Learned entries stagger in on mount.

### Study Hub
- Each topic gets a 32px completion ring instead of a checkbox square.
- Overall E&M progress bar animates in on mount.
- Study session log entries stagger in.

### AI Operations
- Pipeline tab: cards get `rgba(139,92,246,0.14)` tint, `translateY(-2px)` on hover.
- Agents tab: full rebuild per section 7.
- Observations feed: terminal-style, entries stagger in on mount.

### Second Brain
- Timeline entries slide in from `translateX(-16px)` with stagger.
- Quick Capture input: cyan focus glow (`box-shadow: 0 0 0 2px rgba(6,182,212,0.4)`).
- Notes count animates up on mount.

---

## 9. New Files

| File | Purpose |
|---|---|
| `src/components/ParticleField.tsx` | Canvas particle field, mounted at root |
| `src/hooks/useAnimeCountUp.ts` | Anime.js count-up hook for numeric values |
| `src/hooks/useInView.ts` | IntersectionObserver hook for mount animations |
| `src/components/AgentRing.tsx` | SVG ring component with `createDrawable` animation |
| `src/components/ActivityLog.tsx` | Terminal-style log feed with animated entries |

---

## 10. Modified Files

| File | Changes |
|---|---|
| `src/App.tsx` | Mount ParticleField, remove max-width, add section transition CSS classes, fix sidebar active state |
| `src/index.css` | Add `@keyframes pulse-ring`, `glow-breathe`, `section-enter`, `section-exit`. Add transition utility classes. |
| `src/tailwind.config.ts` | No changes needed — colors already defined |
| `src/context/types.ts` | Add `tasks` and `logs` arrays to `Agent` type |
| `src/context/reducer.ts` | Add 5 new agent task/log actions, safe-default migration |
| `src/sections/Overview/index.tsx` | Two-column grid, scramble greeting, count-up stats, agent mini-widget |
| `src/sections/AIOperations/AgentTracker.tsx` | Full rebuild per section 7 |
| `src/sections/AIOperations/Pipeline.tsx` | Color tint + hover lift |
| `src/sections/HealthHub/index.tsx` | Workout grid visual treatment, ring chart |
| `src/sections/BusinessCommand/index.tsx` | Count-up revenue, venture card tint |
| `src/sections/StudyHub/index.tsx` | Topic rings, stagger entries |
| `src/sections/SecondBrain/index.tsx` | Stagger timeline, cyan capture glow |
| `src/components/StatCard.tsx` | Accept `accentColor` prop for background tint + glow text |
| `src/components/ProgressBar.tsx` | Animate width on mount via Anime.js |

---

## 11. Dependencies

- `animejs` v4 (add to `package.json`)

No other new dependencies. The particle field is vanilla canvas. All animation targets are DOM refs or plain JS objects.

---

## 12. What This Does Not Change

- Data model outside of `Agent` (tasks/logs additions only).
- Settings panel, export/import flow.
- Mobile bottom nav (already separate from the main layout).
- The five accent color values — they stay exactly as defined in the design system.
- The typography system — Geist, same hierarchy.
