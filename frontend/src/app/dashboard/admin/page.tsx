"use client";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, Legend,
} from "recharts";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ScoreGauge from "@/components/ScoreGauge";

const tooltipStyle = {
  backgroundColor: "rgba(15, 22, 41, 0.95)",
  border: "1px solid rgba(99, 115, 175, 0.3)",
  borderRadius: 12, padding: "12px 16px",
  color: "#f1f5f9", fontSize: 13,
};

const systemHealth = [
  { service: "FastAPI Backend", status: "active" as const, uptime: "99.97%", latency: "45ms", icon: "🖥️" },
  { service: "PostgreSQL", status: "active" as const, uptime: "99.99%", latency: "12ms", icon: "🗄️" },
  { service: "ChromaDB", status: "active" as const, uptime: "99.95%", latency: "28ms", icon: "🧠" },
  { service: "AI Agent Cluster", status: "active" as const, uptime: "99.90%", latency: "155ms", icon: "🤖" },
  { service: "Redis Cache", status: "active" as const, uptime: "99.98%", latency: "3ms", icon: "⚡" },
  { service: "Next.js Frontend", status: "active" as const, uptime: "99.99%", latency: "32ms", icon: "🌐" },
];

const apiUsage = [
  { hour: "6AM", requests: 120 }, { hour: "8AM", requests: 450 },
  { hour: "10AM", requests: 820 }, { hour: "12PM", requests: 950 },
  { hour: "2PM", requests: 1100 }, { hour: "4PM", requests: 980 },
  { hour: "6PM", requests: 1250 }, { hour: "8PM", requests: 870 },
  { hour: "10PM", requests: 540 }, { hour: "12AM", requests: 180 },
];

const dbStats = [
  { table: "customer_profiles", rows: 500, size: "2.4 MB" },
  { table: "transactions", rows: 52340, size: "18.6 MB" },
  { table: "digital_twins", rows: 500, size: "1.8 MB" },
  { table: "recommendations", rows: 1650, size: "0.8 MB" },
  { table: "engagement_logs", rows: 6250, size: "2.1 MB" },
  { table: "life_events", rows: 780, size: "0.4 MB" },
  { table: "agent_actions", rows: 850, size: "0.6 MB" },
  { table: "financial_scores", rows: 500, size: "0.3 MB" },
  { table: "audit_logs", rows: 500, size: "0.2 MB" },
];

const users = [
  { email: "admin@sbi-smartlife.ai", role: "Admin", status: "active" as const, lastLogin: "5 min ago" },
  { email: "demo@sbi-smartlife.ai", role: "Customer", status: "active" as const, lastLogin: "2 hrs ago" },
  { email: "manager@sbi-smartlife.ai", role: "Manager", status: "active" as const, lastLogin: "1 day ago" },
];

const config = [
  { key: "AI_MODE", value: "simulated", desc: "Agent response mode (simulated | live)" },
  { key: "AI_MODEL", value: "gemini-2.5-flash", desc: "Primary LLM model" },
  { key: "AI_TEMPERATURE", value: "0.7", desc: "Response creativity level" },
  { key: "RATE_LIMIT", value: "100/min", desc: "API rate limiting per user" },
  { key: "JWT_EXPIRY", value: "60 min", desc: "Access token lifetime" },
  { key: "CHROMA_COLLECTION", value: "sbi_customer_embeddings", desc: "Vector store collection" },
];

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}>
      <PageHeader title="Admin Dashboard" icon="⚙️" subtitle="System health • Database stats • User management • Configuration" />

      {/* System Health Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 32 }}>
        {systemHealth.map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{s.service}</div>
            <StatusBadge status={s.status} />
            <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              <div>
                <div style={{ fontFamily: "Outfit", fontSize: 14, fontWeight: 700, color: "#10b981" }}>{s.uptime}</div>
                <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Uptime</div>
              </div>
              <div>
                <div style={{ fontFamily: "Outfit", fontSize: 14, fontWeight: 700, color: "#3b82f6" }}>{s.latency}</div>
                <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Latency</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Row: API Usage + DB Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📈 API Requests (Today)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={apiUsage} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,175,0.1)" />
              <XAxis dataKey="hour" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="requests" name="Requests" radius={[6, 6, 0, 0]} fill="#3b82f6">
                {apiUsage.map((_, i) => (
                  <Cell key={i} fill={i === 6 ? "#10b981" : "#3b82f680"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🗄️ Database Statistics</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <th style={{ padding: "8px 12px", fontSize: 12, color: "var(--text-muted)", textAlign: "left" }}>Table</th>
                <th style={{ padding: "8px 12px", fontSize: 12, color: "var(--text-muted)", textAlign: "right" }}>Rows</th>
                <th style={{ padding: "8px 12px", fontSize: 12, color: "var(--text-muted)", textAlign: "right" }}>Size</th>
              </tr>
            </thead>
            <tbody>
              {dbStats.map((db, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "8px 12px", fontSize: 12, color: "var(--text-secondary)", fontFamily: "monospace" }}>{db.table}</td>
                  <td style={{ padding: "8px 12px", fontSize: 12, color: "var(--text-primary)", fontWeight: 600, textAlign: "right" }}>{db.rows.toLocaleString()}</td>
                  <td style={{ padding: "8px 12px", fontSize: 12, color: "var(--text-muted)", textAlign: "right" }}>{db.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>
            Total: {dbStats.reduce((s, d) => s + d.rows, 0).toLocaleString()} rows • ~28.2 MB
          </div>
        </div>
      </div>

      {/* Row: Users + Config */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>👤 User Management</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {["Email", "Role", "Status", "Last Login"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", fontSize: 12, color: "var(--text-muted)", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px", fontSize: 13, color: "var(--text-primary)" }}>{u.email}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "var(--radius-full)", fontSize: 11, fontWeight: 600,
                      background: u.role === "Admin" ? "rgba(244,63,94,0.1)" : "rgba(59,130,246,0.1)",
                      color: u.role === "Admin" ? "#f43f5e" : "#3b82f6",
                    }}>{u.role}</span>
                  </td>
                  <td style={{ padding: "12px" }}><StatusBadge status={u.status} /></td>
                  <td style={{ padding: "12px", fontSize: 12, color: "var(--text-muted)" }}>{u.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>⚙️ System Configuration</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {config.map((c, i) => (
              <div key={i} style={{
                padding: "10px 14px", borderRadius: "var(--radius-sm)",
                background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "monospace" }}>{c.key}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.desc}</div>
                </div>
                <span style={{
                  padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: 12,
                  background: "rgba(59,130,246,0.1)", color: "var(--sbi-blue-300)", fontFamily: "monospace",
                }}>{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
