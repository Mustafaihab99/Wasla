/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editComment } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";

export function useEditComment(postId: number) {
  const queryClient = useQueryClient();
  const commentsKey = communityKeys.comments(postId);

  return useMutation({
    mutationFn: (data: {
      formData: FormData;
      content: string;
      commentId: number;
    }) =>
      editComment(data.formData, data.content, data.commentId),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: commentsKey });

      const previousComments = queryClient.getQueryData<any[]>(commentsKey);

      queryClient.setQueryData<any[]>(commentsKey, (old = []) =>
        old.map((comment) =>
          comment.commentId === variables.commentId
            ? { ...comment, content: variables.content }
            : comment
        )
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