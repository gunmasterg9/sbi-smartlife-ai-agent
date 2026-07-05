"use client";
import { useState, useEffect } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import ScoreGauge from "@/components/ScoreGauge";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

const tooltipStyle = {
  backgroundColor: "rgba(15, 22, 41, 0.95)",
  border: "1px solid rgba(99, 115, 175, 0.3)",
  borderRadius: 12, padding: "12px 16px",
  color: "#f1f5f9", fontSize: 13,
};

const customers = [
  { id: "1", name: "Aarav Sharma", segment: "Affluent", city: "Mumbai", income: "₹10,20,000/yr", occupation: "Software Engineer", since: "2019", products: 6, branch: "SBI Andheri West", health: 82, engagement: 78, churn: 12 },
  { id: "2", name: "Priya Patel", segment: "Mass Affluent", city: "Ahmedabad", income: "₹7,80,000/yr", occupation: "Teacher", since: "2020", products: 4, branch: "SBI Navrangpura", health: 74, engagement: 65, churn: 18 },
  { id: "3", name: "Vikram Singh", segment: "HNI", city: "Delhi", income: "₹24,00,000/yr", occupation: "Business Owner", since: "2017", products: 9, branch: "SBI Connaught Place", health: 91, engagement: 88, churn: 5 },
  { id: "4", name: "Sneha Gupta", segment: "Affluent", city: "Bangalore", income: "₹15,00,000/yr", occupation: "Doctor", since: "2018", products: 7, branch: "SBI Indiranagar", health: 85, engagement: 72, churn: 10 },
  { id: "5", name: "Rohan Verma", segment: "Mass", city: "Lucknow", income: "₹4,80,000/yr", occupation: "Government Employee", since: "2021", products: 3, branch: "SBI Hazratganj", health: 62, engagement: 55, churn: 25 },
];

function getCustomerData(c: typeof customers[0]) {
  return {
    spending: [
      { category: "Rent/EMI", amount: 22000, pct: 35.3, color: "#3b82f6" },
      { category: "Food & Dining", amount: 8500, pct: 13.6, color: "#f59e0b" },
      { category: "Shopping", amount: 7800, pct: 12.5, color: "#8b5cf6" },
      { category: "Transport", amount: 5200, pct: 8.3, color: "#06b6d4" },
      { category: "Utilities", amount: 4900, pct: 7.9, color: "#10b981" },
      { category: "Entertainment", amount: 3500, pct: 5.6, color: "#ec4899" },
      { category: "Education", amount: 3500, pct: 5.6, color: "#f43f5e" },
      { category: "Healthcare", amount: 2000, pct: 3.2, color: "#14b8a6" },
      { category: "Others", amount: 5000, pct: 8.0, color: "#64748b" },
    ],
    radar: [
      { trait: "Digital Maturity", score: c.health > 80 ? 85 : 65 },
      { trait: "Savings", score: c.health > 80 ? 72 : 55 },
      { trait: "Investment", score: c.engagement > 70 ? 68 : 45 },
      { trait: "Engagement", score: c.engagement },
      { trait: "Risk Appetite", score: c.segment === "HNI" ? 80 : 55 },
      { trait: "Product Usage", score: c.products * 12 },
    ],
    predictions: [
      { need: "Home Loan", confidence: 89, icon: "🏠", reason: "Property search patterns detected" },
      { need: "SIP Investment", confidence: 94, icon: "📈", reason: "Surplus income growth + savings pattern" },
      { need: "Health Insurance", confidence: 76, icon: "🛡️", reason: "No health coverage detected" },
      { need: "Credit Card Upgrade", confidence: 82, icon: "💳", reason: "High spending on premium categories" },
    ],
    lifeEvents: [
      { event: "Salary Increase", confidence: 92, date: "Jun 2026", status: "detected" as const, icon: "📈" },
      { event: "Home Purchase Intent", confidence: 75, date: "Aug 2026", status: "predicted" as const, icon: "🏠" },
      { event: "Education Planning", confidence: 68, date: "2027", status: "predicted" as const, icon: "📚" },
    ],
    incomeVsExpense: [
      { month: "Jan", income: 85000, expense: 62000 },
      { month: "Feb", income: 85000, expense: 58000 },
      { month: "Mar", income: 85000, expense: 64000 },
      { month: "Apr", income: 90000, expense: 61000 },
      { month: "May", income: 90000, expense: 59000 },
      { month: "Jun", income: 110000, expense: 65000 },
    ],
  };
}

export default function DigitalTwinPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const customer = customers[selectedIdx];
  const data = getCustomerData(customer);

  return (
    <div>
      <PageHeader
        title="Customer Digital Twin"
        icon="🧬"
        subtitle="Living AI profile • Continuously learning • Real-time predictions"
        action={
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <select
              value={selectedIdx}
              onChange={(e) => setSelectedIdx(Number(e.target.value))}
              style={{
                padding: "8px 16px", borderRadius: "var(--radius-md)",
                background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)", fontSize: 13, cursor: "pointer",
              }}
            >
              {customers.map((c, i) => (
                <option key={i} value={i}>{c.name} — {c.segment}</option>
              ))}
            </select>
            <StatusBadge status="active" label="🔄 Live" />
          </div>
        }
      />

      {/* Customer Header */}
      <div className="glass-card" style={{
        padding: 32, marginBottom: 24,
        background: "linear-gradient(135deg, rgba(26,35,126,0.2), rgba(57,73,171,0.05))",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{
              width: 80, height: 80, borderRadius: 20,
              background: "var(--gradient-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: 800, color: "white",
            }}>
              {customer.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <h3 style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800 }}>{customer.name}</h3>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {[customer.segment, customer.city, customer.occupation].map((tag, i) => (
                  <span key={i} style={{
                    padding: "4px 12px", borderRadius: "var(--radius-full)",
                    background: "rgba(57,73,171,0.15)", border: "1px solid rgba(57,73,171,0.25)",
                    fontSize: 12, color: "var(--sbi-blue-300)",
                  }}>{tag}</span>
                ))}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>
                Customer since {customer.since} • {customer.products} active products • {customer.branch}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <ScoreGauge score={customer.health} label="Health" color="#10b981" size={100} />
            <ScoreGauge score={customer.engagement} label="Engage" color="#3b82f6" size={100} />
            <ScoreGauge score={100 - customer.churn} label="Retain" color={customer.churn > 15 ? "#f43f5e" : "#10b981"} size={100} />
          </div>
        </div>
      </div>

      {/* Row 1: Spending PieChart + Behavior RadarChart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>💰 Spending Profile</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.spending} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="amount" label={({ category, pct }: any) => `${category} ${pct}%`}>
                {data.spending.map((s, i) => <Cell key={i} fill={s.color} stroke="transparent" />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `₹${Number(v).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🎯 Behavior Analysis</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.radar}>
              <PolarGrid stroke="rgba(99,115,175,0.15)" />
              <PolarAngleAxis dataKey="trait" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
              <Radar dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Income vs Expense BarChart */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📊 Income vs Expenses Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.incomeVsExpense} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,175,0.1)" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `₹${Number(v).toLocaleString()}`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="#f43f5e80" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Row 3: Predictions + Life Events */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🔮 AI Predictions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.predictions.map((pred, i) => (
              <div key={i} style={{
                padding: 16, borderRadius: "var(--radius-md)",
                background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
                display: "flex", alignItems: "center", gap: 16,
              }}>
                <div style={{ fontSize: 28 }}>{pred.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{pred.need}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{pred.reason}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: "Outfit", fontSize: 20, fontWeight: 800,
                    color: pred.confidence > 85 ? "#10b981" : "#f59e0b",
                  }}>
                    {pred.confidence}%
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>confidence</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📅 Life Events Timeline</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.lifeEvents.map((event, i) => (
              <div key={i} style={{
                padding: 16, borderRadius: "var(--radius-md)",
                background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
                display: "flex", alignItems: "center", gap: 16,
                borderLeft: `3px solid ${event.status === "detected" ? "#10b981" : "#f59e0b"}`,
              }}>
                <div style={{ fontSize: 28 }}>{event.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{event.event}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{event.date} • {event.confidence}% confidence</div>
                </div>
                <StatusBadge status={event.status} />
              </div>
            ))}
          </div>

          {/* Product Ownership */}
          <h4 style={{ fontFamily: "Outfit", fontSize: 15, fontWeight: 600, marginTop: 24, marginBottom: 12, color: "var(--text-secondary)" }}>
            🏦 Active Products
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Savings A/C", "Credit Card", "Home Loan", "SIP - Bluechip", "FD 1Y", "PPF"].slice(0, customer.products).map((p, i) => (
              <span key={i} style={{
                padding: "6px 14px", borderRadius: "var(--radius-full)",
                background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                fontSize: 12, color: "var(--sbi-blue-300)",
              }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
