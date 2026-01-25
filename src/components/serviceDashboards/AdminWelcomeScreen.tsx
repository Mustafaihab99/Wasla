import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaShieldAlt } from "react-icons/fa";

export default function AdminWelcomeScreen() {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        navigate("/admin/manage-dashboard");
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center text-white overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at top, #1f2937, #020617)"
          }}
        >
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:60px_60px]" />

          {/* Shield Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative mb-8"
          >
            {/* Glow */}
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-primary/30 blur-2xl"
            />

            <div className="relative w-28 h-28 rounded-2xl border border-white/20 bg-white/5 backdrop-blur flex items-center justify-center shadow-xl">
              <FaShieldAlt className="text-5xl text-primary" />
            </div>
          </motion.div>

          {/* Text */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-3xl font-bold tracking-wide"
          >
            {t("admin.welcome")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-3 text-lg text-white/70"
          >
            {t("admin.welcome2")}
          </motion.p>

          {/* Progress bar */}
          <div className="mt-10 w-64 h-[3px] bg-white/10 overflow-hidden rounded-full">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="h-full w-1/3 bg-primary"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
