import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleReaction } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";
import { ReactionType } from "../../utils/enum";

export function useToggleReaction(currentUserId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleReaction,
    onSuccess: (_, variables) => {
      // إبطال جميع الاستعلامات المتعلقة بالبوستات
      queryClient.invalidateQueries({ queryKey: communityKeys.feed(currentUserId) });
      queryClient.invalidateQueries({ queryKey: communityKeys.userPosts(currentUserId, currentUserId) });
      if (variables.reactionType === ReactionType.save) {
        queryClient.invalidateQueries({ queryKey: communityKeys.userPosts(currentUserId, currentUserId, ReactionType.save) });
      }
    },
  });
}