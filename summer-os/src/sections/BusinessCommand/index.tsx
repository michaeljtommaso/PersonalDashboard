import { useState, useMemo } from 'react';
import { useApp } from '../../hooks/useApp';
import { useAnimeCountUp } from '../../hooks/useAnimeCountUp';
import { SectionHeader } from '../../components/SectionHeader';
import { VentureManager } from './VentureManager';
import { RevenueLog } from './RevenueLog';
import { LessonsLearned } from './LessonsLearned';
import { BusinessCharts } from './BusinessCharts';

type Tab = 'ventures' | 'revenue' | 'lessons' | 'charts';

const TABS: { id: Tab; label: string }[] = [
  { id: 'ventures', label: 'Ventures' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'lessons', label: 'Lessons' },
  { id: 'charts', label: 'Charts' },
];

export function BusinessCommand() {
  const [tab, setTab] = useState<Tab>('ventures');
  const { state } = useApp();

  const totalRevenue = useMemo(() =>
    state.business.ventures.reduce((sum, v) =>
      sum + v.revenue.reduce((s, r) => s + r.amount, 0), 0
    ), [state.business.ventures]);

  const revenueCount = useAnimeCountUp(totalRevenue);

  return (
    <div>
      <SectionHeader title="Business Command" accent="#f59e0b">
        <span className="text-business text-3xl font-bold">
          ${totalRevenue.toLocaleString()}
        </span>
      </SectionHeader>

      <div className="mb-6 rounded p-6" style={{ backgroundColor: 'rgba(245,158,11,0.12)', borderTop: '3px solid #f59e0b' }}>
        <p className="text-dim text-xs uppercase tracking-widest font-medium mb-1">Summer Revenue</p>
        <p
          className="text-5xl font-bold leading-none"
          style={{ color: '#f59e0b', textShadow: '0 0 28px #f59e0b' }}
        >
          ${revenueCount.toLocaleString()}
        </p>
      </div>

      <div className="flex gap-1 mb-6 bg-surface rounded p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-150 ${
              tab === t.id
                ? 'bg-business text-deep'
                : 'text-dim hover:text-light'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'ventures' && <VentureManager />}
      {tab === 'revenue' && <RevenueLog />}
      {tab === 'lessons' && <LessonsLearned />}
      {tab === 'charts' && <BusinessCharts />}
    </div>
  );
}
