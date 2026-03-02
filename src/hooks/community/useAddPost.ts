import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddPost } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";

export function useCreatePost(currentUserId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AddPost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.feed(currentUserId),
      });
    },
  });
}