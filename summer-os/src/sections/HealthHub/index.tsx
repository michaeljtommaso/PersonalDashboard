import { useState } from 'react';
import { SectionHeader } from '../../components/SectionHeader';
import { GymTracker } from './GymTracker';
import { NutritionTracker } from './NutritionTracker';
import { NutritionCharts } from './NutritionCharts';

type Tab = 'gym' | 'nutrition' | 'charts';

const TABS: { id: Tab; label: string }[] = [
  { id: 'gym', label: 'Gym' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'charts', label: 'Charts' },
];

export function HealthHub() {
  const [tab, setTab] = useState<Tab>('gym');

  return (
    <div>
      <SectionHeader title="Health Hub" accent="#10b981" />

      <div className="flex gap-1 mb-6 bg-surface rounded p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-150 ${
              tab === t.id
                ? 'bg-health text-deep'
                : 'text-dim hover:text-light'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'gym' && <GymTracker />}
      {tab === 'nutrition' && <NutritionTracker />}
      {tab === 'charts' && <NutritionCharts />}
    </div>
  );
}
