// CategoriesSection.tsx
import { useState } from "react";
import useGetCategoryMenu from "../../../hooks/restaurant/useGetCategoryMenu";
import CategoryCard from "./CategoryCard";
import CategoryModal from "../Modal/CategoryModal";
import { useTranslation } from "react-i18next";
import { categoryMenuData } from "../../../types/restaurant/restaurant-types";
import { FiPlus } from "react-icons/fi";

interface CategoriesSectionProps {
  restaurantId: string;
}

export default function CategoriesSection({
  restaurantId,
}: CategoriesSectionProps) {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useGetCategoryMenu(restaurantId);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<categoryMenuData | null>(null);

  const handleEdit = (category: categoryMenuData) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleClose = () => {
    setEditingCategory(null);
    setModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-background/50 animate-pulse rounded-xl border border-border"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {!isLoading && (!categories || categories.length === 0) && (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-3xl bg-background/40">
          <p className="text-dried text-lg">
            {t("restaurant.menu.no_categories")}
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 btn-primary">
            {t("restaurant.menu.add_first_category")}
          </button>
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition">
          <FiPlus />
          {t("restaurant.menu.add_category")}
        </button>
      </div>

      {categories && categories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat: categoryMenuData) => (
            <CategoryCard key={cat.id} category={cat} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-3xl bg-background/40">
          <p className="text-dried">{t("restaurant.menu.no_categories")}</p>
        </div>
      )}

      <CategoryModal
        open={modalOpen}
        onClose={handleClose}
        restaurantId={restaurantId}
        initialData={editingCategory}
      />
    </>
  );
}
