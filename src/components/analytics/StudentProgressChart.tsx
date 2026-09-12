"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { StudentProgressDistribution } from "@/server/lib/analytics";

type StudentProgressChartProps = {
  data: StudentProgressDistribution;
};

const SEGMENTS = [
  { key: "accepted" as const,          label: "Accepted",          color: "#16a34a" },
  { key: "needs_improvement" as const, label: "Needs Improvement", color: "#d97706" },
  { key: "pending" as const,           label: "Pending review",    color: "#6b7280" },
  { key: "not_started" as const,       label: "Not started",       color: "#e5e7eb" },
];

export function StudentProgressChart({ data }: StudentProgressChartProps) {
  if (data.total === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 120,
          color: "var(--text-muted)",
          fontSize: "var(--font-sm)",
        }}
      >
        No assignments yet
      </div>
    );
  }

  const chartData = SEGMENTS.map((s) => ({
    name: s.label,
    value: data[s.key],
    color: s.color,
  })).filter((d) => d.value > 0);

  return (
    <div>
      {/* Stacked horizontal progress bar */}
      <div
        style={{
          display: "flex",
          height: 12,
          borderRadius: 6,
          overflow: "hidden",
          marginBottom: "var(--space-4)",
          background: "#e5e7eb",
        }}
        role="img"
        aria-label="Progress distribution"
      >
        {SEGMENTS.map((s) => {
          const val = data[s.key];
          if (val === 0) return null;
          const pct = (val / data.total) * 100;
          return (
            <div
              key={s.key}
              style={{
                width: `${pct}%`,
                background: s.color,
                transition: "width 400ms ease",
              }}
              title={`${s.label}: ${val}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
      >
        {SEGMENTS.map((s) => {
          const val = data[s.key];
          const pct =
            data.total > 0 ? Math.round((val / data.total) * 100) : 0;
          return (
            <div
              key={s.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                opacity: val === 0 ? 0.4 : 1,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: s.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "var(--font-xs)", color: "var(--text-secondary)" }}>
                {s.label}
              </span>
              <span
                style={{
                  fontSize: "var(--font-xs)",
                  color: "var(--text-muted)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {val} · {pct}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Bar chart for detail */}
      {chartData.length > 0 && (
        <div style={{ marginTop: "var(--space-5)" }}>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 32, bottom: 0, left: 0 }}
            >
              <XAxis
                type="number"
                domain={[0, data.total]}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 12, fill: "#4b5563" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
                formatter={(value: number) => [value, "Assignments"]}
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  fontSize: 13,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
                itemStyle={{ color: "#111827" }}
                labelStyle={{ color: "#6b7280", marginBottom: 2 }}
              />
              <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={14}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
