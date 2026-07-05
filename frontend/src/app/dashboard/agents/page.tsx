"use client";
import { useState, useEffect } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, Cell,
} from "recharts";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

const tooltipStyle = {
  backgroundColor: "rgba(15, 22, 41, 0.95)",
  border: "1px solid rgba(99, 115, 175, 0.3)",
  borderRadius: 12, padding: "12px 16px",
  color: "#f1f5f9", fontSize: 13,
};

const agents = [
  { name: "Acquisition Agent", type: "acquisition", actions: 1247, avgMs: 245, confidence: 0.94, success: 97.2, icon: "🎯", color: "#3b82f6", desc: "Lead qualification, KYC, onboarding" },
  { name: "Adoption Agent", type: "adoption", actions: 892, avgMs: 312, confidence: 0.91, success: 96.8, icon: "📱", color: "#8b5cf6", desc: "YONO, UPI, digital banking setup" },
  { name: "Engagement Agent", type: "engagement", actions: 2105, avgMs: 189, confidence: 0.93, success: 98.1, icon: "💡", color: "#ec4899", desc: "Offers, rewards, retention" },
  { name: "Wellness Agent", type: "wellness", actions: 1534, avgMs: 420, confidence: 0.89, success: 95.5, icon: "❤️", color: "#10b981", desc: "Budgets, investments, goals" },
  { name: "Life Events Agent", type: "life_events", actions: 678, avgMs: 680, confidence: 0.87, success: 94.2, icon: "🔮", color: "#f59e0b", desc: "Salary changes, life predictions" },
  { name: "Relationship Manager", type: "relationship", actions: 3421, avgMs: 155, confidence: 0.95, success: 98.7, icon: "🤝", color: "#06b6d4", desc: "General queries, multilingual chat" },
];

const radarData = [
  { metric: "Accuracy", acquisition: 94, adoption: 91, engagement: 93, wellness: 89, lifeEvents: 87, relationship: 95 },
  { metric: "Speed", acquisition: 88, adoption: 82, engagement: 92, wellness: 78, lifeEvents: 72, relationship: 95 },
  { metric: "Volume", acquisition: 72, adoption: 58, engagement: 85, wellness: 78, lifeEvents: 45, relationship: 90 },
  { metric: "Satisfaction", acquisition: 90, adoption: 88, engagement: 92, wellness: 93, lifeEvents: 85, relationship: 96 },
  { metric: "Conversion", acquisition: 85, adoption: 78, engagement: 80, wellness: 75, lifeEvents: 70, relationship: 88 },
];

const actionsOverTime = [
  { hour: "6AM", acquisition: 20, adoption: 10, engagement: 30, wellness: 25, lifeEvents: 8, relationship: 45 },
  { hour: "9AM", acquisition: 85, adoption: 45, engagement: 120, wellness: 80, lifeEvents: 35, relationship: 180 },
  { hour: "12PM", acquisition: 120, adoption: 65, engagement: 180, wellness: 110, lifeEvents: 50, relationship: 250 },
  { hour: "3PM", acquisition: 110, adoption: 70, engagement: 195, wellness: 120, lifeEvents: 55, relationship: 280 },
  { hour: "6PM", acquisition: 95, adoption: 80, engagement: 210, wellness: 140, lifeEvents: 60, relationship: 320 },
  { hour: "9PM", acquisition: 60, adoption: 55, engagement: 160, wellness: 100, lifeEvents: 40, relationship: 220 },
  { hour: "12AM", acquisition: 15, adoption: 8, engagement: 25, wellness: 15, lifeEvents: 5, relationship: 35 },
];

const recentAgentActions = [
  { agent: "Relationship Manager", action: "Loan query resolved in Hindi", customer: "Ravi Kumar", time: "1 min ago", confidence: 0.97, duration: "120ms" },
  { agent: "Wellness Agent", action: "Financial score recomputed", customer: "Aarav Sharma", time: "3 min ago", confidence: 0.94, duration: "450ms" },
  { agent: "Life Events Agent", action: "Salary increase detected (+30%)", customer: "Priya Patel", time: "5 min ago", confidence: 0.91, duration: "680ms" },
  { agent: "Acquisition Agent", action: "KYC verification completed", customer: "Vikram Singh", time: "7 min ago", confidence: 0.96, duration: "240ms" },
  { agent: "Engagement Agent", action: "Personalized offer generated", customer: "Sneha Gupta", time: "10 min ago", confidence: 0.88, duration: "180ms" },
  { agent: "Adoption Agent", action: "UPI activation guided", customer: "Rohan Verma", time: "12 min ago", confidence: 0.93, duration: "310ms" },
  { agent: "Wellness Agent", action: "SIP recommendation generated", customer: "Anjali Mehta", time: "15 min ago", confidence: 0.92, duration: "420ms" },
  { agent: "Relationship Manager", action: "Account summary in Tamil", customer: "Karthik Nair", time: "18 min ago", confidence: 0.95, duration: "140ms" },
];

export default function AgentsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalActions = agents.reduce((s, a) => s + a.actions, 0);

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}>
      <PageHeader
        title="Agent Monitoring"
        icon="🤖"
        subtitle="Multi-agent performance • Real-time actions • System health"
        action={<StatusBadge status="active" label={`${totalActions.toLocaleString()} actions today`} />}
      />

      {/* Agent Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {agents.map((agent, i) => (
          <div key={i} className="glass-card" style={{ padding: 24, borderLeft: `3px solid ${agent.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>{agent.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{agent.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{agent.desc}</div>
                </div>
              </div>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px rgba(16,185,129,0.4)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              {[
                { label: "Actions", value: agent.actions.toLocaleString(), color: agent.color },
                { label: "Avg Speed", value: `${agent.avgMs}ms`, color: agent.avgMs < 300 ? "#10b981" : "#f59e0b" },
                { label: "Confidence", value: `${(agent.confidence * 100).toFixed(0)}%`, color: "#3b82f6" },
                { label: "Success", value: `${agent.success}%`, color: "#10b981" },
              ].map((m, j) => (
                <div key={j} style={{ textAlign: "center", padding: "8px 4px", borderRadius: "var(--radius-sm)", background: "var(--bg-card)" }}>
                  <div style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 800, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Row: Radar + Actions Over Time */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🎯 Multi-Agent Comparison</h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
              <PolarGrid stroke="rgba(99,115,175,0.15)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} />
              <Radar dataKey="acquisition" name="Acquisition" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
              <Radar dataKey="engagement" name="Engagement" stroke="#ec4899" fill="#ec4899" fillOpacity={0.1} strokeWidth={2} />
              <Radar dataKey="relationship" name="Relationship" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📈 Agent Actions Over Time (Today)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={actionsOverTime} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,175,0.1)" />
              <XAxis dataKey="hour" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="relationship" name="Relationship" stroke="#06b6d4" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="engagement" name="Engagement" stroke="#ec4899" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="wellness" name="Wellness" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="acquisition" name="Acquisition" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="adoption" name="Adoption" stroke="#8b5cf6" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="lifeEvents" name="Life Events" stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Action Feed */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>⚡ Live Agent Action Feed</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {recentAgentActions.map((a, i) => (
            <div key={i} style={{
              padding: "14px 16px", borderRadius: "var(--radius-md)",
              background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              animation: "fadeIn 0.3s ease-out",
              animationDelay: `${i * 50}ms`,
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{a.action}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  {a.agent} → {a.customer} • {a.duration}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{a.time}</div>
                <span style={{
                  padding: "2px 8px", borderRadius: "var(--radius-full)", fontSize: 11, fontWeight: 600,
                  background: "rgba(16,185,129,0.1)", color: "#10b981", marginTop: 4, display: "inline-block",
                }}>
                  {(a.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
