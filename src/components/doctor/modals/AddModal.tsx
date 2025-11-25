import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAddDoctorService from "../../../hooks/doctor/useAddDoctorService";
import { doctorServiceAdd, serviceDays, timeSlots } from "../../../types/doctor/doctorTypes";
import { useTranslation } from "react-i18next";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
}

export default function AddServiceModal({ isOpen, onClose, doctorId }: AddServiceModalProps) {
  const [serviceName, setServiceName] = useState({ english: "", arabic: "" });
  const [description, setDescription] = useState({ english: "", arabic: "" });
  const [price, setPrice] = useState<number>(0);

  const [mode, setMode] = useState<"weekly" | "specific" | null>(null);

  const [serviceDays, setServiceDays] = useState<serviceDays[]>([]);
  const [serviceDates, setServiceDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<timeSlots[]>([]);
  const [slotErrors, setSlotErrors] = useState<string[]>([]);

  const { t } = useTranslation();

  const [errors, setErrors] = useState<{
    serviceNameEn?: string;
    serviceNameAr?: string;
    descEn?: string;
    descAr?: string;
    price?: string;
    mode?: string;
    days?: string;
    dates?: string;
  }>({});

  const weekdays = [
    { name: t("doctor.Sat"), value: 0 },
    { name: t("doctor.Sun"), value: 1 },
    { name: t("doctor.Mon"), value: 2 },
    { name: t("doctor.Tue"), value: 3 },
    { name: t("doctor.Wed"), value: 4 },
    { name: t("doctor.Thu"), value: 5 },
    { name: t("doctor.Fri"), value: 6 },
  ];

  const addService = useAddDoctorService();
  if (!isOpen) return null;

  const validateSlot = (index: number, slots: timeSlots[]) => {
    const slot = slots[index];
    const errors = [...slotErrors];

    const startTime = new Date(`2000-01-01T${slot.start}:00`);
    const endTime = new Date(`2000-01-01T${slot.end}:00`);
    const diff = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

    if (diff <= 0) {
      errors[index] = t("doctor.error.invalidSlot"); // End must be after start
    } else if (diff > 60) {
      errors[index] = t("doctor.slotMaxHour"); // Max 1 hour
    } else {
      errors[index] = "";
    }

    setSlotErrors(errors);
  };

  const checkAllOverlaps = (slots: timeSlots[]) => {
  const errors = Array(slots.length).fill("");

  for (let i = 0; i < slots.length; i++) {
    const startI = new Date(`2000-01-01T${slots[i].start}:00`);
    const endI = new Date(`2000-01-01T${slots[i].end}:00`);

    for (let j = 0; j < slots.length; j++) {
      if (i === j) continue;
      const startJ = new Date(`2000-01-01T${slots[j].start}:00`);
      const endJ = new Date(`2000-01-01T${slots[j].end}:00`);

      if (startI < endJ && endI > startJ) {
        errors[i] = t("doctor.error.slotOverlap");
      }
    }
  }

  setSlotErrors(errors);
};



  const handleSubmit = () => {
    const newErrors: typeof errors = {};

    if (!serviceName.english.trim()) newErrors.serviceNameEn = t("doctor.error.namEreq");
    if (!serviceName.arabic.trim()) newErrors.serviceNameAr = t("doctor.error.namAreq");
    if (!description.english.trim()) newErrors.descEn = t("doctor.error.descEreq");
    if (!description.arabic.trim()) newErrors.descAr = t("doctor.error.descAreq");
    if (!price || price <= 0) newErrors.price = t("doctor.error.pospri");
    if (!mode) newErrors.mode = t("doctor.modeError");

    if (mode === "weekly" && serviceDays.length === 0)
      newErrors.days = t("doctor.error.dayleas");

    if (mode === "specific" && serviceDates.length === 0)
      newErrors.dates = t("doctor.error.dateleas");

    setErrors(newErrors);

    const hasSlotErrors = slotErrors.some(err => err !== "");
    if (Object.keys(newErrors).length > 0 || hasSlotErrors) return;

    const payload: doctorServiceAdd = {
      doctorId,
      serviceName,
      description,
      price,
      serviceDays: mode === "weekly" ? serviceDays : [],
      serviceDates: mode === "specific"
        ? serviceDates.map((d, i) => ({ id: i, date: d.toISOString().split("T")[0] }))
        : [],
      timeSlots: timeSlots.map(t => ({ id: t.id, start: t.start + ":00", end: t.end + ":00" })),
    };

    addService.mutate(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 text-black overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-6">{t("doctor.addServ")}</h2>

        <div className="space-y-5">
          {/* MODE */}
          <div>
            <label className="font-medium">{t("doctor.selectMode")}</label>
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => { setMode("weekly"); setServiceDates([]); }}
                className={`px-3 py-1 rounded-md border ${mode === "weekly" ? "bg-primary text-white border-primary" : "bg-gray-100 text-gray-700 border-gray-300"}`}
              >
                {t("doctor.weekly")}
              </button>
              <button
                type="button"
                onClick={() => { setMode("specific"); setServiceDays([]); }}
                className={`px-3 py-1 rounded-md border ${mode === "specific" ? "bg-primary text-white border-primary" : "bg-gray-100 text-gray-700 border-gray-300"}`}
              >
                {t("doctor.specificDates")}
              </button>
            </div>
            {errors.mode && <p className="text-red-500 text-sm mt-1">{errors.mode}</p>}
          </div>

          {/* Service Name */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="font-medium">{t("doctor.ServiceName")} (EN)</label>
              <input
                type="text"
                value={serviceName.english}
                onChange={e => setServiceName({ ...serviceName, english: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-primary"
              />
              {errors.serviceNameEn && <p className="text-red-500 text-sm mt-1">{errors.serviceNameEn}</p>}
            </div>
            <div>
              <label className="font-medium">{t("doctor.ServiceName")} (AR)</label>
              <input
                type="text"
                value={serviceName.arabic}
                onChange={e => setServiceName({ ...serviceName, arabic: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-primary"
              />
              {errors.serviceNameAr && <p className="text-red-500 text-sm mt-1">{errors.serviceNameAr}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="font-medium">{t("doctor.desc")} (EN)</label>
              <textarea
                value={description.english}
                onChange={e => setDescription({ ...description, english: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-primary"
              />
              {errors.descEn && <p className="text-red-500 text-sm mt-1">{errors.descEn}</p>}
            </div>
            <div>
              <label className="font-medium">{t("doctor.desc")} (AR)</label>
              <textarea
                value={description.arabic}
                onChange={e => setDescription({ ...description, arabic: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-primary"
              />
              {errors.descAr && <p className="text-red-500 text-sm mt-1">{errors.descAr}</p>}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="font-medium">{t("doctor.Price")}</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-primary"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          {/* Weekly Days */}
          {mode === "weekly" && (
            <div>
              <label className="font-medium">{t("doctor.Days")} {t("doctor.week")}</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {weekdays.map(day => {
                  const selected = serviceDays.some(d => d.dayOfWeek === day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => {
                        if (selected)
                          setServiceDays(serviceDays.filter(d => d.dayOfWeek !== day.value));
                        else
                          setServiceDays([...serviceDays, { id: serviceDays.length, dayOfWeek: day.value }]);
                      }}
                      className={`px-3 py-1 rounded-md border ${selected ? "bg-primary text-white border-primary" : "bg-gray-100 text-gray-700 border-gray-300"}`}
                    >
                      {day.name}
                    </button>
                  );
                })}
              </div>
              {errors.days && <p className="text-red-500 text-sm mt-1">{errors.days}</p>}
            </div>
          )}

          {/* Specific Dates */}
          {mode === "specific" && (
            <div>
              <label className="font-medium">{t("doctor.Dates")} {t("doctor.specific")}</label>
              <div className="mt-2 border rounded-md p-2">
                <DatePicker
                  inline
                  selected={null}
                  onChange={(date: Date | null) => {
                    if (!date) return;
                    const exists = serviceDates.find(d => d.toDateString() === date.toDateString());
                    if (exists)
                      setServiceDates(serviceDates.filter(d => d.toDateString() !== date.toDateString()));
                    else
                      setServiceDates([...serviceDates, date]);
                  }}
                  highlightDates={serviceDates}
                  minDate={new Date()}
                />
              </div>
              {errors.dates && <p className="text-red-500 text-sm mt-1">{errors.dates}</p>}
            </div>
          )}

          {/* Time Slots */}
          <div>
            <label className="font-medium">{t("doctor.TimeSlots")} (HH:mm)</label>
            <div className="space-y-2 mt-2">
              {timeSlots.map((ti, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={ti.start}
                      onChange={e => {
                        const newSlots = [...timeSlots];
                        newSlots[i].start = e.target.value;
                        setTimeSlots(newSlots);
                        validateSlot(i, newSlots);
                        checkAllOverlaps(newSlots);
                      }}
                      className="border rounded-md px-2 py-1"
                    />

                    <span className="text-gray-500">{t("doctor.to")}</span>

                    <input
                      type="time"
                      value={ti.end}
                      onChange={e => {
                        const newSlots = [...timeSlots];
                        newSlots[i].end = e.target.value;
                        setTimeSlots(newSlots);
                        validateSlot(i, newSlots);
                      }}
                      className="border rounded-md px-2 py-1"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const newSlots = timeSlots.filter((_, idx) => idx !== i);
                        setTimeSlots(newSlots);
                        setSlotErrors(slotErrors.filter((_, idx) => idx !== i));
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                    >
                      X
                    </button>
                  </div>
                  {slotErrors[i] && <p className="text-red-500 text-sm">{slotErrors[i]}</p>}
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setTimeSlots([...timeSlots, { id: timeSlots.length, start: "09:00", end: "10:00" }]);
                  setSlotErrors([...slotErrors, ""]);
                }}
                className="bg-primary text-white px-3 py-1 rounded-md"
              >
                {t("doctor.AddSlot")}
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            {t("doctor.Cancel")}
          </button>

          <button
            type="button"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            onClick={handleSubmit}
          >
            {t("doctor.Add")}
          </button>
        </div>
      </div>
    </div>
  );
}
