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
