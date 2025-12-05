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

import DoctorHomeSkeleton from "./DoctorHomeSkeleton";
import useFetchDoctorCharts from "../../hooks/doctor/useFetchDoctorCharts";
import { useMemo, useState } from "react";

export default function DoctorCharts() {
  const { t } = useTranslation();
  const doctorId = sessionStorage.getItem("user_id")!;
  const { data, isLoading } = useFetchDoctorCharts(doctorId);
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

  if (isLoading) return <DoctorHomeSkeleton />;

  const stats = [
    { title: t("doctor.Patients"), value: data?.numOfPatients },
    { title: t("doctor.Bookings"), value: data?.numOfBookings },
    { title: t("doctor.Completed"), value: data?.numOfCompletedBookings },
    {
      title: t("doctor.Total"),
      value: `${data?.totalAmount} ${t("doctor.EGP")}`,
    },
  ];

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-primary rounded-2xl p-6 shadow hover:shadow-xl hover:-translate-y-1 transition overflow-hidden">
            <h3 className="text-dried text-sm">{s.title}</h3>
            <p className="text-2xl md:text-3xl font-bold text-primary mt-2">
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div
        style={{ direction: "ltr" }}
        className="border border-primary rounded-xl p-6 shadow space-y-4">
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

        <div className="w-full h-[300px] md:h-[360px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={260}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
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

              <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 12 }} />
              <YAxis
                domain={[0, (dataMax) => Math.ceil(dataMax / 100) * 100]}
              />

              <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
              <Tooltip contentStyle={{backgroundColor: "var(--background)", border:"1px solid var(--primary)"}} />
              <Area
                dataKey="amount"
                stroke="var(--primary)"
                fill="url(#rev)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
