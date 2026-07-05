"use client";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, AreaChart, Area, Legend,
} from "recharts";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

const tooltipStyle = {
  backgroundColor: "rgba(15, 22, 41, 0.95)",
  border: "1px solid rgba(99, 115, 175, 0.3)",
  borderRadius: 12, padding: "12px 16px",
  color: "#f1f5f9", fontSize: 13,
};

const eventTypeDistribution = [
  { type: "Salary Increase", count: 125, color: "#10b981", icon: "📈" },
  { type: "Home Purchase", count: 68, color: "#3b82f6", icon: "🏠" },
  { type: "Marriage", count: 42, color: "#ec4899", icon: "💒" },
  { type: "Child Education", count: 55, color: "#8b5cf6", icon: "📚" },
  { type: "Vehicle Purchase", count: 38, color: "#06b6d4", icon: "🚗" },
  { type: "Retirement", count: 30, color: "#f59e0b", icon: "🌴" },
  { type: "Business Expansion", count: 22, color: "#f43f5e", icon: "📊" },
];

const detectionTrend = [
  { month: "Jan", detected: 45, predicted: 80 },
  { month: "Feb", detected: 52, predicted: 85 },
  { month: "Mar", detected: 58, predicted: 92 },
  { month: "Apr", detected: 65, predicted: 98 },
  { month: "May", detected: 72, predicted: 105 },
  { month: "Jun", detected: 78, predicted: 112 },
];

const confidenceDistribution = [
  { range: "90-100%", count: 85, color: "#10b981" },
  { range: "80-89%", count: 120, color: "#3b82f6" },
  { range: "70-79%", count: 95, color: "#f59e0b" },
  { range: "60-69%", count: 55, color: "#ec4899" },
  { range: "50-59%", count: 25, color: "#f43f5e" },
];

const recentEvents = [
  { customer: "Priya Patel", event: "Salary Increase", confidence: 92, method: "Income change analysis", date: "Jul 3, 2026", status: "detected" as const, icon: "📈", action: "SIP + Tax-saving recommendations sent" },
  { customer: "Vikram Singh", event: "Home Purchase Intent", confidence: 87, method: "Search + savings pattern", date: "Jul 2, 2026", status: "predicted" as const, icon: "🏠", action: "Home loan pre-approval initiated" },
  { customer: "Aarav Sharma", event: "Child Education Planning", confidence: 78, method: "Age + spending shift", date: "Jul 1, 2026", status: "predicted" as const, icon: "📚", action: "Education loan options presented" },
  { customer: "Sneha Gupta", event: "Vehicle Purchase", confidence: 72, method: "Transaction pattern", date: "Jun 30, 2026", status: "predicted" as const, icon: "🚗", action: "Auto loan comparison sent" },
  { customer: "Rohan Verma", event: "Marriage", confidence: 68, method: "Behavioral signals", date: "Jun 28, 2026", status: "predicted" as const, icon: "💒", action: "Personal loan + insurance bundle suggested" },
  { customer: "Anjali Mehta", event: "Business Expansion", confidence: 85, method: "Transaction volume increase", date: "Jun 27, 2026", status: "detected" as const, icon: "📊", action: "Business loan options recommended" },
];

export default function LifeEventsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalEvents = eventTypeDistribution.reduce((s, e) => s + e.count, 0);

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}>
      <PageHeader
        title="Life Event Detection"
        icon="🔮"
        subtitle="AI-powered detection • Proactive banking recommendations • Pattern analysis"
        action={<StatusBadge status="active" label={`${totalEvents} events detected`} />}
      />

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Events Detected", value: totalEvents, icon: "🔮", color: "#8b5cf6" },
          { label: "Avg Confidence", value: "82.5%", icon: "🎯", color: "#3b82f6" },
          { label: "Actions Triggered", value: "285", icon: "⚡", color: "#10b981" },
          { label: "Revenue Impact", value: "₹18.5Cr", icon: "💰", color: "#f59e0b" },
        ].map((card, i) => (
          <div key={i} className="glass-card" style={{ padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontFamily: "Outfit", fontSize: 32, fontWeight: 800, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Row: Event Type Bar + Confidence Pie + Detection Trend */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 1fr", gap: 24, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📊 Events by Type</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={eventTypeDistribution} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,175,0.1)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <YAxis type="category" dataKey="type" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} width={100} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" name="Events" radius={[0, 6, 6, 0]}>
                {eventTypeDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🎯 Confidence Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={confidenceDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="count">
                {confidenceDistribution.map((c, i) => <Cell key={i} fill={c.color} stroke="transparent" />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 8 }}>
            {confidenceDistribution.map((c, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "var(--text-muted)" }}>
                <span style={{ width: 6, height: 6, borderRadius: 2, background: c.color }} /> {c.range}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📈 Detection vs Prediction Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={detectionTrend} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,175,0.1)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="detected" name="Confirmed" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Events Timeline */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📅 Recent Life Events</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recentEvents.map((event, i) => (
            <div key={i} style={{
              padding: "16px 20px", borderRadius: "var(--radius-md)",
              background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
              borderLeft: `3px solid ${event.status === "detected" ? "#10b981" : "#8b5cf6"}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              flexWrap: "wrap", gap: 12,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 32 }}>{event.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{event.event}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    {event.customer} • {event.method}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--sbi-blue-300)", marginTop: 4 }}>
                    → {event.action}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 800, color: event.confidence > 80 ? "#10b981" : "#f59e0b" }}>
                    {event.confidence}%
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{event.date}</div>
                </div>
                <StatusBadge status={event.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
