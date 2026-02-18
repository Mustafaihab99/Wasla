import { useQuery } from "@tanstack/react-query";
import { getGymServiceMembers } from "../../api/gym/gym-api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useGetGymMembersService(serviceId: string, p0?: any){
    return useQuery({
        queryKey : ["gym-members" , serviceId , p0],
        queryFn: () => getGymServiceMembers(serviceId)
    })
}