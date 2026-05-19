import { Doughnut, Bar } from 'react-chartjs-2';
import { useApp } from '../../hooks/useApp';

const CHART_BASE = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};

export function StudyCharts() {
  const { state } = useApp();
  const completed = state.academic.topics.filter(t => t.completed).length;
  const remaining = 12 - completed;

  const timeByTopic = state.academic.topics.map(t => ({
    name: t.name.split('&')[0].trim(),
    minutes: state.academic.sessions
      .filter(s => s.topicId === t.id)
      .reduce((sum, s) => sum + s.duration, 0),
  })).filter(t => t.minutes > 0);

  const scales = {
    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded p-5" style={{ borderTop: '3px solid #3b82f6' }}>
        <p className="text-dim text-xs uppercase tracking-widest font-medium mb-4">Topic Completion</p>
        <div className="flex items-center gap-6">
          <div style={{ height: 140, width: 140, flexShrink: 0 }}>
            <Doughnut
              data={{
                labels: ['Complete', 'Remaining'],
                datasets: [{
                  data: [completed, remaining],
                  backgroundColor: ['#3b82f6', '#1e2235'],
                  borderWidth: 0,
                }],
              }}
              options={{
                ...CHART_BASE,
                cutout: '70%',
                plugins: { legend: { display: false } },
              }}
            />
          </div>
          <div>
            <p className="text-light text-3xl font-bold">{completed}<span className="text-dim text-lg">/12</span></p>
            <p className="text-dim text-sm mt-1">topics complete</p>
            <p className="text-academic text-sm mt-2">{Math.round((completed / 12) * 100)}% done</p>
          </div>
        </div>
      </div>

      {timeByTopic.length > 0 && (
        <div className="bg-card rounded p-5" style={{ borderTop: '3px solid #3b82f6' }}>
          <p className="text-dim text-xs uppercase tracking-widest font-medium mb-4">Time per Topic (min)</p>
          <div style={{ height: Math.max(160, timeByTopic.length * 28) }}>
            <Bar
              data={{
                labels: timeByTopic.map(t => t.name),
                datasets: [{
                  data: timeByTopic.map(t => t.minutes),
                  backgroundColor: 'rgba(59, 130, 246, 0.6)',
                  borderColor: '#3b82f6',
                  borderWidth: 1,
                  borderRadius: 3,
                }],
              }}
              options={{
                ...CHART_BASE,
                indexAxis: 'y' as const,
                scales,
              }}
            />
          </div>
        </div>
      )}

      {timeByTopic.length === 0 && (
        <p className="text-dim text-sm text-center py-8">Log some sessions to see time per topic</p>
      )}
    </div>
  );
}
