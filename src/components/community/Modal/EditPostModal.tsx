import { useState, useRef, useEffect } from "react";
import { useEditPost } from "../../../hooks/community/useEditPost";
import { FaX } from "react-icons/fa6";
import { FaImage } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface EditPostModalProps {
  postId: number;
  initialContent: string;
  initialFiles: string[];
  currentUserId: string;
  onClose: () => void;
}

export default function EditPostModal({
  postId,
  initialContent,
  initialFiles,
  currentUserId,
  onClose,
}: EditPostModalProps) {
  const [content, setContent] = useState(initialContent);
  const { t } = useTranslation();

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>(initialFiles || []);

  const myImage = sessionStorage.getItem("profilePhoto");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: doEdit, isPending } = useEditPost(currentUserId);

  const charLeft = 280 - content.length;
  const isOverLimit = charLeft < 0;
  const canSave = !!content.trim() && !isOverLimit && !isPending;
  const progress = Math.min((content.length / 280) * 100, 100);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
    }
  }, []);

  useEffect(() => {
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newPreviews]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    if (existingFiles.length + newFiles.length + selectedFiles.length > 4) {
      toast.error("Maximum 4 files allowed");
      return;
    }

    const previews = selectedFiles.map((file) => URL.createObjectURL(file));

    setNewFiles((prev) => [...prev, ...selectedFiles]);
    setNewPreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index: number, type: "existing" | "new") => {
    if (type === "existing") {
      setExistingFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      URL.revokeObjectURL(newPreviews[index]);

      setNewFiles((prev) => prev.filter((_, i) => i !== index));
      setNewPreviews((prev) => prev.filter((_, i) => i !== index));

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSave = () => {
    if (!canSave) return;

    const formData = new FormData();

    formData.append("id", String(postId));
    formData.append("content", content);

    existingFiles.forEach((file) => {
      formData.append("existingFiles", file);
    });

    newFiles.forEach((file) => {
      formData.append("newFiles", file);
    });

    doEdit(formData, { onSuccess: onClose });
  };

  const renderMedia = (src: string) => {
    const isVideo = src.endsWith(".mp4") || src.endsWith(".webm");

    if (isVideo) {
      return (
        <video
          src={src}
          className="w-full max-h-40 object-cover"
          controls
        />
      );
    }

    return (
      <img
        src={src}
        className="w-full max-h-40 object-cover"
        alt="preview"
      />
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-14 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[600px] bg-black border border-[#2f3336] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2f3336]">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition text-white"
            aria-label="Close"
          >
            <FaX className="w-5 h-5" />
          </button>

          <h2 className="text-white font-extrabold text-[17px]">
            {t("common.editPost")}
          </h2>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className="bg-sky-500 hover:bg-sky-400 active:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-full px-5 py-1.5 text-sm transition-colors"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {t("common.Saving…")}
              </span>
            ) : (
              t("common.Save")
            )}
          </button>
        </div>

        <div className="flex gap-3 p-4">
          <img
            src={myImage!}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            alt="avatar"
          />

          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={300}
              placeholder="What's happening?"
              className="w-full bg-transparent text-white text-xl placeholder:text-gray-600 resize-none outline-none leading-relaxed"
            />

            {(existingFiles.length > 0 || newPreviews.length > 0) && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {existingFiles.map((file, index) => (
                  <div
                    key={`old-${index}`}
                    className="relative rounded-2xl overflow-hidden border border-[#2f3336]"
                  >
                    {renderMedia(file)}
                    <button
                      onClick={() => removeImage(index, "existing")}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full p-1.5 transition"
                    >
                      <FaX className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {newPreviews.map((preview, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative rounded-2xl overflow-hidden border border-[#2f3336]"
                  >
                    {renderMedia(preview)}

                    <button
                      onClick={() => removeImage(index, "new")}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full p-1.5 transition"
                    >
                      <FaX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="h-px bg-[#2f3336]" />

            <div className="flex items-center justify-between">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-sky-500 hover:bg-sky-500/10 rounded-full transition"
                title={t("common.ChangeImage")}
              >
                <FaImage className="w-5 h-5" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex items-center gap-2">
                {content.length > 0 && (
                  <>
                    <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                      <circle
                        cx="16"
                        cy="16"
                        r="12"
                        fill="none"
                        stroke="#2f3336"
                        strokeWidth="3"
                      />

                      <circle
                        cx="16"
                        cy="16"
                        r="12"
                        fill="none"
                        stroke={
                          isOverLimit
                            ? "#f4212e"
                            : charLeft <= 20
                            ? "#ffd400"
                            : "#1d9bf0"
                        }
                        strokeWidth="3"
                        strokeDasharray={`${progress * 0.754} 75.4`}
                        strokeLinecap="round"
                      />
                    </svg>

                    {charLeft <= 20 && (
                      <span
                        className={`text-sm font-medium ${
                          isOverLimit ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        {charLeft}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}