import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptTechBook } from "../../api/technician/technician-api";

export default function useAcceptTechBook(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:["accept-tech-book"],
          mutationFn: (bookingId: number) => acceptTechBook(bookingId),
           onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tech-book-list"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["tech-booking"], exact: false });
    },
    })
}