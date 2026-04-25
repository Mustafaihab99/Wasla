import { motion } from "framer-motion";
import { useState } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import useGetResidentOrders from "../../hooks/restaurant/cart/useGetResidentOrders";

import {
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";

import {
  MdPendingActions,
  MdRestaurant,
  MdLocalShipping,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";

export default function TakeAwayOrder() {
  const id = sessionStorage.getItem("user_id")!;
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const { data, isLoading } = useGetResidentOrders(page, pageSize, id);
  const { t } = useTranslation();
  const totalPages = Math.ceil((data?.totalCount || 0) / pageSize);
  const [openOrder, setOpenOrder] = useState<number | null>(null);

  if (isLoading)
    return (
      <p className="text-center mt-10 text-dried">Loading...</p>
    );

  if (!data?.data?.length)
    return (
      <p className="text-center text-dried mt-10">
        {t("restaurant.noOrders")}
      </p>
    );

  // Payment icon
  const PaymentIcon = (method: number) =>
    method === 1 ? (
      <FaCreditCard className="text-primary" />
    ) : (
      <FaMoneyBillWave className="text-green-600" />
    );

  // Status UI
  const getStatusUI = (status: number) => {
    switch (status) {
      case 0:
        return {
          label: t("restaurant.status_0"),
          icon: <MdPendingActions />,
          style: "bg-yellow-100 text-yellow-800",
        };
      case 1:
        return {
          label: t("restaurant.status_1"),
          icon: <MdCheckCircle />,
          style: "bg-green-100 text-green-800",
        };
      case 2:
        return {
          label: t("restaurant.status_2"),
          icon: <MdRestaurant />,
          style: "bg-blue-100 text-blue-800",
        };
      case 3:
        return {
          label: t("restaurant.status_3"),
          icon: <MdLocalShipping />,
          style: "bg-purple-100 text-purple-800",
        };
      case 4:
        return {
          label: t("restaurant.status_4"),
          icon: <MdCheckCircle />,
          style: "bg-green-200 text-green-900",
        };
      case 5:
        return {
          label: t("restaurant.status_5"),
          icon: <MdCancel />,
          style: "bg-red-100 text-red-800",
        };
      default:
        return {
          label: "Unknown",
          icon: null,
          style: "bg-gray-100 text-gray-700",
        };
    }
  };

  return (
    <>
    <div className="max-w-5xl mx-auto space-y-4 p-4">

      {data.data.map((order) => {
        const status = getStatusUI(order.status);

        return (
          <motion.div
            key={order.id}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-background border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

              <div className="flex items-start gap-2">
                <MdRestaurant className="text-primary text-xl mt-1" />

                <div>
                  <h2 className="font-bold text-primary">
                    {order.restaurantName}
                  </h2>

                  <p className="text-xs text-dried">
                    {new Date(order.createdAt).toLocaleString(
                      i18next.language
                    )}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">

                <span
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${status.style}`}
                >
                  {status.icon}
                  {status.label}
                </span>

                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  {PaymentIcon(order.paymentMethod)}
                  {order.paymentMethod === 1 ? t("restaurant.card") : t("restaurant.cash")}
                </span>

              </div>
            </div>

            {/* Price */}
            <div className="mt-3 flex justify-between items-center">
              <p className="font-bold text-lg text-primary">
                {order.totalPrice} {t("restaurant.EGP")}
              </p>

              <button
                onClick={() =>
                  setOpenOrder(
                    openOrder === order.id ? null : order.id
                  )
                }
                className="text-sm text-primary hover:underline"
              >
                {openOrder === order.id
                  ? t("restaurant.hideItems")
                  : t("restaurant.viewItems")}
              </button>
            </div>

            {/* Items */}
            {openOrder === order.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-3 space-y-2 overflow-hidden"
              >
                {order.items.map((item) => (
                  <div
                    key={item.orderItemId}
                    className="flex justify-between text-sm border-b border-border py-1"
                  >
                    <span>{item.orderItemName}</span>
                    <span className="text-dried">
                      {item.quantity} × {item.price}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
    <div className="flex justify-center items-center gap-3 mt-6">

  <button
    disabled={page === 1}
    onClick={() => setPage((p) => p - 1)}
    className="px-4 py-2 rounded-lg border border-border disabled:opacity-40"
  >
    {t("restaurant.prev")}
  </button>

  <span className="text-sm text-dried">
    {page} / {totalPages}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage((p) => p + 1)}
    className="px-4 py-2 rounded-lg border border-border disabled:opacity-40"
  >
    {t("restaurant.next")}
  </button>

</div>
</>
  );
}