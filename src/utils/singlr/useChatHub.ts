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

// مقارنة IDs بـ case-insensitive عشان نتجنب مشكلة UUID uppercase/lowercase
const sameId = (a?: string, b?: string) =>
  !!a && !!b && a.toLowerCase() === b.toLowerCase();

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
      const otherId = sameId(message.senderId, myId)
        ? message.receiverId
        : message.senderId;
      if (!otherId) return;

      const msg: Message = {
        ...message,
        isMine: sameId(message.senderId, myId),
      };

      // نلف على كل الـ conversation queries
      const allConvQueries = queryClient.getQueriesData<any>({
        queryKey: ["chat-conversation"],
      });

      const matchedEntry = allConvQueries.find(([key]) => {
        const k = key as string[];
        return k.length === 3 && sameId(k[1], myId) && sameId(k[2], otherId);
      });

      if (matchedEntry) {
        // لو في cache -> نضيف الرسالة مباشرة
        queryClient.setQueryData(matchedEntry[0], (oldData: any) => {
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
                      data: [...page.messages.data, msg],
                      totalCount: page.messages.totalCount + 1,
                    },
                  }
                : page,
            ),
          };
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["chat-conversation", myId, otherId],
          refetchType: "none",
        });

        queryClient.setQueryData(chatKeys.recentChats(myId), (oldData: any) => {
          if (!oldData) return oldData;

          // نشوف لو الشات موجود في الـ recent
          const existingIndex = oldData.findIndex((chat: any) =>
            sameId(chat.userId, otherId),
          );
          const updated = [...oldData];
          const newRecent = {
            userId: otherId,
            lastMessage:
              msg.messageText || (msg.audio ? "🎤 Voice message" : "📎 File"),
            lastMessageTime: msg.sentAt,
            unreadCount: !msg.isMine
              ? (updated[existingIndex]?.unreadCount ?? 0) + 1
              : 0,
            ...(msg.isMine ? {} : { isTyping: false }),
          };

          if (existingIndex >= 0) {
            // لو موجود، نحدثه
            const updated = [...oldData];
            updated[existingIndex] = {
              ...updated[existingIndex],
              ...newRecent,
            };
            return updated;
          } else {
            // لو مش موجود، نضيفه جديد
            return [newRecent, ...oldData];
          }
        });

        // 3. نضيف الرسالة فوراً في الـ conversation cache (بنشئ cache جديد)
        const newConversationData = {
          pages: [
            {
              messages: {
                data: [msg],
                pageNumber: 1,
                pageSize: 30,
                totalCount: 1,
                totalPages: 1,
              },
            },
          ],
          pageParams: [1],
        };

        queryClient.setQueryData(
          ["chat-conversation", myId, otherId],
          newConversationData,
        );
      }

      if (!msg.isMine) {
        queryClient.setQueryData(
          chatKeys.recentChats(otherId),
          (oldData: any) => {
            if (!oldData) return oldData;

            const existingIndex = oldData.findIndex((chat: any) =>
              sameId(chat.userId, myId),
            );

            const newRecent = {
              userId: myId,
              lastMessage:
                msg.messageText || (msg.audio ? "🎤 Voice message" : "📎 File"),
              lastMessageTime: msg.sentAt,
              unreadCount: 1,
            };

            if (existingIndex >= 0) {
              const updated = [...oldData];
              updated[existingIndex] = {
                ...updated[existingIndex],
                ...newRecent,
              };
              return updated;
            } else {
              return [newRecent, ...oldData];
            }
          },
        );
      }

      onNewMessageRef.current?.(message);
    };

    // ── MessageDeleted ──────────────────────────────────────────────────────
    const handleMessageDeleted = (messageId: number) => {
      const myId = currentUserIdRef.current;

      const allConvQueries = queryClient.getQueriesData<any>({
        queryKey: ["chat-conversation"],
      });

      for (const [key, oldData] of allConvQueries) {
        if (!oldData) continue;
        queryClient.setQueryData(key, {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            messages: {
              ...page.messages,
              data: page.messages.data.filter(
                (m: Message) => m.messageId !== messageId,
              ),
              totalCount: Math.max(0, page.messages.totalCount - 1),
            },
          })),
        });
      }

      queryClient.invalidateQueries({ queryKey: chatKeys.recentChats(myId) });
    };
    // MessagesRead → نحدث الرسائل في الكاش إنها اتقرأت
    const handleMessagesRead = ({
      messageIds,
    }: {
      chatId: number;
      readerId: string;
      messageIds: number[];
    }) => {
      const myId = currentUserIdRef.current;
      const messageIdSet = new Set(messageIds);

      const allConvQueries = queryClient.getQueriesData<any>({
        queryKey: ["chat-conversation"],
      });

      for (const [key, oldData] of allConvQueries) {
        if (!oldData) continue;
        queryClient.setQueryData(key, {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            messages: {
              ...page.messages,
              data: page.messages.data.map((m: Message) =>
                messageIdSet.has(m.messageId!)
                  ? { ...m, isRead: true, readAt: new Date().toISOString() }
                  : m,
              ),
            },
          })),
        });
      }

      queryClient.invalidateQueries({ queryKey: chatKeys.recentChats(myId) });
    };

    const handleChatUpdated = ({ chatId }: { chatId: number }) => {
      const myId = currentUserIdRef.current;
      console.log(chatId);
      queryClient.invalidateQueries({ queryKey: chatKeys.recentChats(myId) });
    };

    // ── MessageUpdated ──────────────────────────────────────────────────────
    const handleMessageUpdated = (updatedMessage: Message) => {
      const myId = currentUserIdRef.current;

      const allConvQueries = queryClient.getQueriesData<any>({
        queryKey: ["chat-conversation"],
      });

      for (const [key, oldData] of allConvQueries) {
        if (!oldData) continue;

        const msg: Message = {
          ...updatedMessage,
          isMine: sameId(updatedMessage.senderId, myId),
        };

        queryClient.setQueryData(key, {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            messages: {
              ...page.messages,
              data: page.messages.data.map((m: Message) =>
                m.messageId === updatedMessage.messageId ? msg : m,
              ),
            },
          })),
        });
      }

      queryClient.invalidateQueries({ queryKey: chatKeys.recentChats(myId) });
    };

    // ── Typing ──────────────────────────────────────────────────────────────
    const handleTyping = (senderId: string) => {
      if (sameId(senderId, currentUserIdRef.current)) return;
      onTypingRef.current?.(senderId);
    };

    const handleStopTyping = (senderId: string) => {
      if (sameId(senderId, currentUserIdRef.current)) return;
      onStopTypingRef.current?.(senderId);
    };

    const handleUserOnline = (userId: string) => {
      if (sameId(userId, currentUserIdRef.current)) return;
      onUserOnlineRef.current?.(userId);
    };

    const handleUserOffline = (userId: string) => {
      if (sameId(userId, currentUserIdRef.current)) return;
      onUserOfflineRef.current?.(userId);
    };

    connection.on("ReceiveMessage", handleReceiveMessage);
    connection.on("MessageDeleted", handleMessageDeleted);
    connection.on("MessageUpdated", handleMessageUpdated);
    connection.on("UserTyping", handleTyping);
    connection.on("UserStopTyping", handleStopTyping);
    connection.on("UserOnline", handleUserOnline);
    connection.on("UserOffline", handleUserOffline);
    connection.on("MessagesRead", handleMessagesRead);
    connection.on("ChatUpdated", handleChatUpdated);

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
      connection.off("MessagesRead", handleMessagesRead);
      connection.off("ChatUpdated", handleChatUpdated);
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
