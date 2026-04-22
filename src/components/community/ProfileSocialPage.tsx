import { useParams, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useUserPosts } from "../../hooks/community/useUserPosts";
import UserPostCard from "../../components/community/UserPostCard";
import { useTranslation } from "react-i18next";
import ProfileSkeleton from "./ProfileSkeleton";
import PostSkeleton from "./PostProfileSkeleton";
import UserPostLikes from "./UserPostLikes";
import { FiMessageCircle } from "react-icons/fi";


export default function ProfileSocialPage() {
  const { t } = useTranslation();
  const { userId: routeUserId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const currentUserId = sessionStorage.getItem("user_id")!;
  
  const targetUserId =
  !routeUserId || routeUserId === "me" ? currentUserId : routeUserId;
  const baseTabs = ["posts", "likes"] as const;

  
  const isOwner = targetUserId === currentUserId;
  const TABS = isOwner 
  ? baseTabs
  : (["posts"] as const);
  type TabType = (typeof TABS)[number];
  const [activeTab, setActiveTab] = useState<TabType>("posts");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useUserPosts(targetUserId, currentUserId);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "200px" },
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  useEffect(() => {
  if (!isOwner && activeTab === "likes") {
    setActiveTab("posts");
  }
}, [isOwner, activeTab]);

  const firstPage = data?.pages[0];
  const userName = firstPage?.userName ?? "";
  const profilePhoto = firstPage?.profilePhoto ?? "";
  const totalPostCount = firstPage?.posts.totalCount ?? 0;
  const posts = data?.pages.flatMap((p) => p.posts.data) ?? [];

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div className="w-full mx-auto min-h-screen">
        {/* Top bar */}
        <div
          className="sticky top-0 z-20 backdrop-blur-md px-6 py-4 flex items-center gap-5"
          style={{ background: "var(--background)" }}>
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/10 transition">
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-extrabold text-lg">
              {isLoading
                ? t("cprofile.profile")
                : userName || t("cprofile.profile")}
            </h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {totalPostCount} {t("cprofile.posts")}
            </p>
          </div>
        </div>

        {/* Profile header */}
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <div>
            <div className="h-56 bg-gradient-to-br from-sky-600/30 to-transparent" />
            <div className="px-6 relative">
              <div className="absolute -top-16">
                <div className="w-28 h-28 rounded-full border-4 border-[var(--background)] overflow-hidden bg-gray-800">
                  <img
                    src={profilePhoto || "/assets/images/default-avatar.png"}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 pt-20 pb-6">
              <h1 className="font-extrabold text-2xl">{userName}</h1>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--muted-foreground)" }}>
                @{userName.toLowerCase().replace(/\s/g, "_")}
              </p>
              {
                targetUserId == routeUserId ?
              <button
                onClick={() => navigate(`/chat/${targetUserId}`)}
                className="flex items-center mt-2 gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition shadow-sm">
                <FiMessageCircle size={18} />
                <span className="text-sm font-medium">{t("chat.message")}</span>
              </button>
              :
              <></>
            }
              <div className="mt-4 text-sm">
                <span className="font-bold">{totalPostCount}</span>{" "}
                <span style={{ color: "var(--muted-foreground)" }}>
                  {t("cprofile.posts")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div
  className="grid border-b"
  style={{
    gridTemplateColumns: `repeat(${TABS.length}, 1fr)`,
    borderColor: "var(--border-color)",
  }}
>
  {TABS.map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className="py-4 text-sm font-medium transition relative"
      style={{
        color:
          activeTab === tab
            ? "var(--foreground)"
            : "var(--muted-foreground)",
      }}
    >
      {t(`cprofile.${tab}`)}

      {activeTab === tab && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-sky-500 rounded-full" />
      )}
    </button>
  ))}
</div>

        {/* ── Posts tab ── */}
        {activeTab === "posts" && (
          <>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} />)
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-center px-8">
                <p className="font-extrabold text-2xl">
                  {isOwner
                    ? t("cprofile.noPostsOwner")
                    : t("cprofile.noPostsOther")}
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--muted-foreground)" }}>
                  {isOwner
                    ? t("cprofile.ownerEmptySubtitle")
                    : t("cprofile.otherEmptySubtitle", { name: userName })}
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <UserPostCard
                  key={post.postId}
                  post={post}
                  currentUserId={currentUserId}
                  userName={userName}
                  profilePhoto={profilePhoto}
                  postOwnerId={targetUserId}
                />
              ))
            )}
            <div ref={loadMoreRef} className="py-8 flex justify-center">
              {isFetchingNextPage && (
                <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              )}
              {!hasNextPage && posts.length > 0 && (
                <p
                  className="text-sm"
                  style={{ color: "var(--muted-foreground)" }}>
                  {t("cprofile.noMorePosts")}
                </p>
              )}
            </div>
          </>
        )}

        {/* ── Likes tab ── */}
        {activeTab === "likes" && (
          <UserPostLikes currentUserId={currentUserId} />
        )}

      </div>
    </div>
  );
}
