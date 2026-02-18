import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookGymService } from "../../api/gym/gym-api";

export default function useBookGymService(gymId :string , serviceId: number , residentId : string){
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:["book-gym"],
        mutationFn: () => bookGymService(gymId , serviceId , residentId),
           onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gym-book-list"], exact: false });
    },
    })
}
