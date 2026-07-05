"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
} from "recharts";
import PageHeader from "@/components/PageHeader";
import LoadingSkeleton from "@/components/LoadingSkeleton";

/* ───── Static demo data for charts ───── */
const monthlyTrends = [
  { month: "Jan", customers: 412, adoption: 58, engagement: 62, revenue: 98 },
  { month: "Feb", customers: 425, adoption: 61, engagement: 65, revenue: 105 },
  { month: "Mar", customers: 438, adoption: 63, engagement: 66, revenue: 110 },
  { month: "Apr", customers: 449, adoption: 65, engagement: 68, revenue: 117 },
  { month: "May", customers: 461, adoption: 68, engagement: 71, revenue: 125 },
  { month: "Jun", customers: 474, adoption: 70, engagement: 73, revenue: 130 },
  { month: "Jul", customers: 482, adoption: 71, engagement: 74, revenue: 133 },
  { month: "Aug", customers: 490, adoption: 72, engagement: 75, revenue: 136 },
  { month: "Sep", customers: 495, adoption: 73, engagement: 76, revenue: 138 },
  { month: "Oct", customers: 498, adoption: 74, engagement: 77, revenue: 140 },
  { month: "Nov", customers: 500, adoption: 75, engagement: 78, revenue: 142 },
  { month: "Dec", customers: 500, adoption: 76, engagement: 79, revenue: 145 },
];

const funnelData = [
  { stage: "Leads Generated", count: 1250, fill: "#3b82f6" },
  { stage: "Qualified Leads", count: 900, fill: "#6366f1" },
  { stage: "KYC Initiated", count: 700, fill: "#8b5cf6" },
  { stage: "KYC Completed", count: 550, fill: "#a855f7" },
  { stage: "Account Opened", count: 500, fill: "#10b981" },
  { stage: "First Transaction", count: 425, fill: "#06b6d4" },
  { stage: "Active Customer", count: 350, fill: "#f59e0b" },
];

const segmentData = [
  { name: "Mass Market", value: 150, color: "#3b82f6" },
  { name: "Mass Affluent", value: 175, color: "#8b5cf6" },
  { name: "Affluent", value: 100, color: "#06b6d4" },
  { name: "HNI", value: 50, color: "#f59e0b" },
  { name: "Ultra HNI", value: 25, color: "#10b981" },
];

const channelData = [
  { name: "Mobile App", value: 3850, color: "#3b82f6" },
  { name: "Web", value: 1720, color: "#8b5cf6" },
  { name: "WhatsApp", value: 890, color: "#10b981" },
  { name: "SMS", value: 620, color: "#f59e0b" },
  { name: "Email", value: 480, color: "#06b6d4" },
  { name: "Branch", value: 340, color: "#ec4899" },
];

const agentRadar = [
  { metric: "Accuracy", acquisition: 94, adoption: 91, engagement: 93, wellness: 89, lifeEvents: 87, relationship: 95 },
  { metric: "Speed", acquisition: 88, adoption: 92, engagement: 85, wellness: 90, lifeEvents: 86, relationship: 91 },
  { metric: "Volume", acquisition: 72, adoption: 65, engagement: 85, wellness: 78, lifeEvents: 55, relationship: 90 },
  { metric: "Satisfaction", acquisition: 90, adoption: 88, engagement: 92, wellness: 93, lifeEvents: 85, relationship: 96 },
  { metric: "Conversion", acquisition: 85, adoption: 78, engagement: 80, wellness: 75, lifeEvents: 70, relationship: 88 },
];

const revenueData = [
  { month: "Jan", crossSell: 32, upsell: 18, newAcquisition: 48 },
  { month: "Feb", crossSell: 35, upsell: 20, newAcquisition: 50 },
  { month: "Mar", crossSell: 38, upsell: 22, newAcquisition: 50 },
  { month: "Apr", crossSell: 40, upsell: 24, newAcquisition: 53 },
  { month: "May", crossSell: 42, upsell: 26, newAcquisition: 57 },
  { month: "Jun", crossSell: 45, upsell: 28, newAcquisition: 57 },
  { month: "Jul", crossSell: 46, upsell: 29, newAcquisition: 58 },
  { month: "Aug", crossSell: 48, upsell: 30, newAcquisition: 58 },
  { month: "Sep", crossSell: 49, upsell: 31, newAcquisition: 58 },
  { month: "Oct", crossSell: 50, upsell: 32, newAcquisition: 58 },
  { month: "Nov", crossSell: 51, upsell: 33, newAcquisition: 58 },
  { month: "Dec", crossSell: 52, upsell: 35, newAcquisition: 58 },
];

const tooltipStyle = {
  backgroundColor: "rgba(15, 22, 41, 0.95)",
  border: "1px solid rgba(99, 115, 175, 0.3)",
  borderRadius: 12,
  padding: "12px 16px",
  color: "#f1f5f9",
  fontSize: 13,
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<any[]>([]);

  useEffect(() => {
    async function fetchKPIs() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/analytics/kpis`
        );
        const data = await res.json();
        setKpis(data.kpis || []);
      } catch {
        // Fallback KPIs
        setKpis([
          { name: "Total Customers", value: 500, change: 12.5, icon: "👥", color: "#3b82f6" },
          { name: "Acquisition Rate", value: "8.3%", change: 2.1, icon: "🎯", color: "#8b5cf6" },
          { name: "Conversion Rate", value: "34.2%", change: 3.4, icon: "📊", color: "#06b6d4" },
          { name: "Digital Adoption", value: "72.4%", change: 5.2, icon: "📱", color: "#10b981" },
          { name: "YONO Adoption", value: "68.5%", change: 4.1, icon: "📲", color: "#f59e0b" },
          { name: "UPI Activation", value: "78.3%", change: 6.8, icon: "💳", color: "#ec4899" },
          { name: "Engagement Score", value: "76.8", change: 1.5, icon: "📈", color: "#06b6d4" },
          { name: "Retention Rate", value: "94.2%", change: 0.8, icon: "🛡️", color: "#10b981" },
          { name: "Wellness Score", value: "72.5", change: 2.3, icon: "❤️", color: "#f43f5e" },
          { name: "Cross-Sell Rate", value: "23.5%", change: 4.7, icon: "📦", color: "#8b5cf6" },
          { name: "Revenue Impact", value: "₹142.8Cr", change: 15.3, icon: "💰", color: "#f9a825" },
          { name: "Agent Actions", value: "8,421", change: 8.1, icon: "🤖", color: "#3b82f6" },
        ]);
      }
      setLoading(false);
    }
    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader title="Analytics" icon="📉" subtitle="Loading business intelligence..." />
        <LoadingSkeleton rows={12} type="card" />
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out", display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader
        title="Analytics & Business Intelligence"
        icon="📉"
        subtitle="Real-time KPIs • AI-driven insights • Multi-agent performance metrics"
      />

      {/* ═══════ KPI Cards Grid ═══════ */}
      <div className="kpi-grid">
        {kpis.map((kpi: any, i: number) => (
          <div key={i} className="glass-card" style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `${kpi.color || "#3b82f6"}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, border: `1px solid ${kpi.color || "#3b82f6"}25`,
              }}>
                {kpi.icon || "📊"}
              </div>
              <span style={{
                padding: "4px 10px", borderRadius: "var(--radius-full)",
                background: "rgba(16,185,129,0.1)", color: "#10b981",
                fontSize: 12, fontWeight: 600,
              }}>
                +{kpi.change}%
              </span>
            </div>
            <div style={{ fontFamily: "Outfit", fontSize: 28, fontWeight: 800, color: "var(--text-primary)" }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{kpi.name}</div>
          </div>
        ))}
      </div>

      {/* ═══════ Row 1: Monthly Trends + Acquisition Funnel ═══════ */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Monthly Trends LineChart */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
            📈 Monthly Growth Trends
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyTrends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,175,0.1)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={{ stroke: "rgba(99,115,175,0.15)" }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={{ stroke: "rgba(99,115,175,0.15)" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Line type="monotone" dataKey="customers" name="Customers" stroke="#3b82f6" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="adoption" name="Adoption %" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="engagement" name="Engagement %" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Acquisition Funnel */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
            🎯 Acquisition Funnel
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {funnelData.map((item, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item.stage}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{item.count}</span>
                </div>
                <div style={{ height: 24, borderRadius: 6, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 6, background: item.fill,
                    width: `${(item.count / funnelData[0].count) * 100}%`,
                    transition: "width 1s ease",
                    display: "flex", alignItems: "center", paddingLeft: 8,
                  }}>
                    <span style={{ fontSize: 10, color: "white", fontWeight: 600 }}>
                      {Math.round((item.count / funnelData[0].count) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ Row 2: Revenue Impact + Customer Segments + Channel Distribution ═══════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 24 }}>
        {/* Revenue Impact AreaChart */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
            💰 AI-Driven Revenue Impact (₹ Cr)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,175,0.1)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={{ stroke: "rgba(99,115,175,0.15)" }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={{ stroke: "rgba(99,115,175,0.15)" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="crossSell" name="Cross-Sell" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="upsell" name="Upsell" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
              <Area type="monotone" dataKey="newAcquisition" name="New Acquisition" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Segments PieChart */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
            👥 Customer Segments
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={segmentData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {segmentData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8 }}>
            {segmentData.map((s, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-muted)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} /> {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* Channel Distribution PieChart */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
            📱 Channel Distribution
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {channelData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8 }}>
            {channelData.map((c, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-muted)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} /> {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ Row 3: Agent Performance Radar + Cohort Table ═══════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Agent Performance RadarChart */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
            🤖 Multi-Agent Performance Radar
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={agentRadar}>
              <PolarGrid stroke="rgba(99,115,175,0.15)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
              <Radar name="Acquisition" dataKey="acquisition" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Engagement" dataKey="engagement" stroke="#ec4899" fill="#ec4899" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="Wellness" dataKey="wellness" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="Relationship" dataKey="relationship" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Cohort Segmentation Table */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
            📊 Cohort Penetration & Growth
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)", fontSize: 13 }}>
                  <th style={{ padding: "12px 16px" }}>Cohort</th>
                  <th style={{ padding: "12px 16px" }}>Size</th>
                  <th style={{ padding: "12px 16px" }}>Adoption</th>
                  <th style={{ padding: "12px 16px" }}>Growth</th>
                  <th style={{ padding: "12px 16px" }}>CLV</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { segment: "Mass Market", size: 150, adoption: "68%", growth: "+3.1%", clv: "₹45K" },
                  { segment: "Mass Affluent", size: 175, adoption: "78%", growth: "+4.5%", clv: "₹1.2L" },
                  { segment: "Affluent", size: 100, adoption: "82%", growth: "+6.2%", clv: "₹3.5L" },
                  { segment: "HNI", size: 50, adoption: "89%", growth: "+8.0%", clv: "₹12L" },
                  { segment: "Ultra HNI", size: 25, adoption: "95%", growth: "+10.5%", clv: "₹50L" },
                ].map((coh, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)", fontSize: 14 }}>
                    <td style={{ padding: "16px", fontWeight: 600, color: "white" }}>{coh.segment}</td>
                    <td style={{ padding: "16px", color: "var(--text-secondary)" }}>{coh.size}</td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.05)" }}>
                          <div style={{ height: "100%", borderRadius: 3, background: "#3b82f6", width: coh.adoption, transition: "width 1s" }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{coh.adoption}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px", color: "#10b981", fontWeight: 600 }}>{coh.growth}</td>
                    <td style={{ padding: "16px", color: "#f59e0b", fontWeight: 600 }}>{coh.clv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Digital Adoption Mini Bar Chart */}
          <div style={{ marginTop: 32 }}>
            <h4 style={{ fontFamily: "Outfit", fontSize: 15, fontWeight: 600, marginBottom: 16, color: "var(--text-secondary)" }}>
              📲 Digital Service Adoption
            </h4>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={[
                { service: "YONO", rate: 68.5 },
                { service: "UPI", rate: 78.3 },
                { service: "Net Banking", rate: 65.2 },
                { service: "Mobile", rate: 72.4 },
                { service: "Insurance", rate: 35.8 },
                { service: "MF/SIP", rate: 42.1 },
              ]} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,175,0.1)" />
                <XAxis dataKey="service" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="rate" name="Adoption %" radius={[6, 6, 0, 0]}>
                  {[
                    "#3b82f6", "#10b981", "#8b5cf6", "#06b6d4", "#f59e0b", "#ec4899",
                  ].map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
