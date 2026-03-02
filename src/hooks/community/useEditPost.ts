import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";

export function useEditPost(currentUserId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editPost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.feed(currentUserId),
      });
    },
  });
}