import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllRead } from "../../api/notifications/notification-api";

export default function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["notify-all-read"],
    mutationFn: (userId:string) => markAllRead(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
}