import { useState } from "react";
import useBookService from "../../../hooks/resident/useBookService";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface BookServiceModalProps {
  serviceId: number;
  serviceProviderId: string;
  price: number;
  availableDays: { dayOfWeek: number }[];
  availableDates: { date: string }[];
  availableTimeSlots: { start: string; end: string }[];
  onClose: () => void;
}

export default function BookServiceModal({
  serviceId,
  serviceProviderId,
  price,
  availableDays,
  availableDates,
  availableTimeSlots,
  onClose,
}: BookServiceModalProps) {

  const { t } = useTranslation();

  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingType, setBookingType] = useState<1 | 2>(1);
  const [images, setImages] = useState<File[]>([]);

  //error states for each section
  const [dayError, setDayError] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [imgError, setImgError] = useState("");

  const { mutateAsync: mutation, isPending } = useBookService();

  const daysOfWeek = [
    t("doctor.Sat"),t("doctor.Sun"),t("doctor.Mon"),t("doctor.Tue"),
    t("doctor.Wed"),t("doctor.Thu"),t("doctor.Fri"),
  ];


  const handleSubmit = async () => {

    // Reset errors first
    setDayError(""); setDateError(""); setTimeError(""); setImgError("");

    let hasError = false;

    if (!selectedDay && availableDays.length > 0) {
      setDayError(t("doctor.error.selectDay"));
      hasError = true;
    }

    if (!selectedDate && availableDates.length > 0) {
      setDateError(t("doctor.error.selectDay"));
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
      const formData = new FormData();
      formData.append("UserId", sessionStorage.getItem("user_id") || "");
      formData.append("ServiceId", serviceId.toString());
      formData.append("ServiceProviderId", serviceProviderId.toString());
      formData.append("Price", price.toString());
      formData.append("ServiceProviderType", "1");
      formData.append("BookingType", bookingType.toString());
      formData.append("TimeSlot", selectedTime);
      formData.append("Day", selectedDate || selectedDay);

      if (bookingType === 2) {
        images.forEach(file => formData.append("Images", file));
      }

      await mutation(formData);
      onClose();

    } catch {
      toast.error(t("doctor.error.bookingFailed"));
    }
  };

  return (
    <div
    style={{marginTop: "0"}} 
    className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-background text-foreground rounded-xl p-6 w-full max-w-md space-y-4">

        <h2 className="text-xl font-bold">{t("doctor.bookService")}</h2>

        {/* Select Day */}
        {availableDays.length > 0 && (
          <>
            <label>{t("doctor.selectDay")}</label>
            <select
              value={selectedDay}
              onChange={(e) => { setSelectedDay(e.target.value); setDayError(""); }}
              className="w-full bg-background border rounded p-2"
            >
              <option value="">--{t("doctor.selectDay")}--</option>
              {availableDays.map(d =>(
                <option key={d.dayOfWeek} value={d.dayOfWeek}>{daysOfWeek[d.dayOfWeek]}</option>
              ))}
            </select>
            {dayError && <p className="text-red-500 text-sm">{dayError}</p>}
          </>
        )}
        

        {/* Select Date */}
        {availableDates.length > 0 && (
          <>
            <label>{t("doctor.selectDate")}</label>
            <select
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setDateError(""); }}
              className="w-full border bg-background rounded p-2"
            >
              <option value="">--{t("doctor.selectDate")}--</option>
              {availableDates.map(d =>(
                <option key={d.date} value={d.date}>{new Date(d.date).toLocaleDateString()}</option>
              ))}
            </select>
            {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
          </>
        )}


        {/* Select Time */}
        <>
          <label>{t("doctor.selectTimeSlot")}</label>
          <select
            value={selectedTime}
            onChange={(e)=>{ setSelectedTime(e.target.value); setTimeError(""); }}
            className="w-full border bg-background rounded p-2"
          >
            <option value="">--{t("doctor.selectTimeSlot")}--</option>
            {availableTimeSlots.map(ti =>(
              <option key={ti.start} value={`${ti.start}-${ti.end}`}>
                {`${ti.start.slice(0,5)} ${t("doctor.to")} ${ti.end.slice(0,5)}`}
              </option>
            ))}
          </select>
          {timeError && <p className="text-red-500 text-sm">{timeError}</p>}
        </>


        {/* Booking type */}
        <label>{t("doctor.bookingType")}</label>
        <select
          value={bookingType}
          onChange={(e)=>setBookingType(Number(e.target.value) as 1|2)}
          className="w-full border rounded p-2 bg-background"
        >
          <option value={1}>{t("doctor.checkup")}</option>
          <option value={2}>{t("doctor.consult")}</option>
        </select>



        {/* Upload images only if consult */}
        {bookingType===2 && (
          <>
            <label>{t("doctor.uploadImages")}</label>
            <input 
              type="file"
              multiple
              onChange={(e)=>{setImages(Array.from(e.target.files||[])); setImgError("");}}
              className="w-full border rounded p-2"
            />
            {imgError && <p className="text-red-500 text-sm">{imgError}</p>}
          </>
        )}


        <div className="flex justify-end gap-2 mt-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            {t("doctor.Cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            {isPending ? t("doctor.booking...") : t("doctor.book")}
          </button>
        </div>

      </div>
    </div>
  );
}
