import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addContactUs } from "../../api/resident/resident-api";

export default function useAddContactUs(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey : ["add-contactUs"],
        mutationFn: addContactUs,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allContactUs"], exact: false });
    },
    })
}