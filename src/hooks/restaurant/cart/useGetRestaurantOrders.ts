import { useQuery } from "@tanstack/react-query";
import {  getRestaurantOrders } from "../../../api/restaurant/restaurant-api";

export default function useGetRestaurantOrders(
  pageNumber: number = 1,
  pageSize: number = 10,
  id:string
) {
  return useQuery({
    queryKey: ["restaurant-order", pageNumber, pageSize , id],
    queryFn: () => getRestaurantOrders(pageNumber, pageSize , id),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
}
