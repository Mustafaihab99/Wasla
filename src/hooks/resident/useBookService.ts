import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookService } from "../../api/resident/resident-api";
import useCreateEvent from "../userEvent/useCreateEvent";
import { UserEvent } from "../../utils/enum";

export default function useBookService() {
  const queryClient = useQueryClient();
   const createEvent = useCreateEvent();

  return useMutation({
    mutationKey: ["book-service"],
    mutationFn: (values: FormData) => bookService(values),
      onSuccess: (_data, formData) => {
      const userId = formData.get("userId") as string;
      const serviceProviderId = formData.get("serviceProviderId") as string;
      createEvent.mutate({
        userId,
        serviceProviderId,
        eventType: UserEvent.booking,
      });
            queryClient.invalidateQueries({ queryKey: ["doctor-services"], exact: false });
    },
  });
}
