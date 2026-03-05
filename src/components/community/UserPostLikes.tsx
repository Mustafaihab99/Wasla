import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetPostByReaction } from "../../hooks/community/useGetPostByReact";
import { ReactionType } from "../../utils/enum";
import UserPostCard from "../../components/community/UserPostCard";
import { mainPostData } from "../../types/commuinty/community-types";

interface Props {
  currentUserId: string;
}

export default function UserPostLikes({ currentUserId }: Props) {
  const { t } = useTranslation();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetPostByReaction(currentUserId, currentUserId, ReactionType.love);

  // Local state to allow instant removal of posts when unliked
  const [localPosts, setLocalPosts] = useState<mainPostData[]>([]);

  // Sync server data into localPosts whenever the query updates
  useEffect(() => {
    const fetched = data?.pages.flatMap((page) => page.data) ?? [];
    setLocalPosts(fetched);
  }, [data]);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver to fetch more posts when reaching the end
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

  // Handler for removing a post when user unlikes it
  const handleUnlike = (postId: number) => {
    setLocalPosts((prev) => prev.filter((post) => post.postId !== postId));
  };

  if (isLoading) {
    return (
      <p className="text-center text-gray-400 mt-10">{t("common.loading")}</p>
    );
  }

  if (localPosts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center px-8">
        <p className="font-extrabold text-2xl">{t("cprofile.noLikesYet")}</p>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          {t("cprofile.noLikesSubtitle")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-4 px-2 sm:px-4">
      {localPosts.map((post) => (
        <UserPostCard
          key={post.postId}
          post={post}
          currentUserId={currentUserId}
          postOwnerId={post.userId}
          userName={post.userName}
          profilePhoto={post.profilePhoto}
          onRemove={() => handleUnlike(post.postId)}
        />
      ))}

      <div ref={loadMoreRef} className="py-8 flex justify-center">
        {isFetchingNextPage && (
          <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        )}
        {!hasNextPage && localPosts.length > 0 && (
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {t("cprofile.noMorePosts")}
          </p>
        )}
      </div>
    </div>
  );
}