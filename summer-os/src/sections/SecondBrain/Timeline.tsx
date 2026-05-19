import { useState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useShowToast } from '../../App';
import type { NoteTag } from '../../context/types';
import { animate, stagger } from 'animejs';

const TAG_COLORS: Record<NoteTag, string> = {
  lesson: '#3b82f6',
  mistake: '#ef4444',
  win: '#10b981',
  idea: '#f59e0b',
  observation: '#8b5cf6',
};

export function Timeline() {
  const { state, dispatch } = useApp();
  const showToast = useShowToast();
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState<NoteTag | 'all'>('all');
  const notesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notesRef.current) return;
    const items = notesRef.current.querySelectorAll('.note-item');
    animate(items, {
      opacity: [0, 1],
      translateX: [-16, 0],
      delay: stagger(55),
      duration: 280,
      easing: 'easeOutQuart',
    });
  }, []);

  const filtered = state.brain.notes.filter(n => {
    const matchesText = n.text.toLowerCase().includes(search.toLowerCase());
    const matchesTag = filterTag === 'all' || n.tag === filterTag;
    return matchesText && matchesTag;
  });

  const tags: NoteTag[] = ['lesson', 'mistake', 'win', 'idea', 'observation'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-brain transition-colors"
        />
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setFilterTag('all')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              filterTag === 'all' ? 'bg-brain text-deep' : 'text-dim hover:text-light'
            }`}
          >
            All
          </button>
          {tags.map(t => (
            <button
              key={t}
              onClick={() => setFilterTag(filterTag === t ? 'all' : t)}
              className="px-3 py-1.5 rounded text-xs font-medium transition-all duration-150"
              style={
                filterTag === t
                  ? { backgroundColor: TAG_COLORS[t], color: '#0f1117' }
                  : { color: TAG_COLORS[t], backgroundColor: TAG_COLORS[t] + '15' }
              }
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      <div ref={notesRef} className="space-y-2">
        {filtered.map(note => (
          <div key={note.id} className="note-item bg-card rounded px-4 py-3 flex gap-3">
            <div
              className="w-1 rounded-full flex-shrink-0 mt-1"
              style={{ backgroundColor: TAG_COLORS[note.tag], minHeight: 16 }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-medium"
                  style={{ color: TAG_COLORS[note.tag] }}
                >
                  #{note.tag}
                </span>
                <span className="text-dim text-xs">
                  {new Date(note.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-light text-sm leading-relaxed">{note.text}</p>
            </div>
            <button
              onClick={() => {
                dispatch({ type: 'DELETE_BRAIN_NOTE', id: note.id });
                showToast('Note deleted');
              }}
              className="text-dim hover:text-red-400 transition-colors flex-shrink-0 mt-1"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-dim text-sm text-center py-8">
            {search || filterTag !== 'all' ? 'No matches' : 'Nothing captured yet'}
          </p>
        )}
      </div>
    </div>
  );
}
