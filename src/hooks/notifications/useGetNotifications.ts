import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { fetchAllNotifications } from "../../api/notifications/notification-api";

export default function useGetNotifications(
  pageNumber: number = 1,
  pageSize: number = 10,
  userId:string
) {
  return useQuery({
    queryKey: ["notifications", pageNumber, pageSize , i18next.language , userId],
    queryFn: () => fetchAllNotifications(pageNumber, pageSize , userId),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
}
