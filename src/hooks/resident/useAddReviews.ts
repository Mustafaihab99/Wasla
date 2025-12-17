import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReview } from "../../api/resident/resident-api";

export default function useAddReviews(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey : ["add-review"],
        mutationFn: addReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allreviews"], exact: false });
    },
    })
}