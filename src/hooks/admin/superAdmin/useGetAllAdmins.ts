import { useQuery } from "@tanstack/react-query";
import { getAllAdmins } from "../../../api/admin/superAdmin/superAdmin-api";

export default function useGetAllAdmins(){
    return useQuery({
        queryKey: ["get-admins"],
        queryFn: getAllAdmins,
    })
}