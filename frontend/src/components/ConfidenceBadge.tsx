"use client";

interface ConfidenceBadgeProps {
  confidence: number; // 0.0 to 1.0
  showLabel?: boolean;
}

export default function ConfidenceBadge({ confidence, showLabel = true }: ConfidenceBadgeProps) {
  const pct = Math.round(confidence * 100);
  const color = pct >= 90 ? "#10b981" : pct >= 75 ? "#3b82f6" : pct >= 60 ? "#f59e0b" : "#f43f5e";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: "var(--radius-full)",
        background: `${color}12`,
        border: `1px solid ${color}25`,
        fontSize: 12,
        fontWeight: 600,
        color,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 4px ${color}60`,
        }}
      />
      {pct}%{showLabel && " confidence"}
    </span>
  );
}
