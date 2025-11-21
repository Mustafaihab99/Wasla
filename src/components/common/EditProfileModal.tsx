import { useState, useEffect } from "react";
import Modal from "./Modal";
import { useTranslation } from "react-i18next";
import useEditProfile from "../../hooks/auth/useEditProfile";
import { useQueryClient } from "@tanstack/react-query";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  fullname: string | undefined;
  phoneNumber: string | undefined;
  userId: string;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  fullname,
  phoneNumber,
}: EditProfileModalProps) {
  const [name, setName] = useState(fullname || "");
  const [phone, setPhone] = useState(phoneNumber || "");
  const [file, setFile] = useState<File | null>(null);
  const { t } = useTranslation();
  const userId = sessionStorage.getItem("user_id");

  useEffect(() => {
    setName(fullname || "");
    setPhone(phoneNumber || "");
  }, [fullname, phoneNumber]);

  const queryClient = useQueryClient();
  const editProfileMutation = useEditProfile(userId!);

  const handleSave = () => {
    const formData = new FormData();
    formData.append("fullname", name);
    formData.append("phone", phone);
    if (file) formData.append("image", file);

    editProfileMutation.mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
  queryKey: ["residentProfile"],
});
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-2xl font-bold mb-6 text-center">{t("resident.edit")}</h3>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">{t("profile.doctor.name")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-border p-3 rounded-lg w-full bg-input"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">{t("profile.doctor.Phone")}</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-border p-3 rounded-lg w-full bg-input"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">{t("resident.ProfileImage")}</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border border-border p-3 rounded-lg w-full bg-input"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={editProfileMutation.isPending}
          className="mt-4 bg-primary text-white py-3 rounded-lg w-full font-semibold disabled:opacity-50"
        >
          {editProfileMutation.isPending ? t("profile.Saving...") : t("resident.save")}
        </button>
      </div>
    </Modal>
  );
}
