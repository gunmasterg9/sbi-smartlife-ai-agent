"use client";

interface KPICardProps {
  name: string;
  value: string | number;
  change?: string | number;
  trend?: "up" | "down" | "neutral";
  icon?: string;
  color?: string;
  suffix?: string;
}

export default function KPICard({
  name,
  value,
  change,
  trend = "up",
  icon = "📊",
  color = "#3b82f6",
  suffix = "",
}: KPICardProps) {
  const trendColor =
    trend === "up" ? "#10b981" : trend === "down" ? "#f43f5e" : "#64748b";
  const trendSign = trend === "up" ? "+" : trend === "down" ? "-" : "";

  return (
    <div
      className="glass-card"
      style={{ padding: "20px 24px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            border: `1px solid ${color}25`,
          }}
        >
          {icon}
        </div>
        {change !== undefined && (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
              background: `${trendColor}15`,
              color: trendColor,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {trendSign}
            {change}
            {suffix}
          </span>
        )}
      </div>
      <div
        style={{
          fontFamily: "Outfit",
          fontSize: 28,
          fontWeight: 800,
          color: "var(--text-primary)",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
        {name}
      </div>
    </div>
  );
}
