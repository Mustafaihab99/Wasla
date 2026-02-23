import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookGymService } from "../../api/gym/gym-api";
import useCreateEvent from "../userEvent/useCreateEvent";
import { UserEvent } from "../../utils/enum";

export default function useBookGymService(
  gymId: string,
  serviceId: number,
  residentId: string,
) {
  const queryClient = useQueryClient();
  const createEvent = useCreateEvent();

  return useMutation({
    mutationKey: ["book-gym"],
    mutationFn: () => bookGymService(gymId, serviceId, residentId),
    onSuccess: () => {
      createEvent.mutate({
        userId: residentId,
        serviceProviderId: gymId,
        eventType: UserEvent.booking,
      });
      queryClient.invalidateQueries({
        queryKey: ["gym-book-list"],
      });
    },
  });
}
