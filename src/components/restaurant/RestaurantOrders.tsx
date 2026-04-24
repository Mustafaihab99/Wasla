import { useState } from "react";
import { useTranslation } from "react-i18next";
import RestaurantDeliveryOrders from "./RestaurntDeliveryOrders";
import RestaurantReservationsDashboard from "./RestaurantReversation";
import { FaMotorcycle, FaChair } from "react-icons/fa";

type TabType = "delivery" | "reservations";

export default function RestaurantOrders() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabType>("delivery");

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">

      {/* HEADER */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-primary">
          {t("restaurant.myOrders")}
        </h1>

        <p className="text-dried text-sm">
          {t("restaurant.manageYourOrdersAndReservations")}
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-3 p-2 bg-background border border-border rounded-2xl w-full sm:w-fit mx-auto">

        {/* DELIVERY */}
        <button
          onClick={() => setTab("delivery")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition text-sm font-semibold ${
            tab === "delivery"
              ? "bg-primary text-white shadow"
              : "hover:bg-muted"
          }`}
        >
          <FaMotorcycle />
          {t("restaurant.deliveryOrders")}
        </button>

        {/* RESERVATIONS */}
        <button
          onClick={() => setTab("reservations")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition text-sm font-semibold ${
            tab === "reservations"
              ? "bg-primary text-white shadow"
              : "hover:bg-muted"
          }`}
        >
          <FaChair />
          {t("restaurant.tableReservations")}
        </button>
      </div>

      {/* CONTENT */}
      <div className="mt-6">
        {tab === "delivery" ? (
          <RestaurantDeliveryOrders />
        ) : (
          <RestaurantReservationsDashboard />
        )}
      </div>
    </div>
  );
}