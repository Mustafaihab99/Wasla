import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFavorite } from "../../../api/resident/favourites-api";
import { FavouriteResponse } from "../../../types/resident/residentData";

export function useRemoveFavourite(residentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favouriteId: number) => removeFavorite(favouriteId),

    onMutate: async (favouriteId) => {
      await queryClient.cancelQueries({ queryKey: ["favourites", residentId] });

      const prev = queryClient.getQueryData<FavouriteResponse[]>([
        "favourites",
        residentId,
      ]);

      queryClient.setQueryData<FavouriteResponse[]>(
        ["favourites", residentId],
        (old = []) => old.filter(f => f.id !== favouriteId)
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
  });
}
