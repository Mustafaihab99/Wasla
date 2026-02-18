import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaDumbbell } from "react-icons/fa";

export default function GymWelcomeScreen() {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        navigate("/gym/dashboard");
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
              "radial-gradient(circle at center, #0a0f1f 0%, #020617 70%)",
          }}
        >
          <motion.div
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full"
          />

          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-primary blur-2xl"
            />

            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative w-28 h-28 rounded-2xl border border-white/10 bg-white/5 backdrop-blur flex items-center justify-center shadow-2xl"
            >
              <FaDumbbell className="text-5xl text-primary" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold tracking-wide"
          >
            {t("gym.welcome")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-3 text-lg text-white/70 text-center px-4"
          >
            {t("gym.welcome2")}
          </motion.p>

          <motion.div
            className="mt-10 w-14 h-14 rounded-full border-4 border-white/20 border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
