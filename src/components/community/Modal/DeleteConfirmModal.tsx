import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaTrashAlt } from "react-icons/fa";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export default function DeleteConfirmModal({ onConfirm, onCancel, isDeleting }: Props) {
  const {t} =useTranslation();
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[320px] bg-black border border-[#2f3336] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.8)] p-8 flex flex-col items-center text-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center">
          <FaTrashAlt className="w-7 h-7 text-red-500" />
        </div>

        <div className="space-y-1">
          <h2 className="text-white font-extrabold text-xl">{t("common.deletePost")}?</h2>
          <p className="text-gray-500 text-[15px] leading-snug">
            {t("common.remove")}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full py-3 transition-colors"
          >
            {isDeleting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {t("common.Deleting...")}
              </span>
            ) : "Delete"}
          </button>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full border border-[#536471] hover:bg-white/5 text-white font-bold rounded-full py-3 transition-colors disabled:opacity-50"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
}