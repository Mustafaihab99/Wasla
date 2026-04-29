import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeReportData } from "../../types/commuinty/community-types";
import { reportTarget } from "../../api/community/community-api";

export default function useMakeReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["make-report"],
    mutationFn: (formData: makeReportData) => reportTarget(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}