import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useShowToast } from '../../App';

function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: i <= level ? '#3b82f6' : '#1e2235' }}
        />
      ))}
    </div>
  );
}

export function TopicList() {
  const { state, dispatch } = useApp();
  const showToast = useShowToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});

  const completed = state.academic.topics.filter(t => t.completed).length;

  const handleToggle = (id: string, name: string) => {
    dispatch({ type: 'TOGGLE_TOPIC', id });
    const topic = state.academic.topics.find(t => t.id === id);
    showToast(topic?.completed ? `${name} unmarked` : `${name} complete`);
  };

  const handleSaveNotes = (id: string) => {
    const notes = noteDraft[id] ?? state.academic.topics.find(t => t.id === id)?.notes ?? '';
    dispatch({ type: 'UPDATE_TOPIC_NOTES', id, notes });
    showToast('Notes saved');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <p className="text-dim text-xs uppercase tracking-widest font-medium">12 Topics</p>
        <span className="text-academic font-bold text-sm">{completed}/12 complete</span>
      </div>

      {state.academic.topics.map(topic => {
        const isExpanded = expandedId === topic.id;
        const draft = noteDraft[topic.id] ?? topic.notes;

        return (
          <div key={topic.id} className="bg-card rounded overflow-hidden" style={topic.completed ? { borderTop: '3px solid #3b82f6' } : { borderTop: '3px solid #1e2235' }}>
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                onClick={() => handleToggle(topic.id, topic.name)}
                className={`w-5 h-5 rounded flex-shrink-0 border transition-all duration-150 flex items-center justify-center ${
                  topic.completed
                    ? 'bg-academic border-academic'
                    : 'border-white/20 hover:border-academic'
                }`}
              >
                {topic.completed && (
                  <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#0f1117" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${topic.completed ? 'text-dim line-through' : 'text-light'}`}>
                  {topic.name}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <DifficultyDots level={topic.difficulty} />
                <button
                  onClick={() => setExpandedId(isExpanded ? null : topic.id)}
                  className="text-dim hover:text-light text-xs transition-colors"
                >
                  {isExpanded ? 'Hide' : 'Notes'}
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="px-4 pb-4 border-t border-white/5 pt-3">
                <textarea
                  value={draft}
                  onChange={e => setNoteDraft(p => ({ ...p, [topic.id]: e.target.value }))}
                  placeholder="Add notes for this topic..."
                  rows={3}
                  className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 resize-none focus:outline-none focus:border-academic transition-colors"
                />
                <button
                  onClick={() => handleSaveNotes(topic.id)}
                  className="mt-2 px-4 py-1.5 bg-academic text-deep text-xs font-medium rounded hover:opacity-90 transition-opacity"
                >
                  Save Notes
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
