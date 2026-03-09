import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { communityKeys } from "../../utils/community.keys";
import { PaginationResponse, singleCommentData } from "../../types/commuinty/community-types";
import { editComment } from "../../api/community/community-api";

type CommentsCache = InfiniteData<PaginationResponse<singleCommentData>>;

export function useEditComment(postId: number) {
  const currentUserId = sessionStorage.getItem("user_id");
  const queryClient = useQueryClient();
  const commentsKey = communityKeys.comments(postId , currentUserId!);

  return useMutation({
    mutationFn: ({
      commentId,
      content,
      file,
    }: {
      commentId: number;
      content: string;
      file?: File;     
    }) => editComment(content , commentId , file),

    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey: commentsKey });

      const previousData = queryClient.getQueryData<CommentsCache>(commentsKey);

      queryClient.setQueryData<CommentsCache>(commentsKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((c) =>
              c.commentId === commentId
                ? { ...c, content, updatedAt: new Date().toISOString() }
                : c
            ),
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