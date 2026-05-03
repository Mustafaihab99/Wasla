import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdmin } from "../../../api/admin/superAdmin/superAdmin-api";

export default function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-admin"],
    mutationFn: (id:string) => deleteAdmin(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-admins"] });
    },
  });
}