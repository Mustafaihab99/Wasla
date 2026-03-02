import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMoon,
  FaSun,
  FaFire,
  FaSnowflake,
  FaArrowDown,
  FaArrowRight,
  FaGlobe,
} from "react-icons/fa";
import useLogout from "../../hooks/auth/useLogout";

export default function SocialSettings() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { mutate: logout, isPending } = useLogout();

  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const themes = [
    { key: "light", label: t("nav.light") },
    { key: "dark", label: t("nav.dark") },
    { key: "warm", label: t("nav.warm") },
    { key: "cold", label: t("nav.cold") },
  ];

  const themeIcon = (th: string) => {
    switch (th) {
      case "dark": return <FaMoon />;
      case "warm": return <FaFire />;
      case "cold": return <FaSnowflake />;
      default: return <FaSun />;
    }
  };

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("applang", lang);
    setLangOpen(false);
  };

  const handleThemeChange = (th: string) => {
    setTheme(th);
    localStorage.setItem("appTheme", th);
    setThemeOpen(false);
  };

  return (
    <div className="min-h-screen px-6 md:px-12 py-8" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <h1 className="text-2xl font-extrabold mb-8">{t("common.settings")}</h1>

      {/* Language */}
      <div className="mb-6 relative">
        <button
          onClick={() => setLangOpen((p) => !p)}
          className="w-full flex justify-between items-center px-4 py-3 border border-[#2f3336] rounded-lg hover:bg-white/10 transition"
        >
          {i18n.language === "en" ? t("common.english") : t("common.arabic")}
          <FaArrowDown className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {langOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute w-full mt-1 bg-secondary text-foregriund border border-[#2f3336] rounded-lg shadow-lg overflow-hidden z-50"
            >
              {["en","ar"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  className={`w-full text-left px-4 py-2 transition flex items-center gap-2 ${
                    i18n.language === lang ? "bg-primary font-bold" : "hover:bg-foreground"
                  }`}
                >
                  <FaGlobe /> {lang === "en" ? t("common.english") : t("common.arabic")}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Theme */}
      <div className="mb-6 relative">
        <button
          onClick={() => setThemeOpen((p) => !p)}
          className="w-full flex justify-between items-center px-4 py-3 border border-[#2f3336] rounded-lg hover:bg-white/10 transition"
        >
          <span className="flex items-center gap-2">{themeIcon(theme)} {themes.find(th => th.key === theme)?.label}</span>
          <FaArrowDown className={`transition-transform ${themeOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {themeOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute w-full mt-1 bg-secondary border text-foreground border-[#2f3336] rounded-lg shadow-lg overflow-hidden z-50"
            >
              {themes.map((th) => (
                <button
                  key={th.key}
                  onClick={() => handleThemeChange(th.key)}
                  className={`w-full text-left px-4 py-2 transition flex items-center gap-2 ${
                    theme === th.key ? "bg-primary font-bold" : "hover:bg-background"
                  }`}
                >
                  {themeIcon(th.key)} {th.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logout + Back */}
      <div className="mt-12 flex flex-col gap-4">
        <motion.button
          onClick={()=>logout()}
          disabled={isPending}
          className="w-full px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold transition disabled:opacity-50"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isPending ? t("common.loggingOut") : t("common.logout")}
        </motion.button>

        <motion.button
          onClick={() => navigate("/dashboard")}
          className="w-full px-6 py-3 rounded-full border border-[#2f3336] text-sky-500 hover:bg-white/10 transition font-bold flex justify-center items-center gap-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <FaArrowRight /> {t("common.back")}
        </motion.button>
      </div>
    </div>
  );
}