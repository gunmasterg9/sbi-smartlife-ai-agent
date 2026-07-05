"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const stats = [
  { label: "Customers Served", value: 500, suffix: "M+", icon: "👥" },
  { label: "AI Agents Active", value: 6, suffix: "", icon: "🤖" },
  { label: "Daily Interactions", value: 2.5, suffix: "M+", icon: "💬" },
  { label: "Financial Wellness Score", value: 94, suffix: "%", icon: "❤️" },
];

const features = [
  {
    icon: "🧬",
    title: "Customer Digital Twin",
    description: "Living AI profiles that continuously learn from transactions, behavior, and goals to predict needs before customers ask.",
    color: "#3b82f6",
  },
  {
    icon: "🎯",
    title: "Smart Acquisition",
    description: "AI-powered lead qualification, conversational onboarding, and hyper-personalized product recommendations.",
    color: "#8b5cf6",
  },
  {
    icon: "📱",
    title: "Digital Adoption Engine",
    description: "Adaptive learning journeys that guide customers through YONO, UPI, mobile banking, and digital services.",
    color: "#06b6d4",
  },
  {
    icon: "💡",
    title: "Proactive Engagement",
    description: "Real-time behavioral analysis driving personalized offers, rewards, and retention strategies.",
    color: "#f59e0b",
  },
  {
    icon: "❤️",
    title: "Financial Wellness",
    description: "AI-computed wellness scores with actionable improvement suggestions for every customer.",
    color: "#10b981",
  },
  {
    icon: "🔮",
    title: "Life Event Prediction",
    description: "Detect salary changes, marriages, home purchases, and more — triggering proactive banking recommendations.",
    color: "#ec4899",
  },
];

const agents = [
  { name: "Acquisition Agent", status: "active", actions: "1,247", icon: "🎯" },
  { name: "Adoption Agent", status: "active", actions: "892", icon: "📱" },
  { name: "Engagement Agent", status: "active", actions: "2,105", icon: "💡" },
  { name: "Wellness Agent", status: "active", actions: "1,534", icon: "❤️" },
  { name: "Life Events Agent", status: "active", actions: "678", icon: "🔮" },
  { name: "Relationship Manager", status: "active", actions: "3,421", icon: "🤝" },
];

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start * 10) / 10);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{count % 1 === 0 ? count.toFixed(0) : count.toFixed(1)}{suffix}</span>;
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", overflow: "hidden" }}>
      {/* Animated Background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, overflow: "hidden",
        background: "radial-gradient(ellipse at 20% 50%, rgba(26,35,126,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(57,73,171,0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(249,168,37,0.05) 0%, transparent 50%)",
      }}>
        {/* Floating orbs */}
        <div style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26,35,126,0.2) 0%, transparent 70%)",
          top: "10%", left: "5%", animation: "float 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,168,37,0.1) 0%, transparent 70%)",
          top: "60%", right: "10%", animation: "float 6s ease-in-out infinite 1s",
        }} />
        <div style={{
          position: "absolute", width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
          bottom: "20%", left: "30%", animation: "float 7s ease-in-out infinite 2s",
        }} />
      </div>

      {/* Navigation */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "16px 32px",
        background: "rgba(10, 14, 26, 0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-subtle)",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "var(--gradient-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, color: "white",
            }}>S</div>
            <div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>SBI SmartLife</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 2, textTransform: "uppercase" }}>AI Agent Platform</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <Link href="/dashboard" style={{
              padding: "10px 24px", borderRadius: "var(--radius-md)",
              background: "var(--gradient-primary)", color: "white",
              textDecoration: "none", fontWeight: 600, fontSize: 14,
              transition: "all 0.3s ease",
            }}>
              Launch Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        position: "relative", zIndex: 1,
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "120px 32px 80px",
      }}>
        <div className={mounted ? "animate-fade-in" : ""} style={{ opacity: mounted ? 1 : 0 }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 20px", borderRadius: "var(--radius-full)",
            background: "rgba(26, 35, 126, 0.2)", border: "1px solid rgba(57, 73, 171, 0.3)",
            fontSize: 13, color: "var(--sbi-blue-300)", marginBottom: 32,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", animation: "pulse-glow 2s infinite" }} />
            SBI @ Global Fintech Fest 2026
          </div>

          {/* Main heading */}
          <h1 style={{
            fontFamily: "Outfit", fontSize: "clamp(36px, 5vw, 72px)",
            fontWeight: 800, lineHeight: 1.1, marginBottom: 24,
            maxWidth: 900, margin: "0 auto 24px",
          }}>
            <span style={{ color: "var(--text-primary)" }}>The </span>
            <span style={{
              background: "linear-gradient(135deg, #5c6bc0, #7986cb, #f9a825)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Autonomous Banking</span>
            <br />
            <span style={{ color: "var(--text-primary)" }}>Growth Platform</span>
          </h1>

          <p style={{
            fontSize: "clamp(16px, 2vw, 20px)", color: "var(--text-secondary)",
            maxWidth: 650, margin: "0 auto 48px", lineHeight: 1.7,
          }}>
            AI-powered ecosystem that creates a <strong style={{ color: "var(--gold)" }}>Customer Digital Twin</strong> for 
            every customer — predicting needs, delivering proactive recommendations, and 
            guiding them through their entire financial journey.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 64 }}>
            <Link href="/dashboard" className="btn-primary" style={{ padding: "16px 40px", fontSize: 16, borderRadius: "var(--radius-lg)", textDecoration: "none" }}>
              🚀 Explore Platform
            </Link>
            <Link href="/dashboard/assistant" className="btn-secondary" style={{ padding: "16px 40px", fontSize: 16, borderRadius: "var(--radius-lg)", textDecoration: "none" }}>
              💬 Try AI Assistant
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 24, maxWidth: 800, margin: "0 auto",
          }}>
            {stats.map((stat, i) => (
              <div key={i} className={`glass-card animate-fade-in stagger-${i + 1}`} style={{
                padding: 24, textAlign: "center", opacity: mounted ? 1 : 0,
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontFamily: "Outfit", fontSize: 32, fontWeight: 800, color: "var(--text-primary)" }}>
                  {mounted && <AnimatedCounter end={stat.value} suffix={stat.suffix} />}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontFamily: "Outfit", fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
            6 AI Agents. One <span style={{ color: "var(--gold)" }}>Intelligent</span> Ecosystem.
          </h2>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto" }}>
            A multi-agent architecture where each specialized AI works together to deliver proactive, personalized banking.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 24 }}>
          {features.map((feature, i) => (
            <div key={i} className="glass-card" style={{ padding: 32, cursor: "default" }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: `${feature.color}20`, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 28, marginBottom: 20,
                border: `1px solid ${feature.color}30`,
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Agent Status Section */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "Outfit", fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
            Live Agent <span style={{ color: "var(--teal)" }}>Status</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {agents.map((agent, i) => (
            <div key={i} className="glass-card" style={{ padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{agent.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{agent.name}</div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 12px", borderRadius: "var(--radius-full)",
                background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)",
                fontSize: 12, color: "#10b981",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                Active
              </div>
              <div style={{ marginTop: 12, fontSize: 20, fontWeight: 700, fontFamily: "Outfit" }}>{agent.actions}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>actions today</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        position: "relative", zIndex: 1, padding: "80px 32px", textAlign: "center",
      }}>
        <div className="glass-card" style={{
          maxWidth: 800, margin: "0 auto", padding: "64px 48px",
          background: "linear-gradient(135deg, rgba(26,35,126,0.3), rgba(57,73,171,0.1))",
        }}>
          <h2 style={{ fontFamily: "Outfit", fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
            Ready to Transform Banking?
          </h2>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: 32 }}>
            Experience the future of autonomous banking — powered by Agentic AI.
          </p>
          <Link href="/dashboard" className="btn-primary" style={{ padding: "18px 48px", fontSize: 18, borderRadius: "var(--radius-lg)", textDecoration: "none" }}>
            🏦 Enter Platform Dashboard
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 1,
        padding: "32px", textAlign: "center",
        borderTop: "1px solid var(--border-subtle)",
        color: "var(--text-muted)", fontSize: 13,
      }}>
        <p>SBI SmartLife AI Agent — Built for Global Fintech Fest 2026 Hackathon</p>
        <p style={{ marginTop: 4 }}>Powered by Agentic AI • Gemini 2.5 Flash • LangGraph</p>
      </footer>
    </div>
  );
}
