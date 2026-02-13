import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface ConfirmDeleteProps {
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDelete({
  onClose,
  onConfirm,
}: ConfirmDeleteProps) {
    const {t} = useTranslation();
  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{marginTop : "0"}}
    >
      <motion.div
        className="bg-background p-6 rounded-xl border space-y-6 w-[350px]"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h3 className="text-lg font-semibold text-center">
          {t("gym.delete?")}
        </h3>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border border-border px-4 py-2 rounded-lg hover:bg-muted">
            {t("gym.Cancel")}
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            {t("gym.Delete")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
