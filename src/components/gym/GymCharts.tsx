import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useMemo, useState } from "react";
import useFetchGymCharts from "../../hooks/gym/useFetchGymCharts";

export default function GymCharts() {
  const { t } = useTranslation();
  const gymId = sessionStorage.getItem("user_id")!;
  const { data, isLoading } = useFetchGymCharts(gymId);
  const [year, setYear] = useState<number | null>(null);

  const { availableYears, chartData } = useMemo(() => {
    if (!data?.years) return { availableYears: [], chartData: [] };

    const monthsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const years = data.years.map((y) => y.year);
    const selectedYear = year ?? years[years.length - 1];

    const selectedData =
      data.years.find((y) => y.year === selectedYear)?.months || [];

    const finalMonths = monthsList.map((month) => {
      const match = selectedData.find((m) => m.month === month);
      return { name: month, amount: match ? match.amount : 0 };
    });

    return { availableYears: years, chartData: finalMonths };
  }, [data, year]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-16">
        {" "}
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />{" "}
      </div>
    );
  }

  const stats = [
    { title: t("gym.bookings"), value: data?.numberOfBookings },
    { title: t("gym.trainees"), value: data?.numberOfTrainees },
    {
      title: t("gym.totalRevenue"),
      value: `${data?.totalAmount} ${t("gym.EGP")}`,
    },
  ];

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-primary rounded-2xl p-6 shadow hover:shadow-xl transition">
            <h3 className="text-dried text-sm">{s.title}</h3>
            <p className="text-2xl font-bold text-primary mt-2">{s.value}</p>
          </motion.div>
        ))}
      </div>
      {/* Chart */}
      <div className="border border-primary rounded-xl p-6 shadow space-y-4"
      style={{direction:"ltr"}}
      >
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h2 className="text-xl font-bold">{t("doctor.renevue")}</h2>

          <select
            value={year ?? ""}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-primary px-3 py-2 rounded-lg bg-background">
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gymRev" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="85%"
                    stopColor="var(--primary)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--primary)"
                fill="url(#gymRev)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
