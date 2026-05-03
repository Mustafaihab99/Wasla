import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toogleAdminStatus } from "../../../api/admin/superAdmin/superAdmin-api";

export default function useToogleAdminStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["change-admin"],
    mutationFn: (id:string) => toogleAdminStatus(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-admins"] });
    },
  });
}