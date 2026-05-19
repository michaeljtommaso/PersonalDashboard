import { useState } from 'react';
import { Trash2, Globe } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useShowToast } from '../../App';
import type { VentureStage } from '../../context/types';

const STAGES: VentureStage[] = ['Idea', 'Building', 'Testing', 'Running', 'Profitable'];
const STAGE_COLORS: Record<VentureStage, string> = {
  Idea: '#94a3b8',
  Building: '#3b82f6',
  Testing: '#f59e0b',
  Running: '#10b981',
  Profitable: '#10b981',
};

export function VentureManager() {
  const { state, dispatch } = useApp();
  const showToast = useShowToast();
  const [form, setForm] = useState({ name: '', category: '', website: '', stage: 'Idea' as VentureStage });
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    if (!form.name.trim()) return;
    dispatch({
      type: 'ADD_VENTURE',
      venture: {
        id: Date.now().toString(),
        name: form.name.trim(),
        category: form.category.trim(),
        website: form.website.trim(),
        stage: form.stage,
        startDate: new Date().toISOString().split('T')[0],
        revenue: [],
      },
    });
    setForm({ name: '', category: '', website: '', stage: 'Idea' });
    setShowForm(false);
    showToast('Venture added');
  };

  const grandTotal = state.business.ventures.reduce(
    (sum, v) => sum + v.revenue.reduce((s, r) => s + r.amount, 0), 0
  );

  return (
    <div className="space-y-4">
      {state.business.ventures.map(v => {
        const total = v.revenue.reduce((s, r) => s + r.amount, 0);
        const proportion = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
        return (
          <div key={v.id} className="bg-card rounded p-5" style={{ borderTop: `3px solid ${STAGE_COLORS[v.stage]}` }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-light font-semibold">{v.name}</h3>
                <p className="text-dim text-xs mt-0.5">{v.category}</p>
                {v.website && (
                  <a
                    href={`https://${v.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dim text-xs flex items-center gap-1 mt-1 hover:text-light transition-colors"
                  >
                    <Globe size={10} />
                    {v.website}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-business font-bold text-lg">${total.toLocaleString()}</span>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${v.name}"?`)) {
                      dispatch({ type: 'DELETE_VENTURE', id: v.id });
                      showToast('Venture deleted');
                    }
                  }}
                  className="text-dim hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              {STAGES.map(s => (
                <button
                  key={s}
                  onClick={() => {
                    dispatch({ type: 'UPDATE_VENTURE_STAGE', id: v.id, stage: s });
                    showToast(`Stage updated to ${s}`);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    v.stage === s
                      ? 'text-deep'
                      : 'bg-surface text-dim hover:text-light'
                  }`}
                  style={v.stage === s ? { backgroundColor: STAGE_COLORS[s] } : undefined}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${proportion}%`, background: '#f59e0b' }}
                />
              </div>
            </div>
          </div>
        );
      })}

      {showForm ? (
        <div className="bg-card rounded p-5 space-y-3" style={{ borderTop: '3px solid #f59e0b' }}>
          <input
            type="text"
            placeholder="Venture name"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-business transition-colors"
          />
          <input
            type="text"
            placeholder="Category (e.g. SaaS, Freelance)"
            value={form.category}
            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-business transition-colors"
          />
          <input
            type="text"
            placeholder="Website (optional)"
            value={form.website}
            onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
            className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-business transition-colors"
          />
          <select
            value={form.stage}
            onChange={e => setForm(p => ({ ...p, stage: e.target.value as VentureStage }))}
            className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-business transition-colors"
          >
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-light text-deep text-sm font-medium py-2 rounded hover:bg-business hover:text-light transition-all duration-150">
              Add Venture
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-dim text-sm rounded bg-surface hover:text-light transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 border border-dashed border-white/10 rounded text-dim text-sm hover:border-business/50 hover:text-business transition-all duration-150"
        >
          + Add Venture
        </button>
      )}
    </div>
  );
}
