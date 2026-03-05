import { useState, useRef, useEffect } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaEllipsisH,
  FaPen,
  FaTrash,
  FaImage,
  FaTimes,
} from "react-icons/fa";
import { singleCommentData } from "../../../types/commuinty/community-types";
import { useDeleteComment } from "../../../hooks/community/useDeleteComment";
import { useEditComment } from "../../../hooks/community/useEditComment";
import { useToggleReaction } from "../../../hooks/community/useToggleReaction";
import { ReactionType, ReactionTargetType } from "../../../utils/enum";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";

interface Props {
  comment: singleCommentData;
  postId: number;
  currentUserId: string;
}

function InlineEdit({
  initial,
  initialFile,
  onSave,
  onCancel,
  isSaving,
}: {
  initial: string;
  initialFile: string | null;
  onSave: (content: string, file?: File) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [value, setValue] = useState(initial);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [keepExisting, setKeepExisting] = useState(!!initialFile);
  const {t} = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setNewFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
    if (f) setKeepExisting(false);
  };

  const removeImage = () => {
    setNewFile(null);
    setPreview(null);
    setKeepExisting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const displayPreview = preview
    ? preview
    : keepExisting && initialFile
    ? initialFile
    : null;

  return (
    <div className="mt-2 flex flex-col gap-3">
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        className="w-full bg-[#16181c] text-white text-[15px] rounded-2xl px-4 py-3 resize-none outline-none border border-[#2f3336] focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
      />

      {/* Image Preview */}
      {displayPreview && (
        <div className="relative w-fit">
          <img
            src={displayPreview}
            alt="preview"
            className="h-24 rounded-2xl object-cover border border-[#2f3336]"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-black border border-[#2f3336] text-white rounded-full p-1 hover:bg-red-500/20 transition"
          >
            <FaTimes className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-sky-500 hover:bg-sky-500/10 rounded-full p-2 transition"
          title={t("comments.changeImage")}
        >
          <FaImage className="w-4 h-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 text-sm text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition"
          >
            {t("comments.cancel")}
          </button>

          <button
            onClick={() => onSave(value.trim(), newFile ?? undefined)}
            disabled={!value.trim() || isSaving}
            className="px-5 py-1.5 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 rounded-full disabled:opacity-40 transition"
          >
            {isSaving ? t("comments.saving") : t("comments.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionsMenu({
  onEdit,
  onDelete,
  isDeleting,
}: {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const {t} = useTranslation();
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="text-gray-500 hover:text-white hover:bg-white/5 rounded-full p-2 transition"
      >
        <FaEllipsisH className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#16181c] border border-[#2f3336] rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/5 transition"
          >
            <FaPen className="w-3.5 h-3.5 text-sky-500" />
            {t("comments.editReply")}
          </button>

          <div className="h-px bg-[#2f3336]" />

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            disabled={isDeleting}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/10 transition disabled:opacity-50"
          >
            <FaTrash className="w-3.5 h-3.5" />
            {t("comments.deleteReply")}
          </button>
        </div>
      )}
    </div>
  );
}

export default function CommentCard({
  comment,
  postId,
  currentUserId,
}: Props) {
  const isOwner = comment.userId === currentUserId;

  const [isEditing, setIsEditing] = useState(false);
  const [isLoved, setIsLoved] = useState(comment.isLove);
  const [likeCount, setLikeCount] = useState(comment.numberOfLikes);

  const { mutate: doDelete, isPending: isDeleting } =
    useDeleteComment(postId);
  const { mutate: doEdit, isPending: isSaving } =
    useEditComment(postId);
  const { mutate: doLike } =
    useToggleReaction(currentUserId);

  const handleLike = () => {
    setIsLoved((p) => !p);
    setLikeCount((p) => p + (isLoved ? -1 : 1));

    doLike({
      targetId: comment.commentId,
      targetType: ReactionTargetType.comment,
      reactionType: ReactionType.love,
      userId: currentUserId,
    });
  };

  const handleSaveEdit = (content: string, file?: File) => {
    doEdit(
      { commentId: comment.commentId, content, file },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const timeAgo = formatDistanceToNow(
    new Date(comment.createdAt),
    { addSuffix: true }
  );

  return (
    <div className="flex gap-3 px-4 py-4 hover:bg-white/[0.02] transition border-b border-dried group">

      {/* Avatar */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <img
          src={comment.userProfile}
          alt={comment.userName}
          className="w-10 h-10 rounded-full object-cover ring-1 ring-[#2f3336]"
        />
        <div className="w-px flex-1 bg-primary min-h-[10px]" />
      </div>

      <div className="flex-1 min-w-0">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-foreground font-semibold text-[15px]">
              {comment.userName}
            </span>
            <span className="text-dried text-xs">
              · {timeAgo}
            </span>
          </div>

          {isOwner && (
            <div className="opacity-0 group-hover:opacity-100 transition">
              <OptionsMenu
                onEdit={() => setIsEditing(true)}
                onDelete={() => doDelete(comment.commentId)}
                isDeleting={isDeleting}
              />
            </div>
          )}
        </div>

        {/* Content */}
        {isEditing ? (
          <InlineEdit
            initial={comment.content}
            initialFile={comment.file ?? null}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditing(false)}
            isSaving={isSaving}
          />
        ) : (
          <>
            <p className="text-foreground text-[15px] leading-relaxed mt-1 whitespace-pre-wrap break-words">
              {comment.content}
            </p>

            {comment.file && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-[#2f3336] max-w-sm">
                <img
                  src={comment.file}
                  alt="Files"
                  className="w-full object-cover max-h-60 hover:scale-[1.02] transition"
                />
              </div>
            )}
          </>
        )}

        {/* Like */}
        {!isEditing && (
          <div className="mt-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 text-sm px-2 py-1 rounded-full transition ${
                isLoved
                  ? "text-pink-500"
                  : "text-gray-500 hover:text-pink-500"
              } hover:bg-pink-500/10`}
            >
              {isLoved ? (
                <FaHeart className="w-4 h-4" />
              ) : (
                <FaRegHeart className="w-4 h-4" />
              )}

              {likeCount > 0 && (
                <span className="tabular-nums">
                  {likeCount}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}