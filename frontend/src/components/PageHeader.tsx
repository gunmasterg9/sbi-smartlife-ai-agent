"use client";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, icon, action }: PageHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 28,
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      <div>
        <h2
          style={{
            fontFamily: "Outfit",
            fontSize: 24,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {icon && <span>{icon}</span>}
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
