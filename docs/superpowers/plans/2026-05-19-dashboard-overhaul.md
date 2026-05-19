# Dashboard Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Summer OS 2026 from a static narrow-column dashboard into a full-bleed, animated, gamified command center with a particle field background, Anime.js-powered motion, and a live agent tracker.

**Architecture:** A canvas particle system mounts once at the root behind all content. Anime.js handles all choreographed DOM animations: count-up numbers via plain JS objects, SVG ring draws via strokeDashoffset, staggered card entrances via stagger(). Pure CSS @keyframes handles the two infinite glow loops (active agent pulse, blinking cursor). The Agent state model gains tasks[] and logs[] arrays backed by 5 new reducer actions. All section enrichments are self-contained within each section component.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vite, Anime.js v4

---

## File Map

**New files:**
- `summer-os/src/utils/colors.ts` — hexToRgba utility
- `summer-os/src/components/ParticleField.tsx` — canvas particle system
- `summer-os/src/hooks/useAnimeCountUp.ts` — Anime.js count-up for numbers
- `summer-os/src/hooks/useScrambleText.ts` — character-scramble text reveal
- `summer-os/src/hooks/useInView.ts` — IntersectionObserver mount trigger
- `summer-os/src/components/AgentRing.tsx` — SVG completion ring with strokeDashoffset animation
- `summer-os/src/components/ActivityLog.tsx` — terminal-style log feed with animated entries

**Modified files:**
- `summer-os/package.json` — add animejs
- `summer-os/src/index.css` — keyframes + section transition utilities
- `summer-os/src/App.tsx` — mount ParticleField, remove max-width, section transitions, sidebar fix
- `summer-os/src/components/StatCard.tsx` — tinted background + accent value text + glow
- `summer-os/src/components/ProgressBar.tsx` — Anime.js width animation on mount
- `summer-os/src/context/types.ts` — AgentTask, AgentLogEntry types; extend Agent
- `summer-os/src/context/reducer.ts` — 5 new actions + localStorage migration guard
- `summer-os/src/sections/AIOperations/AgentTracker.tsx` — full rebuild
- `summer-os/src/sections/AIOperations/Pipeline.tsx` — color tint + hover lift
- `summer-os/src/sections/Overview/index.tsx` — two-column grid, scramble, count-up, agent widget
- `summer-os/src/sections/HealthHub/index.tsx` — workout grid visual + weekly ring chart
- `summer-os/src/sections/BusinessCommand/index.tsx` — display-scale revenue count-up + venture bars
- `summer-os/src/sections/StudyHub/index.tsx` — topic rings + stagger sessions
- `summer-os/src/sections/SecondBrain/index.tsx` — stagger timeline + cyan capture glow

---

## Task 1: Install Anime.js and create hexToRgba utility

**Files:**
- Modify: `summer-os/package.json`
- Create: `summer-os/src/utils/colors.ts`

- [ ] **Step 1: Install animejs**

```bash
cd summer-os && npm install animejs
```

Expected output: `added 1 package` (or similar, no errors)

- [ ] **Step 2: Verify TypeScript types are bundled**

```bash
ls node_modules/animejs/lib/ | grep -i types
```

Expected: a `.d.ts` file (v4 ships types). If missing, run `npm install --save-dev @types/animejs`.

- [ ] **Step 3: Create the hexToRgba utility**

Create `summer-os/src/utils/colors.ts`:

```typescript
export function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
```

- [ ] **Step 4: Verify the utility types check**

```bash
cd summer-os && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
cd summer-os && git add package.json package-lock.json src/utils/colors.ts
git commit -m "feat: install animejs and add hexToRgba utility"
```

---

## Task 2: Add CSS keyframes and section transition utilities

**Files:**
- Modify: `summer-os/src/index.css`

- [ ] **Step 1: Add keyframes and transition classes**

Append to the end of `summer-os/src/index.css`:

```css
/* ── Section transitions ─────────────────────────────── */
@keyframes section-enter {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-enter {
  animation: section-enter 250ms cubic-bezier(0.25, 1, 0.5, 1) both;
}

/* ── Agent card glow loops ───────────────────────────── */
@keyframes glow-breathe-ai {
  0%, 100% {
    box-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 28px rgba(139, 92, 246, 0.65);
  }
}

@keyframes glow-breathe-testing {
  0%, 100% {
    box-shadow: 0 0 8px rgba(245, 158, 11, 0.3);
  }
  50% {
    box-shadow: 0 0 28px rgba(245, 158, 11, 0.65);
  }
}

/* ── Blinking cursor for active agent logs ───────────── */
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* ── Hover lift utility ──────────────────────────────── */
.hover-lift {
  transition: transform 150ms cubic-bezier(0.25, 1, 0.5, 1);
}
.hover-lift:hover {
  transform: translateY(-2px);
}
```

- [ ] **Step 2: Verify CSS builds without error**

```bash
cd summer-os && npm run build 2>&1 | tail -5
```

Expected: build succeeds, no CSS parse errors.

- [ ] **Step 3: Commit**

```bash
git add summer-os/src/index.css
git commit -m "feat: add section-enter, glow-breathe, and blink-cursor keyframes"
```

---

## Task 3: Create ParticleField component

**Files:**
- Create: `summer-os/src/components/ParticleField.tsx`

- [ ] **Step 1: Create the component**

Create `summer-os/src/components/ParticleField.tsx`:

```tsx
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = window.innerWidth >= 1200 ? 90 : 50;
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      color:
        Math.random() < 0.6
          ? 'rgba(139, 92, 246, 0.4)'
          : 'rgba(6, 182, 212, 0.3)',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - dist / 130) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
```

- [ ] **Step 2: Check types**

```bash
cd summer-os && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add summer-os/src/components/ParticleField.tsx
git commit -m "feat: add ParticleField canvas component"
```

---

## Task 4: Create animation hooks

**Files:**
- Create: `summer-os/src/hooks/useAnimeCountUp.ts`
- Create: `summer-os/src/hooks/useScrambleText.ts`
- Create: `summer-os/src/hooks/useInView.ts`

- [ ] **Step 1: Create useAnimeCountUp**

Create `summer-os/src/hooks/useAnimeCountUp.ts`:

```typescript
import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

export function useAnimeCountUp(target: number, duration = 900): number {
  const [displayed, setDisplayed] = useState(0);
  const obj = useRef({ val: 0 });

  useEffect(() => {
    obj.current.val = 0;
    setDisplayed(0);

    const anim = anime({
      targets: obj.current,
      val: target,
      duration,
      easing: 'easeOutQuart',
      onUpdate: () => {
        setDisplayed(Math.round(obj.current.val));
      },
      complete: () => {
        setDisplayed(target);
      },
    });

    return () => {
      anim.pause();
    };
  }, [target, duration]);

  return displayed;
}
```

- [ ] **Step 2: Create useScrambleText**

Create `summer-os/src/hooks/useScrambleText.ts`:

```typescript
import { useEffect, RefObject } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';

export function useScrambleText(
  ref: RefObject<HTMLElement | null>,
  text: string,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const totalFrames = 22;

    const id = setInterval(() => {
      frame++;
      const resolved = Math.floor((frame / totalFrames) * text.length);
      el.textContent = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < resolved) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      if (frame >= totalFrames) {
        el.textContent = text;
        clearInterval(id);
      }
    }, 28);

    return () => clearInterval(id);
  }, [text, enabled]);
}
```

- [ ] **Step 3: Create useInView**

Create `summer-os/src/hooks/useInView.ts`:

```typescript
import { useEffect, useRef, useState, RefObject } from 'react';

export function useInView(threshold = 0.1): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}
```

- [ ] **Step 4: Check types**

```bash
cd summer-os && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add summer-os/src/hooks/useAnimeCountUp.ts summer-os/src/hooks/useScrambleText.ts summer-os/src/hooks/useInView.ts
git commit -m "feat: add useAnimeCountUp, useScrambleText, useInView hooks"
```

---

## Task 5: Update App.tsx — layout, particle field, transitions, sidebar

**Files:**
- Modify: `summer-os/src/App.tsx`

The current `<main>` has `max-w-5xl mx-auto px-6 py-8` — remove it. The sidebar active state uses `borderLeft: 3px solid` — replace with background tint. Mount `ParticleField` at root. Wrap section output in a `key`-changing div for CSS transitions.

- [ ] **Step 1: Replace App.tsx**

Replace the full contents of `summer-os/src/App.tsx` with:

```tsx
import { useState, createContext, useContext } from 'react';
import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  BookOpen,
  Bot,
  Brain,
  Settings,
} from 'lucide-react';
import { AppProvider } from './context/AppContext';
import { useApp } from './hooks/useApp';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/Toast';
import { ParticleField } from './components/ParticleField';
import { Overview } from './sections/Overview';
import { HealthHub } from './sections/HealthHub';
import { BusinessCommand } from './sections/BusinessCommand';
import { StudyHub } from './sections/StudyHub';
import { AIOperations } from './sections/AIOperations';
import { SecondBrain } from './sections/SecondBrain';
import { SettingsPanel } from './sections/Settings';
import { exportState, importState } from './utils/localStorage';
import { hexToRgba } from './utils/colors';

type Section =
  | 'overview'
  | 'health'
  | 'business'
  | 'study'
  | 'ai'
  | 'brain'
  | 'settings';

interface ToastContextValue {
  showToast: (msg: string) => void;
}

export const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });
export function useShowToast() {
  return useContext(ToastContext).showToast;
}

const NAV_ITEMS: { id: Section; label: string; icon: React.ElementType; accent: string }[] = [
  { id: 'overview',  label: 'Overview',     icon: LayoutDashboard, accent: '#f1f5f9' },
  { id: 'health',    label: 'Health Hub',   icon: Activity,        accent: '#10b981' },
  { id: 'business',  label: 'Business',     icon: TrendingUp,      accent: '#f59e0b' },
  { id: 'study',     label: 'Study Hub',    icon: BookOpen,        accent: '#3b82f6' },
  { id: 'ai',        label: 'AI Ops',       icon: Bot,             accent: '#8b5cf6' },
  { id: 'brain',     label: 'Second Brain', icon: Brain,           accent: '#06b6d4' },
];

function Sidebar({
  active,
  onSelect,
  collapsed,
}: {
  active: Section;
  onSelect: (s: Section) => void;
  collapsed: boolean;
}) {
  return (
    <aside
      className="flex flex-col bg-surface border-r border-white/5 h-full flex-shrink-0"
      style={{ width: collapsed ? 60 : 220, zIndex: 10, position: 'relative' }}
    >
      {!collapsed && (
        <div className="px-5 py-5 border-b border-white/5">
          <span className="text-light font-bold text-sm tracking-widest uppercase">Summer OS</span>
          <span className="text-dim text-xs block mt-0.5">2026</span>
        </div>
      )}
      {collapsed && <div className="h-[68px] border-b border-white/5" />}

      <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all duration-150 w-full text-left group relative"
              style={
                isActive
                  ? {
                      backgroundColor: hexToRgba(item.accent, 0.2),
                      color: item.accent,
                    }
                  : {}
              }
            >
              <Icon
                size={16}
                className="flex-shrink-0"
                style={{
                  color: isActive ? item.accent : '#94a3b8',
                  filter: isActive ? `drop-shadow(0 0 6px ${item.accent})` : undefined,
                }}
              />
              {!collapsed && (
                <span style={{ color: isActive ? item.accent : '#94a3b8' }}>
                  {item.label}
                </span>
              )}
              {!isActive && (
                <style>{`button:hover .nav-label-${item.id} { color: #f1f5f9; }`}</style>
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-card text-light text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="py-3 px-2 border-t border-white/5">
        <button
          onClick={() => onSelect('settings')}
          title={collapsed ? 'Settings' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all duration-150 w-full text-left group relative"
          style={
            active === 'settings'
              ? { backgroundColor: hexToRgba('#94a3b8', 0.2), color: '#94a3b8' }
              : {}
          }
        >
          <Settings
            size={16}
            className="flex-shrink-0"
            style={{ color: active === 'settings' ? '#94a3b8' : '#64748b' }}
          />
          {!collapsed && (
            <span style={{ color: active === 'settings' ? '#94a3b8' : '#64748b' }}>
              Settings
            </span>
          )}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-card text-light text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Settings
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}

function AppInner() {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const { toasts, showToast } = useToast();
  const { state, dispatch } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleExport = () => {
    exportState(state);
    showToast('Backup downloaded');
  };

  const handleImport = async (file: File) => {
    try {
      const imported = await importState(file);
      dispatch({ type: 'LOAD_STATE', state: imported });
      showToast('Data imported successfully');
    } catch {
      showToast('Import failed — invalid file');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all data? This cannot be undone.')) {
      dispatch({ type: 'RESET_STATE' });
      showToast('Data reset to defaults');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':  return <Overview onNavigate={setActiveSection} />;
      case 'health':    return <HealthHub />;
      case 'business':  return <BusinessCommand />;
      case 'study':     return <StudyHub />;
      case 'ai':        return <AIOperations />;
      case 'brain':     return <SecondBrain />;
      case 'settings':  return (
        <SettingsPanel
          onExport={handleExport}
          onImport={handleImport}
          onReset={handleReset}
        />
      );
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="flex h-full bg-deep" style={{ position: 'relative' }}>
        <ParticleField />

        <div className="hidden md:block h-full" style={{ position: 'relative', zIndex: 10 }}>
          <Sidebar
            active={activeSection}
            onSelect={setActiveSection}
            collapsed={sidebarCollapsed}
          />
        </div>

        <button
          onClick={() => setSidebarCollapsed(c => !c)}
          className="hidden md:flex fixed bottom-6 left-4 z-40 items-center justify-center w-6 h-6 rounded bg-card text-dim hover:text-light transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? '›' : '‹'}
        </button>

        <main className="flex-1 overflow-y-auto" style={{ position: 'relative', zIndex: 1 }}>
          <div key={activeSection} className="section-enter px-6 py-6">
            {renderSection()}
          </div>
        </main>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-white/5 flex" style={{ zIndex: 20 }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-colors"
                style={isActive ? { color: item.accent } : { color: '#94a3b8' }}
              >
                <Icon size={18} />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
```

Note: `Overview` now accepts an `onNavigate` prop (added in Task 14). Until Task 14 is done, temporarily keep the old Overview signature or add `onNavigate?: (s: string) => void` to the existing Overview props and ignore it.

- [ ] **Step 2: Check types**

```bash
cd summer-os && npx tsc --noEmit
```

If there's an error about `onNavigate` on Overview, open `src/sections/Overview/index.tsx` and add `onNavigate?: (s: string) => void` to the function signature (don't use it yet — that comes in Task 14).

- [ ] **Step 3: Run dev server and verify**

```bash
cd summer-os && npm run dev
```

Open the app. Verify:
- Particle field is visible (drifting purple/cyan particles with connection lines)
- Sidebar active state shows a tinted background with glowing icon — no left border stripe
- Content fills the full width after the sidebar (no narrow column with dead margins)
- Switching sections triggers a slide-up fade-in transition

- [ ] **Step 4: Commit**

```bash
git add summer-os/src/App.tsx
git commit -m "feat: full-bleed layout, particle field, section transitions, sidebar fix"
```

---

## Task 6: Update StatCard — tinted background + accent value text + glow

**Files:**
- Modify: `summer-os/src/components/StatCard.tsx`

- [ ] **Step 1: Replace StatCard**

Replace `summer-os/src/components/StatCard.tsx`:

```tsx
import { hexToRgba } from '../utils/colors';

interface StatCardProps {
  label: string;
  value: string | number;
  accent: string;
  sub?: string;
}

export function StatCard({ label, value, accent, sub }: StatCardProps) {
  return (
    <div
      className="rounded p-5 flex flex-col gap-1 hover-lift cursor-default"
      style={{
        backgroundColor: hexToRgba(accent, 0.12),
        borderTop: `3px solid ${accent}`,
      }}
    >
      <span className="text-dim text-xs font-medium uppercase tracking-widest">{label}</span>
      <span
        className="text-2xl font-bold leading-tight"
        style={{
          color: accent,
          textShadow: `0 0 20px ${accent}`,
        }}
      >
        {value}
      </span>
      {sub && <span className="text-dim text-xs">{sub}</span>}
    </div>
  );
}
```

- [ ] **Step 2: Run dev server and verify**

```bash
cd summer-os && npm run dev
```

Open Overview. The stat grid should now show colored cards — health stats with emerald tint, business with amber tint. Metric values should glow in their section color.

- [ ] **Step 3: Commit**

```bash
git add summer-os/src/components/StatCard.tsx
git commit -m "feat: StatCard tinted background and glowing accent value text"
```

---

## Task 7: Update ProgressBar — Anime.js animated fill

**Files:**
- Modify: `summer-os/src/components/ProgressBar.tsx`

- [ ] **Step 1: Replace ProgressBar**

Replace `summer-os/src/components/ProgressBar.tsx`:

```tsx
import { useEffect, useRef } from 'react';
import anime from 'animejs';

interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
  height?: number;
  showLabel?: boolean;
}

export function ProgressBar({ value, max, color, height = 8, showLabel = false }: ProgressBarProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    el.style.width = '0%';
    anime({
      targets: el,
      width: `${pct}%`,
      duration: 600,
      easing: 'easeOutQuart',
      delay: 150,
    });
  }, [pct]);

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 bg-surface rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          ref={fillRef}
          className="h-full rounded-full"
          style={{ width: '0%', backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="text-dim text-xs w-10 text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
cd summer-os && npm run dev
```

Navigate to Study Hub. The E&M progress bar should animate from 0% to its actual value on mount.

- [ ] **Step 3: Commit**

```bash
git add summer-os/src/components/ProgressBar.tsx
git commit -m "feat: ProgressBar animates fill width on mount via Anime.js"
```

---

## Task 8: Extend Agent types and reducer

**Files:**
- Modify: `summer-os/src/context/types.ts`
- Modify: `summer-os/src/context/reducer.ts`

- [ ] **Step 1: Add AgentTask and AgentLogEntry types; extend Agent**

In `summer-os/src/context/types.ts`, add the two new interfaces before `Agent`, then extend `Agent`:

```typescript
export interface AgentTask {
  id: string;
  text: string;
  done: boolean;
}

export interface AgentLogEntry {
  id: string;
  ts: string;
  text: string;
}
```

Replace the existing `Agent` interface:

```typescript
export interface Agent {
  id: string;
  name: string;
  purpose: string;
  ventureId: string;
  status: AgentStatus;
  notes: string;
  lastRun: string;
  tasks: AgentTask[];
  logs: AgentLogEntry[];
}
```

Add the five new action types to the `AppAction` union (after `| { type: 'DELETE_AGENT'; id: string }`):

```typescript
  | { type: 'ADD_AGENT_TASK'; agentId: string; task: AgentTask }
  | { type: 'TOGGLE_AGENT_TASK'; agentId: string; taskId: string }
  | { type: 'DELETE_AGENT_TASK'; agentId: string; taskId: string }
  | { type: 'ADD_AGENT_LOG'; agentId: string; entry: AgentLogEntry }
  | { type: 'DELETE_AGENT_LOG'; agentId: string; entryId: string }
```

- [ ] **Step 2: Add migration helper and new reducer cases**

In `summer-os/src/context/reducer.ts`, add a migration helper after the imports:

```typescript
function migrateAgent(agent: Agent): Agent {
  return {
    tasks: [],
    logs: [],
    ...agent,
  };
}
```

Find the existing `ADD_AGENT` and `UPDATE_AGENT` cases and update them to apply migration:

```typescript
case 'ADD_AGENT':
  return {
    ...state,
    ai: { ...state.ai, agents: [...state.ai.agents, migrateAgent(action.agent)] },
  };

case 'UPDATE_AGENT':
  return {
    ...state,
    ai: {
      ...state.ai,
      agents: state.ai.agents.map(a =>
        a.id === action.agent.id ? migrateAgent(action.agent) : a
      ),
    },
  };
```

Also update the `LOAD_STATE` case to migrate existing agents from localStorage:

```typescript
case 'LOAD_STATE':
  return {
    ...action.state,
    ai: {
      ...action.state.ai,
      agents: action.state.ai.agents.map(migrateAgent),
    },
  };
```

Add the five new cases to the reducer switch (before the `default`):

```typescript
case 'ADD_AGENT_TASK':
  return {
    ...state,
    ai: {
      ...state.ai,
      agents: state.ai.agents.map(a =>
        a.id === action.agentId
          ? { ...a, tasks: [...a.tasks, action.task] }
          : a
      ),
    },
  };

case 'TOGGLE_AGENT_TASK':
  return {
    ...state,
    ai: {
      ...state.ai,
      agents: state.ai.agents.map(a =>
        a.id === action.agentId
          ? {
              ...a,
              tasks: a.tasks.map(t =>
                t.id === action.taskId ? { ...t, done: !t.done } : t
              ),
            }
          : a
      ),
    },
  };

case 'DELETE_AGENT_TASK':
  return {
    ...state,
    ai: {
      ...state.ai,
      agents: state.ai.agents.map(a =>
        a.id === action.agentId
          ? { ...a, tasks: a.tasks.filter(t => t.id !== action.taskId) }
          : a
      ),
    },
  };

case 'ADD_AGENT_LOG':
  return {
    ...state,
    ai: {
      ...state.ai,
      agents: state.ai.agents.map(a =>
        a.id === action.agentId
          ? { ...a, logs: [...a.logs, action.entry] }
          : a
      ),
    },
  };

case 'DELETE_AGENT_LOG':
  return {
    ...state,
    ai: {
      ...state.ai,
      agents: state.ai.agents.map(a =>
        a.id === action.agentId
          ? { ...a, logs: a.logs.filter(l => l.id !== action.entryId) }
          : a
      ),
    },
  };
```

- [ ] **Step 3: Check types compile**

```bash
cd summer-os && npx tsc --noEmit
```

Expected: no errors. If AgentTracker.tsx or Pipeline.tsx complain about the updated Agent type, it's because they reference agent properties. Those files get rebuilt in Task 11 — for now add `// @ts-ignore` above any line that errors, or just let the type error sit until Task 11 resolves it.

- [ ] **Step 4: Commit**

```bash
git add summer-os/src/context/types.ts summer-os/src/context/reducer.ts
git commit -m "feat: extend Agent type with tasks/logs, add 5 reducer actions"
```

---

## Task 9: Create AgentRing component

**Files:**
- Create: `summer-os/src/components/AgentRing.tsx`

- [ ] **Step 1: Create the component**

Create `summer-os/src/components/AgentRing.tsx`:

```tsx
import { useEffect, useRef } from 'react';
import anime from 'animejs';

interface AgentRingProps {
  percent: number;
  color: string;
  size?: number;
  pulse?: boolean;
  pulseClass?: string;
}

export function AgentRing({ percent, color, size = 120, pulse = false, pulseClass }: AgentRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (percent / 100) * circumference;

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;

    el.style.strokeDasharray = String(circumference);
    el.style.strokeDashoffset = String(circumference);

    anime({
      targets: el,
      strokeDashoffset: [circumference, targetOffset],
      duration: 800,
      easing: 'easeOutQuart',
      delay: 200,
    });
  }, [circumference, targetOffset]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}
      className={pulse && pulseClass ? pulseClass : undefined}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={8}
      />
      <circle
        ref={circleRef}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
      />
    </svg>
  );
}
```

- [ ] **Step 2: Check types**

```bash
cd summer-os && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add summer-os/src/components/AgentRing.tsx
git commit -m "feat: AgentRing SVG component with strokeDashoffset animation"
```

---

## Task 10: Create ActivityLog component

**Files:**
- Create: `summer-os/src/components/ActivityLog.tsx`

- [ ] **Step 1: Create the component**

Create `summer-os/src/components/ActivityLog.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import anime from 'animejs';
import type { AgentLogEntry } from '../context/types';

interface ActivityLogProps {
  entries: AgentLogEntry[];
  isActive: boolean;
  onAdd: (text: string) => void;
  onDelete: (entryId: string) => void;
  accentColor: string;
}

export function ActivityLog({ entries, isActive, onAdd, onDelete, accentColor }: ActivityLogProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastEntryRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(entries.length);

  useEffect(() => {
    if (entries.length > prevCountRef.current && lastEntryRef.current) {
      anime({
        targets: lastEntryRef.current,
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 200,
        easing: 'easeOutQuart',
      });
    }
    prevCountRef.current = entries.length;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      <div
        className="flex-1 overflow-y-auto rounded p-3 space-y-2"
        style={{ background: '#0f1117', maxHeight: 180 }}
      >
        {entries.length === 0 && (
          <p className="text-xs" style={{ color: '#475569' }}>No log entries yet.</p>
        )}
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            ref={i === entries.length - 1 ? lastEntryRef : undefined}
            className="flex gap-2 group items-start"
          >
            <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: '#475569' }}>
              {new Date(entry.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-xs flex-1 leading-relaxed" style={{ color: '#94a3b8' }}>
              {entry.text}
            </span>
            <button
              onClick={() => onDelete(entry.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              style={{ color: '#64748b' }}
            >
              <Trash2 size={10} />
            </button>
          </div>
        ))}
        {isActive && entries.length > 0 && (
          <span
            className="text-xs"
            style={{
              color: accentColor,
              animation: 'blink-cursor 1s step-end infinite',
            }}
          >
            |
          </span>
        )}
        <div ref={bottomRef} />
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Log entry... (Enter)"
        className="mt-2 w-full bg-surface border border-white/10 rounded text-xs px-3 py-2 focus:outline-none transition-colors"
        style={{ color: '#f1f5f9' }}
        onFocus={e => { e.target.style.borderColor = accentColor; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Check types**

```bash
cd summer-os && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add summer-os/src/components/ActivityLog.tsx
git commit -m "feat: ActivityLog terminal-style feed with animated entry insertion"
```

---

## Task 11: Rebuild AgentTracker

**Files:**
- Modify: `summer-os/src/sections/AIOperations/AgentTracker.tsx`

- [ ] **Step 1: Replace AgentTracker.tsx**

Replace the full contents of `summer-os/src/sections/AIOperations/AgentTracker.tsx`:

```tsx
import { useState, useRef } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useShowToast } from '../../App';
import { useScrambleText } from '../../hooks/useScrambleText';
import { AgentRing } from '../../components/AgentRing';
import { ActivityLog } from '../../components/ActivityLog';
import { hexToRgba } from '../../utils/colors';
import { todayStr } from '../../utils/dates';
import type { AgentStatus, Agent, AgentTask, AgentLogEntry } from '../../context/types';

const STATUSES: AgentStatus[] = ['Active', 'Paused', 'Testing', 'Deployed'];

const STATUS_COLORS: Record<AgentStatus, string> = {
  Active:   '#8b5cf6',
  Deployed: '#3b82f6',
  Testing:  '#f59e0b',
  Paused:   '#94a3b8',
};

const STATUS_GLOW_CLASS: Record<AgentStatus, string | undefined> = {
  Active:   'agent-glow-ai',
  Testing:  'agent-glow-testing',
  Deployed: undefined,
  Paused:   undefined,
};

function AgentCard({ agent }: { agent: Agent }) {
  const { dispatch } = useApp();
  const showToast = useShowToast();
  const nameRef = useRef<HTMLSpanElement>(null);
  const [taskInput, setTaskInput] = useState('');

  useScrambleText(nameRef, agent.name, true);

  const color = STATUS_COLORS[agent.status];
  const glowClass = STATUS_GLOW_CLASS[agent.status];
  const completedCount = agent.tasks.filter(t => t.done).length;
  const taskPercent = agent.tasks.length > 0
    ? Math.round((completedCount / agent.tasks.length) * 100)
    : 0;

  const handleStatusChange = (status: AgentStatus) => {
    dispatch({ type: 'UPDATE_AGENT', agent: { ...agent, status } });
    showToast(`Status: ${status}`);
  };

  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    const task: AgentTask = { id: Date.now().toString(), text: taskInput.trim(), done: false };
    dispatch({ type: 'ADD_AGENT_TASK', agentId: agent.id, task });
    setTaskInput('');
  };

  const handleAddLog = (text: string) => {
    const entry: AgentLogEntry = { id: Date.now().toString(), ts: new Date().toISOString(), text };
    dispatch({ type: 'ADD_AGENT_LOG', agentId: agent.id, entry });
  };

  return (
    <div
      className="rounded p-5"
      style={{
        borderTop: `3px solid ${color}`,
        backgroundColor: hexToRgba(color, agent.status === 'Active' ? 0.18 : agent.status === 'Paused' ? 0.05 : 0.12),
        animation: glowClass === 'agent-glow-ai'
          ? 'glow-breathe-ai 2s ease-in-out infinite'
          : glowClass === 'agent-glow-testing'
          ? 'glow-breathe-testing 3s ease-in-out infinite'
          : undefined,
      }}
    >
      <div className="grid gap-5" style={{ gridTemplateColumns: '120px 1fr 1fr' }}>

        {/* Left — Ring */}
        <div className="flex flex-col items-center gap-2">
          <AgentRing
            percent={taskPercent}
            color={color}
            size={120}
            pulse={agent.status === 'Active'}
          />
          <div className="flex flex-col items-center gap-1">
            <select
              value={agent.status}
              onChange={e => handleStatusChange(e.target.value as AgentStatus)}
              className="bg-surface border border-white/10 rounded text-xs px-2 py-1 focus:outline-none w-full text-center"
              style={{ color }}
            >
              {STATUSES.map(s => (
                <option key={s} value={s} style={{ color: STATUS_COLORS[s] }}>{s}</option>
              ))}
            </select>
            {agent.status === 'Deployed' && (
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ color: '#3b82f6', background: hexToRgba('#3b82f6', 0.15) }}>
                LIVE
              </span>
            )}
          </div>
        </div>

        {/* Center — Content */}
        <div className="flex flex-col gap-3">
          <div>
            <span
              ref={nameRef}
              className="font-semibold text-base"
              style={{ color: '#f1f5f9' }}
            >
              {agent.name}
            </span>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#94a3b8' }}>
              {agent.purpose}
            </p>
            {agent.ventureId && (
              <p className="text-xs mt-0.5" style={{ color }}>
                {agent.ventureId}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#64748b' }}>
                Tasks
              </span>
              {agent.tasks.length > 0 && (
                <span className="text-xs font-semibold" style={{ color }}>
                  {completedCount}/{agent.tasks.length}
                </span>
              )}
            </div>
            {agent.tasks.map(task => (
              <div key={task.id} className="flex items-center gap-2 group">
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_AGENT_TASK', agentId: agent.id, taskId: task.id })}
                  className="w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors"
                  style={{
                    borderColor: task.done ? color : 'rgba(255,255,255,0.2)',
                    background: task.done ? color : 'transparent',
                  }}
                >
                  {task.done && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4l2 2 4-4" stroke="#0f1117" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                <span
                  className="text-xs flex-1"
                  style={{
                    color: task.done ? '#64748b' : '#94a3b8',
                    textDecoration: task.done ? 'line-through' : undefined,
                  }}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => dispatch({ type: 'DELETE_AGENT_TASK', agentId: agent.id, taskId: task.id })}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#475569' }}
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
            <div className="flex gap-1 mt-1">
              <input
                type="text"
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); }}
                placeholder="Add task..."
                className="flex-1 bg-surface border border-white/10 rounded text-xs px-2 py-1 focus:outline-none transition-colors"
                style={{ color: '#f1f5f9' }}
              />
              <button
                onClick={handleAddTask}
                className="rounded px-2 py-1 text-xs transition-colors"
                style={{ background: hexToRgba(color, 0.2), color }}
              >
                <Plus size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Right — Activity Log */}
        <ActivityLog
          entries={agent.logs}
          isActive={agent.status === 'Active'}
          accentColor={color}
          onAdd={handleAddLog}
          onDelete={entryId => dispatch({ type: 'DELETE_AGENT_LOG', agentId: agent.id, entryId })}
        />
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs" style={{ color: '#475569' }}>
          Last run: {agent.lastRun || 'Never'}
        </span>
        <button
          onClick={() => { dispatch({ type: 'DELETE_AGENT', id: agent.id }); showToast('Agent removed'); }}
          className="text-xs transition-colors flex items-center gap-1"
          style={{ color: '#475569' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#475569'; }}
        >
          <Trash2 size={11} /> Remove
        </button>
      </div>
    </div>
  );
}

const EMPTY_FORM = {
  name: '',
  purpose: '',
  ventureId: '',
  status: 'Active' as AgentStatus,
  notes: '',
  lastRun: '',
};

export function AgentTracker() {
  const { state, dispatch } = useApp();
  const showToast = useShowToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM, ventureId: state.business.ventures[0]?.id ?? '', lastRun: todayStr() });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    dispatch({
      type: 'ADD_AGENT',
      agent: {
        id: Date.now().toString(),
        ...form,
        name: form.name.trim(),
        purpose: form.purpose.trim(),
        tasks: [],
        logs: [],
      },
    });
    setForm({ ...EMPTY_FORM, ventureId: state.business.ventures[0]?.id ?? '', lastRun: todayStr() });
    setShowForm(false);
    showToast('Agent added');
  };

  return (
    <div className="space-y-4">
      {state.ai.agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} />
      ))}

      {showForm ? (
        <div className="bg-card rounded p-5 space-y-3" style={{ borderTop: '3px solid #8b5cf6' }}>
          <p className="text-dim text-xs uppercase tracking-widest font-medium">New Agent</p>
          <input
            type="text"
            placeholder="Agent name"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-ai transition-colors"
          />
          <input
            type="text"
            placeholder="Purpose / description"
            value={form.purpose}
            onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))}
            className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-ai transition-colors"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.ventureId}
              onChange={e => setForm(p => ({ ...p, ventureId: e.target.value }))}
              className="bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-ai transition-colors"
            >
              <option value="">No venture</option>
              {state.business.ventures.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            <select
              value={form.status}
              onChange={e => setForm(p => ({ ...p, status: e.target.value as AgentStatus }))}
              className="bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-ai transition-colors"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-light text-deep text-sm font-medium py-2 rounded hover:bg-ai hover:text-light transition-all duration-150">
              Add Agent
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-dim text-sm rounded bg-surface hover:text-light transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 border border-dashed border-white/10 rounded text-dim text-sm hover:border-ai/50 hover:text-ai transition-all duration-150"
        >
          + Add Agent
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Check types**

```bash
cd summer-os && npx tsc --noEmit
```

- [ ] **Step 3: Run dev server and test the agent tracker**

```bash
cd summer-os && npm run dev
```

Navigate to AI Ops → Agents. Add an agent. Verify:
- Three-column layout: ring / tasks / log
- Ring animates in from 0% on card mount
- Name scrambles on appearance
- Adding tasks updates the ring percentage
- Adding log entries animates them in from the bottom
- Active agents show the glow-breathe animation and blinking cursor

- [ ] **Step 4: Commit**

```bash
git add summer-os/src/sections/AIOperations/AgentTracker.tsx
git commit -m "feat: rebuild AgentTracker with ring, task list, and live activity log"
```

---

## Task 12: Update Pipeline tab — color tint and hover lift

**Files:**
- Modify: `summer-os/src/sections/AIOperations/Pipeline.tsx`

- [ ] **Step 1: Read the current file to understand its structure**

Open `summer-os/src/sections/AIOperations/Pipeline.tsx`. Find every `bg-card` className on pipeline item/card divs.

- [ ] **Step 2: Add tint background and hover-lift to pipeline cards**

For every card div that uses `className="bg-card rounded p-..."`, change it to:

```tsx
<div
  className="rounded p-5 hover-lift cursor-default"
  style={{
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderTop: '3px solid #8b5cf6',
  }}
>
```

If the card already has an inline `style` prop, merge the new properties into it.

- [ ] **Step 3: Verify**

```bash
cd summer-os && npm run dev
```

Navigate to AI Ops → Pipeline. Cards should have a purple tint and lift slightly on hover.

- [ ] **Step 4: Commit**

```bash
git add summer-os/src/sections/AIOperations/Pipeline.tsx
git commit -m "feat: Pipeline cards get purple tint and hover lift"
```

---

## Task 13: Update Overview — two-column, scramble greeting, count-up stats, agent widget

**Files:**
- Modify: `summer-os/src/sections/Overview/index.tsx`

- [ ] **Step 1: Replace Overview/index.tsx**

Replace the full contents of `summer-os/src/sections/Overview/index.tsx`:

```tsx
import { useMemo, useRef } from 'react';
import { useApp } from '../../hooks/useApp';
import { StatCard } from '../../components/StatCard';
import { ProgressBar } from '../../components/ProgressBar';
import { AgentRing } from '../../components/AgentRing';
import { useAnimeCountUp } from '../../hooks/useAnimeCountUp';
import { useScrambleText } from '../../hooks/useScrambleText';
import { summerCountdown, timeGreeting, todayStr, getWeekKey } from '../../utils/dates';

const GYM_SPLIT: Record<string, string> = {
  Monday: 'Chest — Strength',
  Tuesday: 'Pull — Rear Delts',
  Wednesday: 'Push — Hypertrophy',
  Thursday: 'Legs',
  Friday: 'Rest',
  Saturday: 'Chest/Back',
  Sunday: 'Shoulders/Arms',
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface OverviewProps {
  onNavigate: (section: string) => void;
}

export function Overview({ onNavigate }: OverviewProps) {
  const { state } = useApp();
  const today = todayStr();
  const dayName = DAYS[new Date().getDay()];
  const { daysRemaining, weeksRemaining, percentElapsed } = summerCountdown();
  const greeting = timeGreeting();
  const weekKey = getWeekKey();

  const greetingRef = useRef<HTMLSpanElement>(null);
  useScrambleText(greetingRef, `${greeting}, Michael.`);

  const daysCount = useAnimeCountUp(daysRemaining);
  const percentCount = useAnimeCountUp(percentElapsed);

  const todayNutrition = state.health.nutrition[today];
  const weekWorkouts = state.health.weekLog[weekKey] ?? {};
  const workoutsThisWeek = Object.values(weekWorkouts).filter(s => s === 'done').length;
  const todayWorkoutStatus = weekWorkouts[dayName];
  const todayWorkout = GYM_SPLIT[dayName];

  const calCount = useAnimeCountUp(todayNutrition?.cal ?? 0);
  const proCount = useAnimeCountUp(todayNutrition?.pro ?? 0);
  const workoutsCount = useAnimeCountUp(workoutsThisWeek);

  const totalRevenue = useMemo(
    () => state.business.ventures.reduce((sum, v) => sum + v.revenue.reduce((s, r) => s + r.amount, 0), 0),
    [state.business.ventures]
  );
  const revenueCount = useAnimeCountUp(totalRevenue);

  const completedTopics = state.academic.topics.filter(t => t.completed).length;
  const topicsCount = useAnimeCountUp(completedTopics);
  const sessionsCount = useAnimeCountUp(state.academic.sessions.length);
  const notesCount = useAnimeCountUp(state.brain.notes.length);

  const priorities: string[] = [];
  if (!todayNutrition) priorities.push("Log today's nutrition");
  if (dayName !== 'Friday' && todayWorkoutStatus !== 'done') priorities.push(`Mark today's workout (${todayWorkout})`);
  if (!state.brain.dailyNotes[today]) priorities.push("Write today's insight");

  const activeAgents = state.ai.agents.filter(a => a.status === 'Active' || a.status === 'Testing');

  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
      {/* ── Left column ─────────────────────────────── */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-light">
            <span ref={greetingRef}>{greeting}, Michael.</span>
          </h1>
          <p className="text-dim text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Summer countdown */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Days Remaining" value={daysCount} accent="#f1f5f9" sub={`${weeksRemaining} weeks left`} />
          <StatCard label="Summer Elapsed" value={`${percentCount}%`} accent="#f1f5f9" />
        </div>

        {/* Health */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Today's Workout"
            value={todayWorkout}
            accent="#10b981"
            sub={todayWorkoutStatus === 'done' ? 'Done' : todayWorkoutStatus === 'missed' ? 'Missed' : 'Pending'}
          />
          <StatCard label="Workouts This Week" value={`${workoutsCount} / 6`} accent="#10b981" />
        </div>

        {/* Nutrition + Business + Study + Brain */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Calories Today"
            value={todayNutrition ? calCount.toLocaleString() : '—'}
            accent="#10b981"
            sub={todayNutrition ? `${proCount}g protein` : 'Not logged'}
          />
          <StatCard label="Summer Revenue" value={`$${revenueCount.toLocaleString()}`} accent="#f59e0b" />
          <StatCard label="Study Sessions" value={sessionsCount} accent="#3b82f6" sub={`${topicsCount}/12 topics done`} />
          <StatCard label="Brain Notes" value={notesCount} accent="#06b6d4" />
        </div>

        {/* Priorities */}
        {priorities.length > 0 && (
          <div className="rounded p-5" style={{ backgroundColor: 'rgba(245,158,11,0.12)', borderTop: '3px solid #f59e0b' }}>
            <p className="text-dim text-xs uppercase tracking-widest font-medium mb-3">Today's Priorities</p>
            <ul className="space-y-2">
              {priorities.map((p, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-light">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#f59e0b' }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Active agents mini-widget */}
        {activeAgents.length > 0 && (
          <div className="rounded p-4" style={{ backgroundColor: 'rgba(139,92,246,0.12)', borderTop: '3px solid #8b5cf6' }}>
            <p className="text-xs uppercase tracking-widest font-medium mb-3" style={{ color: '#94a3b8' }}>
              Active Agents
            </p>
            <div className="space-y-3">
              {activeAgents.map(agent => {
                const done = agent.tasks.filter(t => t.done).length;
                const pct = agent.tasks.length > 0 ? Math.round((done / agent.tasks.length) * 100) : 0;
                return (
                  <button
                    key={agent.id}
                    onClick={() => onNavigate('ai')}
                    className="flex items-center gap-3 w-full text-left hover-lift"
                  >
                    <AgentRing percent={pct} color="#8b5cf6" size={44} />
                    <div>
                      <p className="text-sm font-medium text-light">{agent.name}</p>
                      <p className="text-xs" style={{ color: '#8b5cf6' }}>
                        {agent.tasks.length > 0 ? `${done}/${agent.tasks.length} tasks` : agent.status}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Right column ─────────────────────────────── */}
      <div className="space-y-6">
        {/* Ventures */}
        <div className="rounded p-5" style={{ backgroundColor: 'rgba(245,158,11,0.12)', borderTop: '3px solid #f59e0b' }}>
          <p className="text-dim text-xs uppercase tracking-widest font-medium mb-4">Ventures</p>
          <div className="space-y-3">
            {state.business.ventures.map(v => {
              const total = v.revenue.reduce((s, r) => s + r.amount, 0);
              return (
                <div key={v.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-light text-sm font-medium">{v.name}</p>
                    <p className="text-dim text-xs">{v.stage}</p>
                  </div>
                  <span className="font-bold text-sm" style={{ color: '#f59e0b' }}>
                    ${total.toLocaleString()}
                  </span>
                </div>
              );
            })}
            {state.business.ventures.length === 0 && (
              <p className="text-dim text-sm">No ventures yet</p>
            )}
          </div>
        </div>

        {/* E&M Progress */}
        <div className="rounded p-5" style={{ backgroundColor: 'rgba(59,130,246,0.12)', borderTop: '3px solid #3b82f6' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-dim text-xs uppercase tracking-widest font-medium">E&amp;M Progress</p>
            <span className="text-sm font-bold" style={{ color: '#3b82f6' }}>{completedTopics}/12</span>
          </div>
          <ProgressBar value={completedTopics} max={12} color="#3b82f6" showLabel />
          <div className="mt-4 space-y-2">
            {state.academic.topics.slice(0, 8).map(t => (
              <div key={t.id} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{
                    background: t.completed ? '#3b82f6' : 'transparent',
                    border: t.completed ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                <span className="text-xs" style={{ color: t.completed ? '#94a3b8' : '#64748b', textDecoration: t.completed ? 'line-through' : undefined }}>
                  {t.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Check types**

```bash
cd summer-os && npx tsc --noEmit
```

- [ ] **Step 3: Run dev server and verify**

Open the app on Overview. Verify:
- Two-column layout fills the full width
- Greeting scrambles on load
- Stat numbers count up from 0
- Colored tinted cards per section (emerald health, amber business, etc.)
- Agent mini-widget appears if any Active/Testing agents exist
- Progress bar animates in

- [ ] **Step 4: Commit**

```bash
git add summer-os/src/sections/Overview/index.tsx
git commit -m "feat: Overview two-column grid, scramble greeting, count-up stats, agent widget"
```

---

## Task 14: Update HealthHub — workout grid visual and weekly ring chart

**Files:**
- Modify: `summer-os/src/sections/HealthHub/index.tsx`

- [ ] **Step 1: Read the current file**

Open `summer-os/src/sections/HealthHub/index.tsx` and identify where the weekly workout log is displayed and where the main stat cards are.

- [ ] **Step 2: Add WorkoutWeekGrid component at the top of the file**

Add this component before the `HealthHub` export:

```tsx
import { AgentRing } from '../../components/AgentRing';
import { useAnimeCountUp } from '../../hooks/useAnimeCountUp';
import { hexToRgba } from '../../utils/colors';

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function WorkoutWeekGrid({ weekLog }: { weekLog: Record<string, string | null> }) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {WEEK_DAYS.map((day, i) => {
        const status = weekLog[day];
        return (
          <div key={day} className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium" style={{ color: '#64748b' }}>{SHORT[i]}</span>
            <div
              className="w-full rounded"
              style={{
                height: 36,
                background:
                  status === 'done'
                    ? hexToRgba('#10b981', 0.7)
                    : status === 'missed'
                    ? 'rgba(239, 68, 68, 0.3)'
                    : 'rgba(255,255,255,0.04)',
                border:
                  status === 'done'
                    ? '1px solid #10b981'
                    : status === 'missed'
                    ? '1px solid rgba(239,68,68,0.4)'
                    : '1px solid rgba(255,255,255,0.07)',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Add the WorkoutWeekGrid and ring chart to the HealthHub render**

Inside the HealthHub component, find where `weekWorkouts` or `weekLog` is used. Add the `WorkoutWeekGrid` above or below the existing workout stat cards, and replace the "Workouts This Week" StatCard with an AgentRing + count:

```tsx
const workoutCount = useAnimeCountUp(workoutsThisWeek);

{/* Workout week grid */}
<div className="bg-card rounded p-5" style={{ borderTop: '3px solid #10b981' }}>
  <div className="flex items-center justify-between mb-4">
    <p className="text-dim text-xs uppercase tracking-widest font-medium">This Week</p>
    <div className="flex items-center gap-3">
      <AgentRing percent={Math.round((workoutsThisWeek / 6) * 100)} color="#10b981" size={52} />
      <span className="text-2xl font-bold" style={{ color: '#10b981', textShadow: '0 0 20px #10b981' }}>
        {workoutCount}/6
      </span>
    </div>
  </div>
  <WorkoutWeekGrid weekLog={weekWorkouts} />
</div>
```

- [ ] **Step 4: Verify**

```bash
cd summer-os && npm run dev
```

Navigate to Health Hub. The 7-day grid should show colored fills — emerald for done, red-tinted for missed, empty for pending.

- [ ] **Step 5: Commit**

```bash
git add summer-os/src/sections/HealthHub/index.tsx
git commit -m "feat: HealthHub workout grid visual and weekly ring chart"
```

---

## Task 15: Update BusinessCommand — display-scale revenue count-up and venture proportion bars

**Files:**
- Modify: `summer-os/src/sections/BusinessCommand/index.tsx`

- [ ] **Step 1: Read the current file**

Open `summer-os/src/sections/BusinessCommand/index.tsx`. Find where total revenue is computed and where ventures are listed.

- [ ] **Step 2: Add display-scale revenue header**

Add this at the top of the BusinessCommand section render, before the existing tabs or venture list:

```tsx
import { useAnimeCountUp } from '../../hooks/useAnimeCountUp';

// Inside BusinessCommand component:
const totalRevenue = state.business.ventures.reduce(
  (sum, v) => sum + v.revenue.reduce((s, r) => s + r.amount, 0), 0
);
const revenueCount = useAnimeCountUp(totalRevenue);

// In the JSX, above any existing tabs:
<div className="mb-6 rounded p-6" style={{ backgroundColor: 'rgba(245,158,11,0.12)', borderTop: '3px solid #f59e0b' }}>
  <p className="text-dim text-xs uppercase tracking-widest font-medium mb-1">Summer Revenue</p>
  <p
    className="text-5xl font-bold leading-none"
    style={{ color: '#f59e0b', textShadow: '0 0 28px #f59e0b' }}
  >
    ${revenueCount.toLocaleString()}
  </p>
</div>
```

- [ ] **Step 3: Add proportion bars to venture cards**

Find each venture card in the VentureManager or the main render. After the venture name and stage, add a proportion bar:

```tsx
// compute outside the map:
const grandTotal = state.business.ventures.reduce(
  (sum, v) => sum + v.revenue.reduce((s, r) => s + r.amount, 0), 0
);

// inside each venture card:
const ventureTotal = v.revenue.reduce((s, r) => s + r.amount, 0);
const proportion = grandTotal > 0 ? (ventureTotal / grandTotal) * 100 : 0;

<div className="mt-2">
  <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
    <div
      className="h-full rounded-full transition-all duration-700"
      style={{ width: `${proportion}%`, background: '#f59e0b' }}
    />
  </div>
</div>
```

- [ ] **Step 4: Verify**

```bash
cd summer-os && npm run dev
```

Navigate to Business Command. The large amber revenue total should count up on section entry.

- [ ] **Step 5: Commit**

```bash
git add summer-os/src/sections/BusinessCommand/index.tsx
git commit -m "feat: BusinessCommand display-scale revenue count-up and venture proportion bars"
```

---

## Task 16: Update StudyHub — topic rings and staggered session entries

**Files:**
- Modify: `summer-os/src/sections/StudyHub/index.tsx`

- [ ] **Step 1: Read the current file**

Open `summer-os/src/sections/StudyHub/index.tsx`. Find where topics are listed (they currently use a checkbox-square style span).

- [ ] **Step 2: Replace checkbox spans with topic rings**

Find the topic list rendering. Replace the `<span className="w-3 h-3 rounded-sm ...">` with:

```tsx
import { AgentRing } from '../../components/AgentRing';

// For each topic:
<AgentRing
  percent={t.completed ? 100 : 0}
  color="#3b82f6"
  size={32}
/>
```

- [ ] **Step 3: Add stagger animation to session log entries**

Find where study sessions are mapped to a list. Wrap the session list container:

```tsx
import { useEffect, useRef } from 'react';
import anime from 'animejs';

// Add inside the component that renders sessions:
const listRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!listRef.current) return;
  const items = listRef.current.querySelectorAll('.session-item');
  anime({
    targets: items,
    opacity: [0, 1],
    translateY: [12, 0],
    delay: anime.stagger(60),
    duration: 300,
    easing: 'easeOutQuart',
  });
}, []);

// Wrap the session list:
<div ref={listRef}>
  {sessions.map(s => (
    <div key={s.id} className="session-item ...">
      {/* existing session content */}
    </div>
  ))}
</div>
```

- [ ] **Step 4: Verify**

```bash
cd summer-os && npm run dev
```

Navigate to Study Hub. Topics should show small blue rings (filled for completed, empty for pending). Session list entries should stagger in.

- [ ] **Step 5: Commit**

```bash
git add summer-os/src/sections/StudyHub/index.tsx
git commit -m "feat: StudyHub topic rings and staggered session entries"
```

---

## Task 17: Update SecondBrain — staggered timeline and cyan capture glow

**Files:**
- Modify: `summer-os/src/sections/SecondBrain/index.tsx`

- [ ] **Step 1: Read the current file**

Open `summer-os/src/sections/SecondBrain/index.tsx`. Find where brain notes or timeline entries are rendered, and where the quick capture input is.

- [ ] **Step 2: Add stagger animation to note entries**

Add stagger animation to the notes list:

```tsx
import { useEffect, useRef } from 'react';
import anime from 'animejs';

const notesRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!notesRef.current) return;
  const items = notesRef.current.querySelectorAll('.note-item');
  anime({
    targets: items,
    opacity: [0, 1],
    translateX: [-16, 0],
    delay: anime.stagger(55),
    duration: 280,
    easing: 'easeOutQuart',
  });
}, []);

// Wrap the note list:
<div ref={notesRef}>
  {notes.map(n => (
    <div key={n.id} className="note-item ...">
      {/* existing content */}
    </div>
  ))}
</div>
```

- [ ] **Step 3: Add cyan focus glow to the capture input**

Find the quick capture textarea or input. Add inline focus handlers:

```tsx
<textarea
  // ...existing props
  onFocus={e => {
    e.currentTarget.style.borderColor = '#06b6d4';
    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(6, 182, 212, 0.35)';
  }}
  onBlur={e => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
    e.currentTarget.style.boxShadow = 'none';
  }}
/>
```

- [ ] **Step 4: Verify**

```bash
cd summer-os && npm run dev
```

Navigate to Second Brain. Note entries should slide in from the left with stagger. The capture input should show a cyan glow on focus.

- [ ] **Step 5: Final type check and build**

```bash
cd summer-os && npx tsc --noEmit && npm run build
```

Expected: zero type errors, build succeeds.

- [ ] **Step 6: Commit**

```bash
git add summer-os/src/sections/SecondBrain/index.tsx
git commit -m "feat: SecondBrain staggered notes and cyan capture glow"
```

---

## Task 18: Final visual QA pass

- [ ] **Step 1: Start dev server and review all 6 sections**

```bash
cd summer-os && npm run dev
```

For each section, verify:

| Check | Overview | Health | Business | Study | AI Ops | Brain |
|---|---|---|---|---|---|---|
| Full-bleed layout (no narrow column) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Section-colored card tints visible | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Key metrics glow in accent color | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Particle field visible in background | ✓ | | | | | |
| Section transition animates on nav | ✓ | | | | | |
| Sidebar active = tint fill, no left border | ✓ | | | | | |

- [ ] **Step 2: Test the agent tracker end-to-end**

In AI Ops → Agents:
1. Add a new agent with name, purpose, and venture
2. Confirm name scrambles on card appearance
3. Confirm ring animates from 0%
4. Add 3 tasks; toggle one done — confirm ring updates to 33%
5. Add 2 log entries; confirm each slides in from bottom
6. Switch status to Active — confirm glow-breathe animation and blinking cursor appear
7. Switch to Paused — confirm glow stops, card dims
8. Confirm mini-widget on Overview shows the agent

- [ ] **Step 3: Fix any visual issues found**

For each issue: fix inline, then commit with `git commit -m "fix: ..."`.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: dashboard overhaul complete — particles, motion, color, gamified agents"
```

---

## Self-Review Notes

**Spec coverage check:**

| Spec section | Covered by task |
|---|---|
| Full-bleed layout | Task 5 |
| Particle field | Task 3 |
| Sidebar side-stripe fix | Task 5 |
| Section transitions | Task 5 + Task 2 |
| Three-tier color per section | Task 6 (StatCard), Task 5 (sidebar), Task 13+ (per section) |
| Glowing metrics | Task 6 |
| Count-up numbers | Task 4 + Task 13 |
| Progress bar animation | Task 7 |
| Scramble text | Task 4 + Task 13 (greeting) + Task 11 (agent name) |
| Agent type extensions | Task 8 |
| Reducer new actions | Task 8 |
| AgentRing component | Task 9 |
| ActivityLog component | Task 10 |
| AgentTracker rebuild | Task 11 |
| Agent status visual states | Task 11 |
| Agent glow-breathe | Task 2 + Task 11 |
| Agent mini-widget on Overview | Task 13 |
| Overview two-column | Task 13 |
| HealthHub workout grid | Task 14 |
| BusinessCommand revenue count-up | Task 15 |
| StudyHub topic rings | Task 16 |
| StudyHub stagger | Task 16 |
| AIOperations Pipeline tint | Task 12 |
| SecondBrain stagger | Task 17 |
| SecondBrain cyan glow | Task 17 |
