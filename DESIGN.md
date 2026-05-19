<!-- SEED: re-run /impeccable document once there's code to capture actual components and rendered tokens. -->

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
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.04em"
rounded:
  sm: "6px"
  md: "12px"
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
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.accent-academic}"
    textColor: "{colors.text-primary}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  stat-card:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "20px 24px"
---

# Design System: Summer OS 2026

## 1. Overview

**Creative North Star: "The Operator's Control Room"**

This is a dark, high-information environment built for someone who knows exactly what they're doing. Every screen is a command surface, not a landing page. The design earns trust through precision: exact numbers, clear status, no ambient decoration. When you open this dashboard, you should feel like you're in control, not like you're being onboarded.

The five section accents (emerald, amber, blue, purple, cyan) are the only vivid color in the system. Everything else is deep navy. The accents earn their saturation by being rationed: they appear on borders, progress fills, and interactive states. The deep background is not a fashion choice. It's a signal that this tool was designed for long focused sessions, not glanceable marketing.

What this system explicitly rejects: the SaaS cliché of purple gradient blobs and hero-metric templates that inflate simple data into theater; the hacker-terminal aesthetic of green-on-black and monospace-as-personality; the Notion-clone spaciousness that mistakes empty space for clarity.

**Key Characteristics:**
- Five distinct section identities unified by a single dark base
- Information density closer to Linear than to most personal dashboards
- Flat tonal layering (no shadows), depth through background steps
- No decorative gradients; no gradient text
- Confident typography hierarchy: one weight jump between levels, not gradual creep

---

## 2. Colors: The Control Room Palette

Five vivid accents, one dark base, one neutral text stack. Each accent belongs to exactly one section and is never borrowed by another.

### Primary (Accents by Section)

- **Emerald Health** (`#10b981`): Health Hub — gym progress fills, nutrition bars, done states. Biological, vital, forward motion.
- **Amber Business** (`#f59e0b`): Business Command — revenue numbers, venture stage highlights, profit totals. Money in motion.
- **Academic Blue** (`#3b82f6`): Study Hub — topic completion, exam countdown, session logs. Trust and rigor.
- **AI Purple** (`#8b5cf6`): AI Operations — agent status, kanban cards, pipeline indicators. Synthetic, precise.
- **Brain Cyan** (`#06b6d4`): Second Brain — capture tags, timeline markers, insight fields. Signal in the quiet.

### Neutral

- **Deep Navy** (`#0f1117`): The primary background. Page root. Where the eye rests.
- **Surface Navy** (`#1a1d2e`): Sidebar, section panels, elevated containers. One step lighter than base.
- **Card Navy** (`#1e2235`): Individual cards, stat blocks, input fields. The atomic surface unit.
- **Primary Text** (`#f1f5f9`): All headings, values, primary content. Near-white, slightly blue-tinted.
- **Secondary Text** (`#94a3b8`): Labels, metadata, placeholder text. Recedes without disappearing.

### Named Rules

**The Five-and-None Rule.** The five section accents are reserved for their section. Accent colors do not cross section boundaries. If a component needs to indicate status outside its home section (e.g. an overview stat from Health), it uses the section's accent as a top-border stripe only, not as a fill.

**The No-Gradient Rule.** Gradients do not appear on text, card backgrounds, or section headers. A single solid accent is more precise and less theatrical than any gradient.

---

## 3. Typography

**Display / Body Font:** System UI stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`)

**Character:** The system font stack is the right choice here. It matches the OS of whoever runs this — personal, unselfconscious, fast to render. The personality comes from weight contrast and tracking, not from a display face. This is a tool that doesn't need to announce itself.

### Hierarchy

- **Display** (700 weight, clamp 1.75–2.5rem, line-height 1.1, tracking -0.02em): Section hero numbers — total revenue, days remaining, calorie totals. One per section maximum.
- **Headline** (600 weight, 1.25rem, line-height 1.3): Section titles, card headers, subsection labels.
- **Title** (500 weight, 1rem, line-height 1.4): Tab labels, form field groups, venture names.
- **Body** (400 weight, 0.875rem, line-height 1.6): All descriptive text, log entries, notes content. Maximum 65ch width on prose content.
- **Label** (500 weight, 0.75rem, letter-spacing 0.04em, uppercase for category chips): Tags, status badges, metadata fields.

### Named Rules

**The Weight Gap Rule.** Display is 700; headline is 600; everything below is 400–500. The jump from headline to display is felt, not calculated. No 500-weight headlines next to 600-weight body text: each step must be immediately distinguishable.

---

## 4. Elevation

No shadows. Depth is expressed through background value steps: `#0f1117` (base) → `#1a1d2e` (surface) → `#1e2235` (card). The 3px top-border accent stripe is the primary visual lifting mechanism for stat cards. It signals ownership and draws the eye without any blur, spread, or drop.

Interactive lift on hover is achieved via `transform: translateY(-2px)` only — no shadow appears. The surface doesn't illuminate; it moves.

### Named Rules

**The Flat-By-Default Rule.** Nothing casts a shadow at rest. The only shadows that exist are subtle focus rings on interactive elements (form inputs, buttons) for accessibility. Movement (transform) is the hover language. Light (shadow) is not.

---

## 5. Components

### Buttons

- **Shape:** Gently rounded (12px radius)
- **Primary:** White fill (`#f1f5f9`), near-black text (`#0f1117`), 10px × 20px padding. Used for primary form submits (Save, Log, Capture).
- **Hover / Focus:** Transitions to the section's active accent color fill over 150ms ease-out. `translateY(-1px)` on hover.
- **Ghost:** Transparent background, secondary text (`#94a3b8`), same radius and padding. Used for secondary actions (Cancel, Reset, Toggle).
- **No icon-only buttons without labels.** Every action button has a visible text label. Icon-only reserved for sidebar navigation where labels are visible on hover.

### Stat Cards

- **Shape:** 12px radius, `#1e2235` background
- **Accent:** 3px top border in the section's accent color. This is the only decoration the card receives.
- **Padding:** 20px × 24px internal. The number breathes; the label is compact.
- **Never nest:** Stat cards do not contain other cards. A stat inside a stat is a design failure.

### Progress Bars

- **Track:** `#1a1d2e` (the surface step, not a separate color)
- **Fill:** Section accent color. Animated width transition on load and update (200ms ease-out).
- **Height:** 8px for macro/curriculum bars, 4px for compact inline progress. Never taller than 8px.

### Inputs / Fields

- **Style:** `#1e2235` background, 1px `#94a3b8` border at 30% opacity, 12px radius
- **Focus:** Border shifts to section accent, no glow. 150ms transition.
- **No floating labels.** Labels are above the field, always visible. Placeholder text is supplemental, never the label.

### Sidebar Navigation

- **Default:** Icon + label, section accent dot on left. `#1a1d2e` background.
- **Active:** Section accent as left border accent (3px), label in accent color, background steps to `#1e2235`.
- **Collapsed (below 900px):** Icon only. Tooltip on hover shows the full label. Active state still uses the accent border.

### Kanban Cards (AI Operations Pipeline)

- **Background:** `#1e2235`
- **Hover:** `translateY(-2px)`, no shadow, border brightens to 1px accent
- **Revenue badge:** Amber (`#f59e0b`) number, always visible on card

---

## 6. Do's and Don'ts

### Do:
- **Do** use the section's accent color as a 3px top border on stat cards — this is the primary attribution system.
- **Do** express large numbers (revenue totals, calorie counts, days remaining) at display scale (700 weight, 2rem+). These are the payoff of the whole section.
- **Do** use `transform: translateY(-2px)` for hover lift on interactive cards. No shadows.
- **Do** keep the sidebar's accent dots as the visual anchor of section identity throughout the interface.
- **Do** mark today's gym workout prominently on the Overview — it's the first decision of the day.
- **Do** show real data density. This user is the only user; they can handle information.

### Don't:
- **Don't** use gradient text (`background-clip: text` with a gradient). Use the section's solid accent color for emphasis, not rainbow gradients.
- **Don't** build a generic SaaS dashboard: no hero-metric templates with big numbers inside gradient cards, no identical icon-grid cards repeated endlessly, no decorative blob backgrounds.
- **Don't** use `border-left` as a colored stripe greater than 1px on cards or list items. That is the side-stripe antipattern. Use top borders or background tints instead.
- **Don't** let section accent colors bleed across sections. Emerald is Health. Amber is Business. Period.
- **Don't** add gamification: no badge unlocks, no confetti on streak milestones, no progress ring animations, no reward sounds.
- **Don't** use the terminal aesthetic: no monospace as personality, no green-on-black, no fake CLI chrome.
- **Don't** use Notion-clone whitespace: this is a dense tool, not a document editor. Generous but not spacious.
- **Don't** show shadows at rest. Shadows are a focus ring at most, applied to inputs and buttons for accessibility only.
- **Don't** put nested cards inside cards. `bg-card` (`#1e2235`) does not appear inside another `#1e2235` surface.
