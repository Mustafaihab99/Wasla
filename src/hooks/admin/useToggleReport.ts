import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toogleReport } from "../../api/admin/admin-api";

export default function useToggleReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["toggle-report"],
    mutationFn: (id:number) => toogleReport(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}