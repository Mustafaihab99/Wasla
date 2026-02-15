import useShowGymBooking from "../../hooks/resident/useShowGymBooking";
import useCancelGymBook from "../../hooks/gym/useCancelGymBook";
import { GymResidentBookingData } from "../../types/gym/gym-types";

import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";
import ConfirmationModal from "../../components/doctor/modals/CancelBookPopup";
import noData from "../../assets/images/nodata.webp";

export default function GymBookings() {
  const id = sessionStorage.getItem("user_id")!;
  const { t } = useTranslation();

  const { data: bookings, isLoading } = useShowGymBooking(id);
  const { mutate: cancelGym, isPending } = useCancelGymBook();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleCancel = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(i18next.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const confirmCancel = () => {
    if (selectedId) cancelGym(selectedId);
    setShowConfirm(false);
    setSelectedId(null);
  };

  if (isLoading) return <DoctorCardSkeleton />;

  if (!bookings || bookings.length === 0)
    return (
      <div className="flex flex-col items-center mt-20 gap-4">
        <img src={noData} className="w-48 opacity-70" />
        <p className="text-gray-400">{t("doctor.noBookingsFound")}</p>
      </div>
    );

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {bookings.map((g: GymResidentBookingData) => (
          <motion.div
            key={g.bookingId}
            whileHover={{ scale: 1.03, y: -3 }}
            className="flex flex-col sm:flex-row p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg">
            <img
              src={import.meta.env.VITE_GYM_IMAGE + g.imageUrl}
              className="w-20 h-20 rounded-full object-cover border-2 border-primary"
            />

            <div className="flex-1 ml-6 flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary">
                    {g.gymName}
                  </h3>

                  <p className="text-dried">
                    {i18next.language === "ar"
                      ? g.serviceName.arabic
                      : g.serviceName.english}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    g.bookingStatus === 0
                      ? "bg-blue-100 text-blue-800"
                      : g.bookingStatus === 1
                        ? "bg-green-100 text-green-800"
                        : g.bookingStatus === 2
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                  }`}>
                  {g.bookingStatus === 0
                    ? t("gym.active")
                    : g.bookingStatus === 1
                      ? t("doctor.completed")
                      : g.bookingStatus === 2
                        ? t("doctor.canceled")
                        : t("admin.unknown")}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-dried">
                <p>
                  <FaCalendarAlt className="inline mr-2 text-blue-400" />
                  {formatDateTime(g.bookingTime)}
                </p>

                <p>
                  <FaClock className="inline mr-2 text-yellow-400" />
                  {g.durationInMonths} {t("gym.mo")}
                </p>
              </div>

              {g.bookingStatus === 0 && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleCancel(g.bookingId)}
                    disabled={isPending}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50">
                    {t("doctor.cancelBooking")}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <ConfirmationModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmCancel}
      />
    </>
  );
}
