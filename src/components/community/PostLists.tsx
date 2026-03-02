import { useRef, useEffect } from "react";
import { useInfiniteFeedPosts } from "../../hooks/community/useInfiniteFeedPosts";
import PostCard from "./PostCard";

interface PostListProps {
  currentUserId: string;
}

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
        <div className="h-3.5 w-4/5 bg-white/10 rounded-full" />
        <div className="h-32 w-full bg-white/10 rounded-2xl mt-2" />
        <div className="flex gap-10 pt-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 w-8 bg-white/10 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PostList({ currentUserId }: PostListProps) {
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
        <p className="text-white font-bold text-xl">Something went wrong</p>
        <p className="text-gray-500 text-sm">Try refreshing the page</p>
      </div>
    );
  }

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center px-8">
        <p className="text-white font-bold text-2xl">Welcome to the feed!</p>
        <p className="text-gray-500 text-sm">
          When people you follow post, you'll see it here. Start by posting something!
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.postId} post={post} currentUserId={currentUserId} />
      ))}

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="py-8 flex justify-center">
        {isFetchingNextPage && (
          <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        )}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-gray-600 text-sm">You've seen it all!</p>
        )}
      </div>
    </div>
  );
}