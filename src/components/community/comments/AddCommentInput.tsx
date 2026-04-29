import { useState, useRef } from "react";
import { FaPaperPlane, FaImage, FaTimes } from "react-icons/fa";
import { useAddComment } from "../../../hooks/community/useAddComment";
import { useTranslation } from "react-i18next";

interface Props {
  postId: number;
  bottomOffset?: number;
}

export default function AddCommentInput({
  postId,
}: Props) {
  const { t } = useTranslation();

  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userId = sessionStorage.getItem("user_id")!;
  const { mutate: addComment, isPending } =
    useAddComment(postId, userId);

  const canSend =
    (content.trim().length > 0 || file) && !isPending;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!canSend) return;

    addComment(
      { content: content.trim(), file: file ?? undefined },
      {
        onSuccess: () => {
          setContent("");
          removeFile();
        },
      }
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="fixed left-0 right-0 z-30 px-4 
                 bottom-20 md:bottom-5"
    >
      <div className="max-w-[640px] mx-auto">

        {/* Image preview */}
        {preview && (
          <div className="mb-3 relative w-fit">
            <img
              src={preview}
              alt="preview"
              loading="lazy"
              className="h-24 rounded-xl object-cover border border-border"
            />
            <button
              onClick={removeFile}
              className="absolute -top-2 -right-2 
                         bg-background border border-border 
                         text-foreground rounded-full p-1.5 
                         hover:bg-secondary transition"
            >
              <FaTimes className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div
          className="bg-background border border-border 
                     rounded-2xl shadow-xl 
                     p-3 flex items-center gap-3"
        >
          {/* Attach */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-primary hover:bg-secondary 
                       rounded-full p-2 transition flex-shrink-0"
            title={t("comments.attach")}
          >
            <FaImage className="w-4 h-4" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Text */}
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("comments.placeholder")}
            maxLength={280}
            className="flex-1 bg-transparent 
                       text-foreground text-[15px] 
                       placeholder:text-secondary 
                       outline-none"
          />

          {/* Send */}
          <button
            onClick={handleSubmit}
            disabled={!canSend}
            className="bg-primary hover:opacity-90 active:scale-95
                       disabled:opacity-40 disabled:cursor-not-allowed 
                       text-white rounded-full p-2.5 
                       transition flex-shrink-0"
            title={t("comments.send")}
          >
            {isPending ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin block" />
            ) : (
              <FaPaperPlane className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}