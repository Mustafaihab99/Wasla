import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { editPost } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";
import {
  mainPostData,
  PaginationResponse,
} from "../../types/commuinty/community-types";

type FeedCache = InfiniteData<PaginationResponse<mainPostData>>;

export function useEditPost(currentUserId: string, profileUserId?: string) {
  const queryClient = useQueryClient();
  const feedKey = communityKeys.feed(currentUserId);

  return useMutation({
    mutationFn: editPost,

    onMutate: async (formData: FormData) => {
      const postId = Number(formData.get("id"));
      const content = String(formData.get("content") ?? "");
      const hasNewFile = formData.get("files") instanceof File;
      const shouldClear = formData.get("clearFiles") === "true";

      await queryClient.cancelQueries({ queryKey: feedKey });
      const previousFeed = queryClient.getQueryData<FeedCache>(feedKey);

      queryClient.setQueryData<FeedCache>(feedKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((p) => {
              if (p.postId !== postId) return p;

              return {
                ...p,
                content,
                updatedAt: new Date().toISOString(),
                files: shouldClear
                  ? []
                  : hasNewFile
                    ? p.files
                    : p.files,
              };
            }),
          })),
        };
      });

      return { previousFeed };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(feedKey, context.previousFeed);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: feedKey });
      if (profileUserId) {
        queryClient.invalidateQueries({
          queryKey: communityKeys.userPosts(profileUserId, currentUserId),
        });
      }
    },
  });
}
