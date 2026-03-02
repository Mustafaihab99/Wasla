import { useTranslation } from "react-i18next";
import CreatePostBox from "./CreateBoxPost";
import PostList from "./PostLists";

export default function MainFeed() {
  const currentUserId = sessionStorage.getItem("user_id")!;
  const { t } = useTranslation();

  return (
    <main
      className="flex-1 flex flex-col min-h-screen"
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12">
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
  );
}