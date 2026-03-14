export const communityKeys = {
  all: ["community"] as const,

  feed: (currentUserId: string) =>
    [...communityKeys.all, "feed", currentUserId] as const,

  userPosts: (userId: string, currentUserId: string, reactionType?: number) => {
    const base = [...communityKeys.all, "userPosts", userId, currentUserId];
    return reactionType !== undefined 
      ? [...base, reactionType] as const
      : base as unknown as readonly [...string[], string, string];
  },

  userProfile: (userId: string) =>
    [...communityKeys.all, "profile", userId] as const,

  comments: (postId: number , currentUserId: string) =>
    [...communityKeys.all, "comments", postId , currentUserId] as const,
};