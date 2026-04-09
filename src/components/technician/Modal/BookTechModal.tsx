import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle } from "react-icons/fi";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    bookingDate: string;
    price: number;
  }) => void;
  isPending: boolean;
}

export default function BookTechModal({
  open,
  onClose,
  onConfirm,
  isPending,
}: Props) {
  const { t } = useTranslation();

  const [showIntro, setShowIntro] = useState(true);

  const [bookingDate, setBookingDate] = useState("");
  const [price, setPrice] = useState("");

  const [errors, setErrors] = useState<{
    bookingDate?: string;
    price?: string;
  }>({});

  // ⏱️ auto hide intro بعد 4 ثواني
  useEffect(() => {
    if (open) {
      setShowIntro(true);
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open) return null;

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!bookingDate) {
      newErrors.bookingDate = t("tech.datereq");
    } else {
      const selected = new Date(bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selected <= today) {
        newErrors.bookingDate = t("tech.datefut");
      }
    }

    if (!price) {
      newErrors.price = t("tech.pricereq");
    } else if (Number(price) <= 0) {
      newErrors.price = t("tech.pricemust");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onConfirm({
      bookingDate,
      price: Number(price),
    });

    setBookingDate("");
    setPrice("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-background rounded-3xl p-6 w-full max-w-md shadow-xl overflow-hidden">

        <AnimatePresence mode="wait">

          {/* 🟡 Intro Screen */}
          {showIntro ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-5 py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="flex justify-center"
              >
                <div className="bg-primary/10 p-4 rounded-full">
                  <FiMessageCircle className="text-3xl text-primary" />
                </div>
              </motion.div>

              <h2 className="text-xl font-bold text-foreground">
                {t("tech.beforeBooking")}
              </h2>

              <p className="text-dried text-sm leading-relaxed">
                {t("tech.bookingAdvice")}
              </p>

              <button
                onClick={() => setShowIntro(false)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                {t("tech.gotIt")}
              </button>
            </motion.div>
          ) : (
            /* 🟢 FORM */
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-5"
            >
              <h2 className="text-xl text-foreground font-bold text-center">
                {t("tech.Book")}
              </h2>

              {/* DATE */}
              <div>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full border p-2 rounded-lg bg-background text-foreground"
                />
                {errors.bookingDate && (
                  <p className="text-red-500 text-sm">
                    {errors.bookingDate}
                  </p>
                )}
              </div>

              {/* PRICE */}
              <div>
                <input
                  type="number"
                  placeholder={t("tech.enter")}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border p-2 rounded-lg bg-background text-foreground"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">
                    {errors.price}
                  </p>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg hover:bg-dried"
                >
                  {t("resident.Cancel")}
                </button>

                <button
                  disabled={isPending}
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {isPending
                    ? t("tech.bookingLoading")
                    : t("tech.Confirm")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}