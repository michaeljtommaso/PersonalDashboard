import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useShowToast } from '../../App';
import type { NoteTag } from '../../context/types';

const TAGS: { id: NoteTag; label: string; color: string }[] = [
  { id: 'lesson', label: '#lesson', color: '#3b82f6' },
  { id: 'mistake', label: '#mistake', color: '#ef4444' },
  { id: 'win', label: '#win', color: '#10b981' },
  { id: 'idea', label: '#idea', color: '#f59e0b' },
  { id: 'observation', label: '#observation', color: '#8b5cf6' },
];

export function QuickCapture() {
  const { dispatch } = useApp();
  const showToast = useShowToast();
  const [text, setText] = useState('');
  const [tag, setTag] = useState<NoteTag>('lesson');

  const handleCapture = () => {
    if (!text.trim()) return;
    dispatch({
      type: 'ADD_BRAIN_NOTE',
      note: {
        id: Date.now().toString(),
        ts: new Date().toISOString(),
        tag,
        text: text.trim(),
      },
    });
    setText('');
    showToast('Captured');
  };

  const activeTag = TAGS.find(t => t.id === tag)!;

  return (
    <div className="bg-card rounded p-5 space-y-4" style={{ borderTop: '3px solid #06b6d4' }}>
      <p className="text-dim text-xs uppercase tracking-widest font-medium">Quick Capture</p>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleCapture(); }}
        placeholder="What's on your mind? (Cmd+Enter to save)"
        rows={2}
        className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 resize-none focus:outline-none focus:border-brain transition-colors"
      />
      <div className="flex items-center gap-2 flex-wrap">
        {TAGS.map(t => (
          <button
            key={t.id}
            onClick={() => setTag(t.id)}
            className="px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150"
            style={
              tag === t.id
                ? { backgroundColor: t.color, color: '#0f1117' }
                : { backgroundColor: t.color + '20', color: t.color }
            }
          >
            {t.label}
          </button>
        ))}
      </div>
      <button
        onClick={handleCapture}
        className="w-full bg-light text-deep text-sm font-medium py-2.5 rounded transition-all duration-150"
        style={{ '--hover-bg': activeTag.color } as React.CSSProperties}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = activeTag.color)}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
      >
        Capture
      </button>
    </div>
  );
}
