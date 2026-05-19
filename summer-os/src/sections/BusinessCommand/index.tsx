import { useState, useMemo } from 'react';
import { useApp } from '../../hooks/useApp';
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

  return (
    <div>
      <SectionHeader title="Business Command" accent="#f59e0b">
        <span className="text-business text-3xl font-bold">
          ${totalRevenue.toLocaleString()}
        </span>
      </SectionHeader>

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
