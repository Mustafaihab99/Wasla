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
import { RiUserCommunityLine } from "react-icons/ri";
import { MdMedicalServices, MdComment } from "react-icons/md";
import logo from "../../assets/images/icons/app-logo.png";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import useLogout from "../../hooks/auth/useLogout";

export default function DoctorDashboardLayout() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useContext(ThemeContext);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mutate: logout, isPending } = useLogout();

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
    logout();
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
      label: t("doctor.reviews"),
      link: "/doctor/reviews",
      icon: <MdComment />,
    },
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
      <aside
        className={`border-r border-border flex flex-col justify-between transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } hidden md:flex`}>
        <div className="flex flex-col">
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
                <span className="text-xl transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>

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

        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mx-3 mt-6 p-4 rounded-2xl bg-gradient-to-br from-primary via-pink-500 to-primary text-white shadow-xl cursor-pointer relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <RiUserCommunityLine className="text-3xl" />
              {sidebarOpen && (
                <h4 className="font-bold text-lg">{t("common.Community")}</h4>
              )}
            </div>

            {sidebarOpen && (
              <>
                <NavLink
                  to="/community-loader"
                  className="mt-2 inline-block text-center bg-white text-purple-700 font-semibold py-2 rounded-xl hover:bg-white/90 transition">
                  {t("common.ExploreNow")}
                </NavLink>
              </>
            )}
          </div>
        </motion.div>

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
            disabled={isPending}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-red-500/10 transition-colors text-red-500">
            <SlLogout />
            {sidebarOpen && (
              <span>{isPending ? t("nav.logged...") : t("nav.Logout")}</span>
            )}
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center p-2 mt-2 rounded-md hover:bg-primary/10 transition-colors">
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </aside>

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
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mx-3 mt-6 p-4 rounded-2xl bg-gradient-to-br from-primary via-pink-500 to-primary text-white shadow-xl cursor-pointer relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <RiUserCommunityLine className="text-3xl" />
                    {sidebarOpen && (
                      <h4 className="font-bold text-lg">
                        {t("common.Community")}
                      </h4>
                    )}
                  </div>
                  <NavLink
                    to="/community-loader"
                    className="mt-2 inline-block text-center bg-white text-purple-700 font-semibold py-2 rounded-xl hover:bg-white/90 transition">
                    {t("common.ExploreNow")}
                  </NavLink>
                </div>
              </motion.div>

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
                  <SlLogout className="text-white w-6 h-6" />
                  {t("nav.Logout")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        className="md:hidden fixed top-4 left-4 z-50 text-2xl text-foreground"
        onClick={() => setMobileOpen(true)}>
        <FaBars />
      </button>

      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
