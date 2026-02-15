import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useGetGymAdminBooking from "../../hooks/gym/useGetGymAdminBooking";
import useCancelGymBook from "../../hooks/gym/useCancelGymBook";
import i18next from "i18next";

export default function GymBookingList() {
  const { t } = useTranslation();
  const gymId = sessionStorage.getItem("user_id")!;

  const [status, setStatus] = useState<number>(0);

  const { data: bookings, isLoading } = useGetGymAdminBooking(gymId, status);

  const { mutate: cancelBook, isPending } = useCancelGymBook();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="border border-primary rounded-xl p-6 shadow space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-2xl font-bold">{t("gym.bookingsList")}</h2>
        <select
          value={status}
          onChange={(e) => setStatus(Number(e.target.value))}
          className="border border-primary px-4 py-2 rounded-lg bg-background font-medium">
          <option value={0}>{t("gym.active")}</option>
          <option value={1}>{t("gym.completed")}</option>
          <option value={2}>{t("gym.canceled")}</option>
        </select>
      </div>
      {isLoading && (
        <div className="w-full flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {!isLoading && bookings?.length === 0 && (
        <div className="text-center py-10 text-gray-500 font-semibold">
          {t("gym.noBookings")}
        </div>
      )}
      <div className="space-y-4">
        {bookings?.map((b) => {
          const { date, time } = formatDateTime(b.bookingTime);

          return (
            <motion.div
              key={b.bookingId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 border border-primary rounded-xl shadow hover:shadow-lg transition">
              <div className="flex gap-4 flex-col sm:flex-row">
                {/* User Image */}
                {b.imageUrl && (
                  <img
                    src={import.meta.env.VITE_USER_IMAGE + b.imageUrl}
                    className="w-16 h-16 rounded-full object-cover border shadow"
                  />
                )}

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p>
                    <b>{t("gym.user")}:</b> {b.name}
                  </p>

                  <p>
                    <b>{t("gym.service")}:</b>{" "}
                    {i18next.language === "ar"
                      ? b.serviceName.arabic
                      : b.serviceName.english}
                  </p>

                  <p>
                    <b>{t("gym.date")}:</b> {date}
                  </p>

                  <p>
                    <b>{t("gym.time")}:</b> {time}
                  </p>

                  <p>
                    <b>{t("gym.duration")}:</b> {b.durationInMonths}{" "}
                    {t("gym.months")}
                  </p>

                  <p>
                    <b>{t("gym.price")}:</b> {b.price} {t("gym.EGP")}
                  </p>
                </div>
              </div>

              {/* Cancel Button only for Active */}
              {status === 0 && (
                <div className="flex justify-end mt-4">
                  <button
                    disabled={isPending}
                    onClick={() => cancelBook(b.bookingId)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50">
                    {isPending ? t("gym.canceling") : t("gym.cancelBooking")}
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
