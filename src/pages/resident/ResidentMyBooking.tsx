import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaCalendarAlt } from "react-icons/fa";

import DoctorBookings from "../../components/resident/DoctorBookings";
import GymBookings from "../../components/resident/GymBookings";

type BookingType = "doctor" | "gym";

export default function ResidentMyBooking() {
  const { t } = useTranslation();
  const [bookingType, setBookingType] = useState<BookingType>("doctor");

  const tabs = [
    { key: "doctor", label: t("resident.doctors") },
    { key: "gym", label: t("resident.gymsb") },
  ];

  return (
    <div className="w-full bg-background pb-20 px-4 text-foreground">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold mt-2 mb-6 flex items-center"
      >
        <FaCalendarAlt className="inline text-blue-500 mr-2" />
        {t("resident.myBooking")}
      </motion.h2>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setBookingType(tab.key as BookingType)}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              bookingType === tab.key
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      {bookingType === "doctor" && <DoctorBookings />}
      {bookingType === "gym" && <GymBookings />}
    </div>
  );
}
