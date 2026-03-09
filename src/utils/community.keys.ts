
export const communityKeys = {
  all: ["community"] as const,

  feed: (currentUserId: string) =>
    [...communityKeys.all, "feed", currentUserId] as const,

  userPosts: (userId: string, currentUserId: string , reactionType?: number) =>
    [...communityKeys.all, "userPosts", userId, currentUserId , reactionType] as const,

  userProfile: (userId: string) =>
    [...communityKeys.all, "profile", userId] as const,

  comments: (postId: number , currentUserId: string) =>
  [...communityKeys.all, "comments", postId , currentUserId] as const,
};