import { useParams, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { 
  FaArrowLeft, 
  FaCalendarAlt,  
  FaEllipsisH, 
  FaEnvelope 
} from "react-icons/fa";
import { useUserPosts } from "../../hooks/community/useUserPosts";
import UserPostCard from "../../components/community/UserPostCard";

// ─── Skeleton helpers ─────────────────────────────────────────
function PostSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-3 border-b border-[#2f3336] animate-pulse">
      <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="flex gap-2">
          <div className="h-3.5 w-24 bg-white/10 rounded-full" />
          <div className="h-3.5 w-16 bg-white/10 rounded-full" />
        </div>
        <div className="h-3.5 w-full bg-white/10 rounded-full" />
        <div className="h-3.5 w-3/4 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-white/10" />
      <div className="px-4 pb-4 relative">
        <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-black absolute -top-12" />
        <div className="pt-16 space-y-2">
          <div className="h-5 w-36 bg-white/10 rounded-full" />
          <div className="h-4 w-24 bg-white/10 rounded-full" />
          <div className="h-4 w-full bg-white/10 rounded-full mt-3" />
          <div className="h-4 w-2/3 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Profile Header ───────────────────────────────────────────
interface ProfileHeaderProps {
  userName: string;
  profilePhoto: string;
  userId: string;
  currentUserId: string;
  postCount: number;
}

function ProfileHeader({
  userName,
  profilePhoto,
  userId,
  currentUserId,
  postCount,
}: ProfileHeaderProps) {
  const isOwner = userId === currentUserId;

  return (
    <div>
      {/* Banner */}
      <div className="h-48 bg-gradient-to-br from-sky-900 via-sky-800 to-[#1a1a2e] relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-sky-500/10 rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-sky-400/10 rounded-full" />
      </div>

      {/* Avatar + actions row */}
      <div className="px-4 flex items-start justify-between relative">
        {/* Avatar — overlaps banner */}
        <div className="absolute -top-14 left-4">
          <div className="w-[112px] h-[112px] rounded-full border-4 border-black overflow-hidden bg-[#1e2d3d]">
            <img
              src={profilePhoto || "/assets/images/default-avatar.png"}
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="ml-auto mt-3 flex items-center gap-2">
          <button className="p-2 rounded-full border border-[#536471] hover:bg-white/5 transition text-white">
            <FaEllipsisH className="w-5 h-5" />
          </button>

          {!isOwner && (
            <button className="p-2 rounded-full border border-[#536471] hover:bg-white/5 transition text-white">
              <FaEnvelope className="w-5 h-5" />
            </button>
          )}

          {isOwner ? (
            <button className="px-4 py-1.5 rounded-full border border-[#536471] text-white font-bold text-sm hover:bg-white/5 transition">
              Edit profile
            </button>
          ) : (
            <button className="px-4 py-1.5 rounded-full bg-white text-black font-bold text-sm hover:bg-gray-200 transition">
              Follow
            </button>
          )}
        </div>
      </div>

      {/* User info */}
      <div className="px-4 pt-14 pb-4">
        <h1 className="text-white font-extrabold text-xl leading-tight">{userName}</h1>
        <p className="text-gray-500 text-[15px]">@{userName.toLowerCase().replace(/\s/g, "_")}</p>

        {/* Bio placeholder */}
        <p className="text-white text-[15px] mt-3 leading-snug">
          {isOwner ? "Your profile bio goes here ✨" : `Posts by ${userName}`}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-gray-500 text-sm">
          <span className="flex items-center gap-1">
            <FaCalendarAlt className="w-4 h-4" />
            Joined recently
          </span>
        </div>

        {/* Stats */}
        <div className="flex gap-5 mt-4">
          <button className="hover:underline text-sm">
            <span className="text-white font-bold">{postCount}</span>{" "}
            <span className="text-gray-500">Posts</span>
          </button>
          <button className="hover:underline text-sm">
            <span className="text-white font-bold">0</span>{" "}
            <span className="text-gray-500">Following</span>
          </button>
          <button className="hover:underline text-sm">
            <span className="text-white font-bold">0</span>{" "}
            <span className="text-gray-500">Followers</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Tabs ─────────────────────────────────────────────
const TABS = ["Posts", "Replies", "Highlights", "Media", "Likes"] as const;
type TabType = (typeof TABS)[number];

// ─── Main Page ────────────────────────────────────────────────
export default function ProfileSocialPage() {
  const { userId: routeUserId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const currentUserId = sessionStorage.getItem("user_id")!;

  // "me" shortcut → use currentUserId
  const targetUserId =
    !routeUserId || routeUserId === "me" ? currentUserId : routeUserId;

  const isOwner = targetUserId === currentUserId;
  const [activeTab, setActiveTab] = useState<TabType>("Posts");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useUserPosts(targetUserId, currentUserId);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "200px" }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Extract profile info from first page
  const firstPage = data?.pages[0];
  const userName = firstPage?.userName ?? "";
  const profilePhoto = firstPage?.profilePhoto ?? "";
  const totalPostCount = firstPage?.posts.totalCount ?? 0;

  const posts = data?.pages.flatMap((p) => p.posts.data) ?? [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[600px] mx-auto border-x border-[#2f3336] min-h-screen">

        {/* Sticky top bar */}
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md px-4 py-3 flex items-center gap-6 border-b border-[#2f3336]">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-full hover:bg-white/10 transition"
          >
            <FaArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-white font-extrabold text-lg leading-tight">
              {isLoading ? "Profile" : userName || "Profile"}
            </h1>
            <p className="text-gray-500 text-xs">
              {totalPostCount} post{totalPostCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Profile header */}
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <ProfileHeader
            userName={userName}
            profilePhoto={profilePhoto}
            userId={targetUserId}
            currentUserId={currentUserId}
            postCount={totalPostCount}
          />
        )}

        {/* Tabs */}
        <div className="grid border-b border-[#2f3336]" style={{ gridTemplateColumns: `repeat(${TABS.length}, 1fr)` }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-medium transition relative hover:bg-white/5 ${
                activeTab === tab ? "text-white" : "text-gray-500"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-sky-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Posts tab content */}
        {activeTab === "Posts" && (
          <>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} />)
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-center px-8">
                <p className="text-white font-extrabold text-2xl">
                  {isOwner ? "You haven't posted yet" : "No posts yet"}
                </p>
                <p className="text-gray-500 text-[15px]">
                  {isOwner
                    ? "When you post, it'll show up here."
                    : `When ${userName} posts, you'll see it here.`}
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
                />
              ))
            )}

            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="py-8 flex justify-center">
              {isFetchingNextPage && (
                <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              )}
              {!hasNextPage && posts.length > 0 && (
                <p className="text-gray-600 text-sm">No more posts</p>
              )}
            </div>
          </>
        )}

        {/* Other tabs — placeholder */}
        {activeTab !== "Posts" && (
          <div className="flex flex-col items-center gap-3 py-20 text-center px-8">
            <p className="text-white font-extrabold text-2xl">
              Nothing here yet
            </p>
            <p className="text-gray-500 text-[15px]">
              {activeTab} will appear here when available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}