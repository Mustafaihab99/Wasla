// ============================================================
// hooks/community/useUserPosts.ts
// ============================================================
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostsPerUser } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";

export function useUserPosts(userId: string, currentUserId: string) {
  return useInfiniteQuery({
    queryKey: communityKeys.userPosts(userId, currentUserId),

    queryFn: ({ pageParam = 1 }) =>
      getPostsPerUser(userId, currentUserId, pageParam as number, 10),

    getNextPageParam: (lastPage) => {
      const { pageNumber, pageSize, totalCount } = lastPage.posts;
      const totalPages = Math.ceil(totalCount / pageSize);
      return pageNumber < totalPages ? pageNumber + 1 : undefined;
    },

    initialPageParam: 1,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    enabled: !!userId && !!currentUserId,
  });
}