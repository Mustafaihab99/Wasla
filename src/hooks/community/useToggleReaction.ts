import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { toggleReaction } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";
import { PaginationResponse, mainPostData, toggleReactionData } from "../../types/commuinty/community-types";
import { ReactionType } from "../../utils/enum";

type FeedInfiniteData = InfiniteData<PaginationResponse<mainPostData>>;

export function useToggleReaction(currentUserId: string) {
  const queryClient = useQueryClient();
  const feedKey = communityKeys.feed(currentUserId);

  return useMutation({
    mutationFn: toggleReaction,

    onMutate: async (variables: toggleReactionData) => {
      await queryClient.cancelQueries({ queryKey: feedKey });

      const previousData = queryClient.getQueryData<FeedInfiniteData>(feedKey);

      // Optimistically update the correct post in the infinite feed
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
                  numberofReacts: post.numberofReacts + (wasLoved ? -1 : 1),
                };
              }

              if (variables.reactionType === ReactionType.save) {
                const wasSaved = post.isSaved;
                return {
                  ...post,
                  isSaved: !wasSaved,
                  numberofSaves: post.numberofSaves + (wasSaved ? -1 : 1),
                };
              }

              return post;
            }),
          })),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(feedKey, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: feedKey });
    },
  });
}