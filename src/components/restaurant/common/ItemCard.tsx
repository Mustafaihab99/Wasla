// ItemCard.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FiEdit2, FiTrash2, FiClock } from "react-icons/fi";
import { MdLocalOffer } from "react-icons/md";
import useDeleteItemMenu from "../../../hooks/restaurant/useDeleteMenuItem";
import { useTranslation } from "react-i18next";
import { itemMenuData } from "../../../types/restaurant/restaurant-types";
import { ConfirmDialog } from "../Modal/ConfirmDialog";
import i18next from "i18next";

interface ItemCardProps {
  item: itemMenuData;
  onEdit: (item: itemMenuData) => void;
  categories: any[];
}

export default function ItemCard({
  item,
  onEdit,
  categories,
}: ItemCardProps) {
  const { t } = useTranslation();
  const { mutate: deleteItem } = useDeleteItemMenu();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
const category = categories?.find((c: any) => c.id === item.categoryId);
const itemName = i18next.language == "en" ? item.name?.english : item.name.arabic || "No Name";
const categoryName = i18next.language == "en" ?  category?.name?.english : category.name.arabic || "";
  

  return (
    <>
      <div className="group relative flex flex-col bg-background rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

        {/* IMAGE */}
        <div className="relative h-40 w-full bg-primary/10">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.nameValue}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl">
              🍽️
            </div>
          )}

          {/* ACTIONS */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={() => onEdit(item)}
              className="w-8 h-8 bg-background/80 backdrop-blur rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition"
            >
              <FiEdit2 size={16} />
            </button>

            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-8 h-8 bg-background/80 backdrop-blur rounded-lg flex items-center justify-center hover:bg-error hover:text-white transition"
            >
              <FiTrash2 size={16} />
            </button>
          </div>

          {/* DISCOUNT */}
          {item.discountPrice > 0 && (
            <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <MdLocalOffer size={14} />
              
              {t("restaurant.menu.Offer")}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col flex-1">

          {/* TITLE */}
          <div className="flex justify-between">
            <div>
                <h3 className="font-semibold text-lg line-clamp-1">{itemName}</h3>
                <p className="text-xs text-dried">{categoryName}</p>
            </div>

            {/* PRICE */}
            <div className="text-right">
              {item.discountPrice > 0 ? (
                <>
                  <span className="text-primary font-bold">
                    {item.discountPrice} {t("doctor.EGP")}
                  </span>
                  <span className="text-sm text-dried line-through ml-1">
                    ${item.price} {t("doctor.EGP")}
                  </span>
                </>
              ) : (
                <span className="text-primary font-bold">
                  ${item.price} {t("doctor.EGP")}
                </span>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/50">

            <FiClock className="text-dried" size={14} />
            <span className="text-sm text-dried">
              {item.preparationTime} min
            </span>

            <span
              className={`ml-auto px-2 py-1 rounded-full text-xs ${
                item.isAvailable
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-canceled text-dried border border-border"
              }`}
            >
              {item.isAvailable
                ? t("restaurant.menu.available")
                : t("restaurant.menu.unavailable")}
            </span>
          </div>
        </div>
      </div>

      {/* DELETE */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => deleteItem(item.id)}
        title={t("restaurant.menu.delete")}
        description={t("restaurant.menu.confirm_delete")}
      />
    </>
  );
}