import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaBookmark, FaUser, FaCog, FaBars } from "react-icons/fa";

const NAV_ITEMS = [
  { icon: FaHome, key: "home", path: "/community/home" },
  { icon: FaBookmark, key: "bookmarks", path: "/community/bookmarks" },
  { icon: FaUser, key: "profile", path: "/community/profile/me" },
  { icon: FaCog, key: "settings", path: "/community/settings" },
];

function LeftSidebar({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex sticky top-0 h-screen flex-col py-6 pr-4 transition-all duration-300 border-r ${
          isOpen ? "w-[240px]" : "w-[80px]"
        }`}
        style={{
          background: "var(--background)",
          borderColor: "var(--border)",
        }}>
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between mb-10 px-3">
          <h2
            className="font-extrabold text-2xl tracking-wide"
            style={{ color: "var(--primary)" }}>
            {isOpen ? "COMMUNITY" : "C"}
          </h2>

          <button onClick={toggle} style={{ color: "var(--dried)" }}>
            <FaBars />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-3 flex-1">
          {NAV_ITEMS.map(({ icon: Icon, key, path }) => {
            const isActive = location.pathname === path;

            return (
              <button
                key={key}
                onClick={() => navigate(path)}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium transition-all hover:scale-[1.03]"
                style={{
                  color: isActive ? "var(--foreground)" : "var(--dried)",
                  background: isActive ? "var(--border)" : "transparent",
                }}>
                <Icon className="w-5 h-5" />
                {isOpen && <span>{t(`common.nav.${key}`)}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <div
        className="fixed bottom-0 left-0 right-0 md:hidden flex justify-around py-3 border-t z-50"
        style={{
          background: "var(--background)",
          borderColor: "var(--border)",
        }}>
        {NAV_ITEMS.map(({ icon: Icon, key, path }) => {
          const isActive = location.pathname === path;

          return (
            <button
              key={key}
              onClick={() => navigate(path)}
              className="flex flex-col items-center text-xs"
              style={{
                color: isActive ? "var(--primary)" : "var(--dried)",
              }}>
              <Icon className="w-5 h-5 mb-1" />
              {t(`common.nav.${key}`)}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default function CommunityLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
     <div
      className="min-h-screen flex"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Sidebar */}
      <LeftSidebar
        isOpen={sidebarOpen}
        toggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Outlet container */}
      <div className="flex-1 min-h-screen flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
