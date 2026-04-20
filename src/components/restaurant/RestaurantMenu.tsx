import CategoriesSection from "./common/CategorySection";
import ItemsSection from "./common/ItemSection";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function RestaurantMenuDashboard() {
  const { t } = useTranslation();
  const restaurantId = sessionStorage.getItem("user_id")!;
  const [tab, setTab] = useState<"items" | "categories">("items");

  if (!restaurantId)
    return (
      <div className="p-8 text-center text-dried">
        {t("restaurant.menu.loading")}
      </div>
    );

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-primary bg-clip-text">
          {t("restaurant.menu.dashboard")}
        </h2>
      </div>

      <div className="flex gap-2 p-1 rounded-xl border border-border w-fit">
        <button
          onClick={() => setTab("items")}
          className={`px-4 py-2 rounded-lg transition ${
            tab === "items"
              ? "bg-primary text-white shadow"
              : "text-foreground"
          }`}
        >
          {t("restaurant.menu.items")}
        </button>

        <button
          onClick={() => setTab("categories")}
          className={`px-4 py-2 rounded-lg transition ${
            tab === "categories"
              ? "bg-primary text-white shadow"
              : "text-foreground"
          }`}
        >
          {t("restaurant.menu.categories")}
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-4">
        {tab === "items" && (
          <ItemsSection restaurantId={restaurantId} />
        )}

        {tab === "categories" && (
          <CategoriesSection restaurantId={restaurantId} />
        )}
      </div>
    </div>
  );
}