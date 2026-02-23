import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite } from "../../../api/resident/favourites-api";
import { FavouriteResponse } from "../../../types/resident/residentData";
import useCreateEvent from "../../userEvent/useCreateEvent";
import { UserEvent } from "../../../utils/enum";

export function useAddToFavourite(residentId: string) {
  const queryClient = useQueryClient();
  const createEvent = useCreateEvent();

  return useMutation({
    mutationFn: (serviceProviderId: string) =>
      addFavorite(residentId, serviceProviderId),

    onMutate: async (serviceProviderId) => {
      await queryClient.cancelQueries({ queryKey: ["favourites", residentId] });

      const prev = queryClient.getQueryData<FavouriteResponse[]>([
        "favourites",
        residentId,
      ]);

      queryClient.setQueryData<FavouriteResponse[]>(
        ["favourites", residentId],
        (old = []) => [
          ...old,
          { serviceProviderId } as FavouriteResponse,
        ]
      );

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["favourites", residentId], ctx.prev);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites", residentId] });
    },

    onSuccess: (_data, serviceProviderId) => {
      createEvent.mutate({
        userId: residentId,
        serviceProviderId,
        eventType: UserEvent.addFav,
      });
    }
  })
};


