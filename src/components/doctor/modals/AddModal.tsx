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
  const [serviceDays, setServiceDays] = useState<serviceDays[]>([]);
  const [serviceDates, setServiceDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<timeSlots[]>([]);
  const { t } = useTranslation();

  const [errors, setErrors] = useState<{
    serviceNameEn?: string;
    serviceNameAr?: string;
    descEn?: string;
    descAr?: string;
    price?: string;
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

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    if (!serviceName.english.trim()) newErrors.serviceNameEn = t("doctor.error.namEreq");
    if (!serviceName.arabic.trim()) newErrors.serviceNameAr = t("doctor.error.namAreq");
    if (!description.english.trim()) newErrors.descEn = t("doctor.descEreq");
    if (!description.arabic.trim()) newErrors.descAr = t("doctor.descAreq");
    if (!price || price <= 0) newErrors.price = t("doctor.error.pospri");
    if (serviceDays.length === 0) newErrors.days = t("doctor.error.dayleas");
    if (serviceDates.length === 0) newErrors.dates = t("doctor.error.dateleas");

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload: doctorServiceAdd = {
      doctorId,
      serviceName,
      description,
      price,
      serviceDays,
      serviceDates: serviceDates.map((d, i) => ({ id: i, date: d.toISOString().split("T")[0] })),
      timeSlots: timeSlots.map((t) => ({ id: t.id, start: t.start + ":00", end: t.end + ":00" })),
    };

    addService.mutate(payload);
    onClose();
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 text-black overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-6">{t("doctor.addServ")}</h2>

        <div className="space-y-5">
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

          {/* Service Days */}
          <div>
            <label className="font-medium">{t("doctor.Days")}</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {weekdays.map(day => {
                const selected = serviceDays.some(d => d.dayOfWeek === day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => {
                      if (selected) setServiceDays(serviceDays.filter(d => d.dayOfWeek !== day.value));
                      else setServiceDays([...serviceDays, { id: serviceDays.length, dayOfWeek: day.value }]);
                    }}
                    className={`px-3 py-1 rounded-md border ${
                      selected ? "bg-primary text-white border-primary" : "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    {day.name}
                  </button>
                );
              })}
            </div>
            {errors.days && <p className="text-red-500 text-sm mt-1">{errors.days}</p>}
          </div>

          {/* Service Dates */}
          <div>
            <label className="font-medium">{t("doctor.Dates")}</label>
            <div className="mt-2 border rounded-md p-2">
             <DatePicker
  inline
  selected={null} 
  onChange={(date: Date | null) => {
    if (!date) return;
    const exists = serviceDates.find(d => d.toDateString() === date.toDateString());
    if (exists) setServiceDates(serviceDates.filter(d => d.toDateString() !== date.toDateString()));
    else setServiceDates([...serviceDates, date]);
  }}
  highlightDates={serviceDates}
  minDate={new Date()}
/>
            </div>
            {errors.dates && <p className="text-red-500 text-sm mt-1">{errors.dates}</p>}
          </div>

          {/* Time Slots */}
          <div>
            <label className="font-medium">{t("doctor.TimeSlots")} (HH:mm)</label>
            <div className="space-y-2 mt-2">
              {timeSlots.map((ti, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={ti.start}
                    onChange={e => {
                      const newSlots = [...timeSlots];
                      newSlots[i].start = e.target.value;
                      setTimeSlots(newSlots);
                    }}
                    className="border rounded-md px-2 py-1"
                  />
                  <span className="text-gray-500">
                    {t("doctor.to")}
                    </span>
                  <input
                    type="time"
                    value={ti.end}
                    onChange={e => {
                      const newSlots = [...timeSlots];
                      newSlots[i].end = e.target.value;
                      setTimeSlots(newSlots);
                    }}
                    className="border rounded-md px-2 py-1"
                  />
                  <button
                    type="button"
                    onClick={() => setTimeSlots(timeSlots.filter((_, idx) => idx !== i))}
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setTimeSlots([...timeSlots, { id: timeSlots.length, start: "09:00", end: "10:00" }])}
                className="bg-primary text-white px-3 py-1 rounded-md"
              >
                {t("doctor.AddSlot")}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
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
