import { useState, useRef } from "react";
import { 
  FaImage, 
  FaTimes  
} from "react-icons/fa";
import { useCreatePost } from "../../hooks/community/useAddPost";

interface CreatePostBoxProps {
  currentUserId: string;
}

export default function CreatePostBox({ currentUserId }: CreatePostBoxProps) {
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
    if (selected) {
      const url = URL.createObjectURL(selected);
      setPreview(url);
    }
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
    <div className="px-4 py-3 flex gap-3">
      {/* Avatar */}
      <img
        src="/assets/images/default-avatar.png"
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        alt="avatar"
      />

      <div className="flex-1 min-w-0">
        {/* Textarea */}
        <textarea
          className="w-full bg-transparent text-white text-xl placeholder:text-gray-600 resize-none outline-none min-h-[56px] leading-relaxed"
          placeholder="What is happening?!"
          value={content}
          maxLength={300}
          rows={2}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Image Preview */}
        {preview && (
          <div className="relative mt-2 rounded-2xl overflow-hidden">
            <img
              src={preview}
              alt="preview"
              className="w-full max-h-72 object-cover"
            />
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 transition"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="h-px bg-[#2f3336] my-3" />

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Image upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-sky-500 hover:bg-sky-500/10 rounded-full transition"
              title="Add image"
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
          </div>

          <div className="flex items-center gap-3">
            {/* Char counter */}
            {content.length > 0 && (
              <div className="flex items-center gap-2">
                {/* Circle progress */}
                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="12" fill="none" stroke="#2f3336" strokeWidth="3" />
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    fill="none"
                    stroke={isOverLimit ? "#f4212e" : charLeft <= 20 ? "#ffd400" : "#1d9bf0"}
                    strokeWidth="3"
                    strokeDasharray={`${Math.min(progress, 100) * 0.754} 75.4`}
                    strokeLinecap="round"
                  />
                </svg>
                {charLeft <= 20 && (
                  <span className={`text-sm font-medium ${isOverLimit ? "text-red-500" : "text-gray-500"}`}>
                    {charLeft}
                  </span>
                )}
              </div>
            )}

            {/* Post button */}
            <button
              onClick={handleSubmit}
              disabled={!canPost}
              className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full px-5 py-2 text-sm transition"
            >
              {isPending ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}