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
