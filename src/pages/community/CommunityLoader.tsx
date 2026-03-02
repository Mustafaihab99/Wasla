import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import logo from "../../assets/images/icons/app-logo.png";

export default function CommunityLoader() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadeOut(true);
          setTimeout(() => navigate("/community"), 600);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 animate-gradient bg-[length:400%_400%]" />

          {/* Floating Light Blobs */}
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl bottom-0 right-0 animate-pulse"></div>

          <div className="relative z-10 flex flex-col items-center text-center text-white">

            {/* Glowing Logo */}
            <motion.div
              className="relative mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <div className="absolute inset-0 rounded-full bg-white/30 blur-2xl animate-pulse"></div>
              <img src={logo} alt="Wasla Logo" className="w-28 h-28 relative z-10" />
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl font-bold tracking-wide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {t("community.loadingTitle")}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-3 text-white/80 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {t("community.loadingSubtitle")}
            </motion.p>

            {/* Progress Bar */}
            <div className="w-72 h-2 bg-white/20 rounded-full mt-10 overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </div>

            {/* Percentage */}
            <motion.span
              className="mt-4 text-sm text-white/70"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {progress}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}