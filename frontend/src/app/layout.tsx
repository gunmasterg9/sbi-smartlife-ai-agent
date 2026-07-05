import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SBI SmartLife AI Agent | Autonomous Banking Growth Platform",
  description: "AI-powered banking ecosystem that acts as a digital relationship manager for every customer. Built for GFF 2026 Hackathon.",
  keywords: "SBI, AI, Banking, Digital Twin, Agentic AI, Fintech, GFF 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
