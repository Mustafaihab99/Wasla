import { useState, useRef, useEffect } from "react";
import { 
  FaHeart,      
  FaBookmark,   
  FaComment,    
  FaRetweet,     
  FaShareAlt,    
  FaEllipsisH,    
  FaTrash
} from "react-icons/fa";
import { singlePostData } from "../../types/commuinty/community-types";
import { useToggleReaction } from "../../hooks/community/useToggleReaction";
import { useDeletePost } from "../../hooks/community/useDeletePost";
import { ReactionType, ReactionTargetType } from "../../utils/enum";
import { formatDistanceToNow } from "date-fns";
import DeleteConfirmModal from "./Modal/DeleteConfirmModal";
import EditPostModal from "./Modal/EditPostModal";
import { FaPencil } from "react-icons/fa6";

function OptionsMenu({ onEdit, onDelete, isDeleting }: {
  onEdit: () => void; onDelete: () => void; isDeleting: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button onClick={() => setOpen(p => !p)} className="text-gray-500 hover:text-sky-500 hover:bg-sky-500/10 rounded-full p-1.5 transition">
        <FaEllipsisH className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-black border border-[#2f3336] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden z-50">
          <button onClick={() => { setOpen(false); onEdit(); }} className="w-full flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium text-white hover:bg-white/5 transition">
            <FaPencil className="w-4 h-4 text-gray-400" /> Edit post
          </button>
          <div className="h-px bg-[#2f3336]" />
          <button onClick={() => { setOpen(false); onDelete(); }} disabled={isDeleting} className="w-full flex items-center gap-3 px-4 py-3.5 text-[15px] font-bold text-red-500 hover:bg-red-500/10 transition disabled:opacity-50">
            <FaTrash className="w-4 h-4" /> Delete post
          </button>
        </div>
      )}
    </div>
  );
}

const hoverMap: Record<string, string> = {
  sky: "hover:text-sky-500 hover:bg-sky-500/10",
  green: "hover:text-green-400 hover:bg-green-400/10",
  pink: "hover:text-pink-600 hover:bg-pink-600/10",
};
function ActionBtn({ icon, count, color, active = false, activeClass = "", onClick }: {
  icon: React.ReactNode; count?: number | null; color: string;
  active?: boolean; activeClass?: string; onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 text-[13px] p-1.5 -m-1.5 rounded-full transition ${hoverMap[color]} ${active ? activeClass : ""}`}>
      {icon}
      {count != null && count > 0 && <span className="tabular-nums">{count}</span>}
    </button>
  );
}

interface Props {
  post: singlePostData;
  currentUserId: string;
  postOwnerId: string;
  userName: string;
  profilePhoto: string;
}

export default function UserPostCard({ post, currentUserId, postOwnerId, userName, profilePhoto }: Props) {
  const isOwner = postOwnerId === currentUserId;

  const { mutate: toggleReaction } = useToggleReaction(currentUserId);
  const [isLoved,    setIsLoved]    = useState(post.isLoved);
  const [isSaved,    setIsSaved]    = useState(post.isSaved);
  const [reactCount, setReactCount] = useState(post.numberofReacts);
  const [saveCount,  setSaveCount]  = useState(post.numberofSaves);

  const [showEdit,   setShowEdit]   = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  // Pass postOwnerId so the hook also invalidates userPosts cache
  const { mutate: doDelete, isPending: isDeleting } = useDeletePost(currentUserId, postOwnerId);

  const handleReaction = (e: React.MouseEvent, type: number) => {
    e.stopPropagation();
    if (type === ReactionType.love) { setIsLoved(p => !p); setReactCount(p => p + (isLoved ? -1 : 1)); }
    else                            { setIsSaved(p => !p); setSaveCount(p => p + (isSaved ? -1 : 1)); }
    toggleReaction({ targetId: post.postId, targetType: ReactionTargetType.post, reactionType: type, userId: currentUserId });
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <>
      <article className="flex gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors border-b border-[#2f3336] cursor-pointer group">
        <img src={profilePhoto || "/assets/images/default-avatar.png"} alt={userName} className="w-10 h-10 rounded-full object-cover flex-shrink-0 self-start" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              <span className="text-white font-bold text-[15px] truncate">{userName}</span>
              <span className="text-gray-500 text-[15px] flex-shrink-0">· {timeAgo}</span>
            </div>
            {isOwner && (
              <div className="opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                <OptionsMenu onEdit={() => setShowEdit(true)} onDelete={() => setShowDelete(true)} isDeleting={isDeleting} />
              </div>
            )}
          </div>

          {post.content && <p className="text-white text-[15px] leading-snug mt-0.5 whitespace-pre-wrap break-words">{post.content}</p>}

          {post.files.length > 0 && (
            <div className={`mt-3 rounded-2xl overflow-hidden grid gap-0.5 border border-[#2f3336] ${post.files.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
              {post.files.slice(0, 4).map((file, idx) => (
                <img key={idx} src={file} className="w-full h-48 object-cover" alt="" />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-3 text-gray-500 max-w-[425px]">
            <ActionBtn icon={<FaComment className="w-[18px] h-[18px]" />} color="sky" onClick={(e) => e.stopPropagation()} />
            <ActionBtn icon={<FaRetweet className="w-[18px] h-[18px]" />} color="green" onClick={(e) => e.stopPropagation()} />
            <ActionBtn icon={<FaHeart className={`w-[18px] h-[18px] ${isLoved ? "fill-pink-600 text-pink-600" : ""}`} />} count={reactCount} color="pink" active={isLoved} activeClass="text-pink-600" onClick={(e) => handleReaction(e, ReactionType.love)} />
            <ActionBtn icon={<FaBookmark className={`w-[18px] h-[18px] ${isSaved ? "fill-sky-500 text-sky-500" : ""}`} />} count={saveCount} color="sky" active={isSaved} activeClass="text-sky-500" onClick={(e) => handleReaction(e, ReactionType.save)} />
            <ActionBtn icon={<FaShareAlt className="w-[18px] h-[18px]" />} color="sky" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      </article>

      {showEdit && (
        <EditPostModal
          postId={post.postId}
          initialContent={post.content}
          initialFiles={post.files}
          currentUserId={currentUserId}
          profileUserId={postOwnerId}
          onClose={() => setShowEdit(false)}
        />
      )}
      {showDelete && (
        <DeleteConfirmModal
          isDeleting={isDeleting}
          onCancel={() => setShowDelete(false)}
          onConfirm={() => doDelete(post.postId, { onSuccess: () => setShowDelete(false) })}
        />
      )}
    </>
  );
}