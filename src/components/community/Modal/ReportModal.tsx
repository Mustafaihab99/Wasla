import Modal from "react-modal";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import useMakeReport from "../../../hooks/community/useMakeReport";
import { useTranslation } from "react-i18next";

const reportReasonsKeys = [
  "spam",
  "harassment",
  "hateSpeech",
  "falseInfo",
  "violence",
  "other",
];

export default function ReportModal({
  isOpen,
  onClose,
  targetId,
  targetType,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  targetId: number;
  targetType: number;
  userId: string;
}) {
  const { t } = useTranslation();

  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const { mutate, isPending } = useMakeReport();

  const handleSubmit = () => {
    const finalReason =
      reason === "other" ? customReason : t(`report.reasons.${reason}`);

    if (!finalReason.trim()) return;

    mutate(
      {
        userId,
        reason: finalReason,
        targetId,
        targetType,
      },
      {
        onSuccess: () => {
          onClose();
          setReason("");
          setCustomReason("");
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      closeTimeoutMS={200}
      className="
        bg-background w-full max-w-md mx-auto 
        mt-10 md:mt-24 
        rounded-2xl shadow-2xl outline-none 
        border border-border
        max-h-[85vh] flex flex-col
        animate-[modalIn_0.25s_ease-out]
      "
      overlayClassName="
        fixed inset-0 bg-black/60 z-40 
        flex justify-center items-start md:items-center 
        p-4
        animate-[fadeIn_0.2s_ease-out]
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
        <h2 className="text-foreground text-lg font-bold">
          {t("report.title")}
        </h2>

        <button
          onClick={onClose}
          className="text-dried hover:text-error transition"
        >
          <FaTimes />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4 overflow-y-auto flex-1">
        <p className="text-dried text-sm">
          {t("report.subtitle")}
        </p>

        <div className="space-y-2">
          {reportReasonsKeys.map((key) => (
            <label
              key={key}
              className="flex items-center gap-2 text-foreground cursor-pointer hover:bg-secondary/10 px-3 py-2 rounded-lg transition"
            >
              <input
                type="radio"
                name="reason"
                value={key}
                checked={reason === key}
                onChange={(e) => setReason(e.target.value)}
                className="accent-primary"
              />
              {t(`report.reasons.${key}`)}
            </label>
          ))}
        </div>

        {reason === "other" && (
          <textarea
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder={t("report.placeholder")}
            className="
              w-full p-3 rounded-lg
              bg-background text-foreground
              border border-border
              focus:outline-none focus:border-primary
              resize-none max-h-[120px]
            "
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 px-5 py-4 border-t border-border shrink-0">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-dried hover:bg-secondary/10 transition"
        >
          {t("common.cancel")}
        </button>

        <button
          onClick={handleSubmit}
          disabled={isPending || !reason}
          className="
            px-4 py-2 rounded-lg
            bg-primary text-white
            hover:opacity-90 transition
            disabled:opacity-50
          "
        >
          {isPending
            ? t("report.submitting")
            : t("report.submit")}
        </button>
      </div>
    </Modal>
  );
}