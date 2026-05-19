import { useMemo } from 'react';
import { useApp } from '../../hooks/useApp';
import { StatCard } from '../../components/StatCard';
import { ProgressBar } from '../../components/ProgressBar';
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

export function Overview() {
  const { state } = useApp();
  const today = todayStr();
  const dayName = DAYS[new Date().getDay()];
  const { daysRemaining, weeksRemaining, percentElapsed } = summerCountdown();
  const greeting = timeGreeting();
  const weekKey = getWeekKey();

  const todayNutrition = state.health.nutrition[today];
  const weekWorkouts = state.health.weekLog[weekKey] ?? {};
  const workoutsThisWeek = Object.values(weekWorkouts).filter(s => s === 'done').length;
  const todayWorkoutStatus = weekWorkouts[dayName];
  const todayWorkout = GYM_SPLIT[dayName];

  const totalRevenue = useMemo(() =>
    state.business.ventures.reduce((sum, v) =>
      sum + v.revenue.reduce((s, r) => s + r.amount, 0), 0
    ), [state.business.ventures]);

  const completedTopics = state.academic.topics.filter(t => t.completed).length;

  const priorities: string[] = [];
  if (!todayNutrition) priorities.push('Log today\'s nutrition');
  if (dayName !== 'Friday' && todayWorkoutStatus !== 'done') priorities.push(`Mark today\'s workout (${todayWorkout})`);
  if (!state.brain.dailyNotes[today]) priorities.push('Write today\'s insight');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-light">
          {greeting}, Michael.
        </h1>
        <p className="text-dim text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Days Remaining"
          value={daysRemaining}
          accent="#f1f5f9"
          sub={`${weeksRemaining} weeks left`}
        />
        <StatCard
          label="Summer Elapsed"
          value={`${percentElapsed}%`}
          accent="#f1f5f9"
        />
        <StatCard
          label="Today's Workout"
          value={todayWorkout}
          accent="#10b981"
          sub={todayWorkoutStatus === 'done' ? 'Done' : todayWorkoutStatus === 'missed' ? 'Missed' : 'Pending'}
        />
        <StatCard
          label="Workouts This Week"
          value={`${workoutsThisWeek} / 6`}
          accent="#10b981"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Calories Today"
          value={todayNutrition ? todayNutrition.cal.toLocaleString() : '—'}
          accent="#10b981"
          sub={todayNutrition ? `${todayNutrition.pro}g protein` : 'Not logged'}
        />
        <StatCard
          label="Summer Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          accent="#f59e0b"
        />
        <StatCard
          label="Study Sessions"
          value={state.academic.sessions.length}
          accent="#3b82f6"
          sub={`${completedTopics}/12 topics done`}
        />
        <StatCard
          label="Brain Notes"
          value={state.brain.notes.length}
          accent="#06b6d4"
        />
      </div>

      {priorities.length > 0 && (
        <div className="bg-card rounded p-5" style={{ borderTop: '3px solid #f59e0b' }}>
          <p className="text-dim text-xs uppercase tracking-widest font-medium mb-3">
            Today's Priorities
          </p>
          <ul className="space-y-2">
            {priorities.map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-light">
                <span className="w-1.5 h-1.5 rounded-full bg-business flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded p-5" style={{ borderTop: '3px solid #f59e0b' }}>
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
                  <span className="text-business font-bold text-sm">${total.toLocaleString()}</span>
                </div>
              );
            })}
            {state.business.ventures.length === 0 && (
              <p className="text-dim text-sm">No ventures yet</p>
            )}
          </div>
        </div>

        <div className="bg-card rounded p-5" style={{ borderTop: '3px solid #3b82f6' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-dim text-xs uppercase tracking-widest font-medium">E&amp;M Progress</p>
            <span className="text-academic text-sm font-bold">{completedTopics}/12</span>
          </div>
          <ProgressBar value={completedTopics} max={12} color="#3b82f6" showLabel />
          <div className="mt-4 space-y-2">
            {state.academic.topics.slice(0, 6).map(t => (
              <div key={t.id} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-sm flex-shrink-0 ${t.completed ? 'bg-academic' : 'bg-surface border border-white/10'}`} />
                <span className={`text-xs ${t.completed ? 'text-light line-through' : 'text-dim'}`}>
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
