
export const communityKeys = {
  all: ["community"] as const,

  feed: (currentUserId: string) =>
    [...communityKeys.all, "feed", currentUserId] as const,

  userPosts: (userId: string, currentUserId: string) =>
    [...communityKeys.all, "userPosts", userId, currentUserId] as const,

  userProfile: (userId: string) =>
    [...communityKeys.all, "profile", userId] as const,
};