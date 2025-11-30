import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import DoctorCharts from "./DoctorCharts";
import DoctorBookingList from "./DoctorBookingList";

export default function DoctorHomeDashboard() {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <motion.h1
        className="text-4xl font-bold"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}>
        {t("doctor.overview")}
      </motion.h1>

     <DoctorCharts />
     <DoctorBookingList />

    </div>
  );
}
