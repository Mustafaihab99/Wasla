import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { getReview } from "../../api/resident/resident-api";

export default function useGetReviews(id:string){
    return useQuery({
        queryKey : ["allreviews" , i18next.language],
        queryFn : ()=> getReview(id)
    })
}