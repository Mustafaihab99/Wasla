import { FaTrash } from "react-icons/fa";
import useDeleteDotorService from "../../../hooks/doctor/useDeleteDoctorService";
import { useTranslation } from "react-i18next";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId?: number;
  serviceName?: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, serviceId, serviceName }: DeleteConfirmModalProps) {
  const deleteService = useDeleteDotorService();
  const {t} = useTranslation();

  if (!isOpen || !serviceId) return null;

  const handleDelete = () => {
    deleteService.mutate(serviceId);
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full text-black max-w-sm p-6 text-center">
        <FaTrash className="mx-auto text-red-500 text-4xl mb-4"/>
        <h2 className="text-lg font-bold">{t("doctor.sure?")}</h2>
        <p className="mt-2 text-sm text-gray-600">{t("doctor.doyou")} {serviceName || "this item"}?</p>

        <div className="mt-6 flex justify-center gap-3">
          <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={onClose}>{t("doctor.Cancel")}</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleDelete}>{t("doctor.Delete")}</button>
        </div>
      </div>
    </div>
  )
}
