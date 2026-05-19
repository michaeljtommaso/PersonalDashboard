import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

interface AgentRingProps {
  percent: number;
  color: string;
  size?: number;
  pulse?: boolean;
  pulseClass?: string;
}

export function AgentRing({ percent, color, size = 120, pulse = false, pulseClass }: AgentRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (percent / 100) * circumference;

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;

    el.style.strokeDasharray = String(circumference);
    el.style.strokeDashoffset = String(circumference);

    animate(el, {
      strokeDashoffset: [circumference, targetOffset],
      duration: 800,
      easing: 'easeOutQuart',
      delay: 200,
    });
  }, [circumference, targetOffset]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}
      className={pulse && pulseClass ? pulseClass : undefined}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={8}
      />
      <circle
        ref={circleRef}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
      />
    </svg>
  );
}
