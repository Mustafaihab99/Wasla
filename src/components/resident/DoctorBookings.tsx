import useShowMyBooking from "../../hooks/resident/useShowMyBooking";
import useCancelResidentBook from "../../hooks/doctor/useCancelBook";
import { myBookingDoctor } from "../../types/resident/residentData";

import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCalendarAlt, FaClock, FaMoneyBill } from "react-icons/fa";

import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";
import ConfirmationModal from "../../components/doctor/modals/CancelBookPopup";
import noData from "../../assets/images/nodata.webp";

export default function DoctorBookings() {
  const id = sessionStorage.getItem("user_id")!;
  const { t } = useTranslation();

  const { data: bookings, isLoading } = useShowMyBooking(id);
  const { mutate: cancelBook, isPending } = useCancelResidentBook();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const dayNames = [
    t("doctor.Sat"),
    t("doctor.Sun"),
    t("doctor.Mon"),
    t("doctor.Tue"),
    t("doctor.Wed"),
    t("doctor.Thu"),
    t("doctor.Fri"),
  ];

  const handleCancel = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmCancel = () => {
    if (selectedId) cancelBook(selectedId);
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
        {bookings.map((b: myBookingDoctor) => (
          <motion.div
  key={b.id}
  whileHover={{ scale: 1.03, y: -3 }}
  className="flex flex-col sm:flex-row p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg"
>
  <img
    src={
      import.meta.env.VITE_USER_IMAGE +
      b.serviceProviderProfilePhoto
    }
    className="w-20 h-20 rounded-full object-cover border-2 border-primary"
  />

  <div className="flex-1 ml-6 flex flex-col justify-between">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-bold text-primary">
          {b.serviceProviderName}
        </h3>
        <p className="text-dried">{b.serviceName}</p>
      </div>

      {/* Status Badge */}
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          b.status === 1
            ? "bg-yellow-100 text-yellow-800"
            : b.status === 2
            ? "bg-green-100 text-green-800"
            : b.status === 3
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {b.status === 1
          ? t("doctor.pending")
          : b.status === 2
          ? t("doctor.completed")
          : b.status === 3
          ? t("doctor.canceled")
          : t("doctor.unknown")}
      </span>
    </div>

    {/* Info */}
    <div className="mt-3 space-y-1 text-dried">
      <p>
        <FaCalendarAlt className="inline mr-2 text-blue-400" />
        {dayNames[Number(b.day)]} - {b.date}
      </p>

      <p>
        <FaClock className="inline mr-2 text-yellow-400" />
        {b.start.slice(0, 5)} {t("doctor.to")} {b.end.slice(0, 5)}
      </p>

      <p className="font-semibold text-green-500">
        <FaMoneyBill className="inline mr-2" />
        {b.price} {t("doctor.EGP")}
      </p>
    </div>

    {/* Cancel */}
    {b.status === 1 && (
      <div className="flex justify-end mt-4">
        <button
          onClick={() => handleCancel(b.id)}
          disabled={isPending}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
        >
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
