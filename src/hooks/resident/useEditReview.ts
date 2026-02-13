import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editReview } from "../../api/resident/resident-api";

export default function useEditReview(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:["edit-review"],
        mutationFn: editReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allreviews"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["doctorProfile"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["Gym-profile"], exact: false });
    },
    })
}