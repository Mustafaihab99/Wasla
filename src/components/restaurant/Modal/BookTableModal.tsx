import { useState } from "react";
import { useTranslation } from "react-i18next";
import useBookRestaurantTable from "../../../hooks/restaurant/useBookRestaurantTable";

interface Props {
  open: boolean;
  onClose: () => void;
  restaurantId: string;
}

export default function BookTableModal({ open, onClose, restaurantId }: Props) {
  const { t } = useTranslation();
  const { mutate, isPending } = useBookRestaurantTable();

  const userId = sessionStorage.getItem("user_id")!;

  const [form, setForm] = useState({
    numberOfTables: 1,
    numberOfPersons: 1,
    date: "",
    time: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any>({});

  if (!open) return null;

  const validate = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors: any = {};

    const today = new Date();
    const selectedDate = new Date(form.date);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (form.numberOfTables > 4)
      newErrors.numberOfTables = t("restaurant.maxTables");

    if (form.numberOfPersons > 20)
      newErrors.numberOfPersons = t("restaurant.maxPersons");

    if (!form.date) {
      newErrors.date = t("restaurant.required");
    } else if (selectedDate < today) {
      newErrors.date = t("restaurant.futureDate");
    }

    if (!form.time) newErrors.time = t("restaurant.required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    mutate({
      userId,
      restaurantId,
      numberOfPersons: form.numberOfPersons,
      reservationDate: form.date,
      reservationTime: form.time,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      style={{ marginTop: "0" }}>
      <div className="bg-background w-full max-w-md rounded-2xl p-6 shadow-xl animate-fadeIn">
        {/* HEADER */}
        <h2 className="text-xl font-bold mb-4 text-center">
          🍽️ {t("restaurant.reserveTable")}
        </h2>

        {/* TABLES */}
        <div className="mb-3">
          <label className="text-sm">{t("restaurant.tables")}</label>
          <input
            type="number"
            max={4}
            value={form.numberOfTables}
            onChange={(e) =>
              setForm({ ...form, numberOfTables: +e.target.value })
            }
            className="bg-background text-foreground w-full border rounded-lg p-2 mt-1"
          />
          {errors.numberOfTables && (
            <p className="text-red-500 text-xs">{errors.numberOfTables}</p>
          )}
        </div>

        {/* PERSONS */}
        <div className="mb-3">
          <label className="text-sm">{t("restaurant.persons")}</label>
          <input
            type="number"
            max={20}
            value={form.numberOfPersons}
            onChange={(e) =>
              setForm({ ...form, numberOfPersons: +e.target.value })
            }
            className="w-full bg-background text-foreground border rounded-lg p-2 mt-1"
          />
          {errors.numberOfPersons && (
            <p className="text-red-500 text-xs">{errors.numberOfPersons}</p>
          )}
        </div>

        {/* DATE */}
        <div className="mb-3">
          <label className="text-sm">{t("restaurant.date")}</label>
          <input
  type="date"
  min={new Date().toISOString().split("T")[0]}
  onChange={(e) => setForm({ ...form, date: e.target.value })}
  className="w-full bg-background text-foreground border rounded-lg p-2 mt-1"
/>
          {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
        </div>

        {/* TIME */}
        <div className="mb-4">
          <label className="text-sm">{t("restaurant.time")}</label>
          <input
            type="time"
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="w-full bg-background text-foreground border rounded-lg p-2 mt-1"
          />
          {errors.time && <p className="text-red-500 text-xs">{errors.time}</p>}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border rounded-lg py-2">
            {t("resident.Cancel")}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 bg-primary text-white rounded-lg py-2 hover:opacity-90">
            {isPending ? t("restaurant.booking") : t("restaurant.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
