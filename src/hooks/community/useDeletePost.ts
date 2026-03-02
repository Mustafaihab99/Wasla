import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { deletePost } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";
import { mainPostData, PaginationResponse } from "../../types/commuinty/community-types";

type FeedCache = InfiniteData<PaginationResponse<mainPostData>>;

export function useDeletePost(currentUserId: string, profileUserId?: string) {
  const queryClient = useQueryClient();
  const feedKey = communityKeys.feed(currentUserId);

  return useMutation({
    mutationFn: deletePost,

    onMutate: async (postId: number) => {
      // Cancel any in-flight refetches
      await queryClient.cancelQueries({ queryKey: feedKey });

      // Snapshot for rollback
      const previousFeed = queryClient.getQueryData<FeedCache>(feedKey);

      // Optimistically remove post from feed
      queryClient.setQueryData<FeedCache>(feedKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((p) => p.postId !== postId),
            totalCount: page.totalCount - 1,
          })),
        };
      });

      return { previousFeed };
    },

    onError: (_err, _postId, context) => {
      // Rollback feed on error
      if (context?.previousFeed) {
        queryClient.setQueryData(feedKey, context.previousFeed);
      }
    },

    onSettled: () => {
      // Always sync feed
      queryClient.invalidateQueries({ queryKey: feedKey });

      // If called from a profile page, also sync that user's posts
      if (profileUserId) {
        queryClient.invalidateQueries({
          queryKey: communityKeys.userPosts(profileUserId, currentUserId),
        });
      }
    },
  });
}