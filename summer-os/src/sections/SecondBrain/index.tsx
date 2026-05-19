import { useMemo } from 'react';
import { useApp } from '../../hooks/useApp';
import { SectionHeader } from '../../components/SectionHeader';
import { StatCard } from '../../components/StatCard';
import { QuickCapture } from './QuickCapture';
import { Timeline } from './Timeline';
import { todayStr, getISOWeekStart } from '../../utils/dates';
import type { NoteTag } from '../../context/types';

const TAG_COLORS: Record<NoteTag, string> = {
  lesson: '#3b82f6',
  mistake: '#ef4444',
  win: '#10b981',
  idea: '#f59e0b',
  observation: '#8b5cf6',
};

export function SecondBrain() {
  const { state, dispatch } = useApp();
  const today = todayStr();
  const weekStart = getISOWeekStart(today);

  const dailyNote = state.brain.dailyNotes[today] ?? '';

  const notesThisWeek = useMemo(() => {
    return state.brain.notes.filter(n => n.ts.split('T')[0] >= weekStart).length;
  }, [state.brain.notes, weekStart]);

  const mostUsedTag = useMemo((): string => {
    if (state.brain.notes.length === 0) return '—';
    const counts: Record<string, number> = {};
    state.brain.notes.forEach(n => { counts[n.tag] = (counts[n.tag] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  }, [state.brain.notes]);

  const streak = useMemo(() => {
    let count = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().split('T')[0];
      const hasNote = state.brain.notes.some(n => n.ts.startsWith(key));
      const hasInsight = !!state.brain.dailyNotes[key];
      if (!hasNote && !hasInsight) break;
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [state.brain.notes, state.brain.dailyNotes]);

  const handleInsightChange = (value: string) => {
    dispatch({ type: 'UPDATE_DAILY_NOTE', date: today, text: value });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Second Brain" accent="#06b6d4" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="This Week" value={notesThisWeek} accent="#06b6d4" sub="notes" />
        <StatCard label="Total Notes" value={state.brain.notes.length} accent="#06b6d4" />
        <StatCard
          label="Top Tag"
          value={mostUsedTag !== '—' ? `#${mostUsedTag}` : '—'}
          accent={mostUsedTag !== '—' ? TAG_COLORS[mostUsedTag as NoteTag] : '#94a3b8'}
        />
        <StatCard label="Daily Streak" value={`${streak}d`} accent="#06b6d4" />
      </div>

      <div className="bg-card rounded p-5 space-y-3" style={{ borderTop: '3px solid #06b6d4' }}>
        <p className="text-dim text-xs uppercase tracking-widest font-medium">
          Today's Insight
          <span className="text-dim normal-case ml-2 tracking-normal font-normal">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </p>
        <textarea
          value={dailyNote}
          onChange={e => handleInsightChange(e.target.value)}
          placeholder="What's the most important thing you learned or realized today?"
          rows={4}
          className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2.5 resize-none focus:outline-none focus:border-brain transition-colors"
        />
        {dailyNote && (
          <p className="text-dim text-xs">Auto-saved</p>
        )}
      </div>

      <QuickCapture />

      <div>
        <p className="text-dim text-xs uppercase tracking-widest font-medium mb-4">Timeline</p>
        <Timeline />
      </div>
    </div>
  );
}
