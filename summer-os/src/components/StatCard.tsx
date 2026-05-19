import { hexToRgba } from '../utils/colors';

interface StatCardProps {
  label: string;
  value: string | number;
  accent: string;
  sub?: string;
}

export function StatCard({ label, value, accent, sub }: StatCardProps) {
  return (
    <div
      className="rounded p-5 flex flex-col gap-1 hover-lift cursor-default"
      style={{
        backgroundColor: hexToRgba(accent, 0.12),
        borderTop: `3px solid ${accent}`,
      }}
    >
      <span className="text-dim text-xs font-medium uppercase tracking-widest">{label}</span>
      <span
        className="text-2xl font-bold leading-tight"
        style={{
          color: accent,
          textShadow: `0 0 20px ${accent}`,
        }}
      >
        {value}
      </span>
      {sub && <span className="text-dim text-xs">{sub}</span>}
    </div>
  );
}
