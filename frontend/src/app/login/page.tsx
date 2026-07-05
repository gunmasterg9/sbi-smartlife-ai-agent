"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("sbi_token", data.access_token || "demo_token");
        router.push("/dashboard");
      } else {
        // Fallback: allow demo login
        if (email === "demo@sbi-smartlife.ai" && password === "demo123") {
          localStorage.setItem("sbi_token", "demo_token");
          router.push("/dashboard");
        } else {
          setError("Invalid credentials. Use demo credentials below.");
        }
      }
    } catch {
      // Backend not running — allow demo login
      if (email === "demo@sbi-smartlife.ai" && password === "demo123") {
        localStorage.setItem("sbi_token", "demo_token");
        router.push("/dashboard");
      } else {
        setError("Backend unreachable. Use demo credentials.");
      }
    }

    setLoading(false);
  };

  const fillDemo = () => {
    setEmail("demo@sbi-smartlife.ai");
    setPassword("demo123");
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-body)",
        backgroundImage:
          "radial-gradient(circle at 20% 50%, rgba(26,35,126,0.15) 0%, transparent 50%), " +
          "radial-gradient(circle at 80% 20%, rgba(57,73,171,0.1) 0%, transparent 50%), " +
          "radial-gradient(circle at 50% 80%, rgba(100,116,175,0.08) 0%, transparent 50%)",
        padding: 24,
      }}
    >
      <div
        className="glass-card"
        style={{
          width: 420,
          maxWidth: "100%",
          padding: "48px 40px",
          textAlign: "center",
        }}
      >
        {/* Logo & Header */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "var(--gradient-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: 28,
            boxShadow: "0 8px 24px rgba(26,35,126,0.25)",
          }}
        >
          🏦
        </div>
        <h1
          style={{
            fontFamily: "Outfit",
            fontSize: 26,
            fontWeight: 800,
            background: "linear-gradient(135deg, var(--sbi-blue-300), var(--sbi-blue-100))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          SBI SmartLife AI
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            marginTop: 4,
            marginBottom: 32,
          }}
        >
          Autonomous Banking Growth Platform
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ textAlign: "left" }}>
            <label
              style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6, display: "block" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sbi-smartlife.ai"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--sbi-blue-300)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label
              style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6, display: "block" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--sbi-blue-300)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
            />
          </div>

          {error && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(244,63,94,0.1)",
                border: "1px solid rgba(244,63,94,0.2)",
                color: "#f43f5e",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px 24px",
              borderRadius: "var(--radius-md)",
              background: loading ? "var(--bg-card)" : "var(--gradient-primary)",
              border: "none",
              color: "white",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "Outfit",
              cursor: loading ? "wait" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: loading ? "none" : "0 4px 16px rgba(26,35,126,0.3)",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Demo Credentials */}
        <div
          style={{
            marginTop: 24,
            padding: "14px 16px",
            borderRadius: "var(--radius-md)",
            background: "rgba(57,73,171,0.08)",
            border: "1px solid rgba(57,73,171,0.15)",
          }}
        >
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
            🎯 Demo Credentials
          </div>
          <div style={{ fontSize: 13, color: "var(--sbi-blue-300)", fontFamily: "monospace" }}>
            demo@sbi-smartlife.ai / demo123
          </div>
          <button
            onClick={fillDemo}
            type="button"
            style={{
              marginTop: 8,
              padding: "6px 16px",
              borderRadius: "var(--radius-full)",
              background: "rgba(57,73,171,0.15)",
              border: "1px solid rgba(57,73,171,0.25)",
              color: "var(--sbi-blue-300)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(57,73,171,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(57,73,171,0.15)")}
          >
            Auto-fill Demo
          </button>
        </div>

        <p
          style={{
            marginTop: 20,
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          SBI SmartLife AI Agent • GFF 2026 Hackathon
        </p>
      </div>
    </div>
  );
}
