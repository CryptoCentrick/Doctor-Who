"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const palette = ["#17b2c7", "#ffb347", "#7aa2ff", "#45e56b", "#ff8c69"];

function HeatmapChart({ data }: { data: Array<Record<string, string | number>> }) {
  return (
    <div className="grid grid-cols-7 gap-3">
      {data.map((item) => (
        <div key={String(item.date)} className="space-y-2 text-center">
          <div
            className="h-28 rounded-3xl"
            style={{
              background: `linear-gradient(180deg, rgba(23,178,199,0.12), rgba(23,178,199,${Number(item.intensity) / 100}))`
            }}
          />
          <div className="text-xs text-muted-foreground">{String(item.date)}</div>
        </div>
      ))}
    </div>
  );
}

export function ReportChart({
  title,
  type,
  data,
  keys,
  helper
}: {
  title: string;
  type: "line" | "area" | "bar" | "pie" | "heatmap";
  data: Array<Record<string, string | number>>;
  keys: string[];
  helper?: string;
}) {
  return (
    <Card className="glass-panel border-white/10">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        {helper ? <p className="text-sm text-muted-foreground">{helper}</p> : null}
      </CardHeader>
      <CardContent>
        {type === "heatmap" ? (
          <HeatmapChart data={data} />
        ) : (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {type === "line" ? (
                <LineChart data={data}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Brush dataKey="date" height={26} stroke="#17b2c7" />
                  {keys.map((key, index) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={palette[index % palette.length]}
                      strokeWidth={3}
                      dot={false}
                    />
                  ))}
                </LineChart>
              ) : type === "area" ? (
                <AreaChart data={data}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Brush dataKey="date" height={26} stroke="#17b2c7" />
                  {keys.map((key, index) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={palette[index % palette.length]}
                      fill={palette[index % palette.length]}
                      fillOpacity={0.3}
                    />
                  ))}
                </AreaChart>
              ) : type === "bar" ? (
                <BarChart data={data}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Brush dataKey="date" height={26} stroke="#17b2c7" />
                  {keys.map((key, index) => (
                    <Bar key={key} dataKey={key} radius={[12, 12, 0, 0]} fill={palette[index % palette.length]} />
                  ))}
                </BarChart>
              ) : (
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={data}
                    dataKey={keys[0]}
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`${String(entry["name"] ?? index)}-${index}`} fill={palette[index % palette.length]} />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
