import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import useGetEventDashboard from "../../hooks/userEvent/useGetEventDashboard";
import {
  FaEye,
  FaHeart,
  FaCalendarCheck,
  FaSpinner,
  FaExchangeAlt,
  FaChartLine,
  FaUsers,
} from "react-icons/fa";
import { userActivityData } from "../../types/userEvent/userEvent-typs";

export default function AdminServiceDashboard() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetEventDashboard();

  if (isLoading) {
    return (
      <div className="p-10 flex justify-center items-center">
        <FaSpinner className="animate-spin text-2xl text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const getImage = (item: userActivityData) => {
    if (!item?.image) return "/images/default-user.png";
    return item.roleName === "gym"
      ? import.meta.env.VITE_GYM_IMAGE + item.image
      : import.meta.env.VITE_USER_IMAGE + item.image;
  };

  const totalViews = data.conversion.reduce(
    (sum, c) => sum + (c.views ?? 0),
    0
  );

  const totalBookings = data.conversion.reduce(
    (sum, c) => sum + (c.bookings ?? 0),
    0
  );

  const avgConversion =
    data.conversion.length > 0
      ? data.conversion.reduce(
          (sum, c) => sum + (c.conversionRate ?? 0),
          0
        ) / data.conversion.length
      : 0;

  const bestRole =
    data.conversion.reduce((prev, curr) =>
      (curr.conversionRate ?? 0) > (prev.conversionRate ?? 0)
        ? curr
        : prev,
      data.conversion[0]
    );

  const topCards = [
    {
      title: t("admin.topBooking"),
      icon: <FaCalendarCheck />,
      item: data.serviceProvidersBooking?.[0],
    },
    {
      title: t("admin.topViews"),
      icon: <FaEye />,
      item: data.serviceProvidersView?.[0],
    },
    {
      title: t("admin.topFavorites"),
      icon: <FaHeart />,
      item: data.serviceProvidersFav?.[0],
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-2xl border border-primary/20"
      >
        <h1 className="text-3xl font-bold">
          {t("admin.serviceDashboard")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.serviceDashboardDesc")}
        </p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<FaEye />} label={t("admin.views")} value={totalViews} />
        <StatCard
          icon={<FaCalendarCheck />}
          label={t("admin.bookings")}
          value={totalBookings}
        />
        <StatCard
          icon={<FaChartLine />}
          label={t("admin.avgConversion")}
          value={`${avgConversion.toFixed(1)}%`}
        />
        <StatCard
          icon={<FaUsers />}
          label={t("admin.bestRole")}
          value={bestRole?.roleName || "-"}
        />
      </div>

      {/* Top Providers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{card.title}</h3>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {card.icon}
              </div>
            </div>

            {card.item.id ? (
              <div className="flex items-center gap-3">
                <img
                  src={getImage(card.item)}
                  className="w-16 h-16 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium line-clamp-1">
                    {card.item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {card.item.roleName}
                  </p>
                  <p className="text-sm mt-1">
                    ⭐ {(card.item.rating ?? 0).toFixed(1)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {t("admin.noData")}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Conversion Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg"
      style={{direction: "ltr"}}
      >
        <div className="p-4 border-b border-border flex items-center gap-2">
          <FaExchangeAlt className="text-primary" />
          <h3 className="font-semibold text-lg">
            {t("admin.conversionStats")}
          </h3>
        </div>

        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="p-4 text-left">{t("admin.role")}</th>
              <th className="p-4 text-left">{t("admin.views")}</th>
              <th className="p-4 text-left">{t("admin.bookings")}</th>
              <th className="p-4 text-left">{t("admin.conversionRate")}</th>
            </tr>
          </thead>

          <tbody>
            {data.conversion.map((c, i) => (
              <tr
                key={i}
                className="border-b border-border hover:bg-muted/10"
              >
                <td className="p-4 font-medium">{c.roleName}</td>
                <td className="p-4">{c.views ?? 0}</td>
                <td className="p-4">{c.bookings ?? 0}</td>
                <td className="p-4 text-primary font-semibold">
                  {(c.conversionRate ?? 0).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-3 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
    </div>
  );
}