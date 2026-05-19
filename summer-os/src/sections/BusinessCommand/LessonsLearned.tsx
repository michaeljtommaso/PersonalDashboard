import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useShowToast } from '../../App';
import { formatDate, todayStr } from '../../utils/dates';
import type { LessonCategory } from '../../context/types';

const CATEGORIES: LessonCategory[] = [
  'Marketing', 'Operations', 'Sales', 'Mindset', 'Technical', 'Other',
];

const CATEGORY_COLORS: Record<LessonCategory, string> = {
  Marketing: '#3b82f6',
  Operations: '#10b981',
  Sales: '#f59e0b',
  Mindset: '#8b5cf6',
  Technical: '#06b6d4',
  Other: '#94a3b8',
};

export function LessonsLearned() {
  const { state, dispatch } = useApp();
  const showToast = useShowToast();
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ category: 'Marketing' as LessonCategory, text: '' });

  const filtered = state.business.lessons.filter(l =>
    l.text.toLowerCase().includes(search.toLowerCase()) ||
    l.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.text.trim()) return;
    dispatch({
      type: 'ADD_LESSON',
      lesson: {
        id: Date.now().toString(),
        date: todayStr(),
        category: form.category,
        text: form.text.trim(),
      },
    });
    setForm(p => ({ ...p, text: '' }));
    showToast('Lesson captured');
  };

  return (
    <div className="space-y-5">
      <div className="bg-card rounded p-5 space-y-3" style={{ borderTop: '3px solid #f59e0b' }}>
        <p className="text-dim text-xs uppercase tracking-widest font-medium">Add Lesson</p>
        <select
          value={form.category}
          onChange={e => setForm(p => ({ ...p, category: e.target.value as LessonCategory }))}
          className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 focus:outline-none focus:border-business transition-colors"
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <textarea
          placeholder="What did you learn?"
          value={form.text}
          onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
          rows={3}
          className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2 resize-none focus:outline-none focus:border-business transition-colors"
        />
        <button
          onClick={handleAdd}
          className="w-full bg-light text-deep text-sm font-medium py-2.5 rounded hover:bg-business hover:text-light transition-all duration-150"
        >
          Capture
        </button>
      </div>

      <input
        type="text"
        placeholder="Search lessons..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2.5 focus:outline-none focus:border-business transition-colors"
      />

      <div className="space-y-2">
        {filtered.map(l => (
          <div key={l.id} className="bg-card rounded p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: CATEGORY_COLORS[l.category] + '25',
                      color: CATEGORY_COLORS[l.category],
                    }}
                  >
                    {l.category}
                  </span>
                  <span className="text-dim text-xs">{formatDate(l.date)}</span>
                </div>
                <p className="text-light text-sm leading-relaxed">{l.text}</p>
              </div>
              <button
                onClick={() => {
                  dispatch({ type: 'DELETE_LESSON', id: l.id });
                  showToast('Lesson deleted');
                }}
                className="text-dim hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-dim text-sm text-center py-8">
            {search ? 'No matches' : 'No lessons yet'}
          </p>
        )}
      </div>
    </div>
  );
}
