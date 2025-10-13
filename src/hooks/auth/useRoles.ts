import { useQuery } from "@tanstack/react-query";
import { allRoles } from "../../api/auth/auth-api";

export default function useRoles(){
    return useQuery({
        queryKey:["roles"],
        queryFn: allRoles,
    });
}