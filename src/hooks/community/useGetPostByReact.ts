import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostByReact } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";

export function useGetPostByReaction(
  userId: string,
  currentUserId: string,
  reactionType: number
) {
  return useInfiniteQuery({
    queryKey: communityKeys.userPosts(userId, currentUserId, reactionType),
    queryFn: ({ pageParam = 1 }) =>
      getPostByReact(pageParam as number, 10, userId, reactionType),
    getNextPageParam: (lastPage) => {
      const { pageNumber, pageSize, totalCount } = lastPage;
      const totalPages = Math.ceil(totalCount / pageSize);
      return pageNumber < totalPages ? pageNumber + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    enabled: !!userId && !!currentUserId,
  });
}