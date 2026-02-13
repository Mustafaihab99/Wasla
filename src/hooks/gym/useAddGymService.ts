import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addGymService } from "../../api/gym/gym-api";

export default function useAddGymService(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:["add-gymService"],
        mutationFn: addGymService,
           onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gym-services"], exact: false });
    },
    })
}
