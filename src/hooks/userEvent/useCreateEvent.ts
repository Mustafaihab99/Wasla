import { useMutation } from "@tanstack/react-query";
import { createUserEvent } from "../../api/userEvent/userEvent-api";

export default function useCreateEvent() {
  return useMutation({
    mutationKey: ["create-event"],
    mutationFn: ({
      userId,
      serviceProviderId,
      eventType,
    }: {
      userId: string;
      serviceProviderId: string;
      eventType: number;
    }) => createUserEvent(userId, serviceProviderId, eventType),
  });
}