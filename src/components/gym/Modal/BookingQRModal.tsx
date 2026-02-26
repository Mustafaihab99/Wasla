import { useTranslation } from "react-i18next";

interface Props {
  qrImage: string;
  onClose: () => void;
  onContinue: () => void;
}

export default function BookingQRModal({
  qrImage,
  onClose,
  onContinue,
}: Props) {
  const { t } = useTranslation();

  const fullImageUrl = import.meta.env.VITE_QR_IMAGE + qrImage;

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = fullImageUrl;
    link.download = "gym-booking-qr.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl p-6 w-[90%] max-w-md text-center space-y-4 shadow-lg">

        <h2 className="text-xl font-bold text-primary">
          {t("gym.bookingCreated")}
        </h2>

        <p className="text-sm text-muted-foreground">
          {t("gym.pendingPaymentNote")}
        </p>

        <img
          src={fullImageUrl}
          alt="QR Code"
          className="w-56 h-56 mx-auto border rounded-xl"
        />

        <div className="flex flex-col gap-3 pt-3">
          <button
            onClick={downloadImage}
            className="px-4 py-2 bg-primary text-white rounded-xl"
          >
            {t("gym.downloadQR")}
          </button>

          <button
            onClick={onContinue}
            className="px-4 py-2 bg-green-600 text-white rounded-xl"
          >
            {t("gym.continuePayment")}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-xl"
          >
            {t("gym.close")}
          </button>
        </div>
      </div>
    </div>
  );
}