import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaUtensils } from "react-icons/fa";

export default function RestaurantWelcomeScreen() {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        navigate("/restaurant/");
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
              "radial-gradient(circle at center, #2b0a03 0%, #140201 70%)",
          }}
        >
          {/* Glow */}
          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute w-[500px] h-[500px] bg-orange-500/20 blur-[120px] rounded-full"
          />

          {/* Icon */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-orange-500 blur-2xl"
            />

            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative w-28 h-28 rounded-2xl border border-white/10 bg-white/5 backdrop-blur flex items-center justify-center shadow-2xl"
            >
              <FaUtensils className="text-5xl text-orange-400" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold tracking-wide"
          >
            {t("restaurant.welcome")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-3 text-lg text-white/70 text-center px-4"
          >
            {t("restaurant.welcome2")}
          </motion.p>

          {/* Loader */}
          <motion.div
            className="mt-10 w-14 h-14 rounded-full border-4 border-white/20 border-t-orange-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}