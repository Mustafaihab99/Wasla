import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaMobileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function DriverNotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
            <FaMobileAlt className="text-2xl text-blue-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-2">
          {t("driver.webNoticeTitle")}
        </h2>

        {/* Description */}
        <p className="text-white/70 text-sm mb-6">
          {t("driver.webNoticeDesc")}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold">
            {t("driver.downloadApp")}
          </button>

          <button className="w-full py-2 rounded-lg border border-white/20 hover:bg-white/10 transition text-sm"
            onClick={()=> navigate("/auth/login")}
          >
            {t("driver.alreadyHaveApp")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}