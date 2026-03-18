import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiSearch, FiUser, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useGetRecentChats } from "../../hooks/chat/useChat";
import { CHAT_ROUTES } from "../../routes/ChatRoutes";
import { formatChatTime } from "../../utils/chatUtils";
import ChatListSkeleton from "./ChatListSkeleton";
import { useDeleteChat, useMarkasRead } from "../../hooks/chat/useChat";

export default function ChatList() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const currentUserId = sessionStorage.getItem("user_id") || "";
  const myPhoto = sessionStorage.getItem("profilePhoto") || "";
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetRecentChats(currentUserId);
  const chats = data?.data ?? [];
  const filtered = chats.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const { mutate: deleteChat } = useDeleteChat(currentUserId);

  const { mutate: markAsRead } = useMarkasRead(currentUserId);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-border">
        <button
          onClick={() => navigate(CHAT_ROUTES.profile(currentUserId))}
          className="relative">
          {myPhoto ? (
            <img
              src={myPhoto}
              alt="me"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center">
              <FiUser className="text-dried" />
            </div>
          )}
        </button>

        <h1
          className="text-lg font-bold tracking-tight text-primary"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          Wasla
        </h1>

        <button
          onClick={() => navigate(CHAT_ROUTES.newChat)}
          className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 transition flex items-center justify-center">
          <FiEdit size={16} className="text-primary" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-primary/40 transition">
          <FiSearch className="text-dried shrink-0" size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("chat.searchChats")}
            className="bg-transparent text-sm w-full outline-none placeholder:text-dried"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <ChatListSkeleton />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 gap-2 text-dried">
            <FiUser size={28} className="opacity-40" />
            <p className="text-sm">{t("chat.noChats")}</p>
          </div>
        ) : (
          filtered.map((chat) => {
            const isMine = chat.isMine;

            return (
              <div
                key={chat.chatId}
                className="group w-full flex items-center justify-between px-4 py-3 hover:bg-border/40 transition">
                
                {/* Go to conversation */}
                <button
                  onClick={() => {
                    const otherUserId =
                      chat.senderId === currentUserId
                        ? chat.receiverId
                        : chat.senderId;

                    if (!isMine && chat.unreadMessageCount > 0) {
                      markAsRead(chat.chatId);
                    }

                    navigate(CHAT_ROUTES.conversation(otherUserId));
                  }}
                  className="flex items-center gap-3 flex-1 text-left">
                  
                  <div className="relative shrink-0">
                    {chat.profileReceiver ? (
                      <img
                        src={chat.profileReceiver}
                        alt={chat.name || ""}
                        loading="lazy"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-border flex items-center justify-center">
                        <FiUser size={20} className="text-dried" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      
                      {/* ✅ الاسم Bold لو unread */}
                      <span
                        className={`text-sm truncate ${
                          !isMine && chat.unreadMessageCount > 0
                            ? "font-bold text-foreground"
                            : "font-semibold"
                        }`}>
                        {chat.name || t("chat.unknownUser")}
                      </span>

                      {/* ✅ الوقت + badge */}
                      <div className="flex items-center gap-2 ml-2 shrink-0">
                        <span className="text-xs text-dried">
                          {formatChatTime(chat.sentAt)}
                        </span>

                        {!isMine && chat.unreadMessageCount > 0 && (
                          <span className="bg-primary text-white text-[10px] px-2 py-[2px] rounded-full min-w-[18px] text-center">
                            {chat.unreadMessageCount}
                          </span>
                        )}
                      </div>
                    </div>

                    <p
                      className={`text-xs truncate mt-1 ${
                        !isMine && chat.unreadMessageCount > 0
                          ? "text-foreground font-semibold"
                          : "text-dried"
                      }`}>
                      {chat.audio
                        ? `🎤 ${t("chat.voiceMessage")}`
                        : chat.files?.length
                          ? `📎 ${t("chat.file")}`
                          : chat.messageText || ""}
                    </p>
                  </div>
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    deleteChat({ userId: currentUserId, chatId: chat.chatId });
                    navigate("/chat");
                  }}
                  className="opacity-0 group-hover:opacity-100 mx-2 my-2 transition text-red-500 p-1 rounded-full hover:bg-red-50">
                  <FiTrash2 size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}