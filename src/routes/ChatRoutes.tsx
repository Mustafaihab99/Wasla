export const CHAT_ROUTES = {
  base: "/chat",
  newChat: "/chat/new",
  conversation: (receiverId: string) => `/chat/${receiverId}`,
  profile: (userId: string) => `/chat/profile/${userId}`,
};