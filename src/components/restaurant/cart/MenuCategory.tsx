import { menuData } from "../../../types/restaurant/restaurant-types";
import MenuItemCard from "./MenuItemCard";

export default function MenuCategory({
  category,
  restaurantId,
}: {
  category: menuData;
  restaurantId: string;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-primary border-b pb-2">
        {category.categoryName}
      </h2>

      <div className="space-y-3">
        {category.items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            restaurantId={restaurantId}
          />
        ))}
      </div>
    </div>
  );
}