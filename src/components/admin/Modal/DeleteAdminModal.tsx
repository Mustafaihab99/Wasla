// ConfirmDeleteModal.tsx
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  name,
}: Props) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        style={{marginTop:"0"}}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="bg-background border border-border rounded-2xl w-full max-w-sm p-6 text-center shadow-xl"
        >
          <FaTrash className="mx-auto text-red-500 text-4xl mb-4" />

          <h2 className="text-lg font-bold">
            {t("doctor.sure?")}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {t("doctor.doyou")} {name || t("admin.thisAdmin")} ?
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              {t("doctor.Cancel")}
            </button>

            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              {t("doctor.Delete")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}