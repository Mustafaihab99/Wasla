/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  MutableRefObject,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as signalR from "@microsoft/signalr";
import { chatKeys } from "../../hooks/chat/useChat";
import { Message } from "../../types/chat/chat-types";

const CHAT_HUB_URL = "https://waslammka.runasp.net/chatHub";

// eslint-disable-next-line react-refresh/only-export-components
export const sameId = (a?: string, b?: string) =>
  !!a && !!b && a.toLowerCase() === b.toLowerCase();

function normalizeMessage(raw: any): Message {
  return { ...raw, messageId: raw.messageId ?? raw.id, files: raw.files ?? [] };
}

interface ChatHubContextValue {
  connectionRef: MutableRefObject<signalR.HubConnection | null>;
  sendTyping: (toReceiverId: string) => void;
  sendStopTyping: (toReceiverId: string) => void;
  registerHandlers: (handlers: ChatEventHandlers) => () => void;
  activeChatUserIdRef: MutableRefObject<string | undefined>;
}

export interface ChatEventHandlers {
  onTyping?: (senderId: string) => void;
  onStopTyping?: (senderId: string) => void;
  onNewMessage?: (message: Message) => void;
  onUserOnline?: (userId: string) => void;
  onUserOffline?: (data: { userId: string; lastSeen: string }) => void;
}

const ChatHubContext = createContext<ChatHubContextValue | undefined>(
  undefined,
);

interface ChatHubProviderProps {
  token: string;
  currentUserId: string;
  children: ReactNode;
}

export function ChatHubProvider({
  token,
  currentUserId,
  children,
}: ChatHubProviderProps) {
  const queryClient = useQueryClient();
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const currentUserIdRef = useRef(currentUserId);
  const activeChatUserIdRef = useRef<string | undefined>(undefined);

  // مجموعة الـ handlers المسجلة من الـ components
  const handlersSetRef = useRef<Set<ChatEventHandlers>>(new Set());

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    if (!token || !currentUserId) return;
    if (connectionRef.current) return; // connection موجودة بالفعل

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(CHAT_HUB_URL, { accessTokenFactory: () => token })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    // ── ReceiveMessage ────────────────────────────────────────────────────
    const handleReceiveMessage = (raw: any) => {
      const message = normalizeMessage(raw);
      const myId = currentUserIdRef.current;
      const otherId = sameId(message.senderId, myId)
        ? message.receiverId
        : message.senderId;
      if (!otherId) return;

      const msg: Message = {
        ...message,
        isMine: sameId(message.senderId, myId),
      };

      // تجنب التكرار
      const convKey = chatKeys.conversation(myId, otherId);
      const existingConv = queryClient.getQueryData<any>(convKey);
      if (existingConv) {
        const exists = existingConv.pages.some((page: any) =>
          page.messages.data.some(
            (m: Message) => m.messageId === msg.messageId,
          ),
        );
        if (exists) return;
      }

      // تحديث الـ cache
      const allConvQueries = queryClient.getQueriesData<any>({
        queryKey: ["chat-conversation"],
      });
      const matchedEntry = allConvQueries.find(([key]) => {
        const k = key as string[];
        return k.length === 3 && sameId(k[1], myId) && sameId(k[2], otherId);
      });

      if (matchedEntry) {
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
                      data: [msg, ...page.messages.data],
                      totalCount: page.messages.totalCount + 1,
                    },
                  }
                : page,
            ),
          };
        });
      } else {
        queryClient.setQueryData(["chat-conversation", myId, otherId], {
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
        });
      }

      // تحديث الـ recent chats
      queryClient.setQueryData(chatKeys.recentChats(myId), (oldData: any) => {
        if (!oldData) return oldData;
        const arr: any[] = Array.isArray(oldData)
          ? oldData
          : (oldData?.data ?? []);
        const existingIndex = arr.findIndex((chat: any) =>
          sameId(chat.userId, otherId),
        );
        const updated = [...arr];
        const currentUnread =
          existingIndex >= 0
            ? (updated[existingIndex]?.unreadMessageCount ?? 0)
            : 0;
        const isActiveChat = sameId(otherId, activeChatUserIdRef.current);
        const newRecent = {
          userId: otherId,
          lastMessage:
            msg.messageText || (msg.audio ? "🎤 Voice message" : "📎 File"),
          lastMessageTime: msg.sentAt,
          unreadMessageCount:
            !msg.isMine && !isActiveChat ? currentUnread + 1 : 0,
        };
        if (existingIndex >= 0) {
          updated[existingIndex] = { ...updated[existingIndex], ...newRecent };
          return Array.isArray(oldData)
            ? updated
            : { ...oldData, data: updated };
        }
        return Array.isArray(oldData)
          ? [newRecent, ...updated]
          : { ...oldData, data: [newRecent, ...updated] };
      });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: chatKeys.recentChats(myId) });
      }, 1500);

      // إبلاغ الـ components المشتركة
      handlersSetRef.current.forEach((h) => h.onNewMessage?.(message));
    };

    // ── MessageDeleted ────────────────────────────────────────────────────
    const handleMessageDeleted = (messageId: number) => {
      const myId = currentUserIdRef.current;
      const allConvQueries = queryClient.getQueriesData<any>({
        queryKey: ["chat-conversation"],
      });

      for (const [key, oldData] of allConvQueries) {
        if (!oldData) continue;
        const keyArr = key as string[];
        const senderId = keyArr[1];
        const receiverId = keyArr[2];

        let newLastMessage: Message | undefined;
        for (const page of oldData.pages) {
          const index = page.messages.data.findIndex(
            (m: Message) => m.messageId === messageId,
          );
          if (index !== -1) {
            if (index > 0) newLastMessage = page.messages.data[index - 1];
            break;
          }
        }

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

        if (newLastMessage) {
          const otherId = sameId(senderId, myId) ? receiverId : senderId;
          queryClient.setQueryData(
            chatKeys.recentChats(myId),
            (oldData: any) => {
              if (!oldData) return oldData;
              const arr: any[] = Array.isArray(oldData)
                ? oldData
                : (oldData?.data ?? []);
              const existingIndex = arr.findIndex((chat: any) =>
                sameId(chat.userId, otherId),
              );
              if (existingIndex >= 0) {
                const updated = [...arr];
                updated[existingIndex] = {
                  ...updated[existingIndex],
                  lastMessage:
                    newLastMessage!.messageText ||
                    (newLastMessage!.audio ? "🎤 Voice message" : "📎 File"),
                  lastMessageTime: newLastMessage!.sentAt,
                };
                return Array.isArray(oldData)
                  ? updated
                  : { ...oldData, data: updated };
              }
              return oldData;
            },
          );
        }
      }
      queryClient.invalidateQueries({
        queryKey: chatKeys.recentChats(currentUserIdRef.current),
      });
    };

    // ── MessagesRead ──────────────────────────────────────────────────────
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

    // ── MessageUpdated ────────────────────────────────────────────────────
    const handleMessageUpdated = (raw: any) => {
      const updatedMessage = normalizeMessage(raw);
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

      const otherId = sameId(updatedMessage.senderId, myId)
        ? updatedMessage.receiverId
        : updatedMessage.senderId;
      if (otherId) {
        queryClient.setQueryData(chatKeys.recentChats(myId), (oldData: any) => {
          if (!oldData) return oldData;
          const arr: any[] = Array.isArray(oldData)
            ? oldData
            : (oldData?.data ?? []);
          const existingIndex = arr.findIndex((chat: any) =>
            sameId(chat.userId, otherId),
          );
          if (existingIndex >= 0) {
            const updated = [...arr];
            updated[existingIndex] = {
              ...updated[existingIndex],
              lastMessage:
                updatedMessage.messageText ||
                (updatedMessage.audio ? "🎤 Voice message" : "📎 File"),
              lastMessageTime: updatedMessage.sentAt,
            };
            return Array.isArray(oldData)
              ? updated
              : { ...oldData, data: updated };
          }
          return oldData;
        });
      }
      queryClient.invalidateQueries({ queryKey: chatKeys.recentChats(myId) });
    };

    // ── ChatUpdated ───────────────────────────────────────────────────────
    const handleChatUpdated = ({ chatId }: { chatId: number }) => {
      console.log("ChatUpdated:", chatId);
      queryClient.invalidateQueries({
        queryKey: chatKeys.recentChats(currentUserIdRef.current),
      });
    };

    // ── Typing / Online ───────────────────────────────────────────────────
    connection.on("ReceiveMessage", handleReceiveMessage);
    connection.on("MessageDeleted", handleMessageDeleted);
    connection.on("MessageUpdated", handleMessageUpdated);
    connection.on("MessagesRead", handleMessagesRead);
    connection.on("ChatUpdated", handleChatUpdated);

    connection.on("UserTyping", (data: { senderId: string }) => {
      if (sameId(data.senderId, currentUserIdRef.current)) return;
      handlersSetRef.current.forEach((h) => h.onTyping?.(data.senderId));
    });

    connection.on("UserStopTyping", (data: { senderId: string }) => {
      if (sameId(data.senderId, currentUserIdRef.current)) return;
      handlersSetRef.current.forEach((h) => h.onStopTyping?.(data.senderId));
    });

    connection.on("UserOnline", (data: { userId: string }) => {
      if (sameId(data.userId, currentUserIdRef.current)) return;
      handlersSetRef.current.forEach((h) => h.onUserOnline?.(data.userId));
    });

    connection.on(
      "UserOffline",
      (data: { userId: string; lastSeen: string }) => {
        if (sameId(data.userId, currentUserIdRef.current)) return;

        handlersSetRef.current.forEach((h) => h.onUserOffline?.(data));
      },
    );

    connection
      .start()
      .then(() => console.log("✅ SignalR ChatHub connected"))
      .catch((err) => console.error("❌ SignalR connection failed:", err));

    return () => {
      connection.stop();
      connectionRef.current = null;
    };
  }, [token, currentUserId, queryClient]);

  // registerHandlers: component بيسجل handlers وبتترجع unregister function
  const registerHandlers = useCallback((handlers: ChatEventHandlers) => {
    handlersSetRef.current.add(handlers);
    return () => {
      handlersSetRef.current.delete(handlers);
    };
  }, []);

  const sendTyping = useCallback((toReceiverId: string) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      connectionRef.current.invoke("Typing", toReceiverId).catch(console.error);
    }
  }, []);

  const sendStopTyping = useCallback((toReceiverId: string) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      connectionRef.current
        .invoke("StopTyping", toReceiverId)
        .catch(console.error);
    }
  }, []);

  return (
    <ChatHubContext.Provider
      value={{
        connectionRef,
        sendTyping,
        sendStopTyping,
        registerHandlers,
        activeChatUserIdRef,
      }}>
      {children}
    </ChatHubContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChatHubConnection() {
  const ctx = useContext(ChatHubContext);
  if (!ctx)
    throw new Error("useChatHubConnection must be used within ChatHubProvider");
  return ctx;
}
