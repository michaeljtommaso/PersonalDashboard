import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useShowToast } from '../../App';
import { SectionHeader } from '../../components/SectionHeader';
import { ProgressBar } from '../../components/ProgressBar';
import { TopicList } from './TopicList';
import { SessionLogger } from './SessionLogger';
import { StudyCharts } from './StudyCharts';
import { daysUntil } from '../../utils/dates';

type Tab = 'topics' | 'sessions' | 'charts';

const TABS: { id: Tab; label: string }[] = [
  { id: 'topics', label: 'Topics' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'charts', label: 'Charts' },
];

export function StudyHub() {
  const [tab, setTab] = useState<Tab>('topics');
  const { state, dispatch } = useApp();
  const showToast = useShowToast();
  const [editingDate, setEditingDate] = useState(false);
  const [dateInput, setDateInput] = useState(state.academic.examDate);

  const completed = state.academic.topics.filter(t => t.completed).length;
  const remaining = 12 - completed;
  const daysLeft = daysUntil(state.academic.examDate);
  const recommendedDaily = daysLeft > 0 ? Math.ceil((remaining * 90) / daysLeft) : 0;

  const handleSaveDate = () => {
    dispatch({ type: 'SET_EXAM_DATE', date: dateInput });
    setEditingDate(false);
    showToast('Exam date saved');
  };

  return (
    <div>
      <SectionHeader title="E&M Study Hub" accent="#3b82f6" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-card rounded p-4" style={{ borderTop: '3px solid #3b82f6' }}>
          <p className="text-dim text-xs uppercase tracking-widest mb-1">Exam In</p>
          {editingDate ? (
            <div className="flex gap-1 mt-1">
              <input
                type="date"
                value={dateInput}
                onChange={e => setDateInput(e.target.value)}
                className="flex-1 bg-surface border border-white/10 rounded text-light text-xs px-2 py-1 focus:outline-none focus:border-academic"
              />
              <button onClick={handleSaveDate} className="px-2 py-1 bg-academic text-deep text-xs rounded">Save</button>
            </div>
          ) : (
            <button onClick={() => setEditingDate(true)} className="text-left w-full group">
              <p className="text-light text-2xl font-bold">
                {state.academic.examDate ? `${daysLeft}d` : 'Set date'}
              </p>
              <p className="text-dim text-xs group-hover:text-academic transition-colors">
                {state.academic.examDate || 'Click to set'}
              </p>
            </button>
          )}
        </div>

        <div className="bg-card rounded p-4" style={{ borderTop: '3px solid #3b82f6' }}>
          <p className="text-dim text-xs uppercase tracking-widest mb-1">Daily Target</p>
          <p className="text-light text-2xl font-bold">{recommendedDaily > 0 ? `${recommendedDaily}m` : '—'}</p>
          <p className="text-dim text-xs">recommended</p>
        </div>

        <div className="bg-card rounded p-4 col-span-2" style={{ borderTop: '3px solid #3b82f6' }}>
          <div className="flex justify-between mb-2">
            <p className="text-dim text-xs uppercase tracking-widest">Progress</p>
            <span className="text-academic text-xs font-medium">{completed}/12</span>
          </div>
          <ProgressBar value={completed} max={12} color="#3b82f6" showLabel />
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-surface rounded p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-150 ${
              tab === t.id
                ? 'bg-academic text-light'
                : 'text-dim hover:text-light'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'topics' && <TopicList />}
      {tab === 'sessions' && <SessionLogger />}
      {tab === 'charts' && <StudyCharts />}
    </div>
  );
}
