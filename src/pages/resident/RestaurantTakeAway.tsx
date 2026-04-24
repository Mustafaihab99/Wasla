import { useParams } from "react-router-dom";
import useGetRestaurantMenu from "../../hooks/restaurant/cart/useGetMenuForResident";
import MenuCategory from "../../components/restaurant/cart/MenuCategory";
import { useTranslation } from "react-i18next";
import { menuData } from "../../types/restaurant/restaurant-types";
import CartSection from "../../components/restaurant/cart/CartSection";

export default function RestaurantTakeAway() {
  const { restaurantId } = useParams();
  const { t } = useTranslation();
  const residentId = sessionStorage.getItem("user_id")!
  const { data, isLoading } = useGetRestaurantMenu(restaurantId!);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

 return (
  <div className="space-y-8 pb-40">
    {/* Title */}
    <h1 className="text-2xl font-bold text-primary">
      {t("restaurant.Menu")}
    </h1>

    {data?.map((category: menuData) => (
      <MenuCategory
        key={category.categoryId}
        category={category}
        restaurantId={restaurantId!}
      />
    ))}

    <CartSection
      residentId={residentId}
      restaurantId={restaurantId!}
    />
  </div>
);
}