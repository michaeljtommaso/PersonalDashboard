import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useShowToast } from '../../App';
import { SectionHeader } from '../../components/SectionHeader';
import { Pipeline } from './Pipeline';
import { AgentTracker } from './AgentTracker';

type Tab = 'pipeline' | 'agents' | 'observations';

const TABS: { id: Tab; label: string }[] = [
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'agents', label: 'Agents' },
  { id: 'observations', label: 'Observations' },
];

function ObservationsLog() {
  const { state, dispatch } = useApp();
  const showToast = useShowToast();
  const [text, setText] = useState('');

  const handleLog = () => {
    if (!text.trim()) return;
    dispatch({
      type: 'LOG_OBSERVATION',
      observation: {
        id: Date.now().toString(),
        ts: new Date().toISOString(),
        text: text.trim(),
      },
    });
    setText('');
    showToast('Observation logged');
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded p-5 space-y-3" style={{ borderTop: '3px solid #8b5cf6' }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Record an agent observation, win, mistake, or unexpected output..."
          rows={3}
          className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 resize-none focus:outline-none focus:border-ai transition-colors"
        />
        <button
          onClick={handleLog}
          className="w-full bg-light text-deep text-sm font-medium py-2.5 rounded hover:bg-ai hover:text-light transition-all duration-150"
        >
          Log Observation
        </button>
      </div>

      <div className="space-y-2">
        {state.ai.observations.map(o => (
          <div key={o.id} className="bg-card rounded px-4 py-3 flex gap-3">
            <div className="flex-1">
              <p className="text-dim text-xs mb-1">
                {new Date(o.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-light text-sm leading-relaxed">{o.text}</p>
            </div>
            <button
              onClick={() => {
                dispatch({ type: 'DELETE_OBSERVATION', id: o.id });
                showToast('Deleted');
              }}
              className="text-dim hover:text-red-400 transition-colors flex-shrink-0 mt-1"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {state.ai.observations.length === 0 && (
          <p className="text-dim text-sm text-center py-8">No observations yet</p>
        )}
      </div>
    </div>
  );
}

export function AIOperations() {
  const [tab, setTab] = useState<Tab>('pipeline');

  return (
    <div>
      <SectionHeader title="AI Operations" accent="#8b5cf6" />

      <div className="flex gap-1 mb-6 bg-surface rounded p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-150 ${
              tab === t.id
                ? 'bg-ai text-light'
                : 'text-dim hover:text-light'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'pipeline' && <Pipeline />}
      {tab === 'agents' && <AgentTracker />}
      {tab === 'observations' && <ObservationsLog />}
    </div>
  );
}
