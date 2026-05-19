import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useShowToast } from '../../App';
import { ProgressBar } from '../../components/ProgressBar';
import { todayStr } from '../../utils/dates';

const GOALS = { cal: 2100, pro: 145, carb: 195, fat: 65 };

const MACROS = [
  { key: 'cal' as const, label: 'Calories', unit: 'kcal', color: '#10b981' },
  { key: 'pro' as const, label: 'Protein', unit: 'g', color: '#3b82f6' },
  { key: 'carb' as const, label: 'Carbs', unit: 'g', color: '#f59e0b' },
  { key: 'fat' as const, label: 'Fat', unit: 'g', color: '#8b5cf6' },
];

export function NutritionTracker() {
  const { state, dispatch } = useApp();
  const showToast = useShowToast();
  const today = todayStr();
  const entry = state.health.nutrition[today];

  const [form, setForm] = useState({
    cal: entry?.cal.toString() ?? '',
    pro: entry?.pro.toString() ?? '',
    carb: entry?.carb.toString() ?? '',
    fat: entry?.fat.toString() ?? '',
  });

  const handleSave = () => {
    const parsed = {
      cal: parseInt(form.cal) || 0,
      pro: parseInt(form.pro) || 0,
      carb: parseInt(form.carb) || 0,
      fat: parseInt(form.fat) || 0,
    };
    dispatch({ type: 'LOG_NUTRITION', date: today, entry: parsed });
    showToast('Nutrition logged');
  };

  return (
    <div className="space-y-6">
      {entry && (
        <div className="space-y-4">
          {MACROS.map(m => (
            <div key={m.key}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-dim">{m.label}</span>
                <span className="text-light font-medium">
                  {entry[m.key]}{m.unit} / {GOALS[m.key]}{m.unit}
                </span>
              </div>
              <ProgressBar value={entry[m.key]} max={GOALS[m.key]} color={m.color} />
            </div>
          ))}
        </div>
      )}

      <div className="bg-card rounded p-5 space-y-4" style={{ borderTop: '3px solid #10b981' }}>
        <p className="text-dim text-xs uppercase tracking-widest font-medium">Log Today</p>
        <div className="grid grid-cols-2 gap-3">
          {MACROS.map(m => (
            <div key={m.key}>
              <label className="text-dim text-xs block mb-1">{m.label} ({m.unit})</label>
              <input
                type="number"
                value={form[m.key]}
                onChange={e => setForm(prev => ({ ...prev, [m.key]: e.target.value }))}
                placeholder={GOALS[m.key].toString()}
                className="w-full bg-surface border border-white/10 rounded text-light text-sm px-3 py-2
                  focus:outline-none focus:border-health transition-colors"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-light text-deep text-sm font-medium py-2.5 rounded
            hover:bg-health hover:text-light transition-all duration-150"
        >
          Save
        </button>
      </div>

      <div className="bg-card rounded p-4">
        <p className="text-dim text-xs uppercase tracking-widest font-medium mb-2">Daily Goals</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {MACROS.map(m => (
            <div key={m.key} className="flex justify-between">
              <span className="text-dim">{m.label}</span>
              <span className="text-light">{GOALS[m.key]}{m.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
