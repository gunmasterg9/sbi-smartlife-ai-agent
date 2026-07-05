"use client";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, Legend,
} from "recharts";
import ScoreGauge from "@/components/ScoreGauge";
import PageHeader from "@/components/PageHeader";

const tooltipStyle = {
  backgroundColor: "rgba(15, 22, 41, 0.95)",
  border: "1px solid rgba(99, 115, 175, 0.3)",
  borderRadius: 12, padding: "12px 16px",
  color: "#f1f5f9", fontSize: 13,
};

const scoreBreakdown = [
  { category: "Savings", score: 78, maxScore: 100, icon: "💰", color: "#10b981", tip: "Good savings ratio (26.6%)" },
  { category: "Investments", score: 65, maxScore: 100, icon: "📊", color: "#f59e0b", tip: "Needs diversification — add equity SIP" },
  { category: "Insurance", score: 60, maxScore: 100, icon: "🛡️", color: "#f43f5e", tip: "Health insurance gap detected" },
  { category: "Debt Mgmt", score: 82, maxScore: 100, icon: "💳", color: "#3b82f6", tip: "Healthy debt-to-income ratio" },
  { category: "Goals", score: 70, maxScore: 100, icon: "🎯", color: "#8b5cf6", tip: "Retirement planning not started" },
  { category: "Emergency", score: 75, maxScore: 100, icon: "🏦", color: "#06b6d4", tip: "4.5 months covered (target: 6)" },
];

const scoreTrend = [
  { month: "Jan", score: 62 }, { month: "Feb", score: 64 }, { month: "Mar", score: 66 },
  { month: "Apr", score: 68 }, { month: "May", score: 70 }, { month: "Jun", score: 72.5 },
];

const goals = [
  { name: "Emergency Fund", type: "emergency", target: 500000, current: 337500, monthly: 8000, deadline: "Dec 2026", priority: "high", icon: "🏦" },
  { name: "Home Down Payment", type: "home", target: 2500000, current: 625000, monthly: 15000, deadline: "Jun 2028", priority: "high", icon: "🏠" },
  { name: "Child Education", type: "education", target: 5000000, current: 500000, monthly: 10000, deadline: "2035", priority: "medium", icon: "📚" },
  { name: "Retirement Corpus", type: "retirement", target: 30000000, current: 1800000, monthly: 12500, deadline: "2050", priority: "medium", icon: "🌴" },
  { name: "Vacation Fund", type: "vacation", target: 200000, current: 120000, monthly: 5000, deadline: "Mar 2027", priority: "low", icon: "✈️" },
];

const budgetBreakdown = [
  { category: "Rent/EMI", budget: 25000, actual: 22000, color: "#3b82f6" },
  { category: "Food", budget: 10000, actual: 8500, color: "#f59e0b" },
  { category: "Shopping", budget: 6000, actual: 7800, color: "#f43f5e" },
  { category: "Transport", budget: 5000, actual: 5200, color: "#06b6d4" },
  { category: "Utilities", budget: 5000, actual: 4900, color: "#10b981" },
  { category: "Entertainment", budget: 3000, actual: 3500, color: "#ec4899" },
  { category: "Savings/Invest", budget: 22000, actual: 22600, color: "#8b5cf6" },
];

const radarData = [
  { metric: "Savings Rate", current: 78, ideal: 95 },
  { metric: "Investment Mix", current: 65, ideal: 90 },
  { metric: "Insurance Cover", current: 60, ideal: 85 },
  { metric: "Debt Health", current: 82, ideal: 90 },
  { metric: "Goal Progress", current: 70, ideal: 85 },
  { metric: "Emergency Fund", current: 75, ideal: 100 },
];

const improvements = [
  { action: "Get Health Insurance", impact: "+8 pts", cost: "₹500/month", priority: "critical", icon: "🛡️", color: "#f43f5e" },
  { action: "Start Equity SIP", impact: "+6 pts", cost: "₹5,000/month", priority: "high", icon: "📈", color: "#f59e0b" },
  { action: "Setup Retirement Goal", impact: "+4 pts", cost: "₹12,500/month", priority: "high", icon: "🎯", color: "#8b5cf6" },
  { action: "Top-up Emergency Fund", impact: "+3 pts", cost: "₹5,000 one-time", priority: "medium", icon: "🏦", color: "#06b6d4" },
  { action: "Reduce Discretionary Spend", impact: "+2 pts", cost: "Save ₹2,000/month", priority: "medium", icon: "💡", color: "#10b981" },
];

export default function WellnessPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const overallScore = 72.5;
  const potentialScore = 90;

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}>
      <PageHeader
        title="Financial Wellness"
        icon="❤️"
        subtitle="AI-computed wellness scores • Actionable improvement suggestions • Goal tracking"
      />

      {/* Hero: Overall Score + Trend + Improvement Potential */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Big Score Gauge */}
        <div className="glass-card" style={{
          padding: 32, display: "flex", flexDirection: "column", alignItems: "center",
          background: "linear-gradient(135deg, rgba(26,35,126,0.2), rgba(57,73,171,0.05))",
        }}>
          <ScoreGauge score={overallScore} size={180} strokeWidth={14} label="/ 100" />
          <div style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginTop: 16, textAlign: "center" }}>
            Financial Wellness Score
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4, textAlign: "center" }}>
            Potential: <span style={{ color: "#10b981", fontWeight: 700 }}>{potentialScore}</span> with AI suggestions
          </div>
        </div>

        {/* Score Trend */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h4 style={{ fontFamily: "Outfit", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📈 Score Trend (6 months)</h4>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={scoreTrend} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,175,0.1)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <YAxis domain={[50, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2.5} dot={{ fill: "#10b981", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8, textAlign: "center" }}>
            ↑ <span style={{ color: "#10b981", fontWeight: 600 }}>+10.5 pts</span> improvement in 6 months
          </div>
        </div>

        {/* Current vs Ideal Radar */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h4 style={{ fontFamily: "Outfit", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🎯 Current vs Ideal</h4>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
              <PolarGrid stroke="rgba(99,115,175,0.15)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 9 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} />
              <Radar dataKey="ideal" stroke="#10b981" fill="#10b981" fillOpacity={0.08} strokeWidth={1} strokeDasharray="4 4" />
              <Radar dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Score Breakdown Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16, marginBottom: 32 }}>
        {scoreBreakdown.map((item, i) => (
          <div key={i} className="glass-card" style={{ padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
            <ScoreGauge score={item.score} size={80} strokeWidth={8} color={item.color} />
            <div style={{ fontWeight: 600, fontSize: 13, marginTop: 8, color: "var(--text-primary)" }}>{item.category}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.4 }}>{item.tip}</div>
          </div>
        ))}
      </div>

      {/* Row: Budget Tracking + Improvement Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Budget vs Actual */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📊 Budget vs Actual Spending</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={budgetBreakdown} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,175,0.1)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="category" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} width={80} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `₹${Number(v).toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="budget" name="Budget" fill="#3b82f640" radius={[0, 4, 4, 0]} />
              <Bar dataKey="actual" name="Actual" radius={[0, 4, 4, 0]}>
                {budgetBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.actual > entry.budget ? "#f43f5e" : "#10b981"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
            ⚠️ <span style={{ color: "#f43f5e" }}>Shopping</span> and <span style={{ color: "#f43f5e" }}>Entertainment</span> exceeded budget this month
          </div>
        </div>

        {/* Improvement Actions */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>💡 AI Improvement Suggestions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {improvements.map((item, i) => (
              <div key={i} style={{
                padding: "14px 16px", borderRadius: "var(--radius-md)",
                background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
                display: "flex", alignItems: "center", gap: 14,
                borderLeft: `3px solid ${item.color}`,
              }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.action}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.cost}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 800, color: "#10b981" }}>{item.impact}</div>
                  <span style={{
                    padding: "2px 8px", borderRadius: "var(--radius-full)", fontSize: 10, fontWeight: 600,
                    textTransform: "capitalize",
                    background: item.priority === "critical" ? "rgba(244,63,94,0.1)" : item.priority === "high" ? "rgba(245,158,11,0.1)" : "rgba(99,115,175,0.1)",
                    color: item.priority === "critical" ? "#f43f5e" : item.priority === "high" ? "#f59e0b" : "var(--text-muted)",
                  }}>{item.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Goals */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🎯 Financial Goals Tracker</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {goals.map((goal, i) => {
            const pct = (goal.current / goal.target) * 100;
            const pctColor = pct >= 60 ? "#10b981" : pct >= 30 ? "#f59e0b" : "#f43f5e";
            return (
              <div key={i} style={{
                padding: 20, borderRadius: "var(--radius-md)",
                background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{goal.icon}</span>
                    {goal.name}
                  </span>
                  <span style={{
                    padding: "2px 8px", borderRadius: "var(--radius-full)", fontSize: 10, fontWeight: 600,
                    textTransform: "capitalize",
                    background: goal.priority === "high" ? "rgba(244,63,94,0.1)" : "rgba(99,115,175,0.1)",
                    color: goal.priority === "high" ? "#f43f5e" : "var(--text-muted)",
                  }}>{goal.priority}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
                  <span>₹{(goal.current / 100000).toFixed(1)}L / ₹{(goal.target / 100000).toFixed(1)}L</span>
                  <span style={{ fontWeight: 600, color: pctColor }}>{pct.toFixed(1)}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.05)" }}>
                  <div style={{
                    height: "100%", borderRadius: 4, background: pctColor,
                    width: `${Math.min(pct, 100)}%`, transition: "width 1s ease",
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
                  <span>₹{goal.monthly.toLocaleString()}/month</span>
                  <span>Deadline: {goal.deadline}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
