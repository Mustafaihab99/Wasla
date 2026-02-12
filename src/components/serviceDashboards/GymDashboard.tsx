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
  FaDumbbell,
  FaUsers,
} from "react-icons/fa";
import { MdDashboard, MdFitnessCenter, MdComment } from "react-icons/md";
import { FaUser } from "react-icons/fa6";
import logo from "../../assets/images/icons/app-logo.png";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import useLogout from "../../hooks/auth/useLogout";
import { SiGooglemessages } from "react-icons/si";

export default function GymDashboard() {
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

  const handleLogout = () => logout();

  const navItems = [
    {
      label: t("gym.dashboard"),
      link: "/gym/dashboard",
      icon: <MdDashboard />,
    },
    {
      label: t("gym.services"),
      link: "/gym/services",
      icon: <MdFitnessCenter />,
    },
    {
      label: t("gym.members"),
      link: "/gym/members",
      icon: <FaUsers />,
    },
    {
      label: t("gym.messages"),
      link: "/gym/messages",
      icon: <SiGooglemessages />,
    },
    {
      label: t("gym.reviews"),
      link: "/gym/reviews",
      icon: <MdComment />,
    },
    {
      label: t("gym.profile"),
      link: "/gym/profile",
      icon: <FaUser />,
    },
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
        } hidden md:flex`}
      >
        <div>
          <div className="flex items-center gap-3 p-4">
            <img
              src={logo}
              alt="Logo"
              className={`w-10 h-10 ${sidebarOpen ? "block" : "hidden"}`}
            />
            {sidebarOpen && (
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FaDumbbell className="text-primary" />
                {t("gym.panel")}
              </h3>
            )}
          </div>

          <nav className="flex flex-col mt-6 gap-2 px-3">
            {navItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.link}
                className={({ isActive }) =>
                  `
                  group flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                  ${
                    isActive
                      ? sidebarOpen
                        ? "bg-primary text-white font-semibold shadow-sm"
                        : "bg-primary text-white w-10 h-10"
                      : "text-foreground hover:bg-primary/10 hover:text-primary"
                  }
                `
                }
              >
                <span className="text-xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>

                <span
                  className={`transition-all duration-300 ${
                    sidebarOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-3 w-0 overflow-hidden"
                  }`}
                >
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10"
          >
            <FaGlobe />
            {sidebarOpen && <span>{i18n.language.toUpperCase()}</span>}
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10"
          >
            {themeIcon(theme)}
            {sidebarOpen && <span>{theme}</span>}
          </button>

          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center gap-2 p-2 rounded-md text-red-500 hover:bg-red-500/10"
          >
            <SlLogout />
            {sidebarOpen && (
              <span>{isPending ? t("nav.logged...") : t("nav.Logout")}</span>
            )}
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center p-2 mt-2 rounded-md hover:bg-primary/10"
          >
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
            className="fixed inset-0 bg-black/40 z-40 flex justify-end"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="w-3/4 bg-background h-full p-6 border-l border-border flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <button
                  className="absolute top-4 right-4 text-xl"
                  onClick={() => setMobileOpen(false)}
                >
                  <FaTimes />
                </button>

                <div className="flex items-center gap-2 mb-10 mt-6">
                  <FaDumbbell className="text-primary text-2xl" />
                  <h3 className="text-lg font-semibold">{t("gym.panel")}</h3>
                </div>

                <div className="flex flex-col gap-6">
                  {navItems.map((item, i) => (
                    <NavLink
                      key={i}
                      to={item.link}
                      onClick={() => setMobileOpen(false)}
                      className="text-lg font-medium hover:text-primary"
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-border pt-6">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-primary/10"
                >
                  <FaGlobe />
                  {i18n.language.toUpperCase()}
                </button>

                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-primary/10"
                >
                  {themeIcon(theme)}
                  {theme}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500 text-white"
                >
                  <SlLogout />
                  {t("nav.Logout")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        className="md:hidden fixed top-4 left-4 z-50 text-2xl"
        onClick={() => setMobileOpen(true)}
      >
        <FaBars />
      </button>

      <main className="flex-1 overflow-auto p-6 bg-background">
        <Outlet />
      </main>
    </div>
  );
}
