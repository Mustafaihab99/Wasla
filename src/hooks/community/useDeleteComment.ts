import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { deleteComment } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";
import { PaginationResponse, singleCommentData } from "../../types/commuinty/community-types";

type CommentsCache = InfiniteData<PaginationResponse<singleCommentData>>;

export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();
  const currentUserId = sessionStorage.getItem("user_id")!;
  const commentsKey = communityKeys.comments(postId , currentUserId);

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),

    onMutate: async (commentId: number) => {
      await queryClient.cancelQueries({ queryKey: commentsKey });

      const previousData = queryClient.getQueryData<CommentsCache>(commentsKey);

      // Optimistically remove from all pages
      queryClient.setQueryData<CommentsCache>(commentsKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((c) => c.commentId !== commentId),
            totalCount: page.totalCount - 1,
          })),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(commentsKey, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey });
    },
  });
}
