"use client";

import { scaleLinear } from "d3-scale";
import { arc } from "d3-shape";

export function ScoreGauge({ score }: { score: number }) {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const angle = scaleLinear().domain([0, 100]).range([-Math.PI / 1.4, Math.PI / 1.4]);
  const backgroundArc = arc()({
    innerRadius: 54,
    outerRadius: 68,
    startAngle: -Math.PI / 1.4,
    endAngle: Math.PI / 1.4
  });
  const filledArc = arc()({
    innerRadius: 54,
    outerRadius: 68,
    startAngle: -Math.PI / 1.4,
    endAngle: angle(normalizedScore)
  });
  const color = normalizedScore > 70 ? "#22c55e" : normalizedScore > 40 ? "#eab308" : "#ef4444";

  return (
    <div className="relative flex size-52 items-center justify-center">
      <svg viewBox="-80 -80 160 110" className="size-full">
        <path d={backgroundArc ?? ""} fill="rgba(255,255,255,0.08)" />
        <path d={filledArc ?? ""} fill={color} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Composite score</div>
        <div className="font-display text-5xl font-bold">{normalizedScore}</div>
      </div>
    </div>
  );
}
