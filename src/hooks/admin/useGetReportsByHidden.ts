import { useQuery } from "@tanstack/react-query";
import { getReportsByHidden } from "../../api/admin/admin-api";

export default function useGetReportsByHidden(
  pageNumber: number = 1,
  pageSize: number = 10,
  flag:boolean
) {
  return useQuery({
    queryKey: ["reports", pageNumber, pageSize , flag],
    queryFn: () => getReportsByHidden(pageNumber, pageSize , flag),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
}
