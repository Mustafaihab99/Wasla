import { useState } from "react";
import { useTranslation } from "react-i18next";
import CreatePostBox from "../../components/community/CreateBoxPost";
import PostList from "../../components/community/PostLists";
import {
  FaHome,
  FaBookmark,
  FaUser,
  FaCog,
  FaBars,
} from "react-icons/fa";

const NAV_ITEMS = [
  { icon: FaHome, key: "home", active: true },
  { icon: FaBookmark, key: "bookmarks" },
  { icon: FaUser, key: "profile" },
  { icon: FaCog, key: "settings" },
];

function LeftSidebar({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) {
  const { t } = useTranslation();

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
        }}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between mb-10 px-3">
          <h2
            className="font-extrabold text-2xl tracking-wide"
            style={{ color: "var(--primary)" }}
          >
            {isOpen ? "COMMUNITY" : "C"}
          </h2>

          <button
            onClick={toggle}
            style={{ color: "var(--dried)" }}
          >
            <FaBars />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-3 flex-1">
          {NAV_ITEMS.map(({ icon: Icon, key, active }) => (
            <button
              key={key}
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium transition-all hover:scale-[1.03]"
              style={{
                color: active
                  ? "var(--foreground)"
                  : "var(--dried)",
                background: active ? "var(--border)" : "transparent",
              }}
            >
              <Icon className="w-5 h-5" />
              {isOpen && <span>{t(`common.nav.${key}`)}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <div
        className="fixed bottom-0 left-0 right-0 md:hidden flex justify-around py-3 border-t z-50"
        style={{
          background: "var(--background)",
          borderColor: "var(--border)",
        }}
      >
        {NAV_ITEMS.map(({ icon: Icon, key, active }) => (
          <button
            key={key}
            className="flex flex-col items-center text-xs"
            style={{
              color: active
                ? "var(--primary)"
                : "var(--dried)",
            }}
          >
            <Icon className="w-5 h-5 mb-1" />
            {t(`common.nav.${key}`)}
          </button>
        ))}
      </div>
    </>
  );
}

export default function CommunityLayout() {
  const currentUserId = sessionStorage.getItem("user_id")!;
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="max-w-[1400px] mx-auto flex">

        {/* Sidebar */}
        <LeftSidebar
          isOpen={sidebarOpen}
          toggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Feed */}
        <main
          className="flex-1 min-h-screen"
          style={{
            borderLeft: "1px solid var(--border)",
            borderRight: "1px solid var(--border)",
          }}
        >
          {/* Header */}
          <div
            className="sticky top-0 z-10 backdrop-blur-md border-b"
            style={{
              background: "var(--background)",
              borderColor: "var(--border)",
            }}
          >
            <div className="px-8 py-8 text-center">
              <h1
                className="font-extrabold text-3xl mb-2"
                style={{ color: "var(--primary)" }}
              >
                {t("common.home")}
              </h1>
              <p
                className="text-sm"
                style={{ color: "var(--dried)" }}
              >
                {t("common.communitySubtitle")}
              </p>
            </div>
          </div>

          <div className="px-6 md:px-12">
            <CreatePostBox currentUserId={currentUserId} />
            <div
              className="h-px my-6"
              style={{ background: "var(--border)" }}
            />
            <PostList currentUserId={currentUserId} />
          </div>

          {/* spacing for mobile bottom nav */}
          <div className="h-16 md:hidden" />
        </main>
      </div>
    </div>
  );
}