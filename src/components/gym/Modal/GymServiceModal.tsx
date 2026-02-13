import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { gymServiceData } from "../../../types/gym/gym-types";
import { useTranslation } from "react-i18next";

interface ServiceModalProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  serviceProviderId: string;
  editData?: gymServiceData | null;
  loading?: boolean;
}

export function ServiceModal({
  onClose,
  onSubmit,
  serviceProviderId,
  editData,
  loading = false,
}: ServiceModalProps) {
  const [type, setType] = useState<number>(editData?.type ?? 1);
  const {t} = useTranslation();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const form = new FormData(formElement);

    const nameAr = form.get("name.arabic")?.toString().trim();
    const nameEn = form.get("name.english")?.toString().trim();
    const descAr = form.get("description.arabic")?.toString().trim();
    const descEn = form.get("description.english")?.toString().trim();
    const price = Number(form.get("price"));
    const duration = Number(form.get("durationInMonths"));
    const percentage = Number(form.get("precentage"));


    if (!nameAr || !nameEn) {
      toast.error(t("gym.namereq"));
      return;
    }

    if (!descAr || !descEn) {
      toast.error(t("gym.descreq"));
      return;
    }

    if (!price || price <= 0) {
      toast.error(t("gym.pricereq"));
      return;
    }

    if (!duration || duration <= 0) {
      toast.error(t("gym.durationreq"));
      return;
    }

    if (type === 2) {
      if (isNaN(percentage)) {
        toast.error(t("gym.disreq"));
        return;
      }

      if (percentage < 0) {
        toast.error(t("gym.disneg"));
        return;
      }

      if (percentage > 100) {
        toast.error(t("gym.dismax"));
        return;
      }
    }

    form.append("serviceProviderId", serviceProviderId);
    form.append("type", type.toString());

    if (type === 1) {
      form.delete("precentage");
    }

    if (editData?.id) {
      form.append("id", editData.id.toString());
    }

    onSubmit(form);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{marginTop : "0"}}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-background p-6 rounded-xl w-full max-w-lg space-y-5 border"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h3 className="text-xl font-bold">
          {editData ? t("gym.editser") : t("gym.add")}
        </h3>

        {/* Names */}
        <input
          name="name.arabic"
          placeholder={t("gym.arname")}
          className="w-full border border-border rounded-lg px-3 py-2 bg-transparent"
          defaultValue={editData?.name.arabic ?? ""}
        />

        <input
          name="name.english"
          placeholder={t("gym.enname")}
          className="w-full border border-border rounded-lg px-3 py-2 bg-transparent"
          defaultValue={editData?.name.english ?? ""}
        />

        {/* Descriptions */}
        <input
          name="description.arabic"
          placeholder={t("gym.ardesc")}
          className="w-full border border-border rounded-lg px-3 py-2 bg-transparent"
          defaultValue={editData?.description.arabic ?? ""}
        />

        <input
          name="description.english"
          placeholder={t("gym.endesc")}
          className="w-full border border-border rounded-lg px-3 py-2 bg-transparent"
          defaultValue={editData?.description.english ?? ""}
        />

        <input
          name="price"
          type="number"
          placeholder={t("gym.Price")}
          className="w-full border border-border rounded-lg px-3 py-2 bg-transparent"
          defaultValue={editData?.price ?? ""}
        />

        <input
          name="durationInMonths"
          type="number"
          placeholder={t("gym.month")}
          className="w-full border border-border rounded-lg px-3 py-2 bg-transparent"
          defaultValue={editData?.durationInMonths ?? ""}
        />

        {/* Type */}
        <select
          className="w-full border border-border rounded-lg px-3 py-2 bg-transparent"
          value={type}
          onChange={(e) => setType(Number(e.target.value))}
        >
          <option value={1}>{t("gym.Package")}</option>
          <option value={2}>{t("gym.Offer")}</option>
        </select>

        {/* Percentage */}
        {type === 2 && (
          <input
            name="precentage"
            type="number"
            placeholder={t("gym.disc")}
            className="w-full border border-border rounded-lg px-3 py-2 bg-transparent"
            defaultValue={editData?.precentage ?? ""}
          />
        )}

        {/* Photo */}
        <input
          name="photo"
          type="file"
          className="w-full border border-border rounded-lg px-3 py-2 bg-transparent"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="border border-border px-4 py-2 rounded-lg hover:bg-muted"
          >
            {t("gym.Cancel")}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            {loading ? t("gym.Saving...") : t("gym.Save")}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
