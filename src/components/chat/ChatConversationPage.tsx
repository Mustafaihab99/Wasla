import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiPaperclip,
  FiSend,
  FiUser,
  FiX,
  FiEdit2,
  FiMic,
} from "react-icons/fi";
import {
  useDeleteMessage,
  useEditMessage,
  useGetChatConversation,
  useGetUserProfile,
  useSendMessage,
} from "../../hooks/chat/useChat";
import { useChatHub } from "../../utils/singlr/useChatHub";
import { MessageTypeValue, Message } from "../../types/chat/chat-types";
import { CHAT_ROUTES } from "../../routes/ChatRoutes";
import { MessageType } from "../../utils/enum";
import { useTranslation } from "react-i18next";
import { useAudioRecorder } from "../../hooks/chat/useAudioRecorder";
import { AudioRecorderButton } from "./AudioRecordButton";
import MessageBubble from "./MessageBubble";
import { sameId } from "../../utils/singlr/useChatHub";

export default function ChatConversationPage() {
  const { t } = useTranslation();
  const { receiverId } = useParams<{ receiverId: string }>();
  const navigate = useNavigate();

  const currentUserId = sessionStorage.getItem("user_id") || "";
  const token = localStorage.getItem("auth_token") || "";

  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [editingMsg, setEditingMsg] = useState<{
    id: number;
    text: string;
    existFiles: string[];
  } | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    recording,
    audioBlob,
    audioUrl,
    recordingSeconds,
    start: startRec,
    stop: stopRec,
    clear: clearAudio,
  } = useAudioRecorder();

  const { data: profile } = useGetUserProfile(receiverId || "");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetChatConversation(currentUserId, receiverId || "");

  const { mutate: send, isPending: sending } = useSendMessage(
    currentUserId,
    receiverId || "",
  );
  const { mutate: editMsg } = useEditMessage(currentUserId, receiverId || "");
  const { mutate: delMsg } = useDeleteMessage(currentUserId, receiverId || "");

 const { sendTyping, sendStopTyping } = useChatHub({
  token,
  currentUserId,
  onTyping: (sid) => {
    if (sameId(sid, receiverId)) setIsTyping(true);
  },
  onStopTyping: (sid) => {
    if (sameId(sid, receiverId)) setIsTyping(false);
  },
  onUserOnline: (userId) => {
    if (sameId(userId, receiverId)) setIsOnline(true);
  },
  onUserOffline: (userId) => {
    if (sameId(userId, receiverId)) setIsOnline(false);
  },
});

  const allMessages: Message[] =
  data?.pages?.flatMap((p) => p?.messages?.data ?? []).reverse() ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  const handleTextChange = (val: string) => {
    setText(val);
    if (!receiverId) return;
    sendTyping(receiverId);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(
      () => sendStopTyping(receiverId),
      2000,
    );
  };

  const getType = (): MessageTypeValue => {
    if (audioBlob) return MessageType.audio;
    if (files.length && text) return MessageType.mixed;
    if (files.length) return MessageType.file;
    return MessageType.text;
  };

  const handleSubmit = () => {
    if (!receiverId) return;
    const hasContent = text.trim() || files.length || audioBlob;
    if (!hasContent) return;

    if (editingMsg) {
      editMsg({
        senderId: currentUserId,
        messageId: editingMsg.id,
        messageText: text,
        type: getType(),
        existFiles: editingMsg.existFiles,
        newFiles: files,
      });
      setEditingMsg(null);
    } else {
      send({
        senderId: currentUserId,
        reciverId: receiverId,
        messageText: text.trim() || undefined,
        type: getType(),
        audio: audioBlob
          ? new File([audioBlob], "voice.webm", { type: "audio/webm" })
          : undefined,
        files: files.length ? files : undefined,
      });
    }

    setText("");
    setFiles([]);
    clearAudio();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // show send button only when there's text/files and no audio
  const hasTextOrFiles =
    (text.trim().length > 0 || files.length > 0) && !audioUrl;

  // when recording or audio preview is active, hide text input & attachment
  const isAudioMode = recording || !!audioUrl;

  return (
    <div
      className="flex flex-col h-[100dvh] w-full max-w-full bg-background overflow-hidden"
      onClick={() => setOpenMenuId(null)}>
      {/* ── Header ── */}
      <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-3 border-b border-border shrink-0 bg-background z-20 w-full">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full hover:bg-primary/10 transition flex items-center justify-center text-primary shrink-0 active:scale-95">
          <FiArrowLeft size={19} />
        </button>

        <button
          onClick={() => navigate(CHAT_ROUTES.profile(receiverId || ""))}
          className="flex items-center gap-2 flex-1 min-w-0 text-left">
          {profile?.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.name || ""}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <FiUser size={16} className="text-primary" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate text-foreground">
              {profile?.name || "..."}
            </p>
            {isTyping ? (
              <p className="text-xs text-primary animate-pulse">
                {t("chat.typing")}
              </p>
            ) : isOnline ? (
              <p className="text-xs text-green-500">
                {t("chat.online")}
              </p>
            ) :
            <p className="text-xs text-red-500">
                {t("chat.offline")}
              </p>
            }
          </div>
        </button>
      </div>

      {/* ── Messages list ── */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 flex flex-col gap-1.5 min-h-0 w-full">
        {hasNextPage && (
          <div className="flex justify-center mb-2 w-full">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-xs text-foreground/50 hover:text-primary transition px-4 py-1.5 rounded-full">
              {isFetchingNextPage
                ? t("chat.loading")
                : t("chat.loadOlderMessages")}
            </button>
          </div>
        )}
        
        {allMessages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center select-none opacity-60 w-full">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FiSend size={22} className="text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              {t("chat.noMessagesYet")}
            </h3>
            <p className="text-xs text-foreground/50 mt-1 max-w-[200px]">
              {t("chat.startConversationHint2")}
            </p>
          </div>
        ) : (
          allMessages.map((msg, idx) => (
            <MessageBubble
              key={msg.messageId ?? idx}
              msg={msg}
              isMine={msg.isMine}
              menuOpen={openMenuId === msg.messageId}
              onMenuToggle={(e) => {
                e.stopPropagation();
                setOpenMenuId(
                  openMenuId === msg.messageId ? null : (msg.messageId ?? null),
                );
              }}
              onEdit={() => {
                setEditingMsg({
                  id: msg.messageId!,
                  text: msg.messageText || "",
                  existFiles: msg.files,
                });
                setText(msg.messageText || "");
                setOpenMenuId(null);
              }}
              onDelete={() => {
                delMsg({ messageId: msg.messageId!, senderId: currentUserId });
                setOpenMenuId(null);
              }}
            />
          ))
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Editing banner ── */}
      {editingMsg && (
        <div className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-primary/10 border-t border-primary/20 text-xs text-primary shrink-0 w-full">
          <FiEdit2 size={13} />
          <span className="flex-1 truncate">
            {t("chat.editing")}: {editingMsg.text}
          </span>
          <button
            onClick={() => {
              setEditingMsg(null);
              setText("");
            }}
            className="hover:opacity-70 p-1">
            <FiX size={14} />
          </button>
        </div>
      )}

      {/* ── File preview ── */}
      {files.length > 0 && (
        <div className="flex gap-2 px-2 sm:px-3 py-2 overflow-x-auto border-t border-border shrink-0 w-full">
          {files.map((f, i) => (
            <div key={i} className="relative shrink-0">
              {f.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(f)}
                  alt="file"
                  className="w-14 h-14 rounded-xl object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-xs text-foreground/70 text-center p-1">
                  {f.name.slice(0, 10)}
                </div>
              )}
              <button
                onClick={() => setFiles(files.filter((_, fi) => fi !== i))}
                className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-background rounded-full flex items-center justify-center">
                <FiX size={9} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="shrink-0 w-full border-t border-border bg-background px-2 sm:px-3 py-1">
        <div className="flex items-end gap-1.5 sm:gap-2 w-full max-w-full">
          {/* Attachment button — hidden in audio mode */}
          {!isAudioMode && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-primary/10 flex items-center justify-center shrink-0 text-primary/70">
                <FiPaperclip size={17} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) setFiles(Array.from(e.target.files));
                }}
              />
            </>
          )}

          {/* Text input — hidden in audio mode */}
          {!isAudioMode && (
            <div className="flex-1 min-w-0 bg-primary/10 rounded-2xl px-3 py-1">
              <textarea
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                onKeyDown={handleKey}
                placeholder={t("chat.placeholderMessage")}
                rows={1}
                className="w-full bg-transparent text-sm outline-none resize-none placeholder:text-foreground/40 max-h-24"
                style={{ minHeight: "30px" }}
              />
            </div>
          )}

          {/* Audio recorder — takes full width in audio mode */}
          {isAudioMode && (
            <div className="flex-1 min-w-0">
              <AudioRecorderButton
                recording={recording}
                audioUrl={audioUrl}
                recordingSeconds={recordingSeconds}
                onStart={startRec}
                onStop={stopRec}
                onClear={clearAudio}
                onSend={handleSubmit}
                disabled={sending}
              />
            </div>
          )}

          {/* Send / mic button */}
          <div className="shrink-0">
            {!isAudioMode ? (
              hasTextOrFiles ? (
                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center shadow-sm disabled:opacity-50 active:scale-95 transition-transform">
                  <FiSend size={15} className="text-white" />
                </button>
              ) : (
                <button
                  onClick={startRec}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-primary/10 transition flex items-center justify-center text-primary/70 active:scale-95">
                  <FiMic size={18} />
                </button>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

