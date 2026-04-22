/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import useGetMenuItems from "../../../hooks/restaurant/useGetMenuItems";
import useGetCategoryMenu from "../../../hooks/restaurant/useGetCategoryMenu";
import ItemCard from "./ItemCard";
import ItemModal from "./ItemModal";
import { FiPlus } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function ItemsSection({ restaurantId }: any) {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [category, setCategory] = useState("all");
  const [search,] = useState("");

  const { data: categories } = useGetCategoryMenu(restaurantId);
  const { data: itemsData, isLoading } = useGetMenuItems(page, 8, restaurantId);

  const filtered = itemsData?.data?.filter((item: any) => {
    const matchSearch = item.name?.english?.toLowerCase().includes(search.toLowerCase()) ||
                    item.nameValue?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || item.categoryId.toString() === category;
    return matchSearch && matchCategory;
  }) || [];

  const totalPages = Math.ceil((itemsData?.totalCount || 0) / 8);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-background/50 animate-pulse rounded-xl border border-border" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="flex gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">{t("restaurant.menu.all_categories")}</option>
            {categories?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name?.english || c.nameValue}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus />
          {t("restaurant.menu.add_item")}
        </button>
      </div>

      {/* LIST or NO DATA */}
      {filtered.length > 0 ? (
        <>
          <div className="grid md:grid-cols-3 gap-5 mt-6">
            {filtered.map((item: any) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={(i: any) => {
                  setEditingItem(i);
                  setModalOpen(true);
                }}
                categories={categories!}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-border hover:bg-background/60 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("restaurant.menu.previous")}
              </button>

              <span className="px-4 py-2 border border-border rounded bg-background">
                {page} / {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-border hover:bg-background/60 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("restaurant.menu.next")}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-3xl bg-background/40 mt-6">
          <p className="text-dried text-lg">
            {search || category !== "all" 
              ? t("restaurant.menu.no_filtered_items")
              : t("restaurant.menu.no_items")}
          </p>
          {!search && category === "all" && (
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 btn-primary"
            >
              {t("restaurant.menu.add_first_item")}
            </button>
          )}
        </div>
      )}

      {/* MODAL */}
      <ItemModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        restaurantId={restaurantId}
        categories={categories}
        initialData={editingItem}
      />
    </>
  );
}