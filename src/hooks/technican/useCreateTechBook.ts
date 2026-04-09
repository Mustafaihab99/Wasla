import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookData } from "../../types/technician/technician-types";
import { bookWithtechnicians } from "../../api/technician/technician-api";
import { UserEvent } from "../../utils/enum";
import useCreateEvent from "../userEvent/useCreateEvent";

export default function useCreateTechBook() {
  const queryClient = useQueryClient();
  const createEvent = useCreateEvent();

  return useMutation({
    mutationKey: ["book-tech"],
    mutationFn: (values: BookData) => bookWithtechnicians(values),
    onSuccess: (_data, variables) => {
      const userId = variables.residentId;
      const serviceProviderId = variables.technicianId;

      createEvent.mutate({
        userId,
        serviceProviderId,
        eventType: UserEvent.booking,
      });

      queryClient.invalidateQueries({ queryKey: ["tech-jobs"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["tech-booking"], exact: false });
    },
  });
}
