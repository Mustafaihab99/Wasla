import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "../../api/admin/admin-api";

export default function useGetUsersByRole(roleName: string, pageNumber: number, pageSize: number) {
    return useQuery({
        queryKey: ["admin-users", roleName, pageNumber, pageSize],
        queryFn: () => getAdminUsers(roleName, pageNumber, pageSize),
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!roleName, 
    });
}