import { 
  FaHeart,
  FaBookmark,
  FaComment,
  FaRetweet,
  FaShareAlt
} from "react-icons/fa";
import { useState } from "react";
import { singlePostData } from "../../types/commuinty/community-types";
import { useToggleReaction } from "../../hooks/community/useToggleReaction";
import { ReactionType, ReactionTargetType } from "../../utils/enum";
import { formatDistanceToNow } from "date-fns";

interface UserPostCardProps {
  post: singlePostData;
  currentUserId: string;
  userName: string;
  profilePhoto: string;
}

export default function UserPostCard({
  post,
  currentUserId,
  userName,
  profilePhoto,
}: UserPostCardProps) {
  const { mutate: toggleReactionMutate } = useToggleReaction(currentUserId);

  const [isLoved, setIsLoved] = useState(post.isLoved);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [reactCount, setReactCount] = useState(post.numberofReacts);
  const [saveCount, setSaveCount] = useState(post.numberofSaves);

  const handleReaction = (type: number) => {
    if (type === ReactionType.love) {
      setIsLoved((p) => !p);
      setReactCount((p) => p + (isLoved ? -1 : 1));
    } else if (type === ReactionType.save) {
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

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <article className="flex gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors border-b border-[#2f3336] cursor-pointer group">
      <div className="flex-shrink-0">
        <img
          src={profilePhoto || "/assets/images/default-avatar.png"}
          alt={userName}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-white font-bold text-[15px] hover:underline cursor-pointer">{userName}</span>
          <span className="text-gray-500 text-[15px]">· {timeAgo}</span>
        </div>

        {post.content && (
          <p className="text-white text-[15px] leading-snug mt-0.5 whitespace-pre-wrap break-words">
            {post.content}
          </p>
        )}

        {post.files.length > 0 && (
          <div className={`mt-3 rounded-2xl overflow-hidden grid gap-0.5 ${post.files.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {post.files.slice(0, 4).map((file, idx) => (
              <img key={idx} src={file} className="w-full h-48 object-cover" alt="" />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 text-gray-500 max-w-[425px]">
          <button className="flex items-center gap-1.5 text-sm p-1.5 -m-1.5 rounded-full hover:text-sky-500 hover:bg-sky-500/10 transition">
            <FaComment className="w-[18px] h-[18px]" />
          </button>
          <button className="flex items-center gap-1.5 text-sm p-1.5 -m-1.5 rounded-full hover:text-green-400 hover:bg-green-400/10 transition">
            <FaRetweet className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => handleReaction(ReactionType.love)}
            className={`flex items-center gap-1.5 text-sm p-1.5 -m-1.5 rounded-full hover:text-pink-600 hover:bg-pink-600/10 transition ${isLoved ? "text-pink-600" : ""}`}
          >
            <FaHeart className={`w-[18px] h-[18px] ${isLoved ? "fill-pink-600" : ""}`} />
            {reactCount > 0 && <span className="text-[13px]">{reactCount}</span>}
          </button>
          <button
            onClick={() => handleReaction(ReactionType.save)}
            className={`flex items-center gap-1.5 text-sm p-1.5 -m-1.5 rounded-full hover:text-sky-500 hover:bg-sky-500/10 transition ${isSaved ? "text-sky-500" : ""}`}
          >
            <FaBookmark className={`w-[18px] h-[18px] ${isSaved ? "fill-sky-500" : ""}`} />
            {saveCount > 0 && <span className="text-[13px]">{saveCount}</span>}
          </button>
          <button className="flex items-center gap-1.5 text-sm p-1.5 -m-1.5 rounded-full hover:text-sky-500 hover:bg-sky-500/10 transition">
            <FaShareAlt className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </article>
  );
}