import { useQuery } from "@tanstack/react-query";
import { getResidentOrders } from "../../../api/restaurant/restaurant-api";

export default function useGetResidentOrders(
  pageNumber: number = 1,
  pageSize: number = 10,
  id:string
) {
  return useQuery({
    queryKey: ["resident-order", pageNumber, pageSize , id],
    queryFn: () => getResidentOrders(pageNumber, pageSize , id),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
}
