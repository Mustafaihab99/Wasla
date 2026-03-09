import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { toggleReaction } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";
import {
  PaginationResponse,
  mainPostData,
  singleCommentData,
  toggleReactionData,
} from "../../types/commuinty/community-types";
import { ReactionType, ReactionTargetType } from "../../utils/enum";

type FeedCache     = InfiniteData<PaginationResponse<mainPostData>>;
type CommentsCache = InfiniteData<PaginationResponse<singleCommentData>>;

export function useToggleReaction(currentUserId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleReaction,

    onMutate: async (variables: toggleReactionData) => {
      const isPost    = variables.targetType === ReactionTargetType.post;
      const isComment = variables.targetType === ReactionTargetType.comment;

      if (isPost) {
        const feedKey = communityKeys.feed(currentUserId);
        await queryClient.cancelQueries({ queryKey: feedKey });

        const previousData = queryClient.getQueryData<FeedCache>(feedKey);

        queryClient.setQueryData<FeedCache>(feedKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((post) => {
                if (post.postId !== variables.targetId) return post;

                if (variables.reactionType === ReactionType.love) {
                  return {
                    ...post,
                    isLoved: !post.isLoved,
                    numberofReacts: post.numberofReacts + (post.isLoved ? -1 : 1),
                  };
                }
                if (variables.reactionType === ReactionType.save) {
                  return {
                    ...post,
                    isSaved: !post.isSaved,
                    numberofSaves: post.numberofSaves + (post.isSaved ? -1 : 1),
                  };
                }
                return post;
              }),
            })),
          };
        });

        return { previousData, key: feedKey };
      }

      if (isComment && variables.targetId != null) {
        const commentsKey = communityKeys.comments(variables.targetId , currentUserId);
        await queryClient.cancelQueries({ queryKey: commentsKey });

        const previousData = queryClient.getQueryData<CommentsCache>(commentsKey);

        queryClient.setQueryData<CommentsCache>(commentsKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((comment) => {
                if (comment.commentId !== variables.targetId) return comment;

                // Comment uses isLove + numberOfLikes (different from post fields)
                if (variables.reactionType === ReactionType.love) {
                  return {
                    ...comment,
                    isLove: !comment.isLove,
                    numberOfLikes: comment.numberOfLikes + (comment.isLove ? -1 : 1),
                  };
                }
                return comment;
              }),
            })),
          };
        });

        return { previousData, key: commentsKey };
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
      if (variables.targetType === ReactionTargetType.comment && variables.targetId != null) {
        queryClient.invalidateQueries({
          queryKey: communityKeys.comments(variables.targetId , currentUserId),
        });
      }
    },
  });
}