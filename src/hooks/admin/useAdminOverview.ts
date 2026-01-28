import { useQuery } from "@tanstack/react-query";
import { getAdminOverview } from "../../api/admin/admin-api";

export default function useAdminOverview(){
    return useQuery({
        queryKey:["admin-overview"],
        queryFn: getAdminOverview,
    })
}