import { useTranslation } from "react-i18next";

interface Props {
  qrImage: string;
  onClose: () => void;
}

export default function BookingQRModal({
  qrImage,
  onClose,
}: Props) {
  const { t } = useTranslation();

  const fullImageUrl = qrImage;

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = fullImageUrl;
    link.download = "gym-booking-qr.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      style={{marginTop : "0"}}
    >
      <div className="bg-background rounded-2xl p-6 w-[90%] max-w-md text-center space-y-4 shadow-lg">

        <h2 className="text-xl font-bold text-primary">
          {t("gym.bookingCreated")}
        </h2>

        <img
          src={fullImageUrl}
          alt="QR Code"
          loading="lazy"
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