import { useLocation } from "react-router-dom";
import { mainPostData } from "../../../types/commuinty/community-types";
import PostCard from "../PostCard";
import CommentSection from "./CommentSection";

export default function CommentPage({ currentUserId }: { currentUserId: string }) {
  const location = useLocation();
  const post = location.state?.post as mainPostData;

  if (!post) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Post not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Original Post */}
      <PostCard post={post} currentUserId={currentUserId} />

      {/* Comments */}
      <CommentSection postId={post.postId} currentUserId={currentUserId} />
    </div>
  );
}