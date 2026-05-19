import { Bar, Line } from 'react-chartjs-2';
import { useApp } from '../../hooks/useApp';
import { getLast7Days } from '../../utils/dates';

const CHART_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
  },
};

export function NutritionCharts() {
  const { state } = useApp();
  const days = getLast7Days();
  const labels = days.map(d => {
    const [, , day] = d.split('-');
    return day;
  });

  const calData = days.map(d => state.health.nutrition[d]?.cal ?? 0);
  const proData = days.map(d => state.health.nutrition[d]?.pro ?? 0);
  const carbData = days.map(d => state.health.nutrition[d]?.carb ?? 0);
  const fatData = days.map(d => state.health.nutrition[d]?.fat ?? 0);

  return (
    <div className="space-y-6">
      <div className="bg-card rounded p-5" style={{ borderTop: '3px solid #10b981' }}>
        <p className="text-dim text-xs uppercase tracking-widest font-medium mb-4">Calories — 7 Days</p>
        <div style={{ height: 180 }}>
          <Bar
            data={{
              labels,
              datasets: [{
                data: calData,
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: '#10b981',
                borderWidth: 1,
                borderRadius: 4,
              }],
            }}
            options={{ ...CHART_OPTS, plugins: { ...CHART_OPTS.plugins, tooltip: { callbacks: { label: ctx => `${ctx.raw} kcal` } } } }}
          />
        </div>
      </div>

      <div className="bg-card rounded p-5" style={{ borderTop: '3px solid #10b981' }}>
        <p className="text-dim text-xs uppercase tracking-widest font-medium mb-4">Macros — 7 Days</p>
        <div className="flex gap-4 mb-3">
          {[{ label: 'Protein', color: '#3b82f6' }, { label: 'Carbs', color: '#f59e0b' }, { label: 'Fat', color: '#8b5cf6' }].map(m => (
            <div key={m.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
              <span className="text-dim text-xs">{m.label}</span>
            </div>
          ))}
        </div>
        <div style={{ height: 180 }}>
          <Line
            data={{
              labels,
              datasets: [
                { data: proData, borderColor: '#3b82f6', backgroundColor: 'transparent', tension: 0.3, borderWidth: 2, pointRadius: 3 },
                { data: carbData, borderColor: '#f59e0b', backgroundColor: 'transparent', tension: 0.3, borderWidth: 2, pointRadius: 3 },
                { data: fatData, borderColor: '#8b5cf6', backgroundColor: 'transparent', tension: 0.3, borderWidth: 2, pointRadius: 3 },
              ],
            }}
            options={CHART_OPTS}
          />
        </div>
      </div>
    </div>
  );
}
