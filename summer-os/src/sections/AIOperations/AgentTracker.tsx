import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useShowToast } from '../../App';
import { todayStr } from '../../utils/dates';
import type { AgentStatus } from '../../context/types';

const STATUSES: AgentStatus[] = ['Active', 'Paused', 'Testing', 'Deployed'];

const STATUS_COLORS: Record<AgentStatus, string> = {
  Active: '#10b981',
  Deployed: '#3b82f6',
  Testing: '#f59e0b',
  Paused: '#94a3b8',
};

export function AgentTracker() {
  const { state, dispatch } = useApp();
  const showToast = useShowToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    purpose: '',
    ventureId: state.business.ventures[0]?.id ?? '',
    status: 'Active' as AgentStatus,
    notes: '',
    lastRun: todayStr(),
  });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    dispatch({
      type: 'ADD_AGENT',
      agent: { id: Date.now().toString(), ...form, name: form.name.trim(), purpose: form.purpose.trim() },
    });
    setForm(p => ({ ...p, name: '', purpose: '', notes: '' }));
    setShowForm(false);
    showToast('Agent added');
  };

  const handleStatusChange = (id: string, status: AgentStatus) => {
    const agent = state.ai.agents.find(a => a.id === id);
    if (!agent) return;
    dispatch({ type: 'UPDATE_AGENT', agent: { ...agent, status } });
    showToast(`Status: ${status}`);
  };

  return (
    <div className="space-y-4">
      {state.ai.agents.map(agent => {
        const venture = state.business.ventures.find(v => v.id === agent.ventureId);
        return (
          <div key={agent.id} className="bg-card rounded p-5" style={{ borderTop: `3px solid ${STATUS_COLORS[agent.status]}` }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-light font-semibold">{agent.name}</p>
                <p className="text-dim text-xs mt-0.5">{agent.purpose}</p>
                {venture && <p className="text-ai text-xs mt-1">{venture.name}</p>}
              </div>
              <button
                onClick={() => {
                  dispatch({ type: 'DELETE_AGENT', id: agent.id });
                  showToast('Agent removed');
                }}
                className="text-dim hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <select
                value={agent.status}
                onChange={e => handleStatusChange(agent.id, e.target.value as AgentStatus)}
                className="bg-surface border border-white/10 rounded text-sm px-3 py-1.5 focus:outline-none focus:border-ai transition-colors"
                style={{ color: STATUS_COLORS[agent.status] }}
              >
                {STATUSES.map(s => (
                  <option key={s} value={s} style={{ color: STATUS_COLORS[s] }}>{s}</option>
                ))}
              </select>
              <span className="text-dim text-xs">Last run: {agent.lastRun || 'Never'}</span>
            </div>
            {agent.notes && (
              <p className="text-dim text-xs mt-2 italic">{agent.notes}</p>
            )}
          </div>
        );
      })}

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
            placeholder="Purpose"
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
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Notes"
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              className="bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-ai transition-colors"
            />
            <input
              type="date"
              value={form.lastRun}
              onChange={e => setForm(p => ({ ...p, lastRun: e.target.value }))}
              className="bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-ai transition-colors"
            />
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
