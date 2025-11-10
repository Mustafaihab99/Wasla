import { useQuery } from "@tanstack/react-query";
import { allSpecialzed } from "../../api/auth/complete-profile";
export default function useDoctorSpecialezed(){
    return useQuery({
        queryKey:["doctor-special"],
        queryFn: allSpecialzed,
    });
}