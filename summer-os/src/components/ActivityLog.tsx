import { useEffect, useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { animate } from 'animejs';
import type { AgentLogEntry } from '../context/types';

interface ActivityLogProps {
  entries: AgentLogEntry[];
  isActive: boolean;
  onAdd: (text: string) => void;
  onDelete: (entryId: string) => void;
  accentColor: string;
}

export function ActivityLog({ entries, isActive, onAdd, onDelete, accentColor }: ActivityLogProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastEntryRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(entries.length);

  useEffect(() => {
    if (entries.length > prevCountRef.current && lastEntryRef.current) {
      animate(lastEntryRef.current, {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 200,
        easing: 'easeOutQuart',
      });
    }
    prevCountRef.current = entries.length;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      <div
        className="flex-1 overflow-y-auto rounded p-3 space-y-2"
        style={{ background: '#0f1117', maxHeight: 180 }}
      >
        {entries.length === 0 && (
          <p className="text-xs" style={{ color: '#475569' }}>No log entries yet.</p>
        )}
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            ref={i === entries.length - 1 ? lastEntryRef : undefined}
            className="flex gap-2 group items-start"
          >
            <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: '#475569' }}>
              {new Date(entry.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-xs flex-1 leading-relaxed" style={{ color: '#94a3b8' }}>
              {entry.text}
            </span>
            <button
              onClick={() => onDelete(entry.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              style={{ color: '#64748b' }}
            >
              <Trash2 size={10} />
            </button>
          </div>
        ))}
        {isActive && entries.length > 0 && (
          <span
            className="text-xs"
            style={{
              color: accentColor,
              animation: 'blink-cursor 1s step-end infinite',
            }}
          >
            |
          </span>
        )}
        <div ref={bottomRef} />
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Log entry... (Enter)"
        className="mt-2 w-full bg-surface border border-white/10 rounded text-xs px-3 py-2 focus:outline-none transition-colors"
        style={{ color: '#f1f5f9' }}
        onFocus={e => { e.target.style.borderColor = accentColor; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
      />
    </div>
  );
}
