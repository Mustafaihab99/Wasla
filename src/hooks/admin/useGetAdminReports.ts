import { useQuery } from "@tanstack/react-query";
import { getAdminReports } from "../../api/admin/admin-api";

export default function useAdminReports(){
    return useQuery({
        queryKey: ["allContactUs"],
        queryFn: getAdminReports,
    })
}