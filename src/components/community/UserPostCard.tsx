import { useState, useRef, useEffect } from "react";
import {
  FaHeart,
  FaBookmark,
  FaComment,
  FaEllipsisH,
  FaTrash,
} from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { singlePostData } from "../../types/commuinty/community-types";
import { useToggleReaction } from "../../hooks/community/useToggleReaction";
import { useDeletePost } from "../../hooks/community/useDeletePost";
import { ReactionType, ReactionTargetType } from "../../utils/enum";
import { formatDistanceToNow } from "date-fns";
import DeleteConfirmModal from "./Modal/DeleteConfirmModal";
import EditPostModal from "./Modal/EditPostModal";
import { useNavigate } from "react-router-dom";

function OptionsMenu({
  onEdit,
  onDelete,
  isDeleting,
}: {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full p-2 transition">
        <FaEllipsisH className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-50">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition">
            <FaPencil className="w-4 h-4 text-gray-400" />
            {t("common.editPost")}
          </button>

          <div className="h-px bg-border" />

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            disabled={isDeleting}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/10 transition disabled:opacity-50">
            <FaTrash className="w-4 h-4" />
            {t("common.deletePost")}
          </button>
        </div>
      )}
    </div>
  );
}

const hoverMap: Record<string, string> = {
  primary: "hover:text-primary hover:bg-primary/10",
  green: "hover:text-green-500 hover:bg-green-500/10",
  pink: "hover:text-pink-600 hover:bg-pink-600/10",
};

function ActionBtn({
  icon,
  count,
  color,
  active = false,
  activeClass = "",
  onClick,
}: {
  icon: React.ReactNode;
  count?: number | null;
  color: string;
  active?: boolean;
  activeClass?: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 text-sm p-2 -m-2 rounded-full transition ${hoverMap[color]} ${active ? activeClass : ""}`}>
      {icon}
      {count != null && count > 0 && (
        <span className="tabular-nums text-xs">{count}</span>
      )}
    </button>
  );
}

interface Props {
  post: singlePostData;
  currentUserId: string;
  postOwnerId: string;
  userName: string;
  profilePhoto: string;
  onRemove?: (postId: number) => void;
}

export default function UserPostCard({
  post,
  currentUserId,
  postOwnerId,
  userName,
  profilePhoto,
  onRemove,
}: Props) {
  const isOwner = postOwnerId === currentUserId;

  const { mutate: toggleReaction } = useToggleReaction(currentUserId);

  const [isLoved, setIsLoved] = useState(post.isLoved);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [reactCount, setReactCount] = useState(post.numberofReacts);
  const [saveCount, setSaveCount] = useState(post.numberofSaves);
  const [commentCount,] = useState(post.numberofComments);

  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { mutate: doDelete, isPending: isDeleting } = useDeletePost(
    currentUserId,
    postOwnerId,
  );

  const handleReaction = (e: React.MouseEvent, type: number) => {
    e.stopPropagation();

    if (type === ReactionType.love) {
      setIsLoved((p) => !p);
      setReactCount((p) => p + (isLoved ? -1 : 1));
      if (isLoved && onRemove) onRemove(post.postId);
    } else {
      setIsSaved((p) => !p);
      setSaveCount((p) => p + (isSaved ? -1 : 1));
    }

    toggleReaction({
      targetId: post.postId,
      targetType: ReactionTargetType.post,
      reactionType: type,
      userId: currentUserId,
    });
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <>
      <article className="flex gap-3 px-4 py-4 border-b border-border hover:bg-muted/40 transition-colors group">
        <img
          src={profilePhoto}
          alt={userName}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="font-semibold text-foreground truncate">
                {userName}
              </span>
              <span className="text-muted-foreground text-sm">· {timeAgo}</span>
            </div>

            {isOwner && (
              <div className="opacity-0 group-hover:opacity-100 transition">
                <OptionsMenu
                  onEdit={() => setShowEdit(true)}
                  onDelete={() => setShowDelete(true)}
                  isDeleting={isDeleting}
                />
              </div>
            )}
          </div>

          {post.content && (
            <p className="text-foreground text-sm mt-1 whitespace-pre-wrap break-words">
              {post.content}
            </p>
          )}

          {post.files.length > 0 && (
            <div
              className={`mt-3 rounded-2xl overflow-hidden grid gap-1 border border-border ${
                post.files.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}>
              {post.files.slice(0, 4).map((file, idx) => (
                <img
                  key={idx}
                  src={file}
                  onClick={() => setPreviewImage(file)}
                  className="w-full h-40 sm:h-48 object-cover cursor-pointer hover:opacity-90 transition"
                  alt=""
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-3 text-muted-foreground max-w-md">
            <ActionBtn
              icon={<FaComment className="w-[18px] h-[18px]" />}
              color="sky"
              count={commentCount}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/community/post/${post.postId}`, {
                  state: { post },
                });
              }}
            />

            <ActionBtn
              icon={
                <FaHeart
                  className={isLoved ? "text-pink-600 fill-pink-600" : ""}
                />
              }
              count={reactCount}
              color="pink"
              active={isLoved}
              activeClass="text-pink-600"
              onClick={(e) => handleReaction(e, ReactionType.love)}
            />

            <ActionBtn
              icon={
                <FaBookmark
                  className={isSaved ? "text-primary fill-primary" : ""}
                />
              }
              count={saveCount}
              color="primary"
              active={isSaved}
              activeClass="text-primary"
              onClick={(e) => handleReaction(e, ReactionType.save)}
            />
          </div>
        </div>
      </article>

      {/* Image Preview */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4">
          <img
            src={previewImage}
            className="max-h-[90vh] max-w-[95vw] rounded-2xl object-contain"
            alt=""
          />
        </div>
      )}

      {showEdit && (
        <EditPostModal
          postId={post.postId}
          initialContent={post.content}
          initialFiles={post.files}
          currentUserId={currentUserId}
          // profileUserId={postOwnerId}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showDelete && (
        <DeleteConfirmModal
          isDeleting={isDeleting}
          onCancel={() => setShowDelete(false)}
          onConfirm={() =>
            doDelete(post.postId, {
              onSuccess: () => setShowDelete(false),
            })
          }
        />
      )}
    </>
  );
}
