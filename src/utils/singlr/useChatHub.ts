import { useEffect, useRef } from "react";
import {
  useChatHubConnection,
  ChatEventHandlers,
  sameId,
} from "../singlr/ChatHubConnection";

export { sameId };

interface UseChatHubOptions {
  activeChatUserId?: string;
  receiverId?: string;
  onTyping?: (senderId: string) => void;
  onStopTyping?: (senderId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNewMessage?: (message: any) => void;
  onUserOnline?: (userId: string) => void;
  onUserOffline?: (data: { userId: string; lastSeen: string }) => void;
}

export function useChatHub({
  activeChatUserId,
  onTyping,
  onStopTyping,
  onNewMessage,
  onUserOnline,
  onUserOffline,
}: UseChatHubOptions) {
  const { sendTyping, sendStopTyping, registerHandlers, activeChatUserIdRef } =
    useChatHubConnection();

  // تحديث الـ activeChatUserId في الـ Provider
  useEffect(() => {
    activeChatUserIdRef.current = activeChatUserId;
  }, [activeChatUserId, activeChatUserIdRef]);

  // استخدام ref للـ handlers عشان متعملش re-register كل render
  const handlersRef = useRef<ChatEventHandlers>({});

  useEffect(() => {
    handlersRef.current = {
      onTyping,
      onStopTyping,
      onNewMessage,
      onUserOnline,
      onUserOffline,
    };
  });

  useEffect(() => {
    const stableHandlers: ChatEventHandlers = {
  onTyping: (sid) => handlersRef.current.onTyping?.(sid),
  onStopTyping: (sid) => handlersRef.current.onStopTyping?.(sid),
  onNewMessage: (msg) => handlersRef.current.onNewMessage?.(msg),
  onUserOnline: (uid) => handlersRef.current.onUserOnline?.(uid),
  onUserOffline: (data) =>
    handlersRef.current.onUserOffline?.(data),
};

    const unregister = registerHandlers(stableHandlers);
    return unregister; // cleanup تلقائي لما الـ component يتفكك
  }, [registerHandlers]);

  return { sendTyping, sendStopTyping };
}
