"use client";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from "recharts";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

const tooltipStyle = {
  backgroundColor: "rgba(15, 22, 41, 0.95)",
  border: "1px solid rgba(99, 115, 175, 0.3)",
  borderRadius: 12, padding: "12px 16px",
  color: "#f1f5f9", fontSize: 13,
};

const productCategories = [
  {
    category: "Deposit Products",
    icon: "🏦",
    products: [
      { name: "Savings Account", holders: 500, adoption: "100%", revenue: "₹2.1Cr", trend: "stable", color: "#3b82f6" },
      { name: "Fixed Deposit", holders: 280, adoption: "56%", revenue: "₹18.5Cr", trend: "up", color: "#10b981" },
      { name: "Recurring Deposit", holders: 120, adoption: "24%", revenue: "₹3.2Cr", trend: "up", color: "#8b5cf6" },
      { name: "PPF Account", holders: 95, adoption: "19%", revenue: "₹4.1Cr", trend: "stable", color: "#f59e0b" },
    ],
  },
  {
    category: "Loan Products",
    icon: "💰",
    products: [
      { name: "Home Loan", holders: 85, adoption: "17%", revenue: "₹42.5Cr", trend: "up", color: "#3b82f6" },
      { name: "Personal Loan", holders: 120, adoption: "24%", revenue: "₹8.4Cr", trend: "up", color: "#ec4899" },
      { name: "Education Loan", holders: 45, adoption: "9%", revenue: "₹5.2Cr", trend: "stable", color: "#8b5cf6" },
      { name: "Vehicle Loan", holders: 60, adoption: "12%", revenue: "₹6.8Cr", trend: "down", color: "#f59e0b" },
    ],
  },
  {
    category: "Investment Products",
    icon: "📈",
    products: [
      { name: "Mutual Fund SIP", holders: 210, adoption: "42%", revenue: "₹12.3Cr", trend: "up", color: "#10b981" },
      { name: "Demat Account", holders: 165, adoption: "33%", revenue: "₹1.2Cr", trend: "up", color: "#06b6d4" },
      { name: "NPS", holders: 75, adoption: "15%", revenue: "₹3.8Cr", trend: "up", color: "#8b5cf6" },
    ],
  },
  {
    category: "Protection & Cards",
    icon: "🛡️",
    products: [
      { name: "Credit Card", holders: 310, adoption: "62%", revenue: "₹5.6Cr", trend: "up", color: "#ec4899" },
      { name: "Health Insurance", holders: 180, adoption: "36%", revenue: "₹8.2Cr", trend: "up", color: "#f43f5e" },
      { name: "Life Insurance", holders: 145, adoption: "29%", revenue: "₹6.5Cr", trend: "stable", color: "#10b981" },
    ],
  },
];

const topRecommendations = [
  { product: "SIP Investment", match: 94, customers: 85, icon: "📈", reason: "Surplus income + low investment ratio" },
  { product: "Health Insurance", match: 89, customers: 120, icon: "🛡️", reason: "No health coverage in portfolio" },
  { product: "Credit Card Upgrade", match: 82, customers: 65, icon: "💳", reason: "High spending volume + good history" },
  { product: "Home Loan", match: 78, customers: 42, icon: "🏠", reason: "Property search patterns detected" },
  { product: "Tax-Saver FD", match: 75, customers: 90, icon: "🏦", reason: "Approaching tax planning deadline" },
];

const productAdoption = productCategories.flatMap(c => c.products).sort((a, b) => b.holders - a.holders).slice(0, 8);

const crossSellMatrix = [
  { product: "Savings → FD", rate: "34%", volume: 170 },
  { product: "Savings → SIP", rate: "28%", volume: 140 },
  { product: "Savings → Credit Card", rate: "42%", volume: 210 },
  { product: "Home Loan → Insurance", rate: "65%", volume: 55 },
  { product: "Salary A/C → Personal Loan", rate: "18%", volume: 90 },
];

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalProducts = productCategories.flatMap(c => c.products).length;

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}>
      <PageHeader
        title="Product & Recommendations"
        icon="📦"
        subtitle="AI-powered cross-sell • Product adoption tracking • Smart recommendations"
        action={<StatusBadge status="active" label={`${totalProducts} products tracked`} />}
      />

      {/* Product Categories */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {productCategories.map((cat, i) => (
          <div key={i} className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 24 }}>{cat.icon}</span>
              <h3 style={{ fontFamily: "Outfit", fontSize: 15, fontWeight: 700 }}>{cat.category}</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cat.products.map((product, j) => (
                <div key={j} style={{
                  padding: "10px 14px", borderRadius: "var(--radius-sm)",
                  background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
                  borderLeft: `3px solid ${product.color}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{product.name}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: "var(--radius-full)",
                      background: product.trend === "up" ? "rgba(16,185,129,0.1)" : product.trend === "down" ? "rgba(244,63,94,0.1)" : "rgba(99,115,175,0.1)",
                      color: product.trend === "up" ? "#10b981" : product.trend === "down" ? "#f43f5e" : "var(--text-muted)",
                    }}>
                      {product.trend === "up" ? "↑" : product.trend === "down" ? "↓" : "→"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)" }}>
                    <span>{product.holders} holders</span>
                    <span>{product.adoption}</span>
                    <span>{product.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Row: Adoption Chart + Recommendations */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📊 Product Adoption (Top 8)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productAdoption} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,175,0.1)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} width={100} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="holders" name="Holders" radius={[0, 6, 6, 0]}>
                {productAdoption.map((p, i) => <Cell key={i} fill={p.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🎯 AI-Powered Recommendations</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topRecommendations.map((rec, i) => (
              <div key={i} style={{
                padding: "14px 16px", borderRadius: "var(--radius-md)",
                background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <span style={{ fontSize: 28 }}>{rec.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{rec.product}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{rec.reason}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Outfit", fontSize: 20, fontWeight: 800, color: rec.match > 85 ? "#10b981" : "#f59e0b" }}>{rec.match}%</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{rec.customers} eligible</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-Sell Matrix */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🔗 Cross-Sell Performance</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {["Cross-Sell Path", "Conversion Rate", "Volume", "Impact"].map(h => (
                <th key={h} style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-muted)", fontWeight: 600, textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {crossSellMatrix.map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <td style={{ padding: "14px 16px", fontWeight: 600, color: "white", fontSize: 14 }}>{row.product}</td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.05)", maxWidth: 120 }}>
                      <div style={{ height: "100%", borderRadius: 3, background: "#3b82f6", width: row.rate, transition: "width 1s" }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#3b82f6" }}>{row.rate}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: 14 }}>{row.volume} customers</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ padding: "4px 10px", borderRadius: "var(--radius-full)", fontSize: 11, fontWeight: 600, background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
