import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaMoon, FaSun, FaFire, FaSnowflake, FaGlobe } from "react-icons/fa";

export default function ChatProfileSettings() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const [openLang, setOpenLang] = useState(false);
  const [openTheme, setOpenTheme] = useState(false);

  const themes = [
    { key: "light", label: t("nav.light") },
    { key: "dark", label: t("nav.dark") },
    { key: "warm", label: t("nav.warm") },
    { key: "cold", label: t("nav.cold") },
  ];

  const themeIcon = (th: string) => {
    switch (th) {
      case "dark":
        return <FaMoon />;
      case "warm":
        return <FaFire />;
      case "cold":
        return <FaSnowflake />;
      default:
        return <FaSun />;
    }
  };

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("applang", lang);
    setOpenLang(false);
  };

  const changeTheme = (th: string) => {
    setTheme(th);
    localStorage.setItem("appTheme", th);
    setOpenTheme(false);
  };

  return (
    <div className="mx-4 mt-6 p-4 border border-border rounded-2xl space-y-4">
      {/* Language */}
      <div>
        <p className="text-xs text-dried mb-2 uppercase">
          {t("common.language")}
        </p>

        <button
          onClick={() => setOpenLang(!openLang)}
          className="w-full px-3 py-2 border border-border rounded-lg flex justify-between items-center hover:bg-border/40 transition">
          <span className="flex items-center gap-2">
            <FaGlobe />
            {i18n.language === "ar" ? t("common.arabic") : t("common.english")}
          </span>
        </button>

        <AnimatePresence>
          {openLang && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-2 border border-border rounded-lg overflow-hidden">
              {["en", "ar"].map((l) => (
                <button
                  key={l}
                  onClick={() => changeLang(l)}
                  className="w-full px-3 py-2 text-left hover:bg-border/40 transition">
                  {l === "ar" ? t("common.arabic") : t("common.english")}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Theme */}
      <div>
        <p className="text-xs text-dried mb-2 uppercase">{t("common.theme")}</p>

        <button
          onClick={() => setOpenTheme(!openTheme)}
          className="w-full px-3 py-2 border border-border rounded-lg flex justify-between items-center hover:bg-border/40 transition">
          <span className="flex items-center gap-1">
            {themeIcon(theme)}
            {themes.find((t) => t.key === theme)?.label}
          </span>
        </button>

        <AnimatePresence>
          {openTheme && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-1 border border-border rounded-lg overflow-hidden">
              {themes.map((th) => (
                <button
                  key={th.key}
                  onClick={() => changeTheme(th.key)}
                  className="w-full px-3 py-1 text-left flex items-center gap-2 hover:bg-border/40 transition">
                  {themeIcon(th.key)} {th.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
