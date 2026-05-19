# Michael's Summer OS — 2026

> A personal operating system for the most productive summer of your life. Built as a single-file HTML dashboard with full localStorage persistence, Chart.js visualizations, and six integrated modules.

---

## Overview

**Dashboard file:** `summer_dashboard.html`
**Summer window:** May 19 – August 31, 2026 (104 days)
**Theme:** Dark, modern SaaS-style — deep navy/charcoal with vivid section accents
**Tech stack:** Vanilla HTML/CSS/JS · Chart.js 4.4.0 · localStorage (no server needed)

---

## Section 1 — Overview / Home

The landing screen. Pulls live data from all other sections to give a unified daily picture.

- Live date, day of week, and time-aware greeting (morning / afternoon / evening)
- Summer countdown: days remaining, weeks remaining, % of summer elapsed
- Today's workout called out prominently based on the day of the week
- Quick stats: calories logged today, workouts done this week, total summer revenue, total study sessions
- Dynamic "Today's Priorities" list — updates automatically based on what's been logged (e.g. if you haven't logged nutrition, it shows up; if today's workout isn't marked done, it appears)
- Venture snapshot: each venture with its current total profit
- Study progress: visual bar + list of first 6 E&M topics with completion status

---

## Section 2 — Health Hub

**Accent color:** Emerald green (`#10b981`)

### Gym Tracker

Weekly workout split — hardcoded to your exact program:

| Day | Workout |
|-----|---------|
| Monday | Chest — Strength (Low Volume) |
| Tuesday | Pull — Rear Delts |
| Wednesday | Push — Hypertrophy (Higher Volume) |
| Thursday | Legs |
| Friday | Rest |
| Saturday | Chest/Back — Back Focused, Lower Volume Chest |
| Sunday | Shoulders/Arms — Rear Delts, no shoulder press |

Features:
- Visual week calendar — each day is a card showing the workout name and emoji
- Mark any day as **Done** (turns green) or **Missed** (turns red) — clicking again toggles it off
- Workout streak counter — counts consecutive days with a logged workout
- Weekly completion % (out of 6 training days)
- All-time gym log showing every entry across all weeks

### Nutrition Tracker

Defaults set for body recomp at 139 lbs (moderately active):

| Macro | Daily Goal |
|-------|-----------|
| Calories | 2,100 |
| Protein | 145g |
| Carbs | 195g |
| Fat | 65g |

Features:
- Daily input form: log calories, protein, carbs, fat
- Animated progress bars for each macro, updating on save
- Today's values persist — reloading the page keeps your entries
- Charts tab: 7-day calorie bar chart + 7-day macro line chart (protein / carbs / fat)

---

## Section 3 — Business Command Center

**Accent color:** Gold/amber (`#f59e0b`)

### Pre-loaded Ventures

**Closet Curation Co**
- Website: closetcurationco.com
- Category: Web Design / Freelance
- Stage: Running
- Revenue logged: $300 (Client Website Build — first summer project)

**Degree Planner** *(working title)*
- Category: EdTech / SaaS — college career planning software
- Stage: Building
- Revenue: $0

### Features

**Big profit counter** — total summer revenue displayed as a large number at the top, updating live as entries are added.

**Venture manager:**
- Add ventures with name, category, website, stage, and start date
- Stage selector on each venture card (Idea → Building → Testing → Running → Profitable)
- Delete ventures
- Per-venture profit total displayed on each card

**Revenue log:**
- Log entries by venture: date, amount, source, notes
- Full reverse-chronological log across all ventures

**Lessons Learned journal:**
- Add entries with category (Marketing, Operations, Sales, Mindset, Technical, Other) and free text
- Live search/filter across all entries
- Color-coded by category

**Charts:**
- 30-day revenue bar chart
- Per-venture revenue split (donut chart)

---

## Section 4 — Cornell E&M Study Hub

**Accent color:** Electric blue (`#3b82f6`)

### Exam Details

**Exam:** Cornell Advanced Standing Exam (CASE) — PHYS 2213
**Format:** Closed-book, closed-notes, 2 hours
**Rules:** No formula sheet provided or allowed. Non-graphing, non-programmable calculator permitted.
**Topics covered:** Electrostatics, behavior of matter in electric fields, DC circuits, magnetic fields, Faraday's Law, Maxwell's equations, electromagnetic oscillations.

### Topic Curriculum (12 topics, pre-loaded)

| # | Topic | Difficulty |
|---|-------|-----------|
| 1 | Electrostatics & Coulomb's Law | ●● |
| 2 | Electric Fields | ●● |
| 3 | Gauss's Law | ●●● |
| 4 | Electric Potential & Potential Energy | ●● |
| 5 | Capacitance & Dielectrics | ●● |
| 6 | Current, Resistance & DC Circuits | ●● |
| 7 | Magnetic Fields & Forces | ●● |
| 8 | Sources of Magnetic Fields (Biot-Savart, Ampère's Law) | ●●● |
| 9 | Electromagnetic Induction & Faraday's Law | ●●● |
| 10 | Inductance & LRC Circuits | ●●● |
| 11 | Maxwell's Equations | ●●● |
| 12 | Electromagnetic Waves | ●●● |

Each topic has: completion checkbox, difficulty indicator (1–3), and a notes field.

### Features

**Exam countdown:** Set your exam date and the dashboard shows exact days remaining.

**Recommended daily study time:** Calculates automatically based on topics remaining × ~90 min average ÷ days until exam. Updates as you complete topics.

**Study session logger:** Log date, topic (dropdown of all 12), duration in minutes, and notes. Tracks total minutes studied and average session length.

**Progress bar:** Percentage of curriculum covered, live-updating.

**Charts:** Topic completion donut + time-per-topic horizontal bar chart.

---

## Section 5 — AI Operations Center

**Accent color:** Purple (`#8b5cf6`)

### Pipeline (Kanban)

Five-stage kanban board auto-populated from your Business ventures:

Idea → Building → Testing → Running → Profitable

Each card shows: venture name, revenue to date, category, and any assigned agents.

### Agent / Workflow Tracker

Add AI agents with:
- Name and purpose
- Associated venture
- Status (Active / Paused / Testing / Deployed)
- Notes
- Last run date

Status can be updated inline from a dropdown on each agent card.

### Observations Log

Timestamped freeform log for recording agent behavior — wins, mistakes, unexpected outputs, patterns noticed. Every entry is stamped with the exact date and time.

---

## Section 6 — Second Brain

**Accent color:** Cyan (`#06b6d4`)

Designed to work standalone now and connect to Obsidian later.

### Features

**Today's Insight:** A dedicated text area for a daily note or reflection. Saves per day — reloading preserves it.

**Quick Capture:** Type a thought, select a tag, hit Capture. Tags: `#lesson` `#mistake` `#win` `#idea` `#observation`. Each tag has a distinct color in the timeline.

**Timeline view:** All captured notes in reverse-chronological order, searchable by text or tag.

**Stats:**
- Notes captured this week
- Total entries across all time
- Most used tag
- Daily streak (consecutive days with at least one note or daily insight)

---

## Settings

- **Export JSON:** Downloads a full backup of all data as a timestamped `.json` file
- **Import JSON:** Restores from a backup file (reloads the page after import)
- **Reset:** Wipes all localStorage data and returns to defaults (with confirmation prompt)

---

## Design System

| Property | Value |
|----------|-------|
| Background primary | `#0f1117` |
| Background secondary | `#1a1d2e` |
| Card background | `#1e2235` |
| Health accent | `#10b981` (emerald) |
| Business accent | `#f59e0b` (amber) |
| Academic accent | `#3b82f6` (blue) |
| AI Ops accent | `#8b5cf6` (purple) |
| Second Brain accent | `#06b6d4` (cyan) |
| Primary text | `#f1f5f9` |
| Secondary text | `#94a3b8` |
| Font | System UI / -apple-system |
| Border radius | 12px |
| Chart library | Chart.js 4.4.0 (CDN) |

### Visual features
- Sidebar with color-coded dots per section
- Gradient text headers per section
- 3px top-border accent on stat cards
- Smooth CSS transitions on all interactive elements
- Hover lift effect on kanban cards
- Toast notifications on every save/log action
- Responsive layout — collapses to icon-only sidebar below 900px

---

## Data Architecture

All state lives in a single localStorage key: `summer_os_2026`

```
State
├── health
│   ├── weekLog  { weekKey: { Mon: 'done'|'missed'|null, ... } }
│   └── nutrition  { YYYY-MM-DD: { cal, pro, carb, fat } }
├── business
│   ├── ventures  [ { id, name, category, website, stage, startDate, revenue[] } ]
│   └── lessons  [ { id, date, category, text } ]
├── academic
│   ├── examDate  (string)
│   ├── topics  [ { id, name, difficulty, completed, notes } ]
│   └── sessions  [ { id, date, topicId, topicName, duration, notes } ]
├── ai
│   ├── agents  [ { id, name, purpose, ventureId, status, notes, lastRun } ]
│   └── observations  [ { id, ts, text } ]
└── brain
    ├── dailyNotes  { YYYY-MM-DD: text }
    └── notes  [ { id, ts, tag, text } ]
```

---

*Last updated: May 19, 2026*
