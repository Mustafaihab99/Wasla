import useShowMyBooking from "../../hooks/resident/useShowMyBooking";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCalendarAlt, FaMoneyBill, FaClock } from "react-icons/fa";
import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";
import noData from "../../assets/images/nodata.webp";
import ConfirmationModal from "../../components/doctor/modals/CancelBookPopup";
import useCancelResidentBook from "../../hooks/doctor/useCancelBook";
import { myBookingDoctor } from "../../types/resident/residentData";

export default function ResidentMyBooking() {
  const id = sessionStorage.getItem("user_id")!;
  const { t } = useTranslation();
  const { data: bookings, isLoading: loadBookings } = useShowMyBooking(id);
  const { mutate: cancelBook, isPending: cancelLoading } =
    useCancelResidentBook();

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );

  const dayNames = [
    t("doctor.Sat"),
    t("doctor.Sun"),
    t("doctor.Mon"),
    t("doctor.Tue"),
    t("doctor.Wed"),
    t("doctor.Thu"),
    t("doctor.Fri"),
  ];

  const handleCancelClick = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setShowConfirm(true);
  };

  const handleConfirmCancel = () => {
    if (selectedBookingId) {
      cancelBook(selectedBookingId);
      setShowConfirm(false);
      setSelectedBookingId(null);
    }
  };

  return (
    <>
      {" "}
      <div className="w-full bg-background pb-20 px-4 text-foreground">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold mt-2 mb-12 flex items-center">
          {" "}
          <FaCalendarAlt className="inline text-blue-500 mr-2" />
          {t("resident.myBooking")}
        </motion.h2>
        {loadBookings && <DoctorCardSkeleton />}
        {!loadBookings && bookings?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 gap-4">
            <img src={noData} alt="no data found" className="w-48 opacity-70" />
            <p className="text-gray-400 text-lg font-semibold">
              {t("doctor.noBookingsFound")}
            </p>
          </div>
        )}
        {!loadBookings && bookings!.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto">
            {bookings?.map((b: myBookingDoctor) => (
              <motion.div
                key={b.id}
                whileHover={{ scale: 1.03, y: -3 }}
                className="flex flex-col sm:flex-row p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg transition-transform">
                <div className="flex-shrink-0">
                  <img
                    src={
                      import.meta.env.VITE_USER_IMAGE +
                      b.serviceProviderProfilePhoto
                    }
                    alt={b.serviceProviderName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow-md"
                  />
                </div>

                <div className="flex-1 ml-0 sm:ml-6 mt-4 sm:mt-0 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-primary">
                        {b.serviceProviderName}
                      </h3>
                      <p className="text-dried font-medium">{b.serviceName}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        b.status === 1
                          ? "bg-yellow-100 text-yellow-800"
                          : b.status === 2
                          ? "bg-green-100 text-green-800"
                          : b.status === 3
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      {b.status === 1
                        ? t("doctor.pending")
                        : b.status === 2
                        ? t("doctor.completed")
                        : b.status === 3
                        ? t("doctor.canceled")
                        : t("doctor.unknown")}
                    </span>
                  </div>

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

                  {b.status === 1 && (
                    <div className="flex justify-end mt-4">
                      <button
                        disabled={cancelLoading}
                        onClick={() => handleCancelClick(b.id)}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition disabled:opacity-50">
                        {cancelLoading
                          ? t("doctor.canceling")
                          : t("doctor.cancelBooking")}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <ConfirmationModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
}
