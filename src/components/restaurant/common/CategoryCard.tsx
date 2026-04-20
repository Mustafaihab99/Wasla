// CategoryCard.tsx
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { GiKnifeFork } from "react-icons/gi";
import useDeleteCategoryMenu from "../../../hooks/restaurant/useDeleteCategoryMenu";
import { useTranslation } from "react-i18next";
import { ConfirmDialog } from "../Modal/ConfirmDialog";
import { categoryMenuData } from "../../../types/restaurant/restaurant-types";

interface CategoryCardProps {
  category: categoryMenuData;
  onEdit: (category: categoryMenuData) => void;
}

export default function CategoryCard({ category, onEdit }: CategoryCardProps) {
  const { t } = useTranslation();
  const { mutate: deleteCategory } = useDeleteCategoryMenu();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    deleteCategory(category.id);
    setShowDeleteDialog(false);
  };

  const displayName = category.name?.english || category.nameValue || "No Name";
  const arabicName = category.name?.arabic || "";

  return (
    <>
      <div className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border border-border bg-background hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(category)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-dried hover:text-primary hover:bg-primary/10 transition"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-dried hover:text-error hover:bg-error/10 transition"
          >
            <FiTrash2 size={16} />
          </button>
        </div>

        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
          <GiKnifeFork className="w-7 h-7 text-primary" />
        </div>

        <h3 className="font-semibold text-lg text-center">{displayName}</h3>
        {arabicName && (
          <p className="text-sm text-dried mt-1 text-center">{arabicName}</p>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title={t("restaurant.menu.delete")}
        description={t("restaurant.menu.confirm_delete")}
      />
    </>
  );
}