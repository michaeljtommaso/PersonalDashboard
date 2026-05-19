import { useApp } from '../../hooks/useApp';
import { useShowToast } from '../../App';
import type { VentureStage } from '../../context/types';

const STAGES: VentureStage[] = ['Idea', 'Building', 'Testing', 'Running', 'Profitable'];

const STAGE_COLORS: Record<VentureStage, string> = {
  Idea: '#94a3b8',
  Building: '#3b82f6',
  Testing: '#f59e0b',
  Running: '#10b981',
  Profitable: '#10b981',
};

export function Pipeline() {
  const { state, dispatch } = useApp();
  const showToast = useShowToast();

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3 min-w-max">
        {STAGES.map(stage => {
          const ventures = state.business.ventures.filter(v => v.stage === stage);
          return (
            <div key={stage} className="w-52 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[stage] }} />
                <p className="text-dim text-xs uppercase tracking-widest font-medium">{stage}</p>
                <span className="text-dim text-xs ml-auto">{ventures.length}</span>
              </div>

              <div className="space-y-2">
                {ventures.map(v => {
                  const total = v.revenue.reduce((s, r) => s + r.amount, 0);
                  const assignedAgents = state.ai.agents.filter(a => a.ventureId === v.id);
                  return (
                    <div
                      key={v.id}
                      className="bg-card rounded p-3 cursor-default group transition-transform duration-150 hover:-translate-y-0.5"
                      style={{ border: `1px solid ${STAGE_COLORS[stage]}30` }}
                    >
                      <p className="text-light text-sm font-medium">{v.name}</p>
                      <p className="text-dim text-xs mt-0.5">{v.category}</p>
                      {total > 0 && (
                        <p className="text-business text-xs font-medium mt-1.5">${total.toLocaleString()}</p>
                      )}
                      {assignedAgents.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {assignedAgents.map(a => (
                            <span
                              key={a.id}
                              className="text-xs px-1.5 py-0.5 rounded-full"
                              style={{ backgroundColor: '#8b5cf620', color: '#8b5cf6' }}
                            >
                              {a.name}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {STAGES.filter(s => s !== stage).map(s => (
                          <button
                            key={s}
                            onClick={() => {
                              dispatch({ type: 'UPDATE_VENTURE_STAGE', id: v.id, stage: s });
                              showToast(`Moved to ${s}`);
                            }}
                            className="text-dim hover:text-light text-xs transition-colors"
                            title={`Move to ${s}`}
                          >
                            →{s.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {ventures.length === 0 && (
                  <div className="border border-dashed border-white/10 rounded p-3 text-center">
                    <p className="text-dim text-xs">Empty</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
