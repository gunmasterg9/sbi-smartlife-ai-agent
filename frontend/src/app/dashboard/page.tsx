"use client";
import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, BarChart, Bar,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "rgba(12, 12, 12, 0.95)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 12,
  padding: "12px 16px",
  color: "#ffffff",
  fontSize: 13,
  boxShadow: "0 10px 35px rgba(0, 0, 0, 0.6)",
};

/* ───── Fallback data with Neon Colors ───── */
const fallbackKPIs = [
  { name: "Total Customers", value: "500", change: "+12.5%", icon: "👥", color: "var(--cyan)" },
  { name: "Acquisition Rate", value: "8.3%", change: "+2.1%", icon: "🎯", color: "var(--violet)" },
  { name: "Conversion Rate", value: "34.2%", change: "+3.4%", icon: "📊", color: "var(--cyan)" },
  { name: "Digital Adoption", value: "72.4%", change: "+5.2%", icon: "📱", color: "var(--emerald)" },
  { name: "YONO Adoption", value: "68.5%", change: "+4.1%", icon: "📲", color: "var(--gold)" },
  { name: "UPI Activation", value: "78.3%", change: "+6.8%", icon: "💳", color: "var(--rose)" },
  { name: "Engagement Score", value: "76.8", change: "+1.5", icon: "📈", color: "var(--cyan)" },
  { name: "Retention Rate", value: "94.2%", change: "+0.8%", icon: "🛡️", color: "var(--emerald)" },
  { name: "Wellness Score", value: "72.5", change: "+2.3", icon: "❤️", color: "var(--rose)" },
  { name: "Cross-Sell Rate", value: "23.5%", change: "+4.7%", icon: "📦", color: "var(--violet)" },
  { name: "Revenue Impact", value: "₹142.8Cr", change: "+15.3%", icon: "💰", color: "var(--gold)" },
  { name: "Agent Actions", value: "8,421", change: "+8.1%", icon: "🤖", color: "var(--cyan)" },
];

const sparkData7d = [
  { d: 1, v: 72 }, { d: 2, v: 75 }, { d: 3, v: 73 },
  { d: 4, v: 78 }, { d: 5, v: 80 }, { d: 6, v: 79 }, { d: 7, v: 84 },
];

const fallbackSegmentDonut = [
  { name: "Mass", value: 150, color: "var(--cyan)" },
  { name: "Mass Affluent", value: 175, color: "var(--violet)" },
  { name: "Affluent", value: 100, color: "var(--rose)" },
  { name: "HNI", value: 50, color: "var(--gold)" },
  { name: "Ultra HNI", value: 25, color: "var(--emerald)" },
];

const fallbackAgentStatuses = [
  { name: "Acquisition Agent", type: "acquisition", actions: 1247, confidence: 0.94, color: "var(--cyan)" },
  { name: "Adoption Agent", type: "adoption", actions: 892, confidence: 0.91, color: "var(--violet)" },
  { name: "Engagement Agent", type: "engagement", actions: 2105, confidence: 0.93, color: "var(--rose)" },
  { name: "Wellness Agent", type: "wellness", actions: 1534, confidence: 0.89, color: "var(--emerald)" },
  { name: "Life Events Agent", type: "life_events", actions: 678, confidence: 0.87, color: "var(--gold)" },
  { name: "Relationship Manager", type: "relationship", actions: 3421, confidence: 0.95, color: "var(--cyan)" },
];

const fallbackRecentActions = [
  { agent: "Wellness Agent", action: "Financial score computed", customer: "Aarav Sharma", time: "2 min ago", confidence: 0.94 },
  { agent: "Life Events Agent", action: "Salary increase detected", customer: "Priya Patel", time: "5 min ago", confidence: 0.91 },
  { agent: "Acquisition Agent", action: "KYC verification initiated", customer: "Vikram Singh", time: "8 min ago", confidence: 0.96 },
  { agent: "Engagement Agent", action: "Personalized offer sent", customer: "Sneha Gupta", time: "12 min ago", confidence: 0.88 },
  { agent: "Adoption Agent", action: "YONO setup guided", customer: "Rohan Verma", time: "15 min ago", confidence: 0.93 },
  { agent: "Relationship Manager", action: "Loan query resolved", customer: "Anjali Mehta", time: "18 min ago", confidence: 0.97 },
];

const fallbackWeeklyAgentActivity = [
  { day: "Mon", actions: 1250 },
  { day: "Tue", actions: 1380 },
  { day: "Wed", actions: 1540 },
  { day: "Thu", actions: 1420 },
  { day: "Fri", actions: 1680 },
  { day: "Sat", actions: 920 },
  { day: "Sun", actions: 640 },
];

function formatTimeAgo(isoString: string) {
  if (!isoString) return "Just now";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } catch {
    return "Recently";
  }
}

const getKpiColorAndIcon = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("total customers")) return { icon: "👥", color: "var(--cyan)" };
  if (normalized.includes("acquisition")) return { icon: "🎯", color: "var(--violet)" };
  if (normalized.includes("conversion")) return { icon: "📊", color: "var(--cyan)" };
  if (normalized.includes("digital adoption")) return { icon: "📱", color: "var(--emerald)" };
  if (normalized.includes("yono")) return { icon: "📲", color: "var(--gold)" };
  if (normalized.includes("upi")) return { icon: "💳", color: "var(--rose)" };
  if (normalized.includes("engagement")) return { icon: "📈", color: "var(--cyan)" };
  if (normalized.includes("retention")) return { icon: "🛡️", color: "var(--emerald)" };
  if (normalized.includes("wellness")) return { icon: "❤️", color: "var(--rose)" };
  if (normalized.includes("cross-sell")) return { icon: "📦", color: "var(--violet)" };
  if (normalized.includes("revenue")) return { icon: "💰", color: "var(--gold)" };
  if (normalized.includes("agent action")) return { icon: "🤖", color: "var(--cyan)" };
  return { icon: "📊", color: "#3b82f6" };
};

const segmentMeta: Record<string, { label: string; color: string }> = {
  mass: { label: "Mass", color: "var(--cyan)" },
  mass_affluent: { label: "Mass Affluent", color: "var(--violet)" },
  affluent: { label: "Affluent", color: "var(--rose)" },
  hni: { label: "HNI", color: "var(--gold)" },
  ultra_hni: { label: "Ultra HNI", color: "var(--emerald)" },
  youth: { label: "Youth", color: "var(--cyan)" },
  senior: { label: "Senior", color: "var(--gold)" },
  nri: { label: "NRI", color: "var(--violet)" },
  business: { label: "Business", color: "var(--emerald)" },
};

const agentColorMap: Record<string, string> = {
  acquisition: "var(--cyan)",
  adoption: "var(--violet)",
  engagement: "var(--rose)",
  wellness: "var(--emerald)",
  life_events: "var(--gold)",
  relationship: "var(--cyan)",
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [kpis, setKpis] = useState(fallbackKPIs);
  const [agentStatuses, setAgentStatuses] = useState(fallbackAgentStatuses);
  const [segmentDonut, setSegmentDonut] = useState(fallbackSegmentDonut);
  const [recentActions, setRecentActions] = useState(fallbackRecentActions);
  const [weeklyAgentActivity, setWeeklyAgentActivity] = useState(fallbackWeeklyAgentActivity);

  useEffect(() => {
    setMounted(true);
    
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    const fetchData = async () => {
      // 1. Fetch KPIs
      try {
        const res = await fetch(`${API_BASE}/analytics/kpis`);
        const data = await res.json();
        if (data.kpis && data.kpis.length > 0) {
          setKpis(
            data.kpis.map((k: any) => {
              const meta = getKpiColorAndIcon(k.name);
              let formattedVal = String(k.value);
              if (typeof k.value === "number") {
                if (k.name.includes("Rate") || k.name.includes("Adoption") || k.name.includes("Activation") || k.name.includes("Retention")) {
                  formattedVal = `${k.value}%`;
                } else if (k.name.includes("Revenue")) {
                  formattedVal = `₹${k.value}Cr`;
                } else {
                  formattedVal = k.value.toLocaleString();
                }
              }
              return {
                name: k.name,
                value: formattedVal,
                change: `+${k.change}%`,
                icon: meta.icon,
                color: meta.color,
              };
            })
          );
        }
      } catch (err) {
        console.error("Failed to fetch KPIs:", err);
      }

      // 2. Fetch Agent Statuses
      try {
        const res = await fetch(`${API_BASE}/agents/status`);
        const data = await res.json();
        if (data.agents && data.agents.length > 0) {
          setAgentStatuses(
            data.agents.map((a: any) => ({
              name: a.name,
              type: a.type,
              actions: a.total_actions,
              confidence: a.avg_confidence,
              color: agentColorMap[a.type] || "var(--cyan)",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch Agent Status:", err);
      }

      // 3. Fetch Customer Segments
      try {
        const res = await fetch(`${API_BASE}/customers/segments`);
        const data = await res.json();
        if (data.segments) {
          setSegmentDonut(
            Object.entries(data.segments).map(([key, val]) => {
              const meta = segmentMeta[key] || { label: key, color: "#94a3b8" };
              return {
                name: meta.label,
                value: val as number,
                color: meta.color,
              };
            })
          );
        }
      } catch (err) {
        console.error("Failed to fetch Customer Segments:", err);
      }

      // 4. Fetch Recent Actions
      try {
        const res = await fetch(`${API_BASE}/agents/actions?limit=6`);
        const data = await res.json();
        if (data.actions && data.actions.length > 0) {
          setRecentActions(
            data.actions.map((a: any) => {
              const agentNameShort = a.agent_name.replace(" Agent", "").replace(" Prediction", "");
              return {
                agent: agentNameShort,
                action: a.action,
                customer: a.customer_name || "General System",
                time: formatTimeAgo(a.timestamp),
                confidence: a.confidence,
              };
            })
          );
        }
      } catch (err) {
        console.error("Failed to fetch Recent Actions:", err);
      }

      // 5. Fetch Weekly Agent Activity
      try {
        const res = await fetch(`${API_BASE}/analytics/agent-performance`);
        const data = await res.json();
        if (data.agents && data.agents.length > 0) {
          const nameMap: Record<string, string> = {
            acquisition: "Acq",
            adoption: "Adopt",
            engagement: "Eng",
            wellness: "Well",
            life_events: "Life",
            relationship: "RM",
          };
          setWeeklyAgentActivity(
            data.agents.map((a: any) => ({
              day: nameMap[a.agent_type] || a.agent_type,
              actions: a.total_actions,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch Agent Performance:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}>
      {/* KPI Grid */}
      <div className="kpi-grid" style={{ marginBottom: 32 }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="glass-card metallic-shine" style={{
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            borderLeft: `3px solid ${kpi.color}`,
          }}>
            {/* Hologram card chip for sleek fintech styling */}
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

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: `${kpi.color}10`, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 22, border: `1px solid ${kpi.color}20`,
                boxShadow: `0 0 15px ${kpi.color}08`,
              }}>
                {kpi.icon}
              </div>
              <span style={{
                padding: "4px 10px", borderRadius: "var(--radius-full)",
                background: "rgba(0, 230, 118, 0.12)", color: "var(--emerald)",
                fontSize: 11, fontWeight: 700,
                border: "1px solid rgba(0, 230, 118, 0.2)",
              }}>
                {kpi.change}
              </span>
            </div>
            <div className="fintech-num" style={{ fontSize: 30, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6, fontWeight: 500 }}>{kpi.name}</div>
            {/* Mini sparkline */}
            <div style={{ marginTop: 12, height: 30 }}>
              <ResponsiveContainer width="100%" height={30}>
                <AreaChart data={sparkData7d} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                  <Area type="monotone" dataKey="v" stroke={kpi.color} fill={kpi.color} fillOpacity={0.05} strokeWidth={1.5} dot={false} />
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
              <Bar dataKey="actions" name="Actions" radius={[6, 6, 0, 0]} fill="var(--cyan)">
                {weeklyAgentActivity.map((_, i) => (
                  <Cell key={i} fill={i === 4 ? "var(--emerald)" : "rgba(0, 229, 255, 0.45)"} />
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
            { icon: "💬", label: "Chat with AI Assistant", href: "/dashboard/assistant", color: "var(--cyan)" },
            { icon: "🧬", label: "View Digital Twin", href: "/dashboard/digital-twin", color: "var(--violet)" },
            { icon: "❤️", label: "Financial Health Check", href: "/dashboard/wellness", color: "var(--rose)" },
            { icon: "🎯", label: "View Recommendations", href: "/dashboard/products", color: "var(--gold)" },
            { icon: "📉", label: "Analytics Dashboard", href: "/dashboard/analytics", color: "var(--cyan)" },
            { icon: "🛡️", label: "Compliance Status", href: "/dashboard/compliance", color: "var(--emerald)" },
          ].map((action, i) => (
            <a key={i} href={action.href} style={{
              padding: "16px 20px", borderRadius: "var(--radius-md)",
              background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex", alignItems: "center", gap: 12,
              textDecoration: "none", color: "var(--text-primary)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.borderColor = action.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
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
