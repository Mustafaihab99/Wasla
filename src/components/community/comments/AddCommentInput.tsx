import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { AddComment } from "../../../api/community/community-api";

export default function AddCommentInput({
  postId,
  currentUserId,
}: {
  postId: number;
  currentUserId: string;
}) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);

      const formData = new FormData();
      await AddComment(formData, currentUserId, content, postId);

      setContent("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
      <div className="max-w-2xl mx-auto flex gap-3 items-center">

        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a reply..."
          className="flex-1 bg-muted rounded-full px-4 py-2 text-sm outline-none text-primary"
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading || !content.trim()}
          className="bg-primary text-foreground p-2 rounded-full disabled:opacity-50"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}