import { useState, useRef, useEffect } from "react";
import { useEditPost } from "../../../hooks/community/useEditPost";
import { FaX } from "react-icons/fa6";
import { FaImage } from "react-icons/fa";

interface EditPostModalProps {
  postId: number;
  initialContent: string;
  initialFiles: string[];   // existing image URLs from server
  currentUserId: string;
  profileUserId?: string;   // pass when opened from profile page
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

  // Track new file the user wants to upload
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);

  // Track whether to keep the existing server image
  const [keepExisting, setKeepExisting] = useState(initialFiles.length > 0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: doEdit, isPending } = useEditPost(currentUserId);

  // ── helpers ──────────────────────────────────────────────
  const charLeft = 280 - content.length;
  const isOverLimit = charLeft < 0;
  const canSave = content.trim().length > 0 && !isOverLimit && !isPending;
  const progress = Math.min((content.length / 280) * 100, 100);

  // Which preview to show: new file > existing server image > nothing
  const displayPreview = newPreview
    ? newPreview
    : keepExisting && initialFiles[0]
    ? initialFiles[0]
    : null;

  // ── lifecycle ─────────────────────────────────────────────
  useEffect(() => {
    // Focus and move cursor to end
    const ta = textareaRef.current;
    if (ta) {
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ── handlers ──────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setNewFile(file);
    setNewPreview(URL.createObjectURL(file));
    setKeepExisting(false); // new file replaces the old one
  };

  const removeImage = () => {
    setNewFile(null);
    setNewPreview(null);
    setKeepExisting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
  if (!canSave) return;

  const formData = new FormData();
  formData.append("id", String(postId));
  formData.append("content", content);

  if (newFile) {
    formData.append("files", newFile);
  }

  if (!keepExisting && !newFile) {
    formData.append("clearFiles", "true");
  }

  doEdit(formData, { onSuccess: onClose });
};

  // ── render ────────────────────────────────────────────────
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-14 px-4"
      onClick={onClose}
    >
      {/* Modal card */}
      <div
        className="w-full max-w-[600px] bg-black border border-[#2f3336] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2f3336]">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition text-white"
            aria-label="Close"
          >
            <FaX className="w-5 h-5" />
          </button>

          <h2 className="text-white font-extrabold text-[17px]">Edit post</h2>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className="bg-sky-500 hover:bg-sky-400 active:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-full px-5 py-1.5 text-sm transition-colors"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </span>
            ) : "Save"}
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex gap-3 p-4">
          {/* Avatar */}
          <img
            src="/assets/images/default-avatar.png"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            alt="avatar"
          />

          <div className="flex-1 min-w-0 flex flex-col gap-3">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={300}
              placeholder="What's happening?"
              className="w-full bg-transparent text-white text-xl placeholder:text-gray-600 resize-none outline-none leading-relaxed"
            />

            {/* Image preview */}
            {displayPreview && (
              <div className="relative rounded-2xl overflow-hidden border border-[#2f3336]">
                <img
                  src={displayPreview}
                  alt="preview"
                  className="w-full max-h-72 object-cover"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full p-1.5 transition"
                  aria-label="Remove image"
                >
                  <FaX className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="h-px bg-[#2f3336]" />

            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between">
              {/* Image upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-sky-500 hover:bg-sky-500/10 rounded-full transition"
                title="Change image"
              >
                <FaImage className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Char counter */}
              <div className="flex items-center gap-2">
                {content.length > 0 && (
                  <>
                    <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                      <circle
                        cx="16" cy="16" r="12"
                        fill="none" stroke="#2f3336" strokeWidth="3"
                      />
                      <circle
                        cx="16" cy="16" r="12"
                        fill="none"
                        stroke={
                          isOverLimit ? "#f4212e" : charLeft <= 20 ? "#ffd400" : "#1d9bf0"
                        }
                        strokeWidth="3"
                        strokeDasharray={`${progress * 0.754} 75.4`}
                        strokeLinecap="round"
                      />
                    </svg>
                    {charLeft <= 20 && (
                      <span className={`text-sm font-medium ${isOverLimit ? "text-red-500" : "text-gray-500"}`}>
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