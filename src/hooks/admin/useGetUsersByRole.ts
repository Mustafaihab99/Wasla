import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "../../api/admin/admin-api";

export default function useGetUsersByRole(roleId: string | undefined, pageNumber: number, pageSize: number) {
    return useQuery({
        queryKey: ["admin-users", roleId, pageNumber, pageSize],
        queryFn: () => getAdminUsers(roleId, pageNumber, pageSize),
        retry: 2,
        refetchOnWindowFocus: false,
        enabled: !!roleId, 
    });
}