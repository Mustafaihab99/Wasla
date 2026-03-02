import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaHeart,      
  FaBookmark,   
  FaComment,    
  FaRetweet,     
  FaShareAlt,    
  FaEllipsisH    
} from "react-icons/fa";
import { mainPostData } from "../../types/commuinty/community-types";
import { useToggleReaction } from "../../hooks/community/useToggleReaction";
import { ReactionType, ReactionTargetType } from "../../utils/enum";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: mainPostData;
  currentUserId: string;
}

const hoverMap: Record<string, string> = {
  sky: "hover:text-sky-500 hover:bg-sky-500/10",
  green: "hover:text-green-400 hover:bg-green-400/10",
  pink: "hover:text-pink-600 hover:bg-pink-600/10",
};

interface ActionBtnProps {
  icon: React.ReactNode;
  count?: number | null;
  hoverColor: string;
  active?: boolean;
  activeColor?: string;
  onClick: (e: React.MouseEvent) => void;
}

function ActionBtn({ icon, count, hoverColor, active, activeColor = "", onClick }: ActionBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 text-[13px] p-1.5 -m-1.5 rounded-full transition ${hoverMap[hoverColor] ?? ""} ${active ? activeColor : ""}`}
    >
      {icon}
      {count != null && count > 0 && <span className="tabular-nums">{count}</span>}
    </button>
  );
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const navigate = useNavigate();
  const { mutate: toggleReactionMutate } = useToggleReaction(currentUserId);

  const [isLoved, setIsLoved] = useState(post.isLoved);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [reactCount, setReactCount] = useState(post.numberofReacts);
  const [saveCount, setSaveCount] = useState(post.numberofSaves);

  const handleReaction = (e: React.MouseEvent, type: number) => {
    e.stopPropagation();
    if (type === ReactionType.love) {
      setIsLoved((p) => !p);
      setReactCount((p) => p + (isLoved ? -1 : 1));
    } else {
      setIsSaved((p) => !p);
      setSaveCount((p) => p + (isSaved ? -1 : 1));
    }
    toggleReactionMutate({
      targetId: post.postId,
      targetType: ReactionTargetType.post,
      reactionType: type,
      userId: currentUserId,
    });
  };

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If it's the current user's own post → /community/profile/me
    const profilePath =
      post.userId === currentUserId
        ? "/community/profile/me"
        : `/community/profile/${post.userId}`;
    navigate(profilePath);
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <article className="flex gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors border-b border-[#2f3336] cursor-pointer group">
      {/* Avatar → navigates to profile */}
      <button className="flex-shrink-0 self-start" onClick={goToProfile}>
        <img
          src={post.profilePhoto || "/assets/images/default-avatar.png"}
          alt={post.userName}
          className="w-10 h-10 rounded-full object-cover hover:opacity-90 transition"
        />
      </button>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1 flex-wrap min-w-0">
            <button
              onClick={goToProfile}
              className="text-white font-bold text-[15px] hover:underline truncate"
            >
              {post.userName}
            </button>
            <span className="text-gray-500 text-[15px] flex-shrink-0">· {timeAgo}</span>
          </div>
          <button
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-sky-500 hover:bg-sky-500/10 rounded-full p-1.5 transition flex-shrink-0"
          >
            <FaEllipsisH className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {post.content && (
          <p className="text-white text-[15px] leading-snug mt-0.5 whitespace-pre-wrap break-words">
            {post.content}
          </p>
        )}

        {/* Media grid */}
        {post.files.length > 0 && (
          <div
            className={`mt-3 rounded-2xl overflow-hidden grid gap-0.5 border border-[#2f3336] ${
              post.files.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {post.files.slice(0, 4).map((file, idx) => (
              <div key={idx} className="relative overflow-hidden">
                <img
                  src={file}
                  className="w-full h-52 object-cover hover:opacity-90 transition"
                  alt=""
                />
                {idx === 3 && post.files.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">+{post.files.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-3 text-gray-500 max-w-[425px]">
          <ActionBtn icon={<FaComment className="w-[18px] h-[18px]" />} hoverColor="sky" onClick={(e) => e.stopPropagation()} />
          <ActionBtn icon={<FaRetweet className="w-[18px] h-[18px]" />} hoverColor="green" onClick={(e) => e.stopPropagation()} />
          <ActionBtn
            icon={<FaHeart className={`w-[18px] h-[18px] ${isLoved ? "fill-pink-600 text-pink-600" : ""}`} />}
            count={reactCount}
            hoverColor="pink"
            active={isLoved}
            activeColor="text-pink-600"
            onClick={(e) => handleReaction(e, ReactionType.love)}
          />
          <ActionBtn
            icon={<FaBookmark className={`w-[18px] h-[18px] ${isSaved ? "fill-sky-500 text-sky-500" : ""}`} />}
            count={saveCount}
            hoverColor="sky"
            active={isSaved}
            activeColor="text-sky-500"
            onClick={(e) => handleReaction(e, ReactionType.save)}
          />
          <ActionBtn icon={<FaShareAlt className="w-[18px] h-[18px]" />} hoverColor="sky" onClick={(e) => e.stopPropagation()} />
        </div>
      </div>
    </article>
  );
}