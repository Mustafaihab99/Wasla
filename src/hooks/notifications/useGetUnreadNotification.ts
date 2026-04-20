import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { fetchAllNotifications } from "../../api/notifications/notification-api";

export default function useUnreadNotificationsCount(userId: string) {
  return useQuery({
    queryKey: ["notifications-unread-count", i18next.language, userId],

    queryFn: async () => {
      const res = await fetchAllNotifications(1, 50, userId);
      const unreadCount = res.data.filter((n) => !n.isSeen).length;
      return unreadCount;
    },

    staleTime: 1000 * 30, 
  });
}