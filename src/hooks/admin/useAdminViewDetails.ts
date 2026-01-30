import { useQuery } from "@tanstack/react-query";
import { getAdminUserDetails } from "../../api/admin/admin-api";

export default function useGetUserDetails(userId: string | undefined) {
  return useQuery({
    queryKey: ["admin-user-details", userId],
    queryFn: () => getAdminUserDetails(userId!),
    enabled: !!userId,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
