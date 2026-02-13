import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGymService } from "../../api/gym/gym-api";

export default function useDeleteGymService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-gymService"],
    mutationFn: (ServiceID: number) => deleteGymService(ServiceID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gym-services"] });
    },
  });
}
