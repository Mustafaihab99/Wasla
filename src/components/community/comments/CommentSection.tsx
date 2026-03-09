import { useRef, useEffect } from "react";
import { useInfiniteComments } from "../../../hooks/community/useInfiniteComments";
import CommentCard from "./CommentCard";
import { useTranslation } from "react-i18next";

interface Props {
  postId: number;
  currentUserId: string;
}

function CommentSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-4 border-b border-border animate-pulse bg-background">
      <div className="w-10 h-10 rounded-full bg-secondary flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="flex gap-2">
          <div className="h-3 w-24 bg-secondary rounded-full" />
          <div className="h-3 w-14 bg-secondary rounded-full" />
        </div>
        <div className="h-3 w-full bg-secondary rounded-full" />
        <div className="h-3 w-3/4 bg-secondary rounded-full" />
      </div>
    </div>
  );
}

export default function CommentSection({ postId, currentUserId }: Props) {
  const { t } = useTranslation();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteComments(postId, currentUserId);

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

      if (!currentUserId) {
        {window.location.reload()}
    return (
      <div className="bg-background">
        {Array.from({ length: 4 }).map((_, i) => (
          <CommentSkeleton key={i} />
        ))}
      </div>
    );
  }

  const comments = data?.pages?.flatMap((p) => p.data) ?? [];

  if (isLoading) {
    return (
      <div className="bg-background">
        {Array.from({ length: 4 }).map((_, i) => (
          <CommentSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-14 text-center text-secondary text-sm px-6 bg-background">
        {t("comments.loadError")}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center gap-2 text-center px-8 bg-background">
        <p className="text-foreground font-bold text-xl">
          {t("comments.noReplies")}
        </p>
        <p className="text-secondary text-[15px]">
          {t("comments.beFirst")}
        </p>
      </div>
    );
  }

  return (
    <div className="pb-40 bg-background min-h-screen">
      {comments.map((comment) => (
        <CommentCard
          key={comment.commentId}
          comment={comment}
          postId={postId}
          currentUserId={currentUserId}
        />
      ))}

      <div ref={loadMoreRef} className="py-8 flex justify-center">
        {isFetchingNextPage && (
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}

        {!hasNextPage && comments.length > 5 && (
          <p className="text-secondary text-sm">
            {t("comments.noMore")}
          </p>
        )}
      </div>
    </div>
  );
}