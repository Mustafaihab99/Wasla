import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DoctorWelcomeScreen() {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const {t} = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        navigate("/doctor/manage-dashboard");
      }, 600);

    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex flex-col items-center justify-center text-white z-[9999]"
          style={{
            background: "linear-gradient(135deg, #0A0F29, #1C2242)"
          }}
        >

          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-6"
          >
            <svg width="90" height="90" fill="none" stroke="white" strokeWidth="2">
              <path d="M10 45 H35 L45 25 L55 65 L65 45 H90" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* Welcome Text */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-3xl font-bold"
          >
            {t("doctor.welcome")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-3 text-lg opacity-80"
          >
            {t("doctor.welcome2")}
          </motion.p>

          {/* Loader */}
          <motion.div
            className="mt-8 w-10 h-10 rounded-full border-4 border-white border-t-transparent animate-spin"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
