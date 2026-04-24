import { useState } from "react";
import { useTranslation } from "react-i18next";

import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

import {
  MdPendingActions,
  MdRestaurant,
  MdLocalShipping,
  MdCheckCircle,
  MdCancel,
  MdLocationOn,
} from "react-icons/md";

import useGetRestaurantOrders from "../../hooks/restaurant/cart/useGetRestaurantOrders";
import { restaurantTakeAway } from "../../types/restaurant/restaurant-types";

const getPaymentIcon = (method: number) =>
  method === 1 ? (
    <FaCreditCard className="text-primary" />
  ) : (
    <FaMoneyBillWave className="text-green-600" />
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStatus = (status: number, t: any) => {
  switch (status) {
    case 0:
      return {
        label: t("restaurant.pending"),
        icon: <MdPendingActions />,
        style: "bg-yellow-100 text-yellow-800",
      };
    case 1:
      return {
        label: t("restaurant.paid"),
        icon: <MdCheckCircle />,
        style: "bg-green-100 text-green-800",
      };
    case 2:
      return {
        label: t("restaurant.preparing"),
        icon: <MdRestaurant />,
        style: "bg-blue-100 text-blue-800",
      };
    case 3:
      return {
        label: t("restaurant.onWay"),
        icon: <MdLocalShipping />,
        style: "bg-purple-100 text-purple-800",
      };
    case 4:
      return {
        label: t("restaurant.delivered"),
        icon: <MdCheckCircle />,
        style: "bg-green-200 text-green-900",
      };
    case 5:
      return {
        label: t("restaurant.cancelled"),
        icon: <MdCancel />,
        style: "bg-red-100 text-red-800",
      };
    default:
      return {
        label: t("restaurant.unknown"),
        icon: null,
        style: "bg-gray-100 text-gray-700",
      };
  }
};

export default function RestaurantDeliveryOrders() {
  const id = sessionStorage.getItem("user_id")!;
  const { t, i18n } = useTranslation();

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<number | null>(null);

  const pageSize = 6;
  const { data, isLoading } = useGetRestaurantOrders(page, pageSize, id);

  if (isLoading)
    return (
      <div className="flex justify-center mt-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!data?.data?.length)
    return (
      <p className="text-center mt-10 text-dried">{t("restaurant.noOrders")}</p>
    );

  const totalPages = Math.ceil((data.totalCount || 0) / pageSize);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-5">
      {/* HEADER */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-primary">
          {t("restaurant.deliveryOrders")}
        </h1>

        <p className="text-sm text-dried">{t("restaurant.manageOrders")}</p>
      </div>

      {/* ORDERS */}
      {data.data.map((order: restaurantTakeAway) => {
        const status = getStatus(order.status, t);

        return (
          <div
            key={order.id}
            className="bg-background border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
              <div className="space-y-1">
                <h2 className="font-bold text-primary">{order.residentName}</h2>
                <p className="text-xs text-dried">
                  <a
                    href={`tel:${order.residentPhone}`}
                    className="hover:text-primary transition">
                    {order.residentPhone}
                  </a>
                </p>

                <p className="text-xs text-dried">
                  {new Date(order.createdAt).toLocaleString(i18n.language)}
                </p>

                <p className="text-xs text-dried flex items-center gap-1">
                  <MdLocationOn />
                  {order.address}
                </p>
              </div>

              {/* BADGES */}
              <div className="flex flex-wrap gap-2">
                <span
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${status.style}`}>
                  {status.icon}
                  {status.label}
                </span>

                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  {getPaymentIcon(order.paymentMethod)}
                  {order.paymentMethod === 1
                    ? t("restaurant.card")
                    : t("restaurant.cash")}
                </span>
              </div>
            </div>

            {/* PRICE */}
            <div className="flex justify-between items-center mt-4">
              <p className="font-bold text-primary text-lg">
                {order.totalPrice} {t("restaurant.egp")}
              </p>

              <button
                onClick={() => setOpen(open === order.id ? null : order.id)}
                className="text-sm text-primary hover:underline">
                {open === order.id
                  ? t("restaurant.hideItems")
                  : t("restaurant.viewItems")}
              </button>
            </div>

            {/* ITEMS */}
            {open === order.id && (
              <div className="mt-3 space-y-2 border-t border-border pt-3">
                {order.items.map((item) => (
                  <div
                    key={item.orderItemId}
                    className="flex justify-between text-sm">
                    <span>{item.orderItemName}</span>
                    <span className="text-dried">
                      {item.quantity} × {item.price}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition">
          {t("restaurant.prev")}
        </button>

        <span className="text-dried text-sm">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition">
          {t("restaurant.next")}
        </button>
      </div>
    </div>
  );
}
