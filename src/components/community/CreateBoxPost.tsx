import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaImage, FaTimes } from "react-icons/fa";
import { useCreatePost } from "../../hooks/community/useAddPost";

interface CreatePostBoxProps {
  currentUserId: string;
}

export default function CreatePostBox({ currentUserId }: CreatePostBoxProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: createPost, isPending } = useCreatePost(currentUserId);

  const charLeft = 280 - content.length;
  const progress = (content.length / 280) * 100;
  const isOverLimit = charLeft < 0;
  const canPost = (content.trim() || file) && !isOverLimit && !isPending;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!canPost) return;
    const formData = new FormData();
    formData.append("userId", currentUserId);
    formData.append("content", content);
    if (file) formData.append("filesDto", file);

    createPost(formData, {
      onSuccess: () => {
        setContent("");
        removeFile();
      },
    });
  };

  return (
    <div className="px-4 py-3 flex gap-3"
         style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <img
        src="/assets/images/default-avatar.png"
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        alt={t("common.myAvatar")}
      />

      <div className="flex-1 min-w-0">
        <textarea
          className="w-full text-lg resize-none outline-none leading-relaxed rounded-xl p-2"
          style={{
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          }}
          placeholder={t("common.whatsHappening")}
          value={content}
          maxLength={300}
          rows={2}
          onChange={(e) => setContent(e.target.value)}
        />

        {preview && (
          <div className="relative mt-2 rounded-2xl overflow-hidden border border-var(--border)">
            <img
              src={preview}
              alt={t("common.preview")}
              className="w-full max-h-72 object-cover"
            />
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full p-1.5 transition"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="h-px my-3" style={{ background: "var(--border)" }} />

        <div className="flex items-center justify-between">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full transition"
            style={{ color: "var(--primary)" }}
            title={t("common.addImage")}
          >
            <FaImage className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />

          <div className="flex items-center gap-3">
            {content.length > 0 && (
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="12" fill="none" stroke="var(--border)" strokeWidth="3" />
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    fill="none"
                    stroke={isOverLimit ? "var(--canceled)" : charLeft <= 20 ? "var(--dried)" : "var(--primary)"}
                    strokeWidth="3"
                    strokeDasharray={`${Math.min(progress, 100) * 0.754} 75.4`}
                    strokeLinecap="round"
                  />
                </svg>
                {charLeft <= 20 && (
                  <span className={`text-sm font-medium ${isOverLimit ? "text-red-500" : "text-gray-400"}`}>
                    {charLeft}
                  </span>
                )}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canPost}
              className="font-bold rounded-full px-5 py-2 text-sm transition"
              style={{
                background: "var(--primary)",
                color: "var(--background)",
                opacity: !canPost ? 0.5 : 1,
                cursor: !canPost ? "not-allowed" : "pointer",
              }}
            >
              {isPending ? t("common.posting") : t("common.post")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}