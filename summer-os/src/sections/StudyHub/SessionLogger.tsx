import { useState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useShowToast } from '../../App';
import { todayStr, formatDate } from '../../utils/dates';
import { animate, stagger } from 'animejs';

export function SessionLogger() {
  const { state, dispatch } = useApp();
  const showToast = useShowToast();
  const [form, setForm] = useState({
    date: todayStr(),
    topicId: state.academic.topics[0]?.id ?? '',
    duration: '',
    notes: '',
  });

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('.session-item');
    animate(items, {
      opacity: [0, 1],
      translateY: [12, 0],
      delay: stagger(60),
      duration: 300,
      easing: 'easeOutQuart',
    });
  }, []);

  const totalMinutes = state.academic.sessions.reduce((s, sess) => s + sess.duration, 0);
  const avgMinutes = state.academic.sessions.length > 0
    ? Math.round(totalMinutes / state.academic.sessions.length)
    : 0;

  const handleLog = () => {
    if (!form.topicId || !form.duration) return;
    const topic = state.academic.topics.find(t => t.id === form.topicId);
    if (!topic) return;
    dispatch({
      type: 'LOG_SESSION',
      session: {
        id: Date.now().toString(),
        date: form.date,
        topicId: form.topicId,
        topicName: topic.name,
        duration: parseInt(form.duration),
        notes: form.notes.trim(),
      },
    });
    setForm(p => ({ ...p, duration: '', notes: '' }));
    showToast('Session logged');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded p-4" style={{ borderTop: '3px solid #3b82f6' }}>
          <p className="text-dim text-xs uppercase tracking-widest mb-1">Total Time</p>
          <p className="text-light text-2xl font-bold">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</p>
        </div>
        <div className="bg-card rounded p-4" style={{ borderTop: '3px solid #3b82f6' }}>
          <p className="text-dim text-xs uppercase tracking-widest mb-1">Avg Session</p>
          <p className="text-light text-2xl font-bold">{avgMinutes}m</p>
        </div>
      </div>

      <div className="bg-card rounded p-5 space-y-3" style={{ borderTop: '3px solid #3b82f6' }}>
        <p className="text-dim text-xs uppercase tracking-widest font-medium">Log Session</p>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={form.date}
            onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
            className="bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-academic transition-colors"
          />
          <input
            type="number"
            placeholder="Duration (min)"
            value={form.duration}
            onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
            className="bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-academic transition-colors"
          />
        </div>
        <select
          value={form.topicId}
          onChange={e => setForm(p => ({ ...p, topicId: e.target.value }))}
          className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-academic transition-colors"
        >
          {state.academic.topics.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
          className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-academic transition-colors"
        />
        <button
          onClick={handleLog}
          className="w-full bg-light text-deep text-sm font-medium py-2.5 rounded hover:bg-academic hover:text-light transition-all duration-150"
        >
          Log Session
        </button>
      </div>

      {state.academic.sessions.length > 0 && (
        <div className="space-y-2">
          <p className="text-dim text-xs uppercase tracking-widest font-medium">History</p>
          <div ref={listRef} className="space-y-2">
          {state.academic.sessions.map(s => (
            <div key={s.id} className="session-item flex items-center justify-between bg-card rounded px-4 py-3">
              <div>
                <p className="text-light text-sm font-medium">{s.topicName}</p>
                <p className="text-dim text-xs">{formatDate(s.date)}{s.notes ? ` · ${s.notes}` : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-academic font-medium text-sm">{s.duration}m</span>
                <button
                  onClick={() => {
                    dispatch({ type: 'DELETE_SESSION', id: s.id });
                    showToast('Session deleted');
                  }}
                  className="text-dim hover:text-red-400 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}
