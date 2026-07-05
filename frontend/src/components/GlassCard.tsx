"use client";
import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  gradient?: string;
  noPad?: boolean;
  noHover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = "",
  style,
  gradient,
  noPad = false,
  noHover = false,
  onClick,
}: GlassCardProps) {
  return (
    <div
      className={`glass-card ${noHover ? "no-hover" : ""} ${className}`}
      onClick={onClick}
      style={{
        padding: noPad ? 0 : 24,
        cursor: onClick ? "pointer" : "default",
        background: gradient || undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
