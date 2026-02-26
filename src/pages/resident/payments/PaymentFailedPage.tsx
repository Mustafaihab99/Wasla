import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiXCircle } from "react-icons/fi";

export default function PaymentFailedPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center"
      >
        {/* أيقونة الفشل */}
        <div className="flex justify-center mb-6">
          <FiXCircle className="text-red-600 text-9xl" />
        </div>

        {/* العنوان */}
        <h1 className="text-3xl font-extrabold text-red-700 mb-3">
          {t("payment.failedTitle")}
        </h1>

        {/* الرسالة */}
        <p className="text-red-800 mb-8 text-md">
          {t("payment.failedMessage")}
        </p>

        {/* أزرار الرجوع والمحاولة */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/resident/profile/my-bookings")}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
          >
            {t("payment.goHome")}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
          >
            {t("payment.retry")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}