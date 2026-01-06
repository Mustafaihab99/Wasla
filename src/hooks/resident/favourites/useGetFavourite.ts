import { useQuery } from "@tanstack/react-query";
import { getFavourites } from "../../../api/resident/favourites-api";

export function useGetFavourites(residentId: string) {
  return useQuery({
    queryKey: ["favourites", residentId],
    queryFn: () => getFavourites(residentId),
  });
}
