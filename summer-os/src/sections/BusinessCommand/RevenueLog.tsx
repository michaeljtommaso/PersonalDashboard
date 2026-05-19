import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useShowToast } from '../../App';
import { todayStr, formatDate } from '../../utils/dates';

export function RevenueLog() {
  const { state, dispatch } = useApp();
  const showToast = useShowToast();
  const [form, setForm] = useState({
    ventureId: state.business.ventures[0]?.id ?? '',
    date: todayStr(),
    amount: '',
    source: '',
    notes: '',
  });

  const allEntries = state.business.ventures
    .flatMap(v => v.revenue.map(r => ({ ...r, ventureName: v.name })))
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleLog = () => {
    if (!form.ventureId || !form.amount) return;
    dispatch({
      type: 'LOG_REVENUE',
      ventureId: form.ventureId,
      entry: {
        id: Date.now().toString(),
        ventureId: form.ventureId,
        date: form.date,
        amount: parseFloat(form.amount),
        source: form.source.trim(),
        notes: form.notes.trim(),
      },
    });
    setForm(p => ({ ...p, amount: '', source: '', notes: '' }));
    showToast('Revenue logged');
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded p-5 space-y-3" style={{ borderTop: '3px solid #f59e0b' }}>
        <p className="text-dim text-xs uppercase tracking-widest font-medium">Log Revenue</p>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.ventureId}
            onChange={e => setForm(p => ({ ...p, ventureId: e.target.value }))}
            className="bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-business transition-colors"
          >
            {state.business.ventures.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
            className="bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-business transition-colors"
          />
          <input
            type="number"
            placeholder="Amount ($)"
            value={form.amount}
            onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
            className="bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-business transition-colors"
          />
          <input
            type="text"
            placeholder="Source"
            value={form.source}
            onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
            className="bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-business transition-colors"
          />
        </div>
        <input
          type="text"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
          className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-business transition-colors"
        />
        <button
          onClick={handleLog}
          className="w-full bg-light text-deep text-sm font-medium py-2.5 rounded hover:bg-business hover:text-light transition-all duration-150"
        >
          Log Revenue
        </button>
      </div>

      {allEntries.length > 0 && (
        <div className="space-y-2">
          {allEntries.map(entry => (
            <div key={entry.id} className="flex items-center justify-between bg-card rounded px-4 py-3">
              <div>
                <p className="text-light text-sm font-medium">{entry.source || 'Revenue'}</p>
                <p className="text-dim text-xs">{entry.ventureName} · {formatDate(entry.date)}</p>
                {entry.notes && <p className="text-dim text-xs italic">{entry.notes}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-business font-bold">${entry.amount.toLocaleString()}</span>
                <button
                  onClick={() => {
                    dispatch({ type: 'DELETE_REVENUE', ventureId: entry.ventureId, entryId: entry.id });
                    showToast('Entry deleted');
                  }}
                  className="text-dim hover:text-red-400 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {allEntries.length === 0 && (
        <p className="text-dim text-sm text-center py-8">No revenue logged yet</p>
      )}
    </div>
  );
}
