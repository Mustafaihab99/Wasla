import useShowtechBooking from "../../hooks/technican/useShowTechBookings";
import useCancelTechBook from "../../hooks/technican/useCancelTechBook";
import { TechnicianBookingData } from "../../types/technician/technician-types";

import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import { FaCalendarAlt, FaMoneyBillWave, FaPhone } from "react-icons/fa";

import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";
import ConfirmationModal from "../doctor/modals/ConfirmationModel";
import noData from "../../assets/images/nodata.webp";
import { TechBookStatus } from "../../utils/enum";

export default function TechBookings() {
  const id = sessionStorage.getItem("user_id")!;
  const { t } = useTranslation();

  const { data: bookings, isLoading } = useShowtechBooking(id);
  const { mutate: cancelBook, isPending: cancelLoading } = useCancelTechBook();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"cancel" | "reject" | null>(
    null,
  );

  // 📅 format date
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(i18next.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAction = (id: number, type: "cancel" | "reject") => {
    setSelectedId(id);
    setActionType(type);
    setShowConfirm(true);
  };

  const confirmAction = () => {
    if (!selectedId || !actionType) return;

    if (actionType === "cancel") cancelBook(selectedId);

    setShowConfirm(false);
    setSelectedId(null);
    setActionType(null);
  };

  if (isLoading) return <DoctorCardSkeleton />;

  if (!bookings || bookings.length === 0)
    return (
      <div className="flex flex-col items-center mt-20 gap-4">
        <img src={noData} className="w-48 opacity-70" />
        <p className="text-gray-400">{t("tech.noBookings")}</p>
      </div>
    );

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {bookings.map((b: TechnicianBookingData) => (
          <motion.div
            key={b.bookingId}
            whileHover={{ scale: 1.03, y: -3 }}
            className="flex flex-col sm:flex-row p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg">
            {/* Image */}
            <img
              src={b.technicianImage}
              className="w-20 h-20 rounded-full object-cover border-2 border-primary"
            />

            <div className="flex-1 ml-6 flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary">
                    {b.technicianName}
                  </h3>

                  <p className="text-dried flex items-center gap-2">
                    <FaPhone />
                    {b.technicianPhone}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    b.status === TechBookStatus.Pending
                      ? "bg-yellow-100 text-yellow-800"
                      : b.status === TechBookStatus.Accepted
                        ? "bg-blue-100 text-blue-800"
                        : b.status === TechBookStatus.Done
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                  }`}>
                  {b.status === TechBookStatus.Pending
                    ? t("tech.pending")
                    : b.status === TechBookStatus.Accepted
                      ? t("tech.accepted")
                      : b.status === TechBookStatus.Done
                        ? t("tech.done")
                        : b.status === TechBookStatus.Rejected
                          ? t("tech.rejected")
                          : t("tech.cancelled")}
                </span>
              </div>

              {/* Info */}
              <div className="mt-3 space-y-1 text-dried">
                <p>
                  <FaCalendarAlt className="inline mr-2 text-blue-400" />
                  {formatDateTime(b.bookingDate)}
                </p>

                <p>
                  <FaMoneyBillWave className="inline mr-2 text-green-400" />
                  {b.price} {t("tech.egp")}
                </p>
              </div>

              {/* Actions */}
              {b.status === TechBookStatus.Pending && (
                <div className="flex gap-2 justify-end mt-4">
                  {/* Cancel */}
                  <button
                    onClick={() => handleAction(b.bookingId, "cancel")}
                    disabled={cancelLoading}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
                    {t("tech.cancel")}
                  </button>
                </div>
              )}

              {b.status === TechBookStatus.Accepted && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleAction(b.bookingId, "cancel")}
                    disabled={cancelLoading}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
                    {t("tech.cancel")}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Confirm Modal */}
      <ConfirmationModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmAction}
      />
    </>
  );
}
