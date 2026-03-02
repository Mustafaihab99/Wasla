/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";

export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();
  const commentsKey = communityKeys.comments(postId);

  return useMutation({
    mutationFn: deleteComment,

    onMutate: async (commentId: number) => {
      await queryClient.cancelQueries({ queryKey: commentsKey });

      const previousComments = queryClient.getQueryData<any[]>(commentsKey);

      queryClient.setQueryData<any[]>(commentsKey, (old = []) =>
        old.filter((comment) => comment.commentId !== commentId)
      );

      return { previousComments };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(commentsKey, context.previousComments);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsKey });
    },
  });
}