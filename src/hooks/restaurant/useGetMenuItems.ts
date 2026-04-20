import { useQuery } from "@tanstack/react-query";
import { getMenuItems } from "../../api/restaurant/restaurant-api";

export default function useGetMenuItems(
  pageNumber: number = 1,
  pageSize: number = 10,
  id:string
) {
  return useQuery({
    queryKey: ["item-menu", pageNumber, pageSize , id],
    queryFn: () => getMenuItems(pageNumber, pageSize , id),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
}
