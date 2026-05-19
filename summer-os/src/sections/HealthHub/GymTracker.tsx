import { useApp } from '../../hooks/useApp';
import { useShowToast } from '../../App';
import { getWeekKey } from '../../utils/dates';
import type { WorkoutStatus } from '../../context/types';
import { AgentRing } from '../../components/AgentRing';
import { useAnimeCountUp } from '../../hooks/useAnimeCountUp';
import { hexToRgba } from '../../utils/colors';

const WORKOUT_SPLIT: Record<string, { name: string; emoji: string }> = {
  Monday: { name: 'Chest — Strength (Low Volume)', emoji: '🏋️' },
  Tuesday: { name: 'Pull — Rear Delts', emoji: '💪' },
  Wednesday: { name: 'Push — Hypertrophy (Higher Volume)', emoji: '🔥' },
  Thursday: { name: 'Legs', emoji: '🦵' },
  Friday: { name: 'Rest', emoji: '😴' },
  Saturday: { name: 'Chest/Back — Back Focused', emoji: '🏋️' },
  Sunday: { name: 'Shoulders/Arms — Rear Delts', emoji: '💪' },
};

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

function nextStatus(current: WorkoutStatus): WorkoutStatus {
  if (current === null) return 'done';
  if (current === 'done') return 'missed';
  return null;
}

export function GymTracker() {
  const { state, dispatch } = useApp();
  const showToast = useShowToast();
  const weekKey = getWeekKey();
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const weekLog = state.health.weekLog[weekKey] ?? {};

  const doneCount = Object.values(weekLog).filter(s => s === 'done').length;
  const workoutsThisWeek = doneCount;
  const completionPct = Math.round((doneCount / 6) * 100);
  const workoutCount = useAnimeCountUp(workoutsThisWeek);

  const allWeekKeys = Object.keys(state.health.weekLog).sort().reverse();

  const handleToggle = (day: string) => {
    const current = weekLog[day] ?? null;
    const next = nextStatus(current);
    dispatch({ type: 'LOG_WORKOUT', weekKey, day, status: next });
    if (next === 'done') showToast(`${day} marked done`);
    else if (next === 'missed') showToast(`${day} marked missed`);
    else showToast(`${day} cleared`);
  };

  return (
    <div className="space-y-6">
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
        <WorkoutWeekGrid weekLog={weekLog} />
      </div>

      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-health">{doneCount}</p>
          <p className="text-dim text-xs mt-0.5">this week</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-light">{completionPct}%</p>
          <p className="text-dim text-xs mt-0.5">complete</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {WEEK_DAYS.map(day => {
          const workout = WORKOUT_SPLIT[day];
          const status = weekLog[day] ?? null;
          const isToday = day === todayName;
          const isRest = day === 'Friday';

          let bgColor = 'bg-card hover:bg-white/10';
          let textColor = 'text-dim';
          if (status === 'done') { bgColor = 'bg-health/20'; textColor = 'text-health'; }
          if (status === 'missed') { bgColor = 'bg-red-500/20'; textColor = 'text-red-400'; }

          return (
            <button
              key={day}
              onClick={() => !isRest && handleToggle(day)}
              disabled={isRest}
              className={`
                ${bgColor} rounded p-3 text-left transition-all duration-150
                ${isRest ? 'cursor-default opacity-50' : 'cursor-pointer'}
                ${isToday ? 'ring-1 ring-health/50' : ''}
              `}
            >
              <p className={`text-xs font-medium ${textColor}`}>{day.slice(0, 3)}</p>
              <p className="text-lg mt-1">{workout.emoji}</p>
              <p className="text-dim text-xs mt-1 leading-tight">{workout.name.split('—')[0].trim()}</p>
              {status && (
                <p className={`text-xs font-medium mt-1 capitalize ${status === 'done' ? 'text-health' : 'text-red-400'}`}>
                  {status}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {allWeekKeys.length > 0 && (
        <div>
          <p className="text-dim text-xs uppercase tracking-widest font-medium mb-3">History</p>
          <div className="space-y-2">
            {allWeekKeys.map(wk => {
              const log = state.health.weekLog[wk];
              const done = Object.values(log).filter(s => s === 'done').length;
              const missed = Object.values(log).filter(s => s === 'missed').length;
              return (
                <div key={wk} className="flex items-center justify-between text-sm bg-card rounded px-4 py-2.5">
                  <span className="text-dim">Week of {wk}</span>
                  <div className="flex gap-4">
                    <span className="text-health">{done} done</span>
                    {missed > 0 && <span className="text-red-400">{missed} missed</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
