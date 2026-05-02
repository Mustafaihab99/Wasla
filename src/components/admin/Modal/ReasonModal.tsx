import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  loading?: boolean;
}

export default function ReasonModal({
  open,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError(t("admin.reasonRequired") || "Reason is required");
      return;
    }

    setError("");
    onSubmit(reason.trim());
    setReason("");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    style={{marginTop : "0"}}
    >
      <div className="bg-background border border-border shadow-2xl p-6 rounded-2xl w-[92%] max-w-md space-y-4">
        
        <h2 className="text-lg font-bold">
          {t("admin.reasonTitle")}
        </h2>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border  bg-background text-foreground border-border rounded-xl p-3 min-h-[120px] outline-none focus:ring-2 focus:ring-primary/40"
          placeholder={t("admin.reasonPlaceholder")}
        />

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setReason("");
              setError("");
              onClose();
            }}
            className="px-4 py-2 rounded-xl border"
          >
            {t("admin.cancel")}
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-500 text-white disabled:opacity-50"
          >
            {loading ? t("admin.loading") : t("admin.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}