import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editGymService } from "../../api/gym/gym-api";

export default function useUpdateGymService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-gymService"],
    mutationFn: editGymService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gym-services"] , exact:false});
    },
  });
}
