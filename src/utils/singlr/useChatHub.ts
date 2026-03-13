/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as signalR from "@microsoft/signalr";
import { chatKeys } from "../../hooks/chat/useChat";
import { Message } from "../../types/chat/chat-types";

const CHAT_HUB_URL = "https://waslammka.runasp.net/chatHub";

interface UseChatHubOptions {
  token: string;
  currentUserId: string;
  onTyping?: (senderId: string) => void;
  onStopTyping?: (senderId: string) => void;
  onNewMessage?: (message: Message) => void;
  onUserOnline?: (userId: string) => void;
  onUserOffline?: (userId: string) => void;
}

export function useChatHub({
  token,
  currentUserId,
  onTyping,
  onStopTyping,
  onNewMessage,
  onUserOnline,
  onUserOffline,
}: UseChatHubOptions) {
  const queryClient = useQueryClient();
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const onTypingRef = useRef(onTyping);
  const onStopTypingRef = useRef(onStopTyping);
  const onNewMessageRef = useRef(onNewMessage);
  const onUserOnlineRef = useRef(onUserOnline);
  const onUserOfflineRef = useRef(onUserOffline);
  const currentUserIdRef = useRef(currentUserId);

  useEffect(() => {
    onTypingRef.current = onTyping;
  }, [onTyping]);
  useEffect(() => {
    onStopTypingRef.current = onStopTyping;
  }, [onStopTyping]);
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);
  useEffect(() => {
    onUserOnlineRef.current = onUserOnline;
  }, [onUserOnline]);
  useEffect(() => {
    onUserOfflineRef.current = onUserOffline;
  }, [onUserOffline]);
  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    if (!token || !currentUserId) return;

    if (connectionRef.current) connectionRef.current.stop();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(CHAT_HUB_URL, { accessTokenFactory: () => token })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    const handleReceiveMessage = (message: Message) => {
  const myId = currentUserIdRef.current;
  const otherId =
    message.senderId === myId ? message.receiverId : message.senderId;
  if (!otherId) return;

  // ← الإضافة دي هي الحل
  const messageWithCorrectOwnership: Message = {
    ...message,
    isMine: message.senderId === myId,
  };

  queryClient.setQueryData(
    chatKeys.conversation(myId, otherId),
    (oldData: any) => {
      if (!oldData) return oldData;
      const lastPageIdx = oldData.pages.length - 1;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any, idx: number) =>
          idx === lastPageIdx
            ? {
                ...page,
                messages: {
                  ...page.messages,
                  data: [...page.messages.data, messageWithCorrectOwnership], // ← هنا
                  totalCount: page.messages.totalCount + 1,
                },
              }
            : page,
        ),
      };
    },
  );

  queryClient.invalidateQueries({ queryKey: chatKeys.recentChats(myId) });
  // queryClient.invalidateQueries({ queryKey: chatKeys.conversation(message.senderId , message.receiverId) });
  onNewMessageRef.current?.(message);
};

    const handleMessageDeleted = (messageId: number) => {
      const myId = currentUserIdRef.current;
      queryClient.setQueriesData(
        { queryKey: ["chat-conversation"] },
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              messages: {
                ...page.messages,
                data: page.messages.data.filter(
                  (m: Message) => m.messageId !== messageId,
                ),
                totalCount: page.messages.totalCount - 1,
              },
            })),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: chatKeys.recentChats(myId) });
    };

  const handleMessageUpdated = (updatedMessage: Message) => {
  const myId = currentUserIdRef.current;
  const otherId =
    updatedMessage.senderId === myId
      ? updatedMessage.receiverId
      : updatedMessage.senderId;

  const messageWithCorrectOwnership: Message = {
    ...updatedMessage,
    isMine: updatedMessage.senderId === myId, // ← نفس الحل
  };

  queryClient.setQueryData(
    chatKeys.conversation(myId, otherId),
    (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          messages: {
            ...page.messages,
            data: page.messages.data.map((m: Message) =>
              m.messageId === updatedMessage.messageId
                ? messageWithCorrectOwnership
                : m,
            ),
          },
        })),
      };
    },
  );
};

   const handleTyping = (senderId: string) => {
  if (senderId === currentUserIdRef.current) return;
  onTypingRef.current?.(senderId);
};

const handleStopTyping = (senderId: string) => {
  if (senderId === currentUserIdRef.current) return;
  onStopTypingRef.current?.(senderId);
};
    const handleUserOnline = (userId: string) =>
      onUserOnlineRef.current?.(userId);
    const handleUserOffline = (userId: string) =>
      onUserOfflineRef.current?.(userId);

    connection.on("ReceiveMessage", handleReceiveMessage);
    connection.on("MessageDeleted", handleMessageDeleted);
    connection.on("MessageUpdated", handleMessageUpdated);
    connection.on("UserTyping", handleTyping);
    connection.on("UserStopTyping", handleStopTyping);
    connection.on("UserOnline", handleUserOnline);
    connection.on("UserOffline", handleUserOffline);

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("✅ SignalR ChatHub connected");
      } catch (err) {
        console.error("❌ SignalR connection failed:", err);
      }
    };
    startConnection();

    return () => {
      connection.off("ReceiveMessage", handleReceiveMessage);
      connection.off("MessageDeleted", handleMessageDeleted);
      connection.off("MessageUpdated", handleMessageUpdated);
      connection.off("UserTyping", handleTyping);
      connection.off("UserStopTyping", handleStopTyping);
      connection.off("UserOnline", handleUserOnline);
      connection.off("UserOffline", handleUserOffline);
      connection.stop();
    };
  }, [token, currentUserId, queryClient]);

  const sendTyping = useCallback((toReceiverId: string) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      connectionRef.current
        .invoke("Typing", toReceiverId)
        .catch((err) => console.error("Typing error:", err));
    }
  }, []);

  const sendStopTyping = useCallback((toReceiverId: string) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      connectionRef.current
        .invoke("StopTyping", toReceiverId)
        .catch((err) => console.error("StopTyping error:", err));
    }
  }, []);

  return {
    sendTyping,
    sendStopTyping,
    connection: connectionRef.current,
  };
}
