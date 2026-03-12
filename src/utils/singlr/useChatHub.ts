import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as signalR from "@microsoft/signalr";
import { chatKeys } from "../../hooks/chat/useChat";

const CHAT_HUB_URL = "https://waslammka.runasp.net/chatHub";

interface UseChatHubOptions {
  token: string;
  currentUserId: string;
  receiverId?: string;
  onTyping?: (senderId: string) => void;
  onStopTyping?: (senderId: string) => void;
  onNewMessage?: () => void;
}

export function useChatHub({
  token,
  currentUserId,
  receiverId,
  onTyping,
  onStopTyping,
  onNewMessage,
}: UseChatHubOptions) {
  const queryClient = useQueryClient();
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(CHAT_HUB_URL, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection.start().catch((err) => console.error("ChatHub connection failed:", err));


    connection.on("ReceiveMessage", () => {
      // Invalidate conversation + recent chats on new message
      if (receiverId) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.conversation(currentUserId, receiverId),
        });
      }
      queryClient.invalidateQueries({
        queryKey: chatKeys.recentChats(currentUserId),
      });
      onNewMessage?.();
    });

    connection.on("Typing", (senderId: string) => {
      onTyping?.(senderId);
    });

    connection.on("StopTyping", (senderId: string) => {
      onStopTyping?.(senderId);
    });

    return () => {
      connection.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, currentUserId, receiverId]);

  // ─── Send typing event ───────────────────────────────────────────────────

  const sendTyping = useCallback((toReceiverId: string) => {
    connectionRef.current?.invoke("Typing", toReceiverId).catch(console.error);
  }, []);

  // ─── Send stop typing event ──────────────────────────────────────────────

  const sendStopTyping = useCallback((toReceiverId: string) => {
    connectionRef.current?.invoke("StopTyping", toReceiverId).catch(console.error);
  }, []);

  return { sendTyping, sendStopTyping };
}