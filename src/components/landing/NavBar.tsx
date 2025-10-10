import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import {
  FaGlobe,
  FaSun,
  FaMoon,
  FaSnowflake,
  FaFire,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import logo from "../../assets/images/icons/app-logo.png";

export default function NavBar() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const isAuthPage = location.pathname.includes("auth");

  const themes = [
    { key: "light", label: t("nav.light") },
    { key: "dark", label: t("nav.dark") },
    { key: "warm", label: t("nav.warm") },
    { key: "cold", label: t("nav.cold") },
  ];

  const nav = [
    { label: t("nav.about"), link: "about" },
    { label: t("nav.service"), link: "services" },
    { label: t("nav.home"), link: "home" },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme && themes.some((th) => th.key === savedTheme))
      setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("appTheme", theme);
  }, [theme]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("applang", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

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

  return (
    <header className="w-full bg-background shadow-md border-b border-border py-3 px-6 lg:px-32 flex justify-between items-center fixed top-0 left-0 z-50 transition-colors duration-300" dir="ltr">
      {/* Logo */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}>
        <img src={logo} alt="Logo" className="w-10 h-10" />
        <h3 className="text-lg font-semibold text-foreground">Wasla</h3>
      </motion.div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-6 text-foreground font-medium">
        {nav.map((item, i) => (
          <motion.a
            key={item.link}
            href={`${isAuthPage ? "/" : `#${item.link}`}`}
            className="hover:text-primary transition-colors"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i }}>
            {item.label}
          </motion.a>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3 relative">
        {/* Desktop Login Button */}
        {!isAuthPage && (
          <motion.button
            className="hidden md:block px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition-all"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => alert("Go to Login Page")}>
            {t("nav.login")}
          </motion.button>
        )}

        {/* Theme Switcher */}
        <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            onClick={() => setThemeOpen((prev) => !prev)}
            className="p-2 rounded-full border border-border hover:bg-primary/10 transition-all text-primary"
            title="Change Theme">
            {themeIcon(theme)}
          </button>

          <AnimatePresence mode="wait">
            {themeOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-40">
                {themes.map((th) => (
                  <li
                    key={th.key}
                    onClick={() => {
                      setTheme(th.key);
                      setThemeOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-primary/10 ${
                      theme === th.key
                        ? "text-primary font-semibold"
                        : "text-foreground"
                    }`}>
                    {themeIcon(th.key)}
                    <span>{th.label.charAt(0).toUpperCase() + th.label.slice(1)}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Language Switch */}
        <motion.button
          onClick={toggleLanguage}
          className="flex items-center gap-1 p-2 px-3 rounded-md border border-border hover:bg-primary/10 transition-all"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}>
          <FaGlobe className="text-primary" />
          <span className="font-semibold uppercase">{i18n.language}</span>
        </motion.button>

        {/* Mobile Menu Icon */}
        {!isAuthPage && (
          <button
            className="md:hidden text-foreground text-xl"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setThemeOpen(false);
            }}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {!isAuthPage && (
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex justify-end"
              onClick={() => setMenuOpen(false)}>
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
                className="w-3/4 sm:w-1/2 md:w-1/3 h-full bg-background border-l border-border shadow-2xl flex flex-col p-6 relative"
                onClick={(e) => e.stopPropagation()}>
                
                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 text-xl text-foreground hover:text-primary transition-colors"
                  onClick={() => setMenuOpen(false)}>
                  <FaTimes />
                </button>

                {/* Logo */}
                <div className="flex items-center gap-2 mb-8 mt-8">
                  <img src={logo} alt="Logo" className="w-10 h-10" />
                  <h3 className="text-lg font-semibold text-foreground">Wasla</h3>
                </div>

                {/* Links */}
                <div className="flex flex-col gap-5">
                  {nav.map((item, i) => (
                    <motion.a
                      key={item.link}
                      href={`#${item.link}`}
                      onClick={() => setMenuOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-primary transition-all"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}>
                      {item.label}
                    </motion.a>
                  ))}
                </div>
                <motion.button
                  className="mt-10 py-2 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition-all absolute bottom-4 w-[80%]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => alert('Go to Login Page')}>
                  {t('nav.login')}
                </motion.button>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </header>
  );
}
