import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useFetchDoctorBookingList from "../../hooks/doctor/useFetchDoctorBookingList";

export default function DoctorBookingList() {
  const { t } = useTranslation();
  const doctorId = sessionStorage.getItem("user_id")!;
  const [bookingType, setBookingType] = useState<number>(2);
  const { data: bookings, isLoading: bookingLoading } =
    useFetchDoctorBookingList(doctorId, bookingType);

  const [openImage, setOpenImage] = useState<{
    show: boolean;
    img: string | null;
  }>({
    show: false,
    img: null,
  });
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <>
      {/* Booking */}
      <div className="border border-primary rounded-xl p-6 shadow space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h2 className="text-2xl font-bold">{t("doctor.bookingsList")}</h2>

          {/* Filter */}
          <select
            value={bookingType}
            onChange={(e) => setBookingType(Number(e.target.value))}
            className="border border-primary px-4 py-2 rounded-lg bg-background font-medium">
            <option value={0}>{t("doctor.upcoming")}</option>
            <option value={1}>{t("doctor.completed")}</option>
            <option value={2}>{t("doctor.all")}</option>
          </select>
        </div>

        {/* Spinner */}
        {bookingLoading && (
          <div className="w-full flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* No results */}
        {!bookingLoading && bookings?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/80 border border-primary rounded-xl shadow font-semibold text-gray-500 text-lg">
            {t("doctor.noBookingsFound")}
          </motion.div>
        )}

        {/* BookingCards  */}
        <div className="space-y-5">
          {bookings?.map((b) => (
            <motion.div
              key={b.bookingId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 border border-primary rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-[2px]">
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
                    <b>{t("doctor.bookingType")}:</b> {b.bookingType === 1 ? t("doctor.checkup") : t("doctor.consult")}
                  </p>
                  <p>
                    <b>{t("doctor.date")}:</b> {b.date}
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
            </motion.div>
          ))}
        </div>
      </div>
      {openImage.show && (
        <div
          style={{ marginTop: "0px" }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[999]"
          onClick={() => setOpenImage({ show: false, img: null })}>
          <img
            src={openImage.img!}
            className="max-w-[90vw] max-h-[90vh] rounded shadow-xl"
          />
        </div>
      )}
    </>
  );
}
