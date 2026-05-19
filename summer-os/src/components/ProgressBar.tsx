import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
  height?: number;
  showLabel?: boolean;
}

export function ProgressBar({ value, max, color, height = 8, showLabel = false }: ProgressBarProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    el.style.width = '0%';
    animate(el, {
      width: `${pct}%`,
      duration: 600,
      easing: 'easeOutQuart',
      delay: 150,
    });
  }, [pct]);

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 bg-surface rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          ref={fillRef}
          className="h-full rounded-full"
          style={{ width: '0%', backgroundColor: color }}
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
