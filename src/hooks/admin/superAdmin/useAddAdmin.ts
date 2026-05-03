import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAdminData } from "../../../types/admin/adminTypes";
import { addAdmin } from "../../../api/admin/superAdmin/superAdmin-api";

export default function useAddAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-admin"],
    mutationFn: (formData: addAdminData) => addAdmin(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-admins"] });
    },
  });
}