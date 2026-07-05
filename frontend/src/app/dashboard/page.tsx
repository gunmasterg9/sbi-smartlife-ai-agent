"use client";
import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, BarChart, Bar,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "rgba(15, 22, 41, 0.95)",
  border: "1px solid rgba(99, 115, 175, 0.3)",
  borderRadius: 12,
  padding: "12px 16px",
  color: "#f1f5f9",
  fontSize: 13,
};

/* ───── Fallback data ───── */
const fallbackKPIs = [
  { name: "Total Customers", value: "500", change: "+12.5%", icon: "👥", color: "#3b82f6" },
  { name: "Acquisition Rate", value: "8.3%", change: "+2.1%", icon: "🎯", color: "#8b5cf6" },
  { name: "Conversion Rate", value: "34.2%", change: "+3.4%", icon: "📊", color: "#06b6d4" },
  { name: "Digital Adoption", value: "72.4%", change: "+5.2%", icon: "📱", color: "#10b981" },
  { name: "YONO Adoption", value: "68.5%", change: "+4.1%", icon: "📲", color: "#f59e0b" },
  { name: "UPI Activation", value: "78.3%", change: "+6.8%", icon: "💳", color: "#ec4899" },
  { name: "Engagement Score", value: "76.8", change: "+1.5", icon: "📈", color: "#06b6d4" },
  { name: "Retention Rate", value: "94.2%", change: "+0.8%", icon: "🛡️", color: "#10b981" },
  { name: "Wellness Score", value: "72.5", change: "+2.3", icon: "❤️", color: "#f43f5e" },
  { name: "Cross-Sell Rate", value: "23.5%", change: "+4.7%", icon: "📦", color: "#8b5cf6" },
  { name: "Revenue Impact", value: "₹142.8Cr", change: "+15.3%", icon: "💰", color: "#f9a825" },
  { name: "Agent Actions", value: "8,421", change: "+8.1%", icon: "🤖", color: "#3b82f6" },
];

const sparkData7d = [
  { d: 1, v: 72 }, { d: 2, v: 75 }, { d: 3, v: 73 },
  { d: 4, v: 78 }, { d: 5, v: 80 }, { d: 6, v: 79 }, { d: 7, v: 84 },
];

const segmentDonut = [
  { name: "Mass", value: 150, color: "#3b82f6" },
  { name: "Mass Affluent", value: 175, color: "#8b5cf6" },
  { name: "Affluent", value: 100, color: "#06b6d4" },
  { name: "HNI", value: 50, color: "#f59e0b" },
  { name: "Ultra HNI", value: 25, color: "#10b981" },
];

const agentStatuses = [
  { name: "Acquisition Agent", type: "acquisition", actions: 1247, confidence: 0.94, color: "#3b82f6" },
  { name: "Adoption Agent", type: "adoption", actions: 892, confidence: 0.91, color: "#8b5cf6" },
  { name: "Engagement Agent", type: "engagement", actions: 2105, confidence: 0.93, color: "#ec4899" },
  { name: "Wellness Agent", type: "wellness", actions: 1534, confidence: 0.89, color: "#10b981" },
  { name: "Life Events Agent", type: "life_events", actions: 678, confidence: 0.87, color: "#f59e0b" },
  { name: "Relationship Manager", type: "relationship", actions: 3421, confidence: 0.95, color: "#06b6d4" },
];

const recentActions = [
  { agent: "Wellness Agent", action: "Financial score computed", customer: "Aarav Sharma", time: "2 min ago", confidence: 0.94 },
  { agent: "Life Events Agent", action: "Salary increase detected", customer: "Priya Patel", time: "5 min ago", confidence: 0.91 },
  { agent: "Acquisition Agent", action: "KYC verification initiated", customer: "Vikram Singh", time: "8 min ago", confidence: 0.96 },
  { agent: "Engagement Agent", action: "Personalized offer sent", customer: "Sneha Gupta", time: "12 min ago", confidence: 0.88 },
  { agent: "Adoption Agent", action: "YONO setup guided", customer: "Rohan Verma", time: "15 min ago", confidence: 0.93 },
  { agent: "Relationship Manager", action: "Loan query resolved", customer: "Anjali Mehta", time: "18 min ago", confidence: 0.97 },
];

const weeklyAgentActivity = [
  { day: "Mon", actions: 1250 },
  { day: "Tue", actions: 1380 },
  { day: "Wed", actions: 1540 },
  { day: "Thu", actions: 1420 },
  { day: "Fri", actions: 1680 },
  { day: "Sat", actions: 920 },
  { day: "Sun", actions: 640 },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [kpis, setKpis] = useState(fallbackKPIs);

  useEffect(() => {
    setMounted(true);
    // Try to fetch live data
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/analytics/kpis`
        );
        const data = await res.json();
        if (data.kpis && data.kpis.length > 0) {
          setKpis(
            data.kpis.map((k: any) => ({
              name: k.name,
              value: typeof k.value === "number" && k.name.includes("Revenue") ? `₹${k.value}Cr` : String(k.value),
              change: `+${k.change}%`,
              icon: k.icon === "users" ? "👥" : k.icon === "bot" ? "🤖" : k.icon === "heart" ? "❤️" : "📊",
              color: "#3b82f6",
            }))
          );
        }
      } catch {
        // Use fallback data
      }
    })();
  }, []);

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}>
      {/* KPI Grid */}
      <div className="kpi-grid" style={{ marginBottom: 32 }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="glass-card" style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `${kpi.color}15`, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 20, border: `1px solid ${kpi.color}25`,
              }}>
                {kpi.icon}
              </div>
              <span style={{
                padding: "4px 10px", borderRadius: "var(--radius-full)",
                background: "rgba(16, 185, 129, 0.1)", color: "#10b981",
                fontSize: 12, fontWeight: 600,
              }}>
                {kpi.change}
              </span>
            </div>
            <div style={{ fontFamily: "Outfit", fontSize: 28, fontWeight: 800, color: "var(--text-primary)" }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{kpi.name}</div>
            {/* Mini sparkline */}
            <div style={{ marginTop: 8, height: 30 }}>
              <ResponsiveContainer width="100%" height={30}>
                <AreaChart data={sparkData7d} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                  <Area type="monotone" dataKey="v" stroke={kpi.color} fill={kpi.color} fillOpacity={0.1} strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Three Column: Agent Status | Segment Donut | Weekly Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Agent Status */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
            🤖 AI Agent Status
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {agentStatuses.map((agent, i) => (
              <div key={i} style={{
                padding: "12px 14px", borderRadius: "var(--radius-md)",
                background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{agent.name}</span>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {agent.actions.toLocaleString()} actions • {(agent.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%", background: "#10b981",
                  boxShadow: "0 0 6px rgba(16,185,129,0.4)",
                }} />
              </div>
            ))}
          </div>
        </div>

        {/* Segment Donut */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
            👥 Customer Segments
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={segmentDonut} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {segmentDonut.map((s, i) => (
                  <Cell key={i} fill={s.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 4 }}>
            {segmentDonut.map((s, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-muted)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} /> {s.name}: {s.value}
              </span>
            ))}
          </div>
        </div>

        {/* Weekly Activity BarChart */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
            ⚡ Weekly Agent Activity
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyAgentActivity} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="actions" name="Actions" radius={[6, 6, 0, 0]} fill="#3b82f6">
                {weeklyAgentActivity.map((_, i) => (
                  <Cell key={i} fill={i === 4 ? "#10b981" : "#3b82f680"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 32 }}>
        <h3 style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
          ⚡ Recent AI Actions
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {recentActions.map((action, i) => (
            <div key={i} style={{
              padding: "12px 16px", borderRadius: "var(--radius-md)",
              background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                  {action.action}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  {action.agent} → {action.customer}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{action.time}</div>
                <div style={{
                  fontSize: 11, color: "#10b981",
                  padding: "2px 8px", borderRadius: "var(--radius-full)",
                  background: "rgba(16,185,129,0.1)", marginTop: 4,
                }}>
                  {(action.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
          🚀 Quick Actions
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { icon: "💬", label: "Chat with AI Assistant", href: "/dashboard/assistant", color: "#3b82f6" },
            { icon: "🧬", label: "View Digital Twin", href: "/dashboard/digital-twin", color: "#8b5cf6" },
            { icon: "❤️", label: "Financial Health Check", href: "/dashboard/wellness", color: "#f43f5e" },
            { icon: "🎯", label: "View Recommendations", href: "/dashboard/products", color: "#f59e0b" },
            { icon: "📉", label: "Analytics Dashboard", href: "/dashboard/analytics", color: "#06b6d4" },
            { icon: "🛡️", label: "Compliance Status", href: "/dashboard/compliance", color: "#10b981" },
          ].map((action, i) => (
            <a key={i} href={action.href} style={{
              padding: "16px 20px", borderRadius: "var(--radius-md)",
              background: `${action.color}08`, border: `1px solid ${action.color}20`,
              display: "flex", alignItems: "center", gap: 12,
              textDecoration: "none", color: "var(--text-primary)",
              transition: "all 0.2s ease", cursor: "pointer",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${action.color}15`; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${action.color}08`; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span style={{ fontSize: 24 }}>{action.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
