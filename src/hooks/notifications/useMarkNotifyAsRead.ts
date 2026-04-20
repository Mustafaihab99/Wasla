import { useMutation, useQueryClient } from "@tanstack/react-query";
import { marknotifyAsRead } from "../../api/notifications/notification-api";

export default function useMarkNotifyAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["notify-read"],
    mutationFn: (id:number) => marknotifyAsRead(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
}