import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import Modal from "react-modal";

Modal.setAppElement("#root");

function OptionsMenu({
  t,
  onEdit,
  onDelete,
  isDeleting,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
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
        className="text-gray-500 hover:text-sky-500 hover:bg-sky-500/10 rounded-full p-1.5 transition">
        <FaEllipsisH className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-black border border-[#2f3336] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden z-50">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium text-white hover:bg-white/5 transition">
            <FaPencil className="w-4 h-4 text-gray-400" />{" "}
            {t("common.editPost")}
          </button>
          <div className="h-px bg-[#2f3336]" />
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            disabled={isDeleting}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-[15px] font-bold text-red-500 hover:bg-red-500/10 transition disabled:opacity-50">
            <FaTrash className="w-4 h-4" /> {t("common.deletePost")}
          </button>
        </div>
      )}
    </div>
  );
}

const hoverMap: Record<string, string> = {
  sky: "hover:text-sky-500 hover:bg-sky-500/10",
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
      className={`flex items-center gap-1.5 text-[13px] p-1.5 -m-1.5 rounded-full transition ${hoverMap[color]} ${active ? activeClass : ""}`}>
      {icon}
      {count != null && count > 0 && (
        <span className="tabular-nums">{count}</span>
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
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isOwner = postOwnerId === currentUserId;

  const { mutate: toggleReaction } = useToggleReaction(currentUserId);
  const [isLoved, setIsLoved] = useState(post.isLoved);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [reactCount, setReactCount] = useState(post.numberofReacts);
  const [saveCount, setSaveCount] = useState(post.numberofSaves);
  const [commentCount] = useState(post.numberofComments);

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { mutate: doDelete, isPending: isDeleting } = useDeletePost(
    currentUserId,
    postOwnerId,
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string>("");

  const handleReaction = (e: React.MouseEvent, type: number) => {
    e.stopPropagation();

    if (type === ReactionType.love) {
      setIsLoved(!isLoved);
      setReactCount(reactCount + (isLoved ? -1 : 1));
    } else if (type === ReactionType.save) {
      setIsSaved(!isSaved);
      setSaveCount(saveCount + (isSaved ? -1 : 1));
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

  const openLightbox = (img: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxImg(img);
    setLightboxOpen(true);
  };

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(
      isOwner ? "/community/profile/me" : `/community/profile/${postOwnerId}`,
    );
  };

  return (
    <>
      <article className="flex gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors border-b border-[#2f3336] cursor-pointer group">
        <button className="flex-shrink-0 self-start" onClick={goToProfile}>
          <img
            src={profilePhoto}
            alt={userName}
            loading="lazy"
            className="w-10 h-10 rounded-full object-cover hover:opacity-90 transition"
          />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              <button
                onClick={goToProfile}
                className="text-foreground font-bold text-[15px] hover:underline truncate">
                {userName}
              </button>
              <span className="text-gray-500 text-[15px] flex-shrink-0">
                · {timeAgo}
              </span>
            </div>
            {isOwner && (
              <div className="opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                <OptionsMenu
                  t={t}
                  onEdit={() => setShowEdit(true)}
                  onDelete={() => setShowDelete(true)}
                  isDeleting={isDeleting}
                />
              </div>
            )}
          </div>

          {post.content && (
            <p className="text-foreground text-[15px] leading-snug mt-0.5 whitespace-pre-wrap break-words">
              {post.content}
            </p>
          )}

          {post.files.length > 0 && (
            <div
              className={`mt-3 rounded-2xl overflow-hidden grid gap-1 border border-[#2f3336] ${
                post.files.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}>
              {post.files.slice(0, 4).map((file, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden cursor-pointer"
                  onClick={(e) => openLightbox(file, e)}>
                  <img
                    src={file}
                    className="w-full object-cover rounded-2xl"
                    style={{ maxHeight: "400px" }}
                    alt="post image"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mt-3 text-gray-500">
            <ActionBtn
              icon={<FaComment className="w-[18px] h-[18px]" />}
              color="sky"
              count={commentCount}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/community/post/${post.postId}`, {
                  state: {
                    post: {
                      ...post,
                      userId: postOwnerId,
                      userName,
                      profilePhoto,
                    },
                  },
                });
              }}
            />
            <ActionBtn
              icon={
                <FaHeart
                  className={`w-[18px] h-[18px] ${isLoved ? "fill-pink-600 text-pink-600" : ""}`}
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
                  className={`w-[18px] h-[18px] ${isSaved ? "fill-sky-500 text-sky-500" : ""}`}
                />
              }
              count={saveCount}
              color="sky"
              active={isSaved}
              activeClass="text-sky-500"
              onClick={(e) => handleReaction(e, ReactionType.save)}
            />
          </div>
        </div>
      </article>

      {/* Image Preview */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4">
          <img
            src={lightboxImg}
            className="max-h-[90vh] max-w-[95vw] rounded-2xl object-contain"
            alt="light box"
            loading="lazy"
          />
        </div>
      )}

      {showEdit && (
        <EditPostModal
          postId={post.postId}
          initialContent={post.content}
          initialFiles={post.files}
          currentUserId={currentUserId}
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