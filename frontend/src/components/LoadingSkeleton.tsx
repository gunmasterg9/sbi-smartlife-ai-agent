"use client";

interface LoadingSkeletonProps {
  rows?: number;
  type?: "card" | "chart" | "table" | "text";
}

export default function LoadingSkeleton({ rows = 4, type = "card" }: LoadingSkeletonProps) {
  if (type === "chart") {
    return (
      <div
        style={{
          height: 300,
          borderRadius: "var(--radius-lg)",
          background: "linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
    );
  }

  if (type === "table") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 48,
              borderRadius: "var(--radius-sm)",
              background: "linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "text") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 16,
              width: `${80 - i * 10}%`,
              borderRadius: 4,
              background: "linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    );
  }

  // Default: card grid
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 16,
      }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 140,
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
