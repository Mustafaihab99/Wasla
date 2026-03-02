import { useContext, useState, useEffect } from "react";
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
  FaUser,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/icons/app-logo.png";
import useLogout from "../../hooks/auth/useLogout";

export default function ResidentNavBar() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const { mutate: logout, isPending } = useLogout();
  const navigate = useNavigate();

  const themes = [
    { key: "light", label: t("nav.light") },
    { key: "dark", label: t("nav.dark") },
    { key: "warm", label: t("nav.warm") },
    { key: "cold", label: t("nav.cold") },
  ];

  const navItems = [
    { label: t("nav.home"), link: "/dashboard" },
    { label: t("resident.service"), link: "/resident/service" },
    { label: t("common.Community"), link: "/community-loader" },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("appTheme", theme);
  }, [theme]);

  const toggleLanguage = () => {
    const lang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("applang", lang);
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

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="w-full bg-background shadow-md border-b border-border py-3 px-6 lg:px-20 flex justify-between items-center fixed top-0 left-0 z-50">

      {/* Logo */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="w-10 h-10" />
        <h3 className="text-lg font-semibold text-foreground">Wasla</h3>
      </motion.div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-6 text-foreground font-medium">
        {navItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.link}
            className={({ isActive }) =>
              `transition-colors ${isActive ? "text-primary font-semibold" : "hover:text-primary"}`
            }>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-3 relative">

        <div className="relative">
          <button
            onClick={() => setThemeOpen(!themeOpen)}
            className="p-2 rounded-full border border-border text-primary hover:bg-primary/10 transition-all">
            {themeIcon(theme)}
          </button>

          <AnimatePresence>
            {themeOpen && (
              <motion.ul
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute right-0 mt-2 bg-background border border-border rounded-lg shadow-md">
                {themes.map((th) => (
                  <li
                    key={th.key}
                    onClick={() => {
                      setTheme(th.key);
                      setThemeOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-primary/10 ${
                      theme === th.key ? "text-primary font-semibold" : "text-foreground"
                    }`}>
                    {themeIcon(th.key)}
                    {th.label}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 p-2 px-3 rounded-md border border-border hover:bg-primary/10 transition-all">
          <FaGlobe className="text-primary" />
          <span className="font-semibold uppercase">{i18n.language}</span>
        </button>

        <button
          onClick={() => navigate("/resident/profile")}
          className="flex items-center gap-1 p-2 px-3 rounded-md border border-border hover:bg-primary/10 transition-all">
          <FaUser className="text-primary" />
        </button>
      </div>

      <button className="md:hidden text-foreground text-xl" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-end"
            onClick={() => setMenuOpen(false)}>

            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="w-3/4 sm:w-1/2 bg-background h-full shadow-xl p-6 border-l border-border flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}>

              <div>
                {/* Close */}
                <button className="absolute top-4 right-4 text-xl" onClick={() => setMenuOpen(false)}>
                  <FaTimes />
                </button>

                <div className="flex items-center gap-2 mb-10 mt-6">
                  <img src={logo} className="w-10 h-10" />
                  <h3 className="text-lg font-semibold">Wasla</h3>
                </div>

                <div className="flex flex-col gap-6 mb-10">
                  {navItems.map((item, i) => (
                    <NavLink
                      key={i}
                      to={item.link}
                      className="text-lg font-medium hover:text-primary"
                      onClick={() => setMenuOpen(false)}>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col gap-4 border-t border-border pt-6">

                {/* Language */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-primary/10 transition-all w-full">
                  <FaGlobe className="text-primary" />
                  <span className="font-semibold uppercase">{i18n.language}</span>
                </button>

                <button
                  onClick={() => {
                    const next =
                      theme === "light"
                        ? "dark"
                        : theme === "dark"
                        ? "warm"
                        : theme === "warm"
                        ? "cold"
                        : "light";

                    setTheme(next);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-primary/10 transition-all w-full">
                  {themeIcon(theme)}
                  <span>{theme}</span>
                </button>

                <button
                  onClick={() => navigate("/resident/profile")}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-primary/10 transition-all w-full">
                  <FaUser className="text-primary" />
                  <span>{t("nav.profile")}</span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all w-full">
                  {isPending ? t("nav.logged...") : t("nav.Logout")}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
