import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useFetchDoctorBookingList from "../../hooks/doctor/useFetchDoctorBookingList";
import useCancelDoctorBook from "../../hooks/doctor/useCancelBook";
import ConfirmationModal from "./modals/CancelBookPopup";
import EditBookingModal from "./modals/UpdateBookModal";

export default function DoctorBookingList() {
  const { t } = useTranslation();
  const doctorId = sessionStorage.getItem("user_id")!;
  const [bookingType, setBookingType] = useState<number>(1);

  const { data: bookings, isLoading: bookingLoading } =
    useFetchDoctorBookingList(doctorId, bookingType);

  const { mutate: cancelBook, isPending: cancelLoading } =
    useCancelDoctorBook();

  const [openImage, setOpenImage] = useState({
    show: false,
    img: null as string | null,
  });

  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );

  // State للمودال تعديل الحجز
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBookingData, setEditBookingData] = useState<{
    bookingId: number;
    currentDate: string;
    currentDayOfWeek: number;
    currentStart: string;
    currentEnd: string;
  } | null>(null);

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
  type Booking = {
  bookingId: number; 
  date: string;    
  day: number;
  start: string;   
  end: string;     
};

  const handleEditClick = (booking: Booking) => {
    setEditBookingData({
      bookingId: booking.bookingId,
      currentDate: booking.date,
      currentDayOfWeek: booking.day,
      currentStart: booking.start,
      currentEnd: booking.end,
    });
    setShowEditModal(true);
  };

   const daysOfWeek = [
     t("doctor.Sat"),
     t("doctor.Sun"),
     t("doctor.Mon"),
     t("doctor.Tue"),
     t("doctor.Wed"),
     t("doctor.Thu"),
     t("doctor.Fri"),
  ];

  return (
    <>
      {" "}
      <div className="border border-primary rounded-xl p-6 shadow space-y-6">
        {" "}
        <div className="flex justify-between items-center flex-wrap gap-3">
          {" "}
          <h2 className="text-2xl font-bold">{t("doctor.bookingsList")}</h2>
          <select
            value={bookingType}
            onChange={(e) => setBookingType(Number(e.target.value))}
            className="border border-primary px-4 py-2 rounded-lg bg-background font-medium">
            {" "}
            <option value={1}>{t("doctor.upcoming")}</option>{" "}
            <option value={2}>{t("doctor.completed")}</option>{" "}
            <option value={3}>{t("doctor.canceled")}</option>{" "}
          </select>{" "}
        </div>
        {bookingLoading && (
          <div className="w-full flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!bookingLoading && bookings?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/80 border border-primary rounded-xl shadow font-semibold text-gray-500 text-lg">
            {t("doctor.noBookingsFound")}
          </motion.div>
        )}
        <div className="space-y-5">
          {bookings?.map((b) => (
            <motion.div
              key={b.bookingId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 border border-primary rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.12)]
hover:shadow-[0_6px_18px_rgba(0,0,0,0.16)] transition-all hover:-translate-y-[2px]">
              {" "}
              <div className="flex gap-5 flex-col sm:flex-row">
                {b.userImage && (
                  <img
                    src={import.meta.env.VITE_USER_IMAGE + b.userImage}
                    className="w-20 h-20 rounded-full object-cover border shadow cursor-pointer"
                    onClick={() =>
                      setOpenImage({
                        show: true,
                        img: import.meta.env.VITE_USER_IMAGE + b.userImage,
                      })
                    }
                  />
                )}

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm">
                  <p>
                    <b>{t("doctor.pname")}:</b> {b.userName}
                  </p>
                  <p>
                    <b>{t("profile.doctor.Phone")}:</b> {b.phone}
                  </p>
                  <p>
                    <b>{t("doctor.ServiceName")}:</b> {b.serviceName}
                  </p>
                  <p>
                    <b>{t("doctor.bookingType")}:</b>
                    {b.bookingType === 1
                      ? t("doctor.checkup")
                      : t("doctor.consult")}
                  </p>
                  <p>
                    <b>{t("doctor.date")}:</b> {b.date}
                  </p>
                  <p>
                    <b>{t("doctor.day")}:</b>
                    {b.day === 0 ? t("doctor.Sat") :  daysOfWeek[b.day]}
                  </p>
                  <p>
                    <b>{t("doctor.time")}:</b> {b.start.slice(0, 5)}{" "}
                    {t("doctor.to")} {b.end.slice(0, 5)}
                  </p>
                  <p>
                    <b>{t("doctor.Price")}:</b> {b.price} {t("doctor.EGP")}
                  </p>
                </div>
              </div>
              {b.bookingImages?.length > 0 && (
                <button
                  onClick={() =>
                    setExpandedCard(
                      expandedCard === b.bookingId ? null : b.bookingId
                    )
                  }
                  className="mt-3 text-primary font-semibold underline">
                  {expandedCard === b.bookingId
                    ? t("doctor.hideImages")
                    : t("doctor.showImages")}
                </button>
              )}
              {expandedCard === b.bookingId && (
                <div className="flex gap-3 mt-4 overflow-x-auto">
                  {b.bookingImages.map((img, i) => (
                    <img
                      key={i}
                      src={import.meta.env.VITE_BOOKING_IMAGE + img}
                      onClick={() =>
                        setOpenImage({
                          show: true,
                          img: import.meta.env.VITE_BOOKING_IMAGE + img,
                        })
                      }
                      className="w-24 h-24 rounded-md object-cover border shadow cursor-pointer"
                    />
                  ))}
                </div>
              )}
              {bookingType === 1 && (
                <div className="flex flex-col md:flex-row justify-end mt-4 gap-2">
                  <button
                    disabled={cancelLoading}
                    onClick={() => handleCancelClick(b.bookingId)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition disabled:opacity-50">
                    {cancelLoading
                      ? t("doctor.canceling")
                      : t("doctor.cancelBooking")}
                  </button>

                  <button
                    onClick={() => handleEditClick(b)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
                    {t("doctor.editBooking")}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      {openImage.show && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[999]"
          onClick={() => setOpenImage({ show: false, img: null })}>
          <img
            src={openImage.img!}
            className="max-w-[90vw] max-h-[90vh] rounded shadow-xl"
          />
        </div>
      )}
      <ConfirmationModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmCancel}
      />
      {editBookingData && (
        <EditBookingModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          bookingId={editBookingData.bookingId}
          currentDate={editBookingData.currentDate}
          currentDayOfWeek={editBookingData.currentDayOfWeek}
          currentStart={editBookingData.currentStart}
          currentEnd={editBookingData.currentEnd}
        />
      )}
    </>
  );
}
