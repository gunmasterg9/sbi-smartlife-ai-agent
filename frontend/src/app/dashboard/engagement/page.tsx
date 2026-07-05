"use client";
import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";
import PageHeader from "@/components/PageHeader";
import ScoreGauge from "@/components/ScoreGauge";

const tooltipStyle = {
  backgroundColor: "rgba(15, 22, 41, 0.95)",
  border: "1px solid rgba(99, 115, 175, 0.3)",
  borderRadius: 12, padding: "12px 16px",
  color: "#f1f5f9", fontSize: 13,
};

const engagementTrend = [
  { week: "W1", app: 3200, web: 1100, sms: 400, email: 350, whatsapp: 600 },
  { week: "W2", app: 3400, web: 1200, sms: 380, email: 420, whatsapp: 650 },
  { week: "W3", app: 3600, web: 1350, sms: 350, email: 480, whatsapp: 720 },
  { week: "W4", app: 3850, web: 1500, sms: 320, email: 510, whatsapp: 800 },
];

const channelPie = [
  { name: "Mobile App", value: 3850, color: "#3b82f6" },
  { name: "Web", value: 1500, color: "#8b5cf6" },
  { name: "WhatsApp", value: 800, color: "#10b981" },
  { name: "SMS", value: 320, color: "#f59e0b" },
  { name: "Email", value: 510, color: "#06b6d4" },
  { name: "Branch", value: 220, color: "#ec4899" },
];

const actionDistribution = [
  { action: "Balance Check", count: 2850, color: "#3b82f6" },
  { action: "Fund Transfer", count: 1920, color: "#10b981" },
  { action: "Bill Payment", count: 1540, color: "#8b5cf6" },
  { action: "Product View", count: 1230, color: "#f59e0b" },
  { action: "Offer Click", count: 980, color: "#ec4899" },
  { action: "SIP Setup", count: 420, color: "#06b6d4" },
];

const retentionCohorts = [
  { cohort: "Jan 2026", m1: 95, m2: 91, m3: 88, m4: 85, m5: 83, m6: 82 },
  { cohort: "Feb 2026", m1: 96, m2: 92, m3: 89, m4: 87, m5: 85, m6: null },
  { cohort: "Mar 2026", m1: 97, m2: 94, m3: 91, m4: 89, m5: null, m6: null },
  { cohort: "Apr 2026", m1: 95, m2: 92, m3: 90, m4: null, m5: null, m6: null },
  { cohort: "May 2026", m1: 96, m2: 93, m3: null, m4: null, m5: null, m6: null },
  { cohort: "Jun 2026", m1: 97, m2: null, m3: null, m4: null, m5: null, m6: null },
];

const topOffers = [
  { offer: "Cashback on UPI", impressions: 12500, clicks: 3100, conversions: 480, ctr: "24.8%", icon: "💸" },
  { offer: "SIP Starter Pack", impressions: 8900, clicks: 2200, conversions: 320, ctr: "24.7%", icon: "📈" },
  { offer: "Credit Card Upgrade", impressions: 7600, clicks: 1800, conversions: 250, ctr: "23.7%", icon: "💳" },
  { offer: "Insurance Bundle", impressions: 6400, clicks: 1100, conversions: 180, ctr: "17.2%", icon: "🛡️" },
  { offer: "FD Premium Rate", impressions: 5200, clicks: 980, conversions: 150, ctr: "18.8%", icon: "🏦" },
];

export default function EngagementPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}>
      <PageHeader title="Customer Engagement" icon="📈" subtitle="Channel analytics • Retention cohorts • Offer performance" />

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Engagement Score", value: 76.8, gauge: true, color: "#3b82f6" },
          { label: "Active Users (30d)", value: "12,450", icon: "👥", color: "#10b981" },
          { label: "Sessions/User", value: "4.2", icon: "📱", color: "#8b5cf6" },
          { label: "Retention Rate", value: "94.2%", icon: "🛡️", color: "#06b6d4" },
          { label: "Churn Risk", value: "42", icon: "⚠️", color: "#f59e0b" },
        ].map((card, i) => (
          <div key={i} className="glass-card" style={{ padding: 20, textAlign: "center" }}>
            {card.gauge ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ScoreGauge score={card.value as number} size={80} strokeWidth={8} color={card.color} />
              </div>
            ) : (
              <>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{card.icon}</div>
                <div style={{ fontFamily: "Outfit", fontSize: 28, fontWeight: 800, color: card.color }}>{card.value}</div>
              </>
            )}
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Row 1: Engagement Trend + Channel Pie */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📈 Engagement by Channel (Weekly)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={engagementTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,175,0.1)" />
              <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="app" name="Mobile App" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="web" name="Web" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="whatsapp" name="WhatsApp" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Area type="monotone" dataKey="email" name="Email" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
              <Area type="monotone" dataKey="sms" name="SMS" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📱 Channel Split</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={channelPie} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {channelPie.map((c, i) => <Cell key={i} fill={c.color} stroke="transparent" />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 8 }}>
            {channelPie.map((c, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "var(--text-muted)" }}>
                <span style={{ width: 6, height: 6, borderRadius: 2, background: c.color }} /> {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Action Distribution + Retention Cohort */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>⚡ Top User Actions</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={actionDistribution} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,175,0.1)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <YAxis type="category" dataKey="action" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} width={80} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" name="Actions" radius={[0, 6, 6, 0]}>
                {actionDistribution.map((a, i) => <Cell key={i} fill={a.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Retention Cohort Heatmap */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🔄 Retention Cohort Analysis</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px 12px", fontSize: 12, color: "var(--text-muted)", textAlign: "left" }}>Cohort</th>
                  {["M1", "M2", "M3", "M4", "M5", "M6"].map(m => (
                    <th key={m} style={{ padding: "8px 12px", fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {retentionCohorts.map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: "8px 12px", fontSize: 13, color: "var(--text-secondary)" }}>{row.cohort}</td>
                    {[row.m1, row.m2, row.m3, row.m4, row.m5, row.m6].map((val, j) => (
                      <td key={j} style={{ padding: "4px", textAlign: "center" }}>
                        {val !== null ? (
                          <div style={{
                            padding: "8px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                            background: `rgba(16,185,129,${(val - 70) / 60})`,
                            color: val > 85 ? "#10b981" : "#f59e0b",
                          }}>
                            {val}%
                          </div>
                        ) : (
                          <div style={{ padding: "8px", fontSize: 12, color: "var(--text-muted)" }}>—</div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Offer Performance Table */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🎁 Offer Performance</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {["Offer", "Impressions", "Clicks", "Conversions", "CTR"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-muted)", fontWeight: 600, textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topOffers.map((o, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 600, color: "white", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{o.icon}</span> {o.offer}
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>{o.impressions.toLocaleString()}</td>
                  <td style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>{o.clicks.toLocaleString()}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 600, color: "#10b981" }}>{o.conversions.toLocaleString()}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 600, color: "#3b82f6" }}>{o.ctr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
