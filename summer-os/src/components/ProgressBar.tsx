interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
  height?: number;
  showLabel?: boolean;
}

export function ProgressBar({ value, max, color, height = 8, showLabel = false }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 bg-surface rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="text-dim text-xs w-10 text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
