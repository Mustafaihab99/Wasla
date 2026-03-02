/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { toggleReaction } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";
import {
  PaginationResponse,
  mainPostData,
  toggleReactionData,
} from "../../types/commuinty/community-types";
import { ReactionType, ReactionTargetType } from "../../utils/enum";

type FeedInfiniteData = InfiniteData<PaginationResponse<mainPostData>>;

export function useToggleReaction(currentUserId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleReaction,

    onMutate: async (variables: toggleReactionData) => {
      const isPost = variables.targetType === ReactionTargetType.post;
      const isComment = variables.targetType === ReactionTargetType.comment;

      const feedKey = communityKeys.feed(currentUserId);

      if (isPost) {
        await queryClient.cancelQueries({ queryKey: feedKey });

        const previousData =
          queryClient.getQueryData<FeedInfiniteData>(feedKey);

        queryClient.setQueryData<FeedInfiniteData>(feedKey, (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((post) => {
                if (post.postId !== variables.targetId) return post;

                if (variables.reactionType === ReactionType.love) {
                  const wasLoved = post.isLoved;
                  return {
                    ...post,
                    isLoved: !wasLoved,
                    numberofReacts:
                      post.numberofReacts + (wasLoved ? -1 : 1),
                  };
                }

                if (variables.reactionType === ReactionType.save) {
                  const wasSaved = post.isSaved;
                  return {
                    ...post,
                    isSaved: !wasSaved,
                    numberofSaves:
                      post.numberofSaves + (wasSaved ? -1 : 1),
                  };
                }

                return post;
              }),
            })),
          };
        });

        return { previousData, type: "post", key: feedKey };
      }

      if (isComment) {
        const commentsKey = communityKeys.comments(
          (variables as any).postId
        );

        await queryClient.cancelQueries({ queryKey: commentsKey });

        const previousComments =
          queryClient.getQueryData<any[]>(commentsKey);

        queryClient.setQueryData<any[]>(commentsKey, (old = []) =>
          old.map((comment) => {
            if (comment.commentId !== variables.targetId)
              return comment;

            if (variables.reactionType === ReactionType.love) {
              const wasLoved = comment.isLoved;
              return {
                ...comment,
                isLoved: !wasLoved,
                numberofReacts:
                  comment.numberofReacts + (wasLoved ? -1 : 1),
              };
            }

            return comment;
          })
        );

        return { previousData: previousComments, type: "comment", key: commentsKey };
      }
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData && context?.key) {
        queryClient.setQueryData(context.key, context.previousData);
      }
    },

    onSettled: (_data, _err, variables) => {
      if (variables.targetType === ReactionTargetType.post) {
        queryClient.invalidateQueries({
          queryKey: communityKeys.feed(currentUserId),
        });
      }

      if (variables.targetType === ReactionTargetType.comment) {
        queryClient.invalidateQueries({
          queryKey: communityKeys.comments(
            (variables as any).postId
          ),
        });
      }
    },
  });
}