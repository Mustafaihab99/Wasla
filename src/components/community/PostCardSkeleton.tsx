import { singlePostData } from "../../types/commuinty/community-types";

interface PostCardProps {
  post: singlePostData;
  currentUserId: string;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-backgroundSecondary p-4 rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src="/assets/images/default-avatar.png"
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h4 className="font-semibold text-white">{post.postId}</h4>
          <span className="text-xs text-white/60">{post.createdAt}</span>
        </div>
      </div>

      {/* Content */}
      <p className="text-white mb-3">{post.content}</p>

      {/* Media */}
      {post.files.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {post.files.map((file, idx) => (
            <img
              key={idx}
              src={file}
              className="w-full h-40 object-cover rounded-xl"
            />
          ))}
        </div>
      )}

      {/* Reactions */}
      <div className="flex justify-between text-white/70 text-sm">
        <button>❤️ {post.numberofReacts}</button>
        <button>💾 {post.numberofSaves}</button>
        <button>💬 Comment</button>
      </div>
    </div>
  );
}