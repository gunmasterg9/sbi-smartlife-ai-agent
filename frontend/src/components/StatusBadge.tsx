"use client";

type StatusVariant = "active" | "warning" | "danger" | "info" | "pending" | "detected" | "predicted";

const variants: Record<StatusVariant, { bg: string; color: string; dot: string }> = {
  active:    { bg: "rgba(16,185,129,0.1)",  color: "#10b981", dot: "#10b981" },
  warning:   { bg: "rgba(245,158,11,0.1)",  color: "#f59e0b", dot: "#f59e0b" },
  danger:    { bg: "rgba(244,63,94,0.1)",   color: "#f43f5e", dot: "#f43f5e" },
  info:      { bg: "rgba(6,182,212,0.1)",   color: "#06b6d4", dot: "#06b6d4" },
  pending:   { bg: "rgba(245,158,11,0.1)",  color: "#f59e0b", dot: "#f59e0b" },
  detected:  { bg: "rgba(16,185,129,0.1)",  color: "#10b981", dot: "#10b981" },
  predicted: { bg: "rgba(139,92,246,0.1)",  color: "#8b5cf6", dot: "#8b5cf6" },
};

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  showDot?: boolean;
}

export default function StatusBadge({ status, label, showDot = true }: StatusBadgeProps) {
  const v = variants[status] || variants.info;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        borderRadius: "var(--radius-full)",
        background: v.bg,
        border: `1px solid ${v.color}30`,
        fontSize: 12,
        fontWeight: 600,
        color: v.color,
        textTransform: "capitalize",
      }}
    >
      {showDot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: v.dot,
          }}
        />
      )}
      {label || status}
    </span>
  );
}
