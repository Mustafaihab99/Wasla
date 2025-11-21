import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.85 }}
            className="bg-background p-6 rounded-2xl shadow-xl w-full max-w-md border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
