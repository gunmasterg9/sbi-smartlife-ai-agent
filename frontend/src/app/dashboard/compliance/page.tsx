"use client";
import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import PageHeader from "@/components/PageHeader";
import ScoreGauge from "@/components/ScoreGauge";
import StatusBadge from "@/components/StatusBadge";

const tooltipStyle = {
  backgroundColor: "rgba(15, 22, 41, 0.95)",
  border: "1px solid rgba(99, 115, 175, 0.3)",
  borderRadius: 12, padding: "12px 16px",
  color: "#f1f5f9", fontSize: 13,
};

const complianceChecklist = [
  { category: "RBI Compliance", items: [
    { name: "KYC Verification", status: "compliant", desc: "All customers have completed eKYC" },
    { name: "Data Localization", status: "compliant", desc: "All data stored within India" },
    { name: "Fraud Detection", status: "compliant", desc: "Real-time transaction monitoring active" },
    { name: "AML/CFT", status: "compliant", desc: "Anti-money laundering checks in place" },
    { name: "Grievance Redressal", status: "compliant", desc: "Customer escalation system active" },
  ]},
  { category: "DPDP Act 2023", items: [
    { name: "Consent Management", status: "compliant", desc: "Explicit consent collected for all data processing" },
    { name: "Data Minimization", status: "compliant", desc: "Only necessary data collected" },
    { name: "Right to Erasure", status: "compliant", desc: "Customer data deletion workflow active" },
    { name: "Data Breach Protocol", status: "compliant", desc: "72-hour notification SLA configured" },
    { name: "DPO Appointed", status: "warning", desc: "Data Protection Officer designation pending" },
  ]},
  { category: "AI Governance", items: [
    { name: "Explainable AI", status: "compliant", desc: "All recommendations include reasoning" },
    { name: "Bias Monitoring", status: "compliant", desc: "Fairness metrics tracked across segments" },
    { name: "Model Audit Trail", status: "compliant", desc: "All AI decisions logged with confidence" },
    { name: "Human Override", status: "compliant", desc: "Bank staff can override AI decisions" },
  ]},
];

const kycStatus = [
  { status: "Verified", count: 375, color: "#10b981" },
  { status: "Pending", count: 85, color: "#f59e0b" },
  { status: "Rejected", count: 25, color: "#f43f5e" },
  { status: "Expired", count: 15, color: "#64748b" },
];

const riskDistribution = [
  { level: "Low", count: 320, color: "#10b981" },
  { level: "Medium", count: 125, color: "#f59e0b" },
  { level: "High", count: 55, color: "#f43f5e" },
];

const recentAuditLogs = [
  { action: "Customer data accessed", user: "Admin", resource: "Aarav Sharma profile", risk: "low", time: "2 min ago", ip: "192.168.1.105" },
  { action: "Report exported", user: "Manager", resource: "Monthly KPI report", risk: "medium", time: "15 min ago", ip: "10.0.0.42" },
  { action: "AI recommendation overridden", user: "RM Priya", resource: "Loan recommendation", risk: "low", time: "1 hr ago", ip: "172.16.0.88" },
  { action: "Bulk data export", user: "Analytics Team", resource: "Transaction dataset", risk: "high", time: "2 hrs ago", ip: "10.0.0.15" },
  { action: "Settings modified", user: "Admin", resource: "CORS configuration", risk: "medium", time: "3 hrs ago", ip: "192.168.1.105" },
  { action: "User login", user: "demo@sbi-smartlife.ai", resource: "Dashboard", risk: "low", time: "4 hrs ago", ip: "203.0.113.50" },
];

export default function CompliancePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalCompliant = complianceChecklist.flatMap(c => c.items).filter(i => i.status === "compliant").length;
  const totalItems = complianceChecklist.flatMap(c => c.items).length;
  const complianceScore = Math.round((totalCompliant / totalItems) * 100);

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}>
      <PageHeader
        title="Compliance & Security"
        icon="🛡️"
        subtitle="RBI compliance • DPDP Act 2023 • AI governance • Audit trails"
      />

      {/* Summary Row */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: 24, marginBottom: 32 }}>
        <div className="glass-card" style={{
          padding: 32, display: "flex", flexDirection: "column", alignItems: "center",
          background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(26,35,126,0.1))",
        }}>
          <ScoreGauge score={complianceScore} size={140} strokeWidth={12} color="#10b981" label="Score" />
          <div style={{ fontFamily: "Outfit", fontSize: 14, fontWeight: 700, marginTop: 12 }}>Compliance Score</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{totalCompliant}/{totalItems} checks passed</div>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h4 style={{ fontFamily: "Outfit", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📋 KYC Status</h4>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={kycStatus} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="count">
                {kycStatus.map((s, i) => <Cell key={i} fill={s.color} stroke="transparent" />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {kycStatus.map((s, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "var(--text-muted)" }}>
                <span style={{ width: 6, height: 6, borderRadius: 2, background: s.color }} /> {s.status}: {s.count}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h4 style={{ fontFamily: "Outfit", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>⚠️ Risk Distribution</h4>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={riskDistribution} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <XAxis dataKey="level" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" name="Customers" radius={[6, 6, 0, 0]}>
                {riskDistribution.map((r, i) => <Cell key={i} fill={r.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h4 style={{ fontFamily: "Outfit", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🔒 Security Status</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Data Encryption", status: "active" as const, detail: "AES-256 at rest, TLS 1.3 in transit" },
              { label: "MFA Enabled", status: "active" as const, detail: "All admin accounts secured" },
              { label: "Rate Limiting", status: "active" as const, detail: "100 req/min per user" },
              { label: "RBAC", status: "active" as const, detail: "Admin, Manager, Customer roles" },
              { label: "Audit Logging", status: "active" as const, detail: "All actions logged with IP" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{s.detail}</div>
                </div>
                <StatusBadge status={s.status} showDot={true} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Checklist */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 24 }}>
        {complianceChecklist.map((section, i) => (
          <div key={i} className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{section.category}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {section.items.map((item, j) => (
                <div key={j} style={{
                  padding: "10px 14px", borderRadius: "var(--radius-sm)",
                  background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12,
                    background: item.status === "compliant" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                    color: item.status === "compliant" ? "#10b981" : "#f59e0b",
                  }}>
                    {item.status === "compliant" ? "✓" : "!"}
                  </span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Audit Trail */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📝 Recent Audit Trail</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {["Action", "User", "Resource", "Risk", "Time", "IP"].map(h => (
                <th key={h} style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentAuditLogs.map((log, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{log.action}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--text-secondary)" }}>{log.user}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--text-secondary)" }}>{log.resource}</td>
                <td style={{ padding: "12px 14px" }}>
                  <StatusBadge status={log.risk === "high" ? "danger" : log.risk === "medium" ? "warning" : "active"} label={log.risk} showDot={false} />
                </td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--text-muted)" }}>{log.time}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--text-muted)", fontFamily: "monospace" }}>{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
