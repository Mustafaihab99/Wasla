import { useState } from "react";
import useBookService from "../../../hooks/resident/useBookService";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface BookServiceModalProps {
  serviceId: number;
  serviceProviderId: string;
  price: number;
  availableDays: {
    dayOfWeek: number;
    timeSlots: { id: number; start: string; end: string; isBooking: boolean }[];
  }[];
  onClose: () => void;
}

export default function BookServiceModal({
  serviceProviderId,
  price,
  availableDays,
  onClose,
}: BookServiceModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingType, setBookingType] = useState<1 | 2>(1);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [availableTimesForDay, setAvailableTimesForDay] = useState<
    { id: number; start: string; end: string; isBooking: boolean }[]
  >([]);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<number | null>(
    null
  );

  //error states for each section
  const [dayError, setDayError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [imgError, setImgError] = useState("");

  const { mutateAsync: mutation, isPending } = useBookService();

  const daysOfWeek = [
    t("doctor.Sat"),
    t("doctor.Sun"),
    t("doctor.Mon"),
    t("doctor.Tue"),
    t("doctor.Wed"),
    t("doctor.Thu"),
    t("doctor.Fri"),
  ];

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const day = Number(e.target.value);
    setSelectedDay(day.toString());
    setDayError("");
    setSelectedTime("");
    setSelectedTimeSlotId(null);

    const dayObj = availableDays.find((d) => d.dayOfWeek === day);
    if (dayObj) {
      setAvailableTimesForDay(
        dayObj.timeSlots.filter((slot) => !slot.isBooking)
      );
    } else {
      setAvailableTimesForDay([]);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slotId = Number(e.target.value);
    const slot = availableTimesForDay.find((s) => s.id === slotId);
    if (slot) {
      setSelectedTime(`${slot.start}-${slot.end}`);
      setSelectedTimeSlotId(slot.id);
    }
    setTimeError("");
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  const getNextBookingDate = (appDayIndex: number) => {
    const mappingToJs = [6, 0, 1, 2, 3, 4, 5];
    const targetJsDay = mappingToJs[appDayIndex];

    const today = new Date();
    const todayJs = today.getDay();

    let diff = (targetJsDay - todayJs + 7) % 7;
    if (diff === 0) diff = 7;

    const bookingDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + diff
    );

    const bookingDateStr = `${bookingDate.getFullYear()}-${pad(
      bookingDate.getMonth() + 1
    )}-${pad(bookingDate.getDate())}`;
    return bookingDateStr;
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async () => {
    // Reset errors first
    setDayError("");
    setTimeError("");
    setImgError("");

    let hasError = false;

    if (!selectedDay && availableDays.length > 0) {
      setDayError(t("doctor.error.selectDay"));
      hasError = true;
    }

    if (!selectedTime) {
      setTimeError(t("doctor.selectTimeSlot"));
      hasError = true;
    }

    if (bookingType === 2 && images.length === 0) {
      setImgError(t("doctor.error.uploadImages"));
      hasError = true;
    }

    if (hasError) return;

    try {
      const selectedDayInt = Number(selectedDay);
      const bookingDateStr = getNextBookingDate(selectedDayInt);
      const formData = new FormData();
      formData.append("userId", sessionStorage.getItem("user_id") || "");
      formData.append("serviceProviderId", serviceProviderId);
      formData.append("serviceDayId", selectedTimeSlotId?.toString() || "");
      formData.append("price", price.toString());
      formData.append("serviceProviderType", "1");
      formData.append("bookingType", bookingType.toString());
      formData.append("bookingDate", bookingDateStr);

      if (bookingType === 2) {
        images.forEach((img) => formData.append("Images", img.file));
      }

      await mutation(formData);
      onClose();
      navigate("/resident/profile/my-bookings");
    } catch {
      toast.error(t("doctor.error.bookingFailed"));
    }
  };

  return (
    <div
      style={{ marginTop: "12px" }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
      <div className="w-full max-w-md bg-white/90 dark:bg-background text-black shadow-2xl rounded-2xl p-6 space-y-6 border border-white/30 animate-scaleUp">
        <h2 className="text-2xl font-extrabold text-center text-primary">
          {t("doctor.bookService")}
        </h2>

        {/* Select Day */}
        {availableDays.length > 0 && (
          <div className="space-y-1">
            <label className="font-semibold text-gray-700 dark:text-gray-200">
              {t("doctor.selectDay")}
            </label>

            <select
              value={selectedDay}
              onChange={handleDayChange}
              className="w-full border rounded-lg p-2 bg-white dark:bg-background shadow-sm focus:ring-2 focus:ring-primary">
              <option value="">-- {t("doctor.selectDay")} --</option>
              {availableDays.map((d) => (
                <option key={d.dayOfWeek} value={d.dayOfWeek}>
                  {daysOfWeek[d.dayOfWeek]}
                </option>
              ))}
            </select>

            {dayError && <p className="text-red-500 text-sm">{dayError}</p>}
          </div>
        )}

        {/* Select Time */}
        <div className="space-y-1">
          <label className="font-semibold text-gray-700 dark:text-gray-200">
            {t("doctor.selectTimeSlot")}
          </label>

          <select
            value={selectedTimeSlotId ?? ""}
            onChange={handleTimeChange}
            disabled={!selectedDay || availableTimesForDay.length === 0}
            className="w-full border rounded-lg p-2 bg-white dark:bg-background shadow-sm focus:ring-2 focus:ring-primary disabled:opacity-50">
            <option value="">
              {availableTimesForDay.length === 0
                ? t("doctor.noSlots")
                : `-- ${t("doctor.selectTimeSlot")} --`}
            </option>

            {availableTimesForDay.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.start.slice(0, 5)} {t("doctor.to")} {slot.end.slice(0, 5)}
              </option>
            ))}
          </select>

          {timeError && <p className="text-red-500 text-sm">{timeError}</p>}
        </div>

        {/* Booking Type */}
        <div className="space-y-1">
          <label className="font-semibold text-gray-700 dark:text-gray-200">
            {t("doctor.bookingType")}
          </label>
          <select
            value={bookingType}
            onChange={(e) => setBookingType(Number(e.target.value) as 1 | 2)}
            className="w-full border p-2 rounded-lg bg-white dark:bg-background shadow-sm focus:ring-2 focus:ring-primary">
            <option value={1}>{t("doctor.checkup")}</option>
            <option value={2}>{t("doctor.consult")}</option>
          </select>
        </div>

        {/* Upload Images */}
        {bookingType === 2 && (
          <div className="space-y-2">
            <label className="font-semibold text-gray-700 dark:text-gray-200">
              {t("doctor.uploadImages")}
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);

                const mapped = files.map((file) => ({
                  file,
                  preview: URL.createObjectURL(file),
                }));

                setImages((prev) => [...prev, ...mapped]);
                setImgError("");
              }}
              className="w-full border rounded-lg p-2 bg-white dark:bg-background"
            />

            {/* Preview Images */}
            {images.length > 0 && (
              <div className="max-h-48 overflow-y-auto pr-1">
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, index) => (
                    <div
                      key={img.preview}
                      className="relative border rounded-lg overflow-hidden">
                      <img
                        src={img.preview}
                        alt="preview"
                        className="w-full h-24 object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {imgError && <p className="text-red-500 text-sm">{imgError}</p>}
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-between mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition">
            {t("doctor.Cancel")}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-5 py-2 rounded-lg bg-primary text-white font-semibold shadow-md hover:bg-primary/90 transition disabled:opacity-50">
            {isPending ? t("doctor.booking...") : t("doctor.book")}
          </button>
        </div>
      </div>
    </div>
  );
}
