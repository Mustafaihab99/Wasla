import { Outlet, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ChatList from "./ChatList";

export default function ChatLayout() {
  const { receiverId } = useParams();
  const location = useLocation();
  const { t } = useTranslation();

  const isNewChatPage = location.pathname.includes("/chat/new");
  const isProfilePage = location.pathname.includes("/chat/profile");

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">

      {/* Sidebar */}
      <aside
        className={`
          flex flex-col w-full max-w-sm shrink-0
          border-r border-border
          bg-background
          ${
            isNewChatPage ? "hidden md:flex" : "flex"
          }
        `}
      >
        <ChatList />
      </aside>

      {/* Main content area */}
      <main
        className={`
          flex-1 flex flex-col
          bg-background
          ${
            // الـ main يظهر في حال الشات موجود، New Chat أو Profile
            receiverId || isNewChatPage || isProfilePage
              ? "flex"
              : "hidden md:flex"
          }
        `}
      >
        {receiverId || isNewChatPage || isProfilePage ? (
          <Outlet />
        ) : (
          // placeholder لما مفيش chat مختار
          <div className="flex flex-1 flex-col items-center justify-center gap-4 select-none text-dried">

            {/* icon */}
            <div className="opacity-60">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M20 26h24M20 34h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* text */}
            <p className="text-sm font-medium tracking-wide text-center max-w-xs">
              {t("chat.selectChatToStart")}
            </p>

            {/* hint */}
            <p className="text-xs opacity-60">
              {t("chat.startConversationHint")}
            </p>

          </div>
        )}
      </main>

    </div>
  );
}