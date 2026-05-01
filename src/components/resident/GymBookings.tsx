import useShowGymBooking from "../../hooks/resident/useShowGymBooking";
import useCancelGymBook from "../../hooks/gym/useCancelGymBook";
import { GymResidentBookingData } from "../../types/gym/gym-types";

import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { FaCalendarAlt, FaClock, FaQrcode } from "react-icons/fa";

import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";
import ConfirmationModal from "../doctor/modals/ConfirmationModel";
import noData from "../../assets/images/nodata.webp";
import BookingQRModal from "../gym/Modal/BookingQRModal";

export default function GymBookings() {
  const id = sessionStorage.getItem("user_id")!;
  const { t } = useTranslation();
  const [showQR, setShowQR] = useState(false);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

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
    if (selectedId) cancelGym({ bookingId: selectedId, isResident: true });
    setShowConfirm(false);
    setSelectedId(null);
  };

  if (isLoading) return <DoctorCardSkeleton />;

  if (!bookings || bookings.length === 0)
    return (
      <div className="flex flex-col items-center mt-20 gap-4">
        <img src={noData} loading="lazy" className="w-48 opacity-70" />
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
            className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg">
            {/* Image */}
            <div className="flex justify-center sm:justify-start">
              <img
                src={import.meta.env.VITE_USER_IMAGE + g.imageUrl}
                loading="lazy"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-primary"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-primary">
                    {g.gymName}
                  </h3>

                  <p className="text-dried text-sm sm:text-base">
                    {i18next.language === "ar"
                      ? g.serviceName.arabic
                      : g.serviceName.english}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap justify-center sm:justify-end gap-2">
                  {/* Status */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      g.bookingStatus === 0
                        ? "bg-blue-100 text-blue-800"
                        : g.bookingStatus === 1
                          ? "bg-green-100 text-green-800"
                          : g.bookingStatus === 2
                            ? "bg-red-100 text-red-800"
                            : g.bookingStatus === 3
                              ? "bg-gray-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                    }`}>
                    {g.bookingStatus === 0
                      ? t("gym.active")
                      : g.bookingStatus === 1
                        ? t("doctor.completed")
                        : g.bookingStatus === 2
                          ? t("doctor.canceled")
                          : g.bookingStatus === 3
                            ? t("doctor.pending")
                            : t("admin.unknown")}
                  </span>

                  {/* isPaid */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      g.isPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {g.isPaid ? t("gym.paid") : t("gym.notPaid")}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="mt-3 space-y-1 text-dried text-sm sm:text-base">
                <p>
                  <FaCalendarAlt className="inline mr-2 text-blue-400" />
                  {formatDateTime(g.bookingTime)}
                </p>

                <p>
                  <FaClock className="inline mr-2 text-yellow-400" />
                  {g.durationInMonths} {t("gym.mo")}
                </p>
              </div>

              {/* Cancel */}
              {(g.bookingStatus === 0 || g.bookingStatus === 3) && (
                <div className="flex justify-center sm:justify-end mt-4">
                  <button
                    onClick={() => handleCancel(g.bookingId)}
                    disabled={isPending}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50">
                    {t("doctor.cancelBooking")}
                  </button>
                </div>
              )}
              {g.isPaid && g.qrCode && (g.bookingStatus === 0 || g.bookingStatus === 1) && (
                <div className="flex justify-center sm:justify-end mt-3">
                  <button
                    onClick={() => {
                      setSelectedQR(g.qrCode);
                      setShowQR(true);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition">
                    <FaQrcode size={14} />
                    {t("gym.showQR")}
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
      {showQR && selectedQR && (
        <BookingQRModal
          qrImage={selectedQR}
          onClose={() => {
            setShowQR(false);
            setSelectedQR(null);
          }}
        />
      )}
    </>
  );
}
