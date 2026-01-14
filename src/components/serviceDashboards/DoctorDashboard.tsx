import { useState, useEffect, useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { SlLogout } from "react-icons/sl";
import {
  FaSun,
  FaMoon,
  FaGlobe,
  FaBars,
  FaTimes,
  FaSnowflake,
} from "react-icons/fa";
import { FaUser, FaUserDoctor } from "react-icons/fa6";
import { SiGooglemessages } from "react-icons/si";
import { MdMedicalServices , MdComment } from "react-icons/md";
import logo from "../../assets/images/icons/app-logo.png";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function DoctorDashboardLayout() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useContext(ThemeContext);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme) setTheme(savedTheme);
  }, [setTheme]);

  const toggleLanguage = () => {
    const lang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("applang", lang);
  };

  const toggleTheme = () => {
    const next =
      theme === "light"
        ? "dark"
        : theme === "dark"
        ? "warm"
        : theme === "warm"
        ? "cold"
        : "light";
    setTheme(next);
    localStorage.setItem("appTheme", next);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/auth/login";
  };

  const navItems = [
    {
      label: t("doctor.dashboard"),
      link: "/doctor/manage-dashboard",
      icon: <FaUserDoctor />,
    },
    {
      label: t("doctor.Service"),
      link: "/doctor/manage-service",
      icon: <MdMedicalServices />,
    },
    {
      label: t("doctor.inbox"),
      link: "/doctor/inbox",
      icon: <SiGooglemessages />,
    },
    { label: t("doctor.reviews"), link: "/doctor/reviews", icon: <MdComment /> },
    { label: t("doctor.profile"), link: "/doctor/profile", icon: <FaUser /> },
  ];

  const themeIcon = (th: string) => {
    switch (th) {
      case "dark":
        return <FaMoon />;
      case "warm":
        return <FaSun />;
      case "cold":
        return <FaSnowflake />;
      default:
        return <FaSun />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Desktop */}
      <aside
        className={`border-r border-border flex flex-col justify-between transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } hidden md:flex`}>
        <div className="flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 p-4">
            <img
              src={logo}
              alt="Logo"
              className={`w-10 h-10 ${sidebarOpen ? "block" : "hidden"}`}
            />
            {sidebarOpen && (
              <h3 className="text-lg font-bold text-foreground">Wasla</h3>
            )}
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col mt-6 gap-2 px-3">
            {navItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.link}
                className={({ isActive }) =>
                  `
          group flex items-center gap-3 p-3 rounded-lg 
          transition-all duration-300 
          cursor-pointer
          ${
            isActive
              ? sidebarOpen
                ? "bg-primary text-white shadow-sm font-semibold"
                : "bg-primary  text-white shadow-sm font-semibold w-10 h-10"
              : "text-foreground hover:bg-primary/10 hover:text-primary"
          }
        `
                }>
                {/* Icon Animation */}
                <span className="text-xl transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>

                {/* Label */}
                <span
                  className={`
          transition-all duration-300 
          ${
            sidebarOpen
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-3 w-0 overflow-hidden"
          }
        `}>
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 p-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 transition-colors">
            <FaGlobe />
            {sidebarOpen && <span>{i18n.language.toUpperCase()}</span>}
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 transition-colors">
            {themeIcon(theme)}
            {sidebarOpen && <span>{theme}</span>}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-red-500/10 transition-colors text-red-500">
            <SlLogout />
            {sidebarOpen && <span>{t("nav.Logout")}</span>}
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center p-2 mt-2 rounded-md hover:bg-primary/10 transition-colors">
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex justify-end"
            onClick={() => setMobileOpen(false)}>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="w-3/4 sm:w-1/2 bg-background h-full shadow-xl p-6 border-l border-border flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}>
              {/* Top */}
              <div>
                <button
                  className="absolute top-4 right-4 text-xl"
                  onClick={() => setMobileOpen(false)}>
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
                      onClick={() => setMobileOpen(false)}>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Bottom */}
              <div className="flex flex-col gap-4 border-t border-border pt-6">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-primary/10 transition-all w-full">
                  <FaGlobe className="text-primary" />
                  <span className="font-semibold uppercase">
                    {i18n.language}
                  </span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-primary/10 transition-all w-full">
                  {themeIcon(theme)}
                  <span>{theme}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all w-full">
                  <SlLogout  className="text-white w-6 h-6" />
                  {t("nav.Logout")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-2xl text-foreground"
        onClick={() => setMobileOpen(true)}>
        <FaBars />
      </button>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
