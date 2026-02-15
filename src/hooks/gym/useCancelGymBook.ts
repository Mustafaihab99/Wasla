import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelGymBook } from "../../api/gym/gym-api";

export default function useCancelGymBook(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:["cancel-gym-book"],
          mutationFn: (bookingId: number) => cancelGymBook(bookingId),
           onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gym-book-list"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["gym-booking"], exact: false });
    },
    })
}