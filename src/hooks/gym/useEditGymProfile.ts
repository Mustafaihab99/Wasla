import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditGymProfile } from "../../api/gym/gym-api";

export default function useEditGymProfile(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:["edit-gym-profile"],
        mutationFn: EditGymProfile,
           onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Gym-profile"], exact: false });
    },
    })
}