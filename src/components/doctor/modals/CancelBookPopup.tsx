import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface ConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}
export default function ConfirmationModal({
        show,
        onClose,
        onConfirm
    }: ConfirmationModalProps) {
  const {t} = useTranslation();
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            className="bg-background rounded-xl p-6 w-[90%] max-w-md text-center shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}>
            
            <h2 className="text-xl font-bold mb-4">{t("doctor.cancelBooking")}</h2>
            <p className="mb-6 text-dried">{t("doctor.cancelmess")}</p>
            <div className="flex justify-center gap-4">              
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-dried hover:bg-gray-400 transition font-semibold">
                {t("doctor.Cancel")}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold">
                {t("doctor.conf")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
