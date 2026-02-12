import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { getGymProfile } from "../../api/gym/gym-api";

export default function useGetGymProfile(id:string){
    return useQuery({
        queryKey:["Gym-profile" , id , i18next.language],
        queryFn: ()=> getGymProfile(id),
    })
}