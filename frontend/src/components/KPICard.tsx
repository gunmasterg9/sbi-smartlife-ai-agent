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
    trend === "up" ? "var(--emerald)" : trend === "down" ? "var(--rose)" : "var(--text-muted)";
  const trendSign = trend === "up" ? "+" : trend === "down" ? "-" : "";

  return (
    <div
      className="glass-card metallic-shine"
      style={{ 
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        borderLeft: `3px solid ${color}`,
      }}
    >
      {/* Decorative credit card hologram / chip pattern for sleek fintech feel */}
      <div style={{
        position: "absolute",
        top: 24,
        right: 24,
        width: 32,
        height: 24,
        borderRadius: 4,
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        opacity: 0.6,
      }}>
        💳
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: `${color}10`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            border: `1px solid ${color}20`,
            boxShadow: `0 0 15px ${color}08`,
          }}
        >
          {icon}
        </div>
        {change !== undefined && (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
              background: `${trendColor}12`,
              color: trendColor,
              fontSize: 11,
              fontWeight: 700,
              border: `1px solid ${trendColor}20`,
              boxShadow: `0 0 10px ${trendColor}05`,
            }}
          >
            {trendSign}
            {change}
            {suffix}
          </span>
        )}
      </div>
      <div
        className="fintech-num"
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: "var(--text-primary)",
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6, fontWeight: 500 }}>
        {name}
      </div>
    </div>
  );
}
