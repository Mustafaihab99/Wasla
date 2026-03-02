import { useRef, useEffect } from "react";
import { useInfiniteFeedPosts } from "../../hooks/community/useInfiniteFeedPosts";
import PostCard from "./PostCard";
import PostSkeleton from "./PostCardSkeleton";
import { useTranslation } from "react-i18next";

interface PostListProps {
  currentUserId: string;
}

export default function PostList({ currentUserId }: PostListProps) {
  const { t } = useTranslation();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteFeedPosts(currentUserId);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center px-8">
        <p
          className="font-bold text-xl"
          style={{ color: "var(--foreground)" }}
        >
          {t("feed.errorTitle")}
        </p>
        <p
          className="text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          {t("feed.errorSubtitle")}
        </p>
      </div>
    );
  }

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center px-8">
        <p
          className="font-bold text-2xl"
          style={{ color: "var(--foreground)" }}
        >
          {t("feed.emptyTitle")}
        </p>
        <p
          className="text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          {t("feed.emptySubtitle")}
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.postId}
          post={post}
          currentUserId={currentUserId}
        />
      ))}

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="py-8 flex justify-center">
        {isFetchingNextPage && (
          <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        )}

        {!hasNextPage && posts.length > 0 && (
          <p
            className="text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            {t("feed.endOfFeed")}
          </p>
        )}
      </div>
    </div>
  );
}