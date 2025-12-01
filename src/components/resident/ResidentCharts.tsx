import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useGetResidentCharts from "../../hooks/resident/useGetResidentCharts";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ResidentCharts({ residentId }: { residentId: string }) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetResidentCharts(residentId);

  const [year, setYear] = useState<number | null>(null);

  const { availableYears, chartData } = useMemo(() => {
    if (!data?.years) return { availableYears: [], chartData: [] };

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const years = data.years.map((y) => y.year);
    const selectedYear = year ?? years[years.length - 1];

    const selectedData =
      data.years.find((y) => y.year === selectedYear)?.months || [];

    const finalMonths = months.map((m) => {
      const match = selectedData.find((mm) => mm.month === m);
      return {
        name: m,
        bookings: match?.bookings ?? 0,
        amount: match?.amount ?? 0,
      };
    });

    return { availableYears: years, chartData: finalMonths };
  }, [data, year]);

  if (isLoading)
    return (
      <div className="w-full flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
        <div className="border border-primary p-5 rounded-xl text-center shadow">
          <h3 className="text-sm opacity-70">{t("resident.allBooking")}</h3>
          <p className="text-3xl font-bold text-primary">
            {data?.numOfBookings}
          </p>
        </div>

        <div className="border border-primary p-5 rounded-xl text-center shadow">
          <h3 className="text-sm opacity-70">{t("resident.reneve")}</h3>
          <p className="text-3xl font-bold text-green-600">
            {data?.totalAmount} {t("doctor.EGP")}
          </p>
        </div>
      </div>

      <div className="border border-primary rounded-xl p-6 shadow space-y-4">
        <div className="flex justify-between flex-col md:flex-row gap-2  items-center">
          <h2 className="text-xl font-bold">{t("resident.usageStats")}</h2>

          <select
            value={year ?? ""}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border bg-background border-primary px-3 py-2 rounded-lg">
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div
          className="w-full h-[300px] md:h-[360px]"
          style={{ direction: "ltr" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="amountG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c853" stopOpacity="0.8" />
                  <stop offset="85%" stopColor="#00c853" stopOpacity="0.1" />
                </linearGradient>

                <linearGradient id="bookingsG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2962ff" stopOpacity="0.8" />
                  <stop offset="85%" stopColor="#2962ff" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 12 }} />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
              <Tooltip
                contentStyle={{
                  background: "var(--background)",
                  borderRadius: "10px",
                  border: "1px solid #00c853",
                  color: "var(--primary)",
                }}
              />

              <Area
                type="monotone"
                className="mt-5"
                dataKey="amount"
                stroke="#00c853"
                fill="url(#amountG)"
                strokeWidth={3}
                name={t("resident.reneve")}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="var(--primary)"
                fill="url(#bookingsG)"
                strokeWidth={3}
                name={t("resident.allBooking")}
              />

              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
