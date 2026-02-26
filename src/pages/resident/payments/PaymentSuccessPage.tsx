import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiCheckCircle } from "react-icons/fi";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-200 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center"
      >
        {/* أيقونة النجاح */}
        <div className="flex justify-center mb-6">
          <FiCheckCircle className="text-green-600 text-9xl" />
        </div>

        {/* العنوان */}
        <h1 className="text-3xl font-extrabold text-green-700 mb-3">
          {t("payment.successTitle")}
        </h1>

        {/* الرسالة */}
        <p className="text-green-800 mb-8 text-md">
          {t("payment.successMessage")}
        </p>

        {/* زر الرجوع */}
        <button
          onClick={() => navigate("/resident/profile/my-bookings")}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
        >
          {t("payment.goHome")}
        </button>
      </motion.div>
    </div>
  );
}