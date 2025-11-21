import { useQuery } from "@tanstack/react-query";
import { getResidentProfile } from "../../api/resident/resident-api";
import i18next from "i18next";

export default function useGetResidentProfile(id:string){
    return useQuery({
        queryKey:["residentProfile" , id ,i18next.language],
        queryFn: ()=> getResidentProfile(id),
    })
}