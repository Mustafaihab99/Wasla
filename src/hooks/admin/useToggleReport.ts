import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toogleReport } from "../../api/admin/admin-api";

export default function useToggleReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["toggle-report"],
    mutationFn: ({ id, adminId ,reason }: { id: number; adminId:string; reason?: string }) =>
      toogleReport(id, adminId , reason),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"], exact: false });
    },
  });
}