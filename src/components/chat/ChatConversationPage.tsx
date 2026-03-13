import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiMic,
  FiMoreVertical,
  FiPaperclip,
  FiSend,
  FiTrash2,
  FiUser,
  FiX,
  FiEdit2,
  FiSquare,
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
import { formatChatTime } from "../../utils/chatUtils";
import { MessageType } from "../../utils/enum";
import { useTranslation } from "react-i18next";

function useAudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setRecording(true);
    } catch {
      console.error("Microphone access denied");
    }
  }, []);

  const stop = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }, []);

  const clear = useCallback(() => {
    setAudioBlob(null);
    setAudioUrl(null);
  }, []);

  return { recording, audioBlob, audioUrl, start, stop, clear };
}

export default function ChatConversationPage() {
  const { t } = useTranslation();
  const { receiverId } = useParams<{ receiverId: string }>();
  const navigate = useNavigate();

  const currentUserId = sessionStorage.getItem("user_id") || "";
  const token = localStorage.getItem("auth_token") || "";

  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [editingMsg, setEditingMsg] = useState<{
    id: number;
    text: string;
    existFiles: string[];
  } | null>(null);
  const [menuMsgId, setMenuMsgId] = useState<number | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    recording,
    audioBlob,
    audioUrl,
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

  // ── SignalR ────────────────────────────────────────────────────────────────
  const { sendTyping, sendStopTyping } = useChatHub({
    token,
    currentUserId,
    onTyping: (sid) => {
      if (sid === receiverId) setIsTyping(true);
    },
    onStopTyping: (sid) => {
      if (sid === receiverId) setIsTyping(false);
    },
  });

const allMessages: Message[] =
  data?.pages?.flatMap((p) => p?.messages?.data ?? []) ?? [];

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

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  return (
    <div
      className="flex flex-col h-full bg-background"
      onClick={() => setMenuMsgId(null)}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0 bg-background sticky top-0 z-20">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full hover:bg-primary/10 transition flex items-center justify-center text-primary">
          <FiArrowLeft size={20} />
        </button>

        <button
          onClick={() => navigate(CHAT_ROUTES.profile(receiverId || ""))}
          className="flex items-center gap-3 flex-1 min-w-0">
          {profile?.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.name || ""}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <FiUser size={18} className="text-primary" />
            </div>
          )}
          <div className="text-left min-w-0">
            <p className="text-sm font-semibold truncate text-foreground">
              {profile?.name || "..."}
            </p>
            {isTyping && (
              <p className="text-xs text-primary animate-pulse">
                {t("chat.typing")}
              </p>
            )}
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {/* Load more */}
        {hasNextPage && (
          <div className="flex justify-center mb-2">
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
          <div className="flex flex-1 flex-col items-center justify-center text-center select-none opacity-70">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <FiSend size={28} className="text-primary" />
            </div>

            <h3 className="text-sm font-semibold text-foreground">
              {t("chat.noMessagesYet")}
            </h3>

            <p className="text-xs text-foreground/50 mt-1 max-w-[240px]">
              {t("chat.startConversationHint2")}
            </p>
          </div>
        ) : (
          allMessages.map((msg, idx) => {
            return (
              <MessageBubble
                key={msg.messageId ?? idx}
                msg={msg}
                isMine={msg.isMine}
                menuOpen={menuMsgId === msg.messageId}
                onMenuToggle={(e) => {
                  e.stopPropagation();
                  setMenuMsgId(
                    menuMsgId === msg.messageId ? null : msg.messageId!,
                  );
                }}
                onEdit={() => {
                  setEditingMsg({
                    id: msg.messageId!, // ← messageId الحقيقي
                    text: msg.messageText || "",
                    existFiles: msg.files,
                  });
                  setText(msg.messageText || "");
                  setMenuMsgId(null);
                }}
                onDelete={() => {
                  delMsg({
                    messageId: msg.messageId!,
                    senderId: currentUserId,
                  });
                  setMenuMsgId(null);
                }}
              />
            );
          })
        )}

        <div ref={bottomRef} />
      </div>

      {editingMsg && (
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-t border-primary/20 text-xs text-primary shrink-0">
          <FiEdit2 size={13} />
          <span className="flex-1 truncate">
            {t("chat.editing")}: {editingMsg.text}
          </span>
          <button
            onClick={() => {
              setEditingMsg(null);
              setText("");
            }}
            className="hover:opacity-70">
            <FiX size={14} />
          </button>
        </div>
      )}

      {/* ── Audio preview ─────────────────────────────────────────────────────── */}
      {audioUrl && !recording && (
        <div className="flex items-center gap-2 px-4 py-2 bg-background border-t border-border shrink-0">
          <audio src={audioUrl} controls className="h-8 flex-1" />
          <button
            onClick={clearAudio}
            className="text-foreground/50 hover:text-foreground transition">
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* ── File preview ──────────────────────────────────────────────────────── */}
      {files.length > 0 && (
        <div className="flex gap-2 px-4 py-2 overflow-x-auto border-t border-border shrink-0">
          {files.map((f, i) => (
            <div key={i} className="relative shrink-0">
              {f.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(f)}
                  alt="send file"
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

      {/* ── Input bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-end gap-2 px-4 py-3 border-t border-border shrink-0 bg-background">
        {/* File attach */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 rounded-full hover:bg-primary/10 transition flex items-center justify-center shrink-0 text-primary/70">
          <FiPaperclip size={18} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          className="hidden"
          onChange={handleFilePick}
        />

        {/* Text area */}
        <div className="flex-1 bg-primary/10 rounded-2xl px-4 py-2.5 min-h-[42px] flex items-end">
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder={t("chat.placeholderMessage")}
            rows={1}
            className="w-full bg-transparent text-sm outline-none resize-none placeholder:text-foreground/40 max-h-32 leading-snug"
            style={{
              overflowY: text.split("\n").length > 4 ? "auto" : "hidden",
            }}
          />
        </div>

        {/* Mic / Send */}
        {text.trim() || files.length || audioUrl ? (
          <button
            onClick={handleSubmit}
            disabled={sending}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 hover:opacity-85 transition disabled:opacity-50">
            <FiSend size={16} className="text-white ml-0.5" />
          </button>
        ) : recording ? (
          <button
            onClick={stopRec}
            className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0 animate-pulse">
            <FiSquare size={14} className="text-white" />
          </button>
        ) : (
          <button
            onClick={startRec}
            className="w-10 h-10 rounded-full hover:bg-primary/10 transition flex items-center justify-center shrink-0 text-primary/70">
            <FiMic size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

interface BubbleProps {
  msg: Message;
  isMine: boolean;
  menuOpen: boolean;
  onMenuToggle: (e: React.MouseEvent) => void;
  onEdit: () => void;
  onDelete: () => void;
}

function MessageBubble({
  msg,
  isMine,
  menuOpen,
  onMenuToggle,
  onEdit,
  onDelete,
}: BubbleProps) {
  const { t } = useTranslation();
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} group`}>
      <div className="relative max-w-[75%]">
        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed
            ${
              isMine
                ? "bg-primary text-white rounded-br-sm"
                : "bg-background text-foreground border border-border rounded-bl-sm"
            }`}>
          {/* Audio */}
          {msg.audio && (
            <audio src={msg.audio} controls className="h-8 max-w-[180px]" />
          )}

          {/* Files */}
          {msg.files?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-1">
              {msg.files.map((f, i) =>
                /\.(jpg|jpeg|png|gif|webp)$/i.test(f) ? (
                  <img
                    key={i}
                    src={f}
                    alt="send file"
                    className="max-w-[180px] rounded-xl object-cover"
                  />
                ) : (
                  <a
                    key={i}
                    href={f}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline opacity-80">
                    📎 {f}
                  </a>
                ),
              )}
            </div>
          )}

          {/* Text */}
          {msg.messageText && (
            <p className="whitespace-pre-wrap">{msg.messageText}</p>
          )}

          {/* Meta */}
          <div
            className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
            <span
              className={`text-[10px] ${isMine ? "text-white/60" : "text-foreground/40"}`}>
              {formatChatTime(msg.sentAt)}
            </span>
            {msg.isEdited  && (
              <span
                className={`text-[10px] ${isMine ? "text-white/50" : "text-foreground/30"}`}>
                · {t("chat.edited")}
              </span>
            )}
            {msg.readAt && isMine && (
              <span className="text-[10px] text-white/60">✓✓</span>
            )}
          </div>
        </div>

        {/* Context menu trigger */}
        {isMine && (
          <button
            onClick={onMenuToggle}
            className="absolute -left-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition w-6 h-6 rounded-full hover:bg-primary/10 flex items-center justify-center">
            <FiMoreVertical size={13} className="text-foreground/50" />
          </button>
        )}

        {/* Dropdown menu */}
        {menuOpen && isMine && (
          <div className="absolute right-0 top-full mt-1 z-10 bg-background border border-border rounded-xl shadow-lg overflow-hidden min-w-[120px]">
            {
              msg.type !== MessageType.audio && msg.type !== MessageType.file && (
            <button
              onClick={onEdit}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-primary/10 transition">
              <FiEdit2 size={12} /> {t("chat.edit")}
            </button>
            )
           }
            <button
              onClick={onDelete}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
              <FiTrash2 size={12} /> {t("chat.delete")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
