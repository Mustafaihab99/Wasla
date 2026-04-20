import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { mainPostData } from "../../../types/commuinty/community-types";
import PostCard from "../PostCard";
import CommentSection from "./CommentSection";
import AddCommentInput from "./AddCommentInput";
import { useTranslation } from "react-i18next";

export default function CommentPage({ currentUserId }: { currentUserId: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const post = location.state?.post as mainPostData | undefined;
  
  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-foreground font-bold text-xl">
          {t("comments.postNotFound")}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:underline text-sm transition"
        >
          {t("common.goBack")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-[] w-full mx-auto border-x border-border min-h-screen">

        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-secondary transition"
          >
            <FaArrowLeft className="w-4 h-4 text-foreground" />
          </button>

          <h1 className="font-extrabold text-lg tracking-tight">
            {t("comments.post")}
          </h1>
        </div>

        <PostCard post={post} currentUserId={currentUserId} />

        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-sm text-foreground">
            {t("comments.replies")}
          </h2>
        </div>

        <CommentSection postId={post.postId} currentUserId={currentUserId} />

        <AddCommentInput
          postId={post.postId}
          bottomOffset={64}
        />
      </div>
    </div>
  );
}