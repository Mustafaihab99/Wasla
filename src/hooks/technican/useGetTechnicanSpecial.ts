import { useQuery } from "@tanstack/react-query";
import { allTechnicanSpecialzed } from "../../api/auth/complete-profile";
import i18next from "i18next";

export default function useGetTechnicanSpecial(){
    return useQuery({
        queryKey: ['technican-special' , i18next.language],
        queryFn: allTechnicanSpecialzed,
    })
}