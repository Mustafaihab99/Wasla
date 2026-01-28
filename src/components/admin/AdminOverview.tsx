import { motion } from "framer-motion";
import {
  FaCalendarCheck,
  FaUsers,
  FaBan,
  FaChartArea,
} from "react-icons/fa";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useAdminOverview from "../../hooks/admin/useAdminOverview";
import AdminOverviewChart from "./AdminOverviewCharts";

const colorMap = {
  green: {
    border: "border-green-500/20",
    text: "text-green-600",
    bg: "bg-green-500/10",
  },
  red: {
    border: "border-red-500/20",
    text: "text-red-600",
    bg: "bg-red-500/10",
  },
  primary: {
    border: "border-primary/20",
    text: "text-primary",
    bg: "bg-primary/10",
  },
};

export default function AdminOverview() {
  const { t } = useTranslation();
  const { data, isLoading } = useAdminOverview();
  const [year, setYear] = useState<number | null>(null);

  const years = data?.years?.map((y) => y.year) || [];
  const selectedYear = year ?? years[years.length - 1];

  const totalBookings =
    (data?.completedBookingsCount ?? 0) +
    (data?.canceledBookingsCount ?? 0);

  const completionRate = totalBookings
    ? Math.round(
        ((data?.completedBookingsCount ?? 0) / totalBookings) * 100
      )
    : 0;

  const cancellationRate = totalBookings
    ? Math.round(
        ((data?.canceledBookingsCount ?? 0) / totalBookings) * 100
      )
    : 0;

  const totalRevenue =
    data?.years
      ?.flatMap((y) => y.months)
      ?.reduce((sum, m) => sum + m.amount, 0) ?? 0;

  const avgMonthlyRevenue = data?.years?.length
    ? Math.round(totalRevenue / (data.years.length * 12))
    : 0;

  const stats = [
    {
      title: t("admin.CompletedBookings"),
      value: data?.completedBookingsCount ?? 0,
      hint: `${completionRate}% ${t("admin.successRate")}`,
      icon: <FaCalendarCheck />,
      color: "green",
    },
    {
      title: t("admin.CanceledBookings"),
      value: data?.canceledBookingsCount ?? 0,
      hint: `${cancellationRate}% ${t("admin.cancelRate")}`,
      icon: <FaBan />,
      color: "red",
    },
    {
      title: t("admin.TotalUsers"),
      value: data?.countOfUsers ?? 0,
      hint: t("admin.systemUsers"),
      icon: <FaUsers />,
      color: "primary",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-24 bg-muted rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-muted rounded-xl animate-pulse"
            />
          ))}
        </div>
        <div className="h-[350px] bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/20">
            <FaChartArea className="text-2xl text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {t("admin.overview")}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t("admin.systemAnalytics")}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => {
          const colors =
            colorMap[s.color as keyof typeof colorMap];

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-card border rounded-xl p-5 ${colors.border}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {s.title}
                  </p>
                  <p
                    className={`text-3xl font-bold mt-1 ${colors.text}`}
                  >
                    {s.value}
                  </p>
                  {s.hint && (
                    <p className="text-xs mt-1 text-muted-foreground">
                      {s.hint}
                    </p>
                  )}
                </div>

                <div
                  className={`p-3 rounded-xl ${colors.bg} ${colors.text}`}
                >
                  {s.icon}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6"
      >
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">
              {t("admin.RevenueSummary")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("admin.allTimeAnalytics")}
            </p>
          </div>

          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("admin.TotalRevenue")}
              </p>
              <p className="text-xl font-bold text-primary">
                {totalRevenue.toLocaleString()} {t("admin.EGP")}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {t("admin.AvgMonthly")}
              </p>
              <p className="text-xl font-bold text-primary">
                {avgMonthlyRevenue.toLocaleString()} {t("admin.EGP")}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <AdminOverviewChart
        years={data?.years || []}
        selectedYear={selectedYear}
        onYearChange={setYear}
      />
    </div>
  );
}
