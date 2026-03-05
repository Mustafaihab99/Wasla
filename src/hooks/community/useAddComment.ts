import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { AddComment } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";
import { PaginationResponse, singleCommentData } from "../../types/commuinty/community-types";

type CommentsCache = InfiniteData<PaginationResponse<singleCommentData>>;

export function useAddComment(postId: number, currentUserId: string) {
  const queryClient = useQueryClient();
  const commentsKey = communityKeys.comments(postId);

  return useMutation({
    mutationFn: ({
      content,
      file,
    }: {
      content: string;
      file?: File;
    }) => AddComment(currentUserId, content, postId, file),

    onMutate: async ({ content }) => {
      await queryClient.cancelQueries({ queryKey: commentsKey });

      const previousData = queryClient.getQueryData<CommentsCache>(commentsKey);

      const optimistic: singleCommentData = {
        commentId: Date.now(),        //
        content,
        isLove: false,
        numberOfLikes: 0,
        file: null,
        userName: "",                
        userProfile: "",
        userId: currentUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Prepend to the first page optimistically
      queryClient.setQueryData<CommentsCache>(commentsKey, (old) => {
        if (!old) return old;
        const [firstPage, ...rest] = old.pages;
        return {
          ...old,
          pages: [
            {
              ...firstPage,
              data: [optimistic, ...firstPage.data],
              totalCount: firstPage.totalCount + 1,
            },
            ...rest,
          ],
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