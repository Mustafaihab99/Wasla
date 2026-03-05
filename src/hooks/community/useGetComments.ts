import { useQuery } from "@tanstack/react-query";
import { getAllCommentsPerPost } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";
import { postAllCommentData } from "../../types/commuinty/community-types";

export function useGetComments(
  postId: number,
  currentUserId: string,
  pageNumber: number = 1,
  pageSize: number = 10
) {
  return useQuery<postAllCommentData>({
    queryKey: communityKeys.comments(postId),
    queryFn: () =>
      getAllCommentsPerPost(
        postId,
        pageNumber,
        pageSize,
        currentUserId
      ),
    enabled: !!postId,
  });
}