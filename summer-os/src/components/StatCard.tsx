interface StatCardProps {
  label: string;
  value: string | number;
  accent: string;
  sub?: string;
}

export function StatCard({ label, value, accent, sub }: StatCardProps) {
  return (
    <div
      className="bg-card rounded p-5 flex flex-col gap-1"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <span className="text-dim text-xs font-medium uppercase tracking-widest">{label}</span>
      <span className="text-light text-2xl font-bold leading-tight">{value}</span>
      {sub && <span className="text-dim text-xs">{sub}</span>}
    </div>
  );
}
