import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddComment } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";

export function useAddComment(postId: number, currentUserId: string) {
  const queryClient = useQueryClient();
  const commentsKey = communityKeys.comments(postId);

  return useMutation({
    mutationFn: (data: {
      formData: FormData;
      content: string;
    }) =>
      AddComment(data.formData, currentUserId, data.content, postId),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: commentsKey });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const previousComments = queryClient.getQueryData<any[]>(commentsKey);

      // optimistic fake comment
      const optimisticComment = {
        commentId: Date.now(),
        content: variables.content,
        isLoved: false,
        numberofReacts: 0,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData<any[]>(commentsKey, (old = []) => [
        optimisticComment,
        ...old,
      ]);

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