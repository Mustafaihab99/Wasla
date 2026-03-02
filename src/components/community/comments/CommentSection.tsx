import { useState } from "react";
import AddCommentInput from "./AddCommentInput";

interface Comment {
  commentId: number;
  userId: string;
  userName: string;
  profilePhoto: string;
  content: string;
  createdAt: string;
  isLoved: boolean;
  numberofReacts: number;
}

export default function CommentSection({
  postId,
  currentUserId,
}: {
  postId: number;
  currentUserId: string;
}) {

  // 🔥 ده مكان الـ GET لما يتعمل
  const [comments] = useState<Comment[]>([]);

  return (
    <div className="relative">

      {/* Comments List */}
      <div className="pb-28">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No comments yet
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.commentId}>
              {/* هنا بعدين هنحط CommentCard */}
              {comment.content}
            </div>
          ))
        )}
      </div>

      {/* Sticky Input */}
      <AddCommentInput
        postId={postId}
        currentUserId={currentUserId}
      />
    </div>
  );
}