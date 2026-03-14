import {
  FiMoreVertical,
  FiTrash2,
  FiEdit2,
} from "react-icons/fi";
import {  Message } from "../../types/chat/chat-types";
import { formatChatTime } from "../../utils/chatUtils";
import { MessageType } from "../../utils/enum";
import { useTranslation } from "react-i18next";
import {  WavePreview } from "./AudioRecordButton";
import { useState } from "react";
import Modal from "react-modal";

interface BubbleProps {
  msg: Message;
  isMine: boolean;
  menuOpen: boolean;
  onMenuToggle: (e: React.MouseEvent) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MessageBubble({
  msg,
  isMine,
  menuOpen,
  onMenuToggle,
  onEdit,
  onDelete,
}: BubbleProps) {
  const { t } = useTranslation();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImg, setLightboxImg] = useState<string>("");
  
  const openLightbox = (img: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxImg(img);
    setLightboxOpen(true);
  };

  return (
    <>
    <div
      className={`flex ${isMine ? "justify-end" : "justify-start"} group w-full px-1`}>
      <div
        className={`relative ${isMine ? "max-w-[85%] sm:max-w-[70%]" : "max-w-[85%] sm:max-w-[70%]"}`}>
        <div
          className={`rounded-2xl px-3 sm:px-4 py-2.5 text-sm leading-relaxed break-words
            ${
              isMine
                ? "bg-primary text-white rounded-br-sm"
                : "bg-background text-foreground border border-border rounded-bl-sm"
            }`}>
          {/* Audio */}
          {msg.audio && (
            <div className="w-full max-w-[180px] sm:max-w-[220px]">
              <WavePreview
                audioUrl={msg.audio}
                isMine={isMine}
                showActions={false}
              />
            </div>
          )}

          {/* Files */}
          {msg.files?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-1 w-full">
              {msg.files.map((f, i) =>
                /\.(jpg|jpeg|png|gif|webp)$/i.test(f) ? (
                  <img
                    key={i}
                    src={f}
                    alt="Sended image"
                    loading="lazy"
                    className="max-w-[120px] sm:max-w-[160px] rounded-xl object-cover"
                    onClick={(e) => openLightbox(f, e)}
                  />
                ) : (
                  <a
                    key={i}
                    href={f}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline opacity-80 break-all">
                    📎 {f.split("/").pop() || f}
                  </a>
                ),
              )}
            </div>
          )}

          {/* Text */}
          {msg.messageText && (
            <p className="whitespace-pre-wrap break-words overflow-hidden">
              {msg.messageText}
            </p>
          )}

          {/* Meta */}
          <div
            className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"} flex-wrap`}>
            <span
              className={`text-[10px] whitespace-nowrap ${isMine ? "text-white/60" : "text-foreground/40"}`}>
              {formatChatTime(msg.sentAt)}
            </span>
            {msg.isEdited && (
              <span
                className={`text-[10px] whitespace-nowrap ${isMine ? "text-white/50" : "text-foreground/30"}`}>
                · {t("chat.edited")}
              </span>
            )}
            {msg.readAt && isMine && (
              <span className="text-[10px] text-white/60 whitespace-nowrap">
                ✓✓
              </span>
            )}
          </div>
        </div>

        {/* Menu trigger */}
        {isMine && (
          <button
            onClick={onMenuToggle}
            className={`
              absolute left-0 -translate-x-full top-1/2 -translate-y-1/2
              w-8 h-8 rounded-full hover:bg-border
              flex items-center justify-center transition-opacity z-10
              ${menuOpen ? "opacity-100" : "opacity-0 md:group-hover:opacity-70"}
            `}>
            <FiMoreVertical size={14} className="text-foreground/60" />
          </button>
        )}

        {/* Dropdown */}
        {menuOpen && isMine && (
          <div
            className="absolute right-0 top-full mt-1 z-30 bg-background border border-border rounded-xl shadow-lg overflow-hidden min-w-[130px]"
            onClick={(e) => e.stopPropagation()}>
            {msg.type !== MessageType.audio &&
              msg.type !== MessageType.file && (
                <button
                  onClick={onEdit}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-primary/10 transition">
                  <FiEdit2 size={13} /> {t("chat.edit")}
                </button>
              )}
            <button
              onClick={onDelete}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
              <FiTrash2 size={13} /> {t("chat.delete")}
            </button>
          </div>
        )}
      </div>
    </div>
    
          <Modal
            isOpen={lightboxOpen}
            onRequestClose={() => setLightboxOpen(false)}
            contentLabel="Image preview"
            className="max-w-3xl mx-auto mt-20 bg-black rounded-xl overflow-hidden outline-none"
            overlayClassName="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4">
            <img
              src={lightboxImg}
              alt="preview"
              className="w-full h-[80vh] object-contain rounded-xl"
            />
          </Modal>
          </>
  );
}