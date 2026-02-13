import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { getGymServices } from "../../api/gym/gym-api";

export default function useGetGymService(id:string){
    return useQuery({
        queryKey : ["gym-services" , i18next.language],
        queryFn : ()=> getGymServices(id)
    })
}