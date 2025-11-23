import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useUpdateDoctorService from "../../../hooks/doctor/useUpdateDoctorService";
import { doctorServiceEdit, serviceDays, timeSlots } from "../../../types/doctor/doctorTypes";
import { useTranslation } from "react-i18next";

interface UpdateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: doctorServiceEdit;
  doctorId: string;
}

export default function UpdateServiceModal({ isOpen, onClose, initialData }: UpdateServiceModalProps) {
  const { t } = useTranslation();
  const [serviceName, setServiceName] = useState(initialData.serviceName);
  const [description, setDescription] = useState(initialData.description);
  const [price, setPrice] = useState(initialData.price);
  const [serviceDays, setServiceDays] = useState<serviceDays[]>(initialData.serviceDays || []);
  const [serviceDates, setServiceDates] = useState<Date[]>(initialData.serviceDates.map(d => new Date(d.date)));
  const [timeSlots, setTimeSlots] = useState<timeSlots[]>(initialData.timeSlots || []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const weekdays = [
    { name: t("doctor.Sun"), value: 0 },
    { name: t("doctor.Mon"), value: 1 },
    { name: t("doctor.Tue"), value: 2 },
    { name: t("doctor.Wed"), value: 3 },
    { name: t("doctor.Thu"), value: 4 },
    { name: t("doctor.Fri"), value: 5 },
    { name: t("doctor.Sat"), value: 6 },
  ];

  const updateService = useUpdateDoctorService();

  useEffect(() => {
    if (initialData) {
      setServiceName(initialData.serviceName);
      setDescription(initialData.description);
      setPrice(initialData.price);
      setServiceDays(initialData.serviceDays || []);
      setServiceDates(initialData.serviceDates.map(d => new Date(d.date)));
      setTimeSlots(initialData.timeSlots || []);
    }
  }, [initialData, isOpen]);

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

  // إرسال payload مباشرة من النوع doctorServiceEdit
  const payload: doctorServiceEdit = {
    serviceId: initialData.serviceId,
    serviceName,
    description,
    price,
    serviceDays,
    serviceDates: serviceDates.map((d, i) => ({
      id: i,
      date: d.toISOString().split("T")[0]
    })),
    timeSlots: timeSlots.map((t) => ({
      id: t.id,
      start: t.start.length === 5 ? t.start + ":00" : t.start, // hh:mm:ss
      end: t.end.length === 5 ? t.end + ":00" : t.end
    }))
  };

  updateService.mutate(payload);
  onClose();
};


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-white rounded-xl shadow-xl text-black w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-6">{t("doctor.updateServ")}</h2>

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
                  <span className="text-gray-500">{t("doctor.to")}</span>
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
            {t("doctor.Update")}
          </button>
        </div>
      </div>
    </div>
  );
}
