"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { StatusDistribution } from "@/server/lib/analytics";

type StatusDonutChartProps = {
  data: StatusDistribution;
};

// Use exact CSS token hex values — Recharts can't consume var() at runtime
const COLORS = {
  accepted: "#16a34a",
  pending: "#6b7280",
  needs_improvement: "#d97706",
};

const LABELS = {
  accepted: "Accepted",
  pending: "Pending",
  needs_improvement: "Needs Improvement",
};

type SliceKey = keyof typeof COLORS;

export function StatusDonutChart({ data }: StatusDonutChartProps) {
  if (data.total === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 220,
          color: "var(--text-muted)",
          fontSize: "var(--font-sm)",
        }}
      >
        No submissions yet
      </div>
    );
  }

  const chartData = (
    ["accepted", "pending", "needs_improvement"] as SliceKey[]
  )
    .map((key) => ({ key, name: LABELS[key], value: data[key] }))
    .filter((d) => d.value > 0);

  // Build a human-readable summary for screen readers
  const summary = chartData
    .map(
      (d) =>
        `${d.name}: ${d.value} (${Math.round((d.value / data.total) * 100)}%)`
    )
    .join(", ");

  return (
    <div>
      {/* Accessible description for screen readers */}
      <p className="sr-only">
        Submission status breakdown — {summary}. Total: {data.total}.
      </p>

      {/* Chart is decorative; the sr-only text above provides the content */}
      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={88}
              paddingAngle={2}
              strokeWidth={0}
              tabIndex={-1}
            >
              {chartData.map((entry) => (
                <Cell key={entry.key} fill={COLORS[entry.key as SliceKey]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value} (${Math.round((value / data.total) * 100)}%)`,
                name,
              ]}
              contentStyle={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                fontSize: 13,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
              itemStyle={{ color: "#111827" }}
              labelStyle={{ display: "none" }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: 13, color: "#4b5563" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
