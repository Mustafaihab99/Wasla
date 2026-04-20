import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotify } from "../../api/notifications/notification-api";

export default function useDeleteNotify() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-notify"],
    mutationFn: (id:number) => deleteNotify(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });
}