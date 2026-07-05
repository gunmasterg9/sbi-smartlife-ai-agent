"use client";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from "recharts";
import PageHeader from "@/components/PageHeader";

const tooltipStyle = {
  backgroundColor: "rgba(15, 22, 41, 0.95)",
  border: "1px solid rgba(99, 115, 175, 0.3)",
  borderRadius: 12, padding: "12px 16px",
  color: "#f1f5f9", fontSize: 13,
};

const segmentDistribution = [
  { name: "Mass Market", count: 150, color: "#3b82f6" },
  { name: "Mass Affluent", count: 175, color: "#8b5cf6" },
  { name: "Affluent", count: 100, color: "#06b6d4" },
  { name: "HNI", count: 50, color: "#f59e0b" },
  { name: "Ultra HNI", count: 25, color: "#10b981" },
];

const geoDistribution = [
  { city: "Mumbai", count: 85 },
  { city: "Delhi", count: 72 },
  { city: "Bangalore", count: 65 },
  { city: "Hyderabad", count: 52 },
  { city: "Chennai", count: 48 },
  { city: "Kolkata", count: 40 },
  { city: "Pune", count: 38 },
  { city: "Ahmedabad", count: 35 },
  { city: "Jaipur", count: 33 },
  { city: "Others", count: 32 },
];

const ageDistribution = [
  { range: "22-25", count: 40, color: "#06b6d4" },
  { range: "26-30", count: 95, color: "#3b82f6" },
  { range: "31-35", count: 120, color: "#8b5cf6" },
  { range: "36-40", count: 90, color: "#f59e0b" },
  { range: "41-50", count: 85, color: "#ec4899" },
  { range: "51-65", count: 70, color: "#10b981" },
];

const topCustomers = [
  { name: "Vikram Singh", segment: "HNI", city: "Delhi", income: "₹24L", score: 91, products: 9, status: "active" },
  { name: "Sneha Gupta", segment: "Affluent", city: "Bangalore", income: "₹15L", score: 85, products: 7, status: "active" },
  { name: "Aarav Sharma", segment: "Affluent", city: "Mumbai", income: "₹10.2L", score: 82, products: 6, status: "active" },
  { name: "Priya Patel", segment: "Mass Affluent", city: "Ahmedabad", income: "₹7.8L", score: 74, products: 4, status: "active" },
  { name: "Rohan Verma", segment: "Mass", city: "Lucknow", income: "₹4.8L", score: 62, products: 3, status: "at-risk" },
  { name: "Anjali Mehta", segment: "Mass Affluent", city: "Pune", income: "₹8.5L", score: 78, products: 5, status: "active" },
  { name: "Karthik Nair", segment: "HNI", city: "Chennai", income: "₹20L", score: 88, products: 8, status: "active" },
  { name: "Deepa Rao", segment: "Affluent", city: "Hyderabad", income: "₹12L", score: 80, products: 6, status: "active" },
];

export default function InsightsPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState("all");
  useEffect(() => setMounted(true), []);

  const filtered = filter === "all" ? topCustomers : topCustomers.filter(c => c.segment === filter);

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}>
      <PageHeader
        title="Customer Insights"
        icon="👥"
        subtitle="Customer segmentation • Geographic analysis • Portfolio overview"
        action={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: "8px 16px", borderRadius: "var(--radius-md)", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: 13, cursor: "pointer" }}
          >
            <option value="all">All Segments</option>
            {segmentDistribution.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
        }
      />

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Customers", value: "500", icon: "👥", color: "#3b82f6" },
          { label: "Avg Wellness Score", value: "72.5", icon: "❤️", color: "#f43f5e" },
          { label: "Avg Products/Customer", value: "4.2", icon: "📦", color: "#8b5cf6" },
          { label: "At-Risk Customers", value: "42", icon: "⚠️", color: "#f59e0b" },
          { label: "KYC Verified", value: "94%", icon: "✅", color: "#10b981" },
        ].map((card, i) => (
          <div key={i} className="glass-card" style={{ padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontFamily: "Outfit", fontSize: 28, fontWeight: 800, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Segment Distribution */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📊 Segment Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={segmentDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="count">
                {segmentDistribution.map((s, i) => <Cell key={i} fill={s.color} stroke="transparent" />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 8 }}>
            {segmentDistribution.map((s, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-muted)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} /> {s.name}: {s.count}
              </span>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🗺️ Geographic Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={geoDistribution} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,175,0.1)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <YAxis type="category" dataKey="city" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} width={60} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" name="Customers" fill="#3b82f6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Age Distribution */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📅 Age Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ageDistribution} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,175,0.1)" />
              <XAxis dataKey="range" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" name="Customers" radius={[6, 6, 0, 0]}>
                {ageDistribution.map((a, i) => <Cell key={i} fill={a.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Table */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>👤 Customer Portfolio</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {["Customer", "Segment", "City", "Income", "Wellness", "Products", "Status"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-muted)", fontWeight: 600, textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "14px 16px", fontWeight: 600, color: "white" }}>{c.name}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: "var(--radius-full)", background: "rgba(59,130,246,0.1)", color: "var(--sbi-blue-300)", fontSize: 12 }}>{c.segment}</span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: 14 }}>{c.city}</td>
                  <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: 14 }}>{c.income}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontFamily: "Outfit", fontWeight: 700, color: c.score >= 80 ? "#10b981" : c.score >= 60 ? "#f59e0b" : "#f43f5e" }}>{c.score}</span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: 14 }}>{c.products}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: "var(--radius-full)", fontSize: 11, fontWeight: 600,
                      background: c.status === "active" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                      color: c.status === "active" ? "#10b981" : "#f59e0b",
                    }}>
                      {c.status === "active" ? "● Active" : "⚠ At Risk"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
