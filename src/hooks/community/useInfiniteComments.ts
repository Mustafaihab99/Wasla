import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllCommentsPerPost } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";
import { PaginationResponse, singleCommentData } from "../../types/commuinty/community-types";

export function useInfiniteComments(postId: number, currentUserId: string) {
  return useInfiniteQuery<PaginationResponse<singleCommentData>>({
    queryKey: communityKeys.comments(postId, currentUserId),

    queryFn: ({ pageParam = 1 }) =>
      getAllCommentsPerPost(postId, pageParam as number, 10, currentUserId),

    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.totalCount / lastPage.pageSize);
      return lastPage.pageNumber < totalPages ? lastPage.pageNumber + 1 : undefined;
    },

    initialPageParam: 1,
    enabled: !!postId && !!currentUserId,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
}