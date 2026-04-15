import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { fetchAllRestaurant } from "../../api/restaurant/restaurant-api";

export default function useFetchAllRestaurants(
  pageNumber: number = 1,
  pageSize: number = 10,
  id:number,
  filterId: number
) {
  return useQuery({
    queryKey: ["allRestaurants", pageNumber, pageSize , i18next.language , filterId],
    queryFn: () => fetchAllRestaurant(pageNumber, pageSize , id , filterId),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
}
