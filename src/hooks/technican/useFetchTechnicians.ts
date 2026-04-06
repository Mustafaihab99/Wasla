import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { fetchAllTechnicians } from "../../api/technician/technician-api";

export default function useFetchTechnicians(
  pageNumber: number = 1,
  pageSize: number = 10,
  specialityId?: number
) {
  return useQuery({
    queryKey: ["allTechnicians", pageNumber, pageSize , i18next.language , specialityId],
    queryFn: () => fetchAllTechnicians(pageNumber, pageSize , specialityId),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
}
