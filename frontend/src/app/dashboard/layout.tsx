"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "📊", exact: true },
  { href: "/dashboard/assistant", label: "AI Assistant", icon: "💬" },
  { href: "/dashboard/digital-twin", label: "Digital Twin", icon: "🧬" },
  { href: "/dashboard/insights", label: "Customer Insights", icon: "👥" },
  { href: "/dashboard/wellness", label: "Financial Wellness", icon: "❤️" },
  { href: "/dashboard/products", label: "Recommendations", icon: "🎯" },
  { href: "/dashboard/life-events", label: "Life Events", icon: "🔮" },
  { href: "/dashboard/engagement", label: "Engagement", icon: "📈" },
  { href: "/dashboard/agents", label: "Agent Monitor", icon: "🤖" },
  { href: "/dashboard/admin", label: "Admin", icon: "⚙️" },
  { href: "/dashboard/compliance", label: "Compliance", icon: "🛡️" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📉" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 72 : 260,
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex", flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 40,
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? "20px 16px" : "20px 20px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: "var(--gradient-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, color: "white",
          }}>S</div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "var(--text-primary)", whiteSpace: "nowrap" }}>SBI SmartLife</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>AI Platform</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}>
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: collapsed ? "12px 16px" : "10px 16px",
                marginBottom: 2, borderRadius: "var(--radius-sm)",
                textDecoration: "none", fontSize: 14,
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                background: isActive ? "rgba(26, 35, 126, 0.2)" : "transparent",
                borderLeft: isActive ? "3px solid var(--sbi-blue-400)" : "3px solid transparent",
                transition: "all 0.2s ease",
                fontWeight: isActive ? 600 : 400,
                whiteSpace: "nowrap",
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <div style={{ padding: 12, borderTop: "1px solid var(--border-subtle)" }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{
            width: "100%", padding: 10, borderRadius: "var(--radius-sm)",
            background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)", cursor: "pointer", fontSize: 14,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {collapsed ? "→" : "← Collapse"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1, marginLeft: collapsed ? 72 : 260,
        transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        {/* Top Bar */}
        <header style={{
          padding: "16px 32px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "rgba(10, 14, 26, 0.8)",
          backdropFilter: "blur(20px)",
          position: "sticky", top: 0, zIndex: 30,
        }}>
          <div>
            <h1 style={{ fontFamily: "Outfit", fontSize: 22, fontWeight: 700 }}>
              {navItems.find(n => n.exact ? pathname === n.href : pathname.startsWith(n.href))?.label || "Dashboard"}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              padding: "6px 14px", borderRadius: "var(--radius-full)",
              background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)",
              fontSize: 12, color: "#10b981", display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
              AI Mode: Simulated
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "var(--gradient-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "white", cursor: "pointer",
            }}>A</div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: 32 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
