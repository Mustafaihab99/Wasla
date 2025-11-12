import { useQuery } from "@tanstack/react-query";
import { allRoles } from "../../api/auth/auth-api";
import i18next from "i18next";

export default function useRoles(){
    return useQuery({
        queryKey:["roles" , i18next.language],
        queryFn: allRoles,
    });
}