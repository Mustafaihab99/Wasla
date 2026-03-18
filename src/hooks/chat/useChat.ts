import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteChat,
  deleteMessage,
  editMessage,
  getChatConversation,
  getChatUsers,
  getRecentChats,
  getUserProfile,
  markRead,
  sendMessage,
  updateBio,
} from "../../api/chat/chat-api";
import {
  DeleteChatParams,
  DeleteMessageParams,
  EditMessageParams,
  SendMessageParams,
  UpdateBioParams,
} from "../../types/chat/chat-types";

export const chatKeys = {
  users: (page: number) => ["chat-users", page] as const,
  recentChats: (userId: string) => ["recent-chats", userId] as const,
  profile: (userId: string) => ["chat-profile", userId] as const,
  conversation: (senderId: string, receiverId: string) =>
    ["chat-conversation", senderId, receiverId] as const,
};

export function useGetChatUsers(pageNumber: number = 1, pageSize: number = 20) {
  return useQuery({
    queryKey: chatKeys.users(pageNumber),
    queryFn: () => getChatUsers(pageNumber, pageSize),
  });
}

export function useGetRecentChats(userId: string) {
  return useQuery({
    queryKey: chatKeys.recentChats(userId),
    queryFn: () => getRecentChats(userId),
    enabled: !!userId,
  });
}

export function useGetUserProfile(userId: string) {
  return useQuery({
    queryKey: chatKeys.profile(userId),
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });
}

export function useGetChatConversation(
  senderId: string,
  receiverId: string,
  pageSize: number = 30,
) {
  return useInfiniteQuery({
    queryKey: chatKeys.conversation(senderId, receiverId),
    queryFn: ({ pageParam = 1 }) =>
      getChatConversation(senderId, receiverId, pageParam as number, pageSize),
    getNextPageParam: (lastPage) => {
      const messages = lastPage?.messages;

      if (!messages) return undefined;

      const hasMore =
        messages.pageNumber * messages.pageSize < messages.totalCount;

      return hasMore ? messages.pageNumber + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!senderId && !!receiverId,
  });
}

export function useDeleteChat(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: DeleteChatParams) => deleteChat(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.recentChats(userId) });
    },
  });
}

export function useMarkasRead(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chatId: number) => markRead(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.recentChats(userId),
      });
    },
  });
}

export function useUpdateBio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UpdateBioParams) => updateBio(params),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.profile(variables.userId),
      });
    },
  });
}

export function useSendMessage(senderId: string, receiverId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: SendMessageParams) => sendMessage(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.recentChats(senderId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.recentChats(receiverId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.conversation(senderId , receiverId) });
    },
  });
}

export function useDeleteMessage(senderId: string, receiverId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: DeleteMessageParams) => deleteMessage(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.recentChats(senderId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.recentChats(receiverId) });
    },
  });
}

export function useEditMessage(senderId: string, receiverId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: EditMessageParams) => editMessage(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversation(senderId, receiverId),
      });
    },
  });
}
