import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";


export function useDeletePost(currentUserId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.feed(currentUserId),
      });
    },
  });
}