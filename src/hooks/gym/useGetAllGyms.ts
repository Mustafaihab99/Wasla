import { useQuery } from "@tanstack/react-query";
import { fetchAllGym } from "../../api/gym/gym-api";
import i18next from "i18next";

export default function useGetAllGyms(
  pageNumber: number = 1,
  pageSize: number = 10,
) {
  return useQuery({
    queryKey: ["allgyms", pageNumber, pageSize , i18next.language],
    queryFn: () => fetchAllGym(pageNumber, pageSize),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
}
