"use client";
import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
  showLabel?: boolean;
}

function getScoreColor(score: number, max: number): string {
  const pct = score / max;
  if (pct >= 0.75) return "#10b981";
  if (pct >= 0.5) return "#f59e0b";
  return "#f43f5e";
}

export default function ScoreGauge({
  score,
  maxScore = 100,
  size = 120,
  strokeWidth = 10,
  label,
  color,
  showLabel = true,
}: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(animatedScore / maxScore, 1);
  const offset = circumference * (1 - pct);
  const resolvedColor = color || getScoreColor(score, maxScore);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: `drop-shadow(0 0 6px ${resolvedColor}40)`,
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Outfit",
            fontSize: size * 0.28,
            fontWeight: 800,
            color: resolvedColor,
            lineHeight: 1,
          }}
        >
          {Math.round(animatedScore)}
        </span>
        {showLabel && (
          <span
            style={{
              fontSize: size * 0.1,
              color: "var(--text-muted)",
              marginTop: 2,
            }}
          >
            {label || `/ ${maxScore}`}
          </span>
        )}
      </div>
    </div>
  );
}
