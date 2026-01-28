import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  years: {
    year: number;
    months: { month: number; amount: number }[];
  }[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const monthLabels = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

export default function AdminOverviewChart({
  years,
  selectedYear,
  onYearChange,
}: Props) {
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const yearData =
      years.find((y) => y.year === selectedYear)?.months || [];

    return months.map((m, idx) => {
      const found = yearData.find((x) => x.month === m);
      return {
        name: monthLabels[idx],
        amount: found?.amount ?? 0,
      };
    });
  }, [years, selectedYear]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow space-y-4"
      style={{ direction: "ltr" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold">
            {t("admin.RevenueAnalytics")}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            {t("admin.monthlyRevenue")}
          </p>
        </div>

        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="border border-border px-3 py-2 rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {years.map((y) => (
            <option key={y.year} value={y.year}>
              {y.year}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-[260px] sm:h-[300px] md:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="adminRev" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="90%"
                  stopColor="var(--primary)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              stroke="#888"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              domain={[0, (dataMax: number) => Math.ceil(dataMax / 100) * 100]}
            />

            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

            <Tooltip
              formatter={(value: number) => [
                `${value.toLocaleString()} EGP`,
                t("admin.revenue"),
              ]}
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />

            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--primary)"
              strokeWidth={3}
              fill="url(#adminRev)"
              dot={false}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
