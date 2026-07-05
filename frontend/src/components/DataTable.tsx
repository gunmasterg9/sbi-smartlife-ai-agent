"use client";
import { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "12px 16px",
                  fontSize: 13,
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  textAlign: col.align || "left",
                  width: col.width,
                  whiteSpace: "nowrap",
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: 40,
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: 14,
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: "1px solid var(--border-subtle)",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: "14px 16px",
                      fontSize: 14,
                      color: "var(--text-secondary)",
                      textAlign: col.align || "left",
                    }}
                  >
                    {col.render
                      ? col.render(item)
                      : String(item[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
