import { Bar, Doughnut } from 'react-chartjs-2';
import { useApp } from '../../hooks/useApp';
import { getLast30Days } from '../../utils/dates';

const CHART_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 }, callback: (v: number | string) => `$${v}` } },
  },
};

const VENTURE_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#06b6d4'];

export function BusinessCharts() {
  const { state } = useApp();
  const days = getLast30Days();
  const labels = days.map((d, i) => i % 7 === 0 ? d.slice(5) : '');

  const dailyRevenue = days.map(d =>
    state.business.ventures.reduce((sum, v) =>
      sum + v.revenue.filter(r => r.date === d).reduce((s, r) => s + r.amount, 0), 0
    )
  );

  const ventureTotals = state.business.ventures.map(v =>
    v.revenue.reduce((s, r) => s + r.amount, 0)
  ).filter(t => t > 0);
  const ventureNames = state.business.ventures
    .filter(v => v.revenue.reduce((s, r) => s + r.amount, 0) > 0)
    .map(v => v.name);

  return (
    <div className="space-y-6">
      <div className="bg-card rounded p-5" style={{ borderTop: '3px solid #f59e0b' }}>
        <p className="text-dim text-xs uppercase tracking-widest font-medium mb-4">Revenue — 30 Days</p>
        <div style={{ height: 180 }}>
          <Bar
            data={{
              labels,
              datasets: [{
                data: dailyRevenue,
                backgroundColor: 'rgba(245, 158, 11, 0.6)',
                borderColor: '#f59e0b',
                borderWidth: 1,
                borderRadius: 3,
              }],
            }}
            options={CHART_OPTS as Parameters<typeof Bar>[0]['options']}
          />
        </div>
      </div>

      {ventureTotals.length > 0 && (
        <div className="bg-card rounded p-5" style={{ borderTop: '3px solid #f59e0b' }}>
          <p className="text-dim text-xs uppercase tracking-widest font-medium mb-4">Revenue by Venture</p>
          <div className="flex items-center gap-6">
            <div style={{ height: 160, width: 160, flexShrink: 0 }}>
              <Doughnut
                data={{
                  labels: ventureNames,
                  datasets: [{
                    data: ventureTotals,
                    backgroundColor: VENTURE_COLORS.slice(0, ventureTotals.length),
                    borderWidth: 0,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: ctx => `$${ctx.raw}` } },
                  },
                  cutout: '65%',
                }}
              />
            </div>
            <div className="space-y-2">
              {ventureNames.map((name, i) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: VENTURE_COLORS[i] }} />
                  <span className="text-dim text-xs">{name}</span>
                  <span className="text-light text-xs font-medium ml-auto">${ventureTotals[i].toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {ventureTotals.length === 0 && (
        <p className="text-dim text-sm text-center py-8">Log some revenue to see charts</p>
      )}
    </div>
  );
}
