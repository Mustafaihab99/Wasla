import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";

export function useInfiniteFeedPosts(currentUserId: string) {
  return useInfiniteQuery({
    queryKey: communityKeys.feed(currentUserId),

    queryFn: ({ pageParam = 1 }) =>
      getAllPosts(pageParam, 10, currentUserId),

    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(
        lastPage.totalCount / lastPage.pageSize
      );

      if (lastPage.pageNumber < totalPages) {
        return lastPage.pageNumber + 1;
      }

      return undefined;
    },

    initialPageParam: 1,
    staleTime: 1000 * 30, 
    gcTime: 1000 * 60 * 5, 
  });
}