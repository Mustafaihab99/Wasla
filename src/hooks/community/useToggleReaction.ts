import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { toggleReaction } from "../../api/community/community-api";
import { communityKeys } from "../../utils/community.keys";
import {
  PaginationResponse,
  mainPostData,
  singleCommentData,
  toggleReactionData,
} from "../../types/commuinty/community-types";
import { ReactionType, ReactionTargetType } from "../../utils/enum";

type FeedCache     = InfiniteData<PaginationResponse<mainPostData>>;
type CommentsCache = InfiniteData<PaginationResponse<singleCommentData>>;

export function useToggleReaction(currentUserId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleReaction,

    onMutate: async (variables: toggleReactionData) => {
      const isPost    = variables.targetType === ReactionTargetType.post;
      const isComment = variables.targetType === ReactionTargetType.comment;

      if (isPost) {
        // 1. تحديث الفيد
        const feedKey = communityKeys.feed(currentUserId);
        await queryClient.cancelQueries({ queryKey: feedKey });
        const previousFeed = queryClient.getQueryData<FeedCache>(feedKey);

        queryClient.setQueryData<FeedCache>(feedKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((post) => {
                if (post.postId !== variables.targetId) return post;

                if (variables.reactionType === ReactionType.love) {
                  return {
                    ...post,
                    isLoved: !post.isLoved,
                    numberofReacts: post.numberofReacts + (post.isLoved ? -1 : 1),
                  };
                }
                if (variables.reactionType === ReactionType.save) {
                  return {
                    ...post,
                    isSaved: !post.isSaved,
                    numberofSaves: post.numberofSaves + (post.isSaved ? -1 : 1),
                  };
                }
                return post;
              }),
            })),
          };
        });

        // 2. تحديث كل الـ userPosts caches (اللي فيها البوستات الخاصة)
        const allUserPostsQueries = queryClient.getQueriesData<FeedCache>({
          queryKey: communityKeys.userPosts(currentUserId, currentUserId),
        });

        allUserPostsQueries.forEach(([queryKey, oldData]) => {
          if (!oldData) return;
          
          queryClient.setQueryData<FeedCache>(queryKey, (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                data: page.data.map((post) => {
                  if (post.postId !== variables.targetId) return post;

                  if (variables.reactionType === ReactionType.love) {
                    return {
                      ...post,
                      isLoved: !post.isLoved,
                      numberofReacts: post.numberofReacts + (post.isLoved ? -1 : 1),
                    };
                  }
                  if (variables.reactionType === ReactionType.save) {
                    return {
                      ...post,
                      isSaved: !post.isSaved,
                      numberofSaves: post.numberofSaves + (post.isSaved ? -1 : 1),
                    };
                  }
                  return post;
                }),
              })),
            };
          });
        });

        // 3. تحديث الـ saved posts cache لو التفاعل من نوع save
        if (variables.reactionType === ReactionType.save) {
          const savedPostsKey = communityKeys.userPosts(currentUserId, currentUserId, ReactionType.save);
          await queryClient.cancelQueries({ queryKey: savedPostsKey });
          // هنا مش بنحدثها manual عشان في onSettled هنعملها invalidate عشان تيجي جديدة
        }

        return { 
          previousData: previousFeed, 
          key: feedKey,
          previousUserPosts: allUserPostsQueries.map(([key, data]) => ({ key, data }))
        };
      }

      if (isComment && variables.targetId != null) {
        const commentsKey = communityKeys.comments(variables.targetId , currentUserId);
        await queryClient.cancelQueries({ queryKey: commentsKey });

        const previousData = queryClient.getQueryData<CommentsCache>(commentsKey);

        queryClient.setQueryData<CommentsCache>(commentsKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((comment) => {
                if (comment.commentId !== variables.targetId) return comment;

                if (variables.reactionType === ReactionType.love) {
                  return {
                    ...comment,
                    isLove: !comment.isLove,
                    numberOfLikes: comment.numberOfLikes + (comment.isLove ? -1 : 1),
                  };
                }
                return comment;
              }),
            })),
          };
        });

        return { previousData, key: commentsKey };
      }
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData && context?.key) {
        queryClient.setQueryData(context.key, context.previousData);
      }
      
      // استعادة الـ userPosts caches القديمة
      if (context?.previousUserPosts) {
        context.previousUserPosts.forEach(({ key, data }) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: (_data, _err, variables) => {
      if (variables.targetType === ReactionTargetType.post) {
        // 1. Invalidate الفيد
        queryClient.invalidateQueries({
          queryKey: communityKeys.feed(currentUserId),
        });
        
        // 2. Invalidate كل userPosts
        queryClient.invalidateQueries({
          queryKey: communityKeys.userPosts(currentUserId, currentUserId),
        });
        
        // 3. Invalidate saved posts لو التفاعل save
        if (variables.reactionType === ReactionType.save) {
          queryClient.invalidateQueries({
            queryKey: communityKeys.userPosts(currentUserId, currentUserId, ReactionType.save),
          });
        }

        // 4. Invalidate بروفايل اليوزر (لأن عدد البوستات أو الreacts ممكن يتغير)
        queryClient.invalidateQueries({
          queryKey: communityKeys.userProfile(variables.targetId.toString()),
        });
      }
      
      if (variables.targetType === ReactionTargetType.comment && variables.targetId != null) {
        queryClient.invalidateQueries({
          queryKey: communityKeys.comments(variables.targetId , currentUserId),
        });
      }
    },
  });
}