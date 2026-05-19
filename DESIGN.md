---
name: Summer OS 2026
description: A personal operating system for the most ambitious summer of your life.
colors:
  bg-deep: "#0f1117"
  bg-surface: "#1a1d2e"
  bg-card: "#1e2235"
  accent-health: "#10b981"
  accent-business: "#f59e0b"
  accent-academic: "#3b82f6"
  accent-ai: "#8b5cf6"
  accent-brain: "#06b6d4"
  text-primary: "#f1f5f9"
  text-secondary: "#94a3b8"
typography:
  display:
    fontFamily: "Geist, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.04em"
rounded:
  sm: "6px"
  DEFAULT: "12px"
  lg: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.text-primary}"
    textColor: "{colors.bg-deep}"
    rounded: "{rounded.DEFAULT}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.accent-academic}"
    textColor: "{colors.text-primary}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.DEFAULT}"
    padding: "10px 20px"
  stat-card:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.DEFAULT}"
    padding: "20px 24px"
  agent-card:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.DEFAULT}"
    padding: "20px"
---

# Design System: Summer OS 2026

## 1. Overview

**Creative North Star: "The Operator's Control Room — Live"**

This is a dark, high-information environment for someone who knows exactly what they're doing — and now, it moves. Every screen is a command surface with real-time presence: numbers count up, a particle field drifts behind everything, agent rings pulse when work is in flight. The design earns trust through precision and motion together. When you open this dashboard, you should feel like a control room that is actively running, not one frozen on standby.

The five section accents (emerald, amber, blue, purple, cyan) are now used at full palette depth. Each accent appears at three intensities: a `0.14` opacity background tint on cards (dim), `0.25` opacity on hover and active states (mid), and solid on key metrics and glowing indicators (full). This is not restrained color — it is deliberate color. Every card knows what section it belongs to before you read a single word.

Motion runs on Anime.js v4, chosen for its SVG stroke animation (`createDrawable`), spring-eased count-up on plain JS objects, `scrambleText` for section title reveals, and `stagger()` for coordinated card entrances. The particle field is a separate `requestAnimationFrame` canvas loop — drifting purple and cyan particles with proximity connection lines — mounted once at the root and never touching the DOM animation stack. CSS `@keyframes` remain only for the two looping glow animations (`pulse-ring`, `glow-breathe`) that need no orchestration.

Layout is full-bleed. The `max-w-5xl` centering wrapper is removed. Content fills the viewport after the sidebar; each section owns its grid. On a wide monitor, sections render two- or three-column layouts instead of a single narrow column. Section transitions animate: 150ms fade-out, 250ms ease-out-quart slide-up fade-in on the incoming content.

What this system explicitly rejects: the SaaS cliché of purple gradient blobs and hero-metric templates; the hacker-terminal aesthetic of green-on-black and monospace-as-personality; the Notion-clone spaciousness that mistakes whitespace for clarity; any shadow at rest.

**Key Characteristics:**
- Five section identities unified by a single dark base, each now vivid at three tiers of intensity
- Particle field background: drifting neural network, always present, never distracting
- Anime.js animation throughout: count-up numbers, scramble reveals, staggered entrances, SVG rings
- Agent Tracker as live command center: animated completion rings, scrollable activity logs, task checklists
- Full-bleed layout; sections own their grids with no global centering constraint
- Flat tonal layering (no shadows), depth through background steps
- No gradients on card backgrounds; no gradient text

---

## 2. Colors: The Control Room Palette

Five vivid section accents at full palette depth, over a single dark base. Each accent is rationed to its section — and within that section, used at three intensities that create real visual hierarchy.

### Primary (Section Accents)

- **Emerald Health** (`#10b981`): Health Hub — calorie counts, workout completion rings, macro progress fills, done states. Biological, vital, forward motion.
- **Amber Business** (`#f59e0b`): Business Command — revenue totals (display scale, glow), venture bars, profit figures. Money in motion.
- **Academic Blue** (`#3b82f6`): Study Hub — topic completion rings, exam countdown, session logs. Trust and rigor.
- **AI Purple** (`#8b5cf6`): AI Operations — agent status rings (pulsing when Active), pipeline cards, particle field (60% share). Synthetic, precise, alive.
- **Brain Cyan** (`#06b6d4`): Second Brain — capture input glow, timeline markers, notes count. Signal in the quiet. Particle field (40% share).

### Neutral

- **Deep Navy** (`#0f1117`): Page root. The background the eye rests on. Also the background of the activity log terminal feed.
- **Surface Navy** (`#1a1d2e`): Sidebar, elevated containers, progress bar tracks.
- **Card Navy** (`#1e2235`): Individual cards, stat blocks, input fields. The atomic surface unit.
- **Primary Text** (`#f1f5f9`): Headings, values, primary content. Near-white with a blue tint.
- **Secondary Text** (`#94a3b8`): Labels, metadata, placeholder text. Recedes without disappearing.

### Three-Tier Accent Usage

Every accent has three intensities for surfaces it owns:

| Tier | Value | Usage |
|---|---|---|
| Dim | `rgba(accent, 0.14)` | Card background tint at rest |
| Mid | `rgba(accent, 0.25)` | Hover state, active sidebar fill, focused input highlight |
| Full | Solid accent | Key metric numbers, progress fills, agent rings, active icons |

Key metrics use `text-shadow: 0 0 20px <accent>` so they glow against the dark. Section header icons use `filter: drop-shadow(0 0 12px <accent>)`.

### Named Rules

**The Full-Palette Rule.** Each section accent operates at three intensities, not one. A card tinted at `0.14` opacity, a hover state at `0.25`, and a glowing metric number at full saturation is the minimum expression for any section. Anything less is color starvation.

**The Five-and-None Rule.** The five section accents are reserved for their section. Accent colors do not cross section boundaries. On the Overview, section-attributed stats use their section's accent — but only as inherited from the section's identity, never borrowed decoratively.

**The No-Gradient Rule.** Gradients are forbidden on text, card backgrounds, and section headers. Solid low-opacity tints only on cards. Single solid accent for text emphasis.

---

## 3. Typography

**Display / Body Font:** Geist (`'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`)

**Character:** Geist is Vercel's geometric sans, built for data-dense product UIs. Confident at display scale, precise at small sizes. Numbers are commanding without the coldness of a strict geometric. Loaded via Google Fonts (weights 300–700).

### Hierarchy

- **Display** (700 weight, `clamp(1.75rem, 4vw, 2.5rem)`, line-height 1.1, tracking −0.02em): Section hero numbers — total revenue, days remaining, calorie totals. One per section. Rendered in the section's full accent color with glow `text-shadow`.
- **Headline** (600 weight, 1.25rem, line-height 1.3): Section titles and major card headers. Revealed via `scrambleText` on section mount.
- **Title** (500 weight, 1rem, line-height 1.4): Tab labels, form field groups, venture names, agent names.
- **Body** (400 weight, 0.875rem, line-height 1.6): All descriptive text, log entries, notes, activity log feed. Max 65ch on prose content.
- **Label** (500 weight, 0.75rem, letter-spacing 0.04em, uppercase for category chips): Tags, status badges, metadata fields, activity log timestamps.

### Named Rules

**The Weight Gap Rule.** Display is 700; headline is 600; everything below is 400–500. Each step is felt, not calculated. No 500-weight headline beside 600-weight body.

**The Scramble Rule.** Section titles and agent names scramble-reveal via Anime.js `scrambleText` on mount. This is the only text animation permitted. Body copy, labels, and metadata do not scramble.

---

## 4. Elevation

No shadows at rest. Depth is expressed through background value steps: `#0f1117` (base) → `#1a1d2e` (surface) → `#1e2235` (card). The 3px top-border accent stripe is the primary visual lifting mechanism for cards. Tonal background tints (`rgba(accent, 0.14)`) provide additional differentiation per section.

Interactive lift on hover uses `transform: translateY(-2px)` only — no shadow appears on movement. Glow animations on active agents (`glow-breathe` keyframe, `box-shadow` oscillating in the section accent) are the sole exception: glow communicates live status, not depth.

**Motion vocabulary** (fold into elevation because it governs spatial behavior):

| Animation | Mechanism | Duration | Easing |
|---|---|---|---|
| Section entry | CSS class swap on `key` change | 250ms in, 150ms out | ease-out-quart |
| Card entrance stagger | Anime.js `stagger()` | 300ms, 60ms between | ease-out-quart |
| Number count-up | Anime.js on JS object | 900ms | Spring (stiffness 80, damping 15) |
| Progress bar fill | Anime.js width | 600ms | ease-out-quart |
| Agent ring draw | Anime.js `createDrawable` | 800ms | ease-out-quart |
| Active agent pulse | CSS `@keyframes glow-breathe` | 2s infinite | — |
| Testing agent pulse | CSS `@keyframes glow-breathe` | 3s infinite | — |
| Activity log entry | Anime.js `translateY` from bottom | 200ms | ease-out-quart |
| Particle field | `requestAnimationFrame` canvas | Continuous | — |

### Named Rules

**The Flat-By-Default Rule.** Nothing casts a shadow at rest. The only box-shadows are focus rings on inputs and the `glow-breathe` on Active agents — status, not depth.

**The Move-Not-Light Rule.** Hover feedback is `translateY(-2px)`. The surface moves; it does not illuminate. Shadows do not appear on hover.

---

## 5. Components

### Buttons

- **Shape:** Gently rounded (12px radius)
- **Primary:** White fill (`#f1f5f9`), near-black text (`#0f1117`), 10px × 20px padding. Primary form submits.
- **Hover / Focus:** Transitions to the section's active accent color fill over 150ms ease-out. `translateY(-1px)`.
- **Ghost:** Transparent background, secondary text (`#94a3b8`), same radius and padding. Secondary actions.

### Stat Cards

- **Shape:** 12px radius, Card Navy (`#1e2235`) base
- **Tint:** `rgba(section-accent, 0.14)` solid background tint — the card's section ownership is immediately visible from color.
- **Accent stripe:** 3px top border in section accent, full opacity. No side borders.
- **Key metric:** Rendered in full solid accent color. Display scale (700 weight, 2rem+) for hero numbers. `text-shadow: 0 0 20px <accent>` on mount.
- **Count-up:** All numeric values animate from 0 to target on section mount via Anime.js spring easing.
- **Padding:** 20px × 24px. Never nest another card inside.

### Progress Bars

- **Track:** Surface Navy (`#1a1d2e`)
- **Fill:** Section accent color, solid. Animates from `width: 0` to actual value over 600ms ease-out-quart on mount.
- **Height:** 8px for macro bars, 4px for compact inline. Never taller than 8px.

### Inputs / Fields

- **Style:** Card Navy (`#1e2235`) background, 1px `rgba(148,163,184,0.3)` border, 12px radius
- **Focus:** Border shifts to section accent. `box-shadow: 0 0 0 2px rgba(accent, 0.4)` glow. 150ms transition. No floating labels.
- **Activity log input:** Same style, anchored to the bottom of the activity log panel.

### Sidebar Navigation

- **Default:** Icon + label at secondary text color (`#94a3b8`). Surface Navy (`#1a1d2e`) background.
- **Active:** Full `rgba(section-accent, 0.25)` background fill. Icon and label in solid section accent. `filter: drop-shadow(0 0 6px <accent>)` on the icon. No side-stripe border.
- **Collapsed:** Icon only. Tooltip on hover shows the full label.

**The No-Side-Stripe Rule.** `border-left` or `border-right` greater than 1px as a colored accent is prohibited on all surfaces — including sidebar nav items. Active states use background fills, not left borders.

### Agent Cards (Signature Component)

The primary interactive surface of the AI Operations section. Three-column layout at full width:

**Left — Status Ring (120px SVG):**
- `createDrawable()` on an SVG circle. Stroke progress = task completion percentage.
- Active: ring pulses via `glow-breathe` CSS keyframe (purple glow, 2s). Full AI purple stroke.
- Paused: ring at 30% opacity, static, dim gray stroke.
- Testing: amber stroke, slower pulse (3s). Amber `glow-breathe`.
- Deployed: blue stroke, solid, no pulse. "LIVE" label in Academic Blue below the ring.

**Center — Content:**
- Agent name scramble-reveals via `scrambleText` on card mount.
- Purpose and linked venture name in section accent.
- Task list: inline checkboxes, toggleable. Completed tasks strike through in Secondary Text. Count displayed as `3/7 complete` in solid accent.
- "Add task" input inline below the task list; Enter to commit.

**Right — Activity Log:**
- Terminal-style feed: Deep Navy (`#0f1117`) background, label-weight font.
- Timestamped entries, newest at bottom. Scrollable, max 200px height.
- New entries animate in from bottom via Anime.js timeline, 200ms ease-out-quart.
- When status is Active: blinking cursor (`|`) at the end of the last entry.
- "Log entry" input at the bottom; Enter to commit. Trash icon on hover for deletion.

**Card background tints by status:**

| Status | Tint | Glow |
|---|---|---|
| Active | `rgba(139, 92, 246, 0.25)` | `glow-breathe` 2s purple |
| Paused | `rgba(148, 163, 184, 0.08)` | None |
| Testing | `rgba(245, 158, 11, 0.14)` | `glow-breathe` 3s amber |
| Deployed | `rgba(59, 130, 246, 0.14)` | None |

### Agent Mini-Widget (Overview)

Compact row per Active/Testing agent: 48px ring, agent name, task count (`3/7`). Clicking navigates to AI Operations. Paused and Deployed agents are omitted.

### Workout Grid (Health Hub)

Seven-day horizontal grid. Done day: solid Emerald Health fill. Missed day: `rgba(239, 68, 68, 0.3)` red tint. Pending day: empty surface, 1px `rgba(255,255,255,0.1)` border.

### Topic Rings (Study Hub)

32px SVG completion rings replacing checkbox squares. Same `createDrawable` mechanic as agent rings, Academic Blue stroke. Full ring = topic complete.

### Particle Field (Global Background)

Fixed canvas, `inset: 0`, `z-index: 0`, `pointer-events: none`. 90 particles (≥1200px viewport), 50 particles below. Drift speed 0.3–0.6px/frame. Particle radius 1.5px. Color mix: 60% AI Purple `rgba(139, 92, 246, 0.4)`, 40% Brain Cyan `rgba(6, 182, 212, 0.3)`. Connection lines between particles within 130px: `opacity = (1 - distance/130) * 0.15`. Pauses on `prefers-reduced-motion: reduce`.

---

## 6. Do's and Don'ts

### Do:

- **Do** use the three-tier accent system on every card in every section: `0.14` background tint at rest, `0.25` on hover/active, solid accent on key metric numbers.
- **Do** animate every numeric stat on section mount via Anime.js spring count-up. A static number is a missed opportunity.
- **Do** use `scrambleText` for section headlines and agent names on mount. This is the only text animation permitted.
- **Do** use `createDrawable` for all SVG ring animations — agent completion rings, topic rings. Consistent mechanic, consistent feel.
- **Do** use `stagger()` with 60ms delay between cards for all list and grid entrances.
- **Do** use full-bleed layout within each section. No `max-w-5xl` or centering wrappers. Sections own their grids.
- **Do** use `rgba(accent, 0.25)` full background fills on active sidebar items with the icon in solid accent. No side-stripe borders.
- **Do** apply `text-shadow: 0 0 20px <accent>` to display-scale metric numbers so they glow against the dark.
- **Do** apply `filter: drop-shadow(0 0 12px <accent>)` to section header icons.
- **Do** make Active agents visually unmistakable: pulsing ring, blinking cursor in the log, `0.25` opacity card fill. Status must be readable at a glance.
- **Do** use `transform: translateY(-2px)` as the universal hover lift. No shadows on hover.
- **Do** keep the particle field present but background: dim enough to never compete with content, vivid enough to confirm the interface is alive.
- **Do** show real data density. The sole user can handle information. Sparse sections are design failures.

### Don't:

- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe — on cards, list items, callouts, alerts, or sidebar nav items. Prohibited. Use top borders, background tints, or nothing.
- **Don't** build generic SaaS dashboards: no hero-metric templates inside gradient cards, no identical icon-grid cards repeated endlessly, no decorative blob backgrounds or purple gradient overlays.
- **Don't** use gradient text (`background-clip: text` with a gradient). Emphasis via solid accent color, scale, and weight.
- **Don't** use gradients on card backgrounds. Solid low-opacity tints only.
- **Don't** use the terminal aesthetic as personality: no green-on-black, no monospace-as-personality, no fake CLI chrome. The activity log uses monospace-weight type for a functional reason, not an aesthetic pose.
- **Don't** use Notion-clone whitespace. This is a dense tool. Generous padding, not spacious emptiness.
- **Don't** let section accent colors bleed across sections. Emerald is Health. Amber is Business. AI Purple is AI Operations. Period.
- **Don't** add shadows at rest. The only box-shadows are focus rings on inputs and the `glow-breathe` on Active agents.
- **Don't** nest cards inside cards. `bg-card` (`#1e2235`) does not appear inside another `#1e2235` surface.
- **Don't** animate CSS layout properties (width/height changes that trigger reflow). Anime.js targets `strokeDashoffset`, `opacity`, `translateY` — not layout.
- **Don't** use bounce or elastic easing. All curves are ease-out-quart or spring physics. Motion settles; it does not overshoot.
- **Don't** scramble body copy, labels, or metadata. `scrambleText` is reserved for section titles and agent names on initial mount only.
- **Don't** constrain the layout with a global max-width. Each section owns its width within the viewport.
