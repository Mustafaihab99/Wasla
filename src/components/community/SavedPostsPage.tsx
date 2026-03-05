import { useTranslation } from "react-i18next";
import PostCard from "../../components/community/PostCard";
import { useGetPostByReaction } from "../../hooks/community/useGetPostByReact";
import { ReactionType } from "../../utils/enum";

export default function SavedPostsPage() {
  const { t } = useTranslation();
  const userId = sessionStorage.getItem("user_id")!;
  const currentUserId = userId;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useGetPostByReaction(userId, currentUserId, ReactionType.save);

  const posts = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div
      className="mx mt-4 px-2 sm:px-4 mb-24"
      style={{ color: "var(--foreground)" }}
    >
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--primary)" }}>
        {t("common.savedPosts")}
      </h1>

      {isLoading && (
        <p className="text-center text-gray-400 mt-10">{t("common.loading")}</p>
      )}

      {!isLoading && posts.length === 0 && (
        <p className="text-center text-gray-400 mt-10">{t("common.noSavedPosts")}</p>
      )}

      {!isLoading && posts.length > 0 && (
        <>
          {posts.map((post) => (
            <PostCard key={post.postId} post={post} currentUserId={currentUserId} />
          ))}

          {hasNextPage && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-full px-5 py-2 transition disabled:opacity-50"
              >
                {isFetchingNextPage ? t("common.loadingMore") : t("common.loadMore")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}